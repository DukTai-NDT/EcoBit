// Kiểm tra nội dung src/data theo schema docs/PLAN.md mục 2.3–2.4.
// Chạy tại thư mục gốc: node scripts/validate_data.mjs
// Thoát mã 1 nếu có LỖI; CẢNH BÁO (chuỗi dài) không làm thất bại.
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

const load = async (name) => (await import(pathToFileURL(resolve(ROOT, 'src/data', name + '.js')).href)).default;
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const LIMIT = { q: 140, option: 90, ebi: 160, fact: 200 };
const len = (f, where, s, max) => { if (typeof s === 'string' && s.length > max) warn(f, `${where} dài ${s.length} > ${max} ký tự: “${s.slice(0, 50)}…”`); };

function uniqueIds(f, list, where = 'id') {
  const seen = new Set();
  list.forEach((x, i) => {
    if (x == null || x.id == null) return err(f, `${where}[${i}] thiếu id`);
    if (seen.has(x.id)) err(f, `id trùng: ${x.id}`);
    seen.add(x.id);
  });
}

// Mọi khoá img / scene trong cây dữ liệu phải có public/img/<tên>.webp
function checkImages(f, node, path = '') {
  if (Array.isArray(node)) return node.forEach((v, i) => checkImages(f, v, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'img' || k === 'scene') && typeof v === 'string') {
        if (!existsSync(resolve(ROOT, 'public/img', v + '.webp'))) err(f, `${path}.${k}: thiếu ảnh public/img/${v}.webp`);
      } else checkImages(f, v, `${path}.${k}`);
    }
  }
}

// ---- Engine configs (PLAN 2.3) ----
function checkSort(f, c, p = '') {
  if (!Array.isArray(c.bins) || !c.bins.length) return err(f, `${p}bins rỗng`);
  if (!Array.isArray(c.items) || !c.items.length) return err(f, `${p}items rỗng`);
  uniqueIds(f, c.bins, `${p}bins`); uniqueIds(f, c.items, `${p}items`);
  const bins = new Set(c.bins.map((b) => b.id));
  c.bins.forEach((b) => { if (!isStr(b.label)) err(f, `${p}bin ${b.id} thiếu label`); });
  c.items.forEach((it) => {
    if (!isStr(it.label)) err(f, `${p}item ${it.id} thiếu label`);
    if (!bins.has(it.bin)) err(f, `${p}item ${it.id}: bin “${it.bin}” không có trong bins`);
    len(f, `${p}item ${it.id}.label`, it.label, LIMIT.option);
  });
  bins.forEach((b) => { if (!c.items.some((it) => it.bin === b)) warn(f, `${p}bin ${b} không có món nào`); });
}
function checkQuestions(f, qs, p = '', opts = {}) {
  if (!Array.isArray(qs) || !qs.length) return err(f, `${p}questions rỗng`);
  qs.forEach((q, i) => {
    const w = `${p}câu ${i + 1}`;
    if (!isStr(q.q)) err(f, `${w} thiếu q`);
    if (!Array.isArray(q.options) || q.options.length < 2) return err(f, `${w}: options < 2`);
    if (opts.nOptions && q.options.length !== opts.nOptions) err(f, `${w}: cần đúng ${opts.nOptions} nhận định (có ${q.options.length})`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(f, `${w}: answer ${q.answer} ngoài khoảng options`);
    if (new Set(q.options).size !== q.options.length) err(f, `${w}: phương án trùng`);
    if (!isStr(q.explain)) warn(f, `${w} thiếu explain`);
    len(f, `${w}.q`, q.q, LIMIT.q);
    q.options.forEach((o, j) => { if (!isStr(o)) err(f, `${w}.options[${j}] rỗng`); len(f, `${w}.options[${j}]`, o, LIMIT.option); });
    len(f, `${w}.explain`, q.explain, LIMIT.ebi);
    // Mẹo "chọn câu dài nhất" (PM-DUYET B1)
    if (q.options.length > 2 && Number.isInteger(q.answer)) {
      const L = q.options.map((o) => String(o).length);
      const others = L.filter((_, j) => j !== q.answer);
      if (L[q.answer] > Math.max(...others) * 1.25) warn(f, `${w}: đáp án đúng dài hơn hẳn các phương án khác`);
    }
  });
}
function checkMatch(f, c, p = '') {
  if (!Array.isArray(c.pairs) || c.pairs.length < 2) return err(f, `${p}pairs < 2`);
  uniqueIds(f, c.pairs, `${p}pairs`);
  c.pairs.forEach((x) => {
    if (!isStr(x.left?.label) || !isStr(x.right?.label)) err(f, `${p}pair ${x.id} thiếu left/right.label`);
    len(f, `${p}pair ${x.id}.left`, x.left?.label, LIMIT.option);
    len(f, `${p}pair ${x.id}.right`, x.right?.label, LIMIT.option);
  });
}
function checkOrder(f, c, p = '') {
  if (!Array.isArray(c.items) || c.items.length < 2) return err(f, `${p}items < 2`);
  uniqueIds(f, c.items, `${p}items`);
  c.items.forEach((it) => { if (!isStr(it.label)) err(f, `${p}item ${it.id} thiếu label`); len(f, `${p}item ${it.id}.label`, it.label, LIMIT.option); });
}
const ENGINES = { sort: checkSort, match: checkMatch, order: checkOrder, quiz: (f, c, p) => checkQuestions(f, c.questions, p) };

// ---- Từng file (PLAN 2.4) ----
const checks = {
  async codes(f, d) {
    if (!Array.isArray(d) || d.length !== 7) err(f, `cần đúng 7 mã (có ${d?.length})`);
    uniqueIds(f, d);
    const LV = ['cao', 'trung bình', 'thấp'];
    d.forEach((c, i) => {
      for (const k of ['id', 'abbr', 'name', 'vn', 'color', 'img', 'object', 'traits', 'fact']) if (!isStr(c[k])) err(f, `${c.id}: thiếu ${k}`);
      if (c.num !== i + 1) err(f, `${c.id}: num ${c.num} ≠ ${i + 1}`);
      if (!Array.isArray(c.products) || !c.products.length) err(f, `${c.id}: products rỗng`);
      if (!LV.includes(c.recycle?.level)) err(f, `${c.id}: recycle.level không hợp lệ`);
      if (!isStr(c.recycle?.text)) err(f, `${c.id}: thiếu recycle.text`);
      len(f, `${c.id}.fact`, c.fact, LIMIT.ebi);
      len(f, `${c.id}.traits`, c.traits, LIMIT.fact);
      len(f, `${c.id}.recycle.text`, c.recycle?.text, LIMIT.fact);
    });
  },
  async facts(f, d) {
    if (!Array.isArray(d) || d.length < 16) err(f, `cần ≥ 16 thẻ (có ${d?.length})`);
    uniqueIds(f, d);
    d.forEach((x) => {
      if (!isStr(x.text)) err(f, `${x.id}: thiếu text`);
      if (!isStr(x.tag)) err(f, `${x.id}: thiếu tag`);
      len(f, `${x.id}.text`, x.text, LIMIT.fact);
    });
  },
  async quiz(f, d) {
    if (!Number.isFinite(d.timer)) err(f, 'thiếu timer');
    if (d.questions?.length !== 10) err(f, `cần đúng 10 câu (có ${d.questions?.length})`);
    checkQuestions(f, d.questions);
  },
  async detective(f, d) { checkQuestions(f, d.questions, '', { nOptions: 3 }); },
  async sort(f, d) { checkSort(f, d); },
  async match(f, d) { checkMatch(f, d); },
  async puzzle(f, d) { checkOrder(f, d); },
  async journey(f, d) {
    const st = d.stages;
    if (!Array.isArray(st) || st.length !== 5) return err(f, `cần đúng 5 chặng (có ${st?.length})`);
    uniqueIds(f, st, 'stages');
    len(f, 'intro', d.intro, LIMIT.ebi); len(f, 'finale', d.finale, LIMIT.ebi);
    st.forEach((s) => {
      const p = `chặng ${s.id}: `;
      for (const k of ['title', 'scene', 'piece']) if (!isStr(s[k])) err(f, `${p}thiếu ${k}`);
      if (!Array.isArray(s.lines) || !s.lines.length) err(f, `${p}lines rỗng`);
      (s.lines || []).forEach((l, i) => len(f, `${p}lines[${i}]`, l, LIMIT.ebi));
      len(f, `${p}learn`, s.learn, LIMIT.fact);
      const eng = s.task?.engine;
      if (!ENGINES[eng]) return err(f, `${p}task.engine “${eng}” không thuộc sort/quiz/order/match`);
      if (!s.task.config) return err(f, `${p}thiếu task.config`);
      ENGINES[eng](f, s.task.config, p);
    });
  },
  async lab(f, d) {
    if (!isStr(d.disclaimer)) err(f, 'thiếu disclaimer');
    if (!Array.isArray(d.steps) || !d.steps.length) err(f, 'steps rỗng');
    if (!Array.isArray(d.products) || !d.products.length) err(f, 'products rỗng');
    if (!Array.isArray(d.slider?.frames) || d.slider.frames.length < 2) err(f, 'slider.frames < 2');
    uniqueIds(f, d.steps || [], 'steps'); uniqueIds(f, d.products || [], 'products');
    (d.steps || []).forEach((s) => {
      if (!isStr(s.title)) err(f, `step ${s.id}: thiếu title`);
      len(f, `step ${s.id}.ebi`, s.ebi, LIMIT.ebi);
      len(f, `step ${s.id}.text`, s.text, LIMIT.fact);
      if (s.choices) {
        uniqueIds(f, s.choices, `step ${s.id}.choices`);
        if (!s.choices.some((c) => c.isPet)) err(f, `step ${s.id}: không có lựa chọn đúng`);
        s.choices.forEach((c) => { len(f, `choice ${c.id}.label`, c.label, LIMIT.option); len(f, `choice ${c.id}.why`, c.why, LIMIT.ebi); });
      }
    });
    (d.products || []).forEach((x) => { if (!isStr(x.label)) err(f, `product ${x.id}: thiếu label`); len(f, `product ${x.id}.fact`, x.fact, LIMIT.fact); });
    (d.slider?.frames || []).forEach((fr, i) => { if (!isStr(fr.img) || !isStr(fr.label)) err(f, `slider.frames[${i}] thiếu img/label`); });
  },
};

for (const [name, fn] of Object.entries(checks)) {
  const f = name + '.js';
  let data;
  try { data = await load(name); } catch (e) { err(f, `không import được – ${e.message}`); continue; }
  try { await fn(f, data); } catch (e) { err(f, `lỗi khi kiểm tra – ${e.message}`); }
  checkImages(f, data);
}

for (const w of warns) console.log('⚠️  ' + w);
for (const e of errors) console.log('❌ ' + e);
console.log(`\n${Object.keys(checks).length} file · ${errors.length} lỗi · ${warns.length} cảnh báo`);
process.exit(errors.length ? 1 : 0);
