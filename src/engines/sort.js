// Engine phân nhóm: mỗi lần một vật, kéo (hoặc chạm/bàn phím) vào đúng ô.
/**
 * mountSort(el, config, { onComplete, onProgress }) → cleanup()
 *
 * config: {
 *   prompt: string,
 *   bins:  [{ id, label, sub?, color? }],             // 2–5 ô
 *   items: [{ id, label, img?, emoji?, hint?, bin }]  // bin = id của ô đúng; hint = gợi ý riêng (tuỳ chọn)
 * }
 * onProgress({ done, total })   sau mỗi vật xếp đúng
 * onComplete({ correct, total }) correct = số vật đúng ngay lần đầu
 *
 * `el` phải có chiều cao xác định (engine lấp đầy el).
 */
import { h, esc, pick, shuffle, vibrate } from '../core/ui.js';
import { createDnd } from './drag.js';
import { coach, visual, timers, shake, emptyState } from './common.js';

const PRAISE = ['Đúng rồi!', 'Giỏi quá!', 'Chuẩn luôn!', 'Tuyệt vời!'];

export function mountSort(el, config, { onComplete, onProgress } = {}) {
  const { prompt = '', bins = [], items = [] } = config;
  if (!items.length || !bins.length) return emptyState(el);

  const t = timers();
  const queue = shuffle(items);
  const total = queue.length;
  let idx = 0;
  let correct = 0;
  let misses = 0;
  let card = null;
  let offCard = null;

  const ebiLine = coach(esc(prompt), { pose: 'recycle' });
  const count = h('span', { class: 'chip chip-sun sort-count' });
  const pile = h('div', { class: 'sort-pile' });
  const binEls = bins.map((b) => {
    const btn = h('button', { type: 'button', class: 'sort-bin', dataset: { bin: b.id } },
      h('span', { class: 'sort-bin-label' }, b.label),
      b.sub ? h('span', { class: 'sort-bin-sub' }, b.sub) : null);
    if (b.color) btn.style.setProperty('--bin', b.color);
    return btn;
  });
  const binBox = h('div', { class: `sort-bins n${bins.length}` }, binEls);
  const root = h('div', { class: 'eng eng-sort' }, ebiLine.el, h('div', { class: 'sort-table' }, count, pile), binBox);

  const dnd = createDnd({
    targets: binEls,
    defaultItem: () => card,
    onPick: (item, via) => {
      if (item) ebiLine.say(via === 'key' ? 'Dùng phím Tab chọn ô rồi nhấn Enter nhé.' : 'Giờ chạm vào ô đúng nhé!');
    },
    onDrop: (itemEl, target, via) => {
      const item = queue[idx];
      if (itemEl !== card || !item) return false;
      const bin = bins.find((b) => b.id === target.dataset.bin);

      if (item.bin === bin.id) {
        if (!misses) correct++;
        idx++;
        target.classList.add('is-ok');
        t.later(() => target.classList.remove('is-ok'), 420);
        ebiLine.say(`${pick(PRAISE)} <b>${esc(item.label)}</b> thuộc nhóm <b>${esc(bin.label)}</b>.`, { ok: true });
        onProgress?.({ done: idx, total });
        clearCard();
        t.later(() => next(via), idx === total ? 700 : 260);
        return true;
      }

      misses++;
      vibrate();
      shake(target);
      shake(itemEl);
      const answer = bins.find((b) => b.id === item.bin);
      ebiLine.say(hintFor(item, bin, answer, misses), { ok: false });
      return false;
    },
  });

  function hintFor(item, wrong, answer, n) {
    if (item.hint && n === 1) return `Chưa đúng rồi. ${esc(item.hint)}`;
    if (n >= 2 && answer) return `Gợi ý nè: thử ô <b>${esc(answer.label)}</b> xem sao!`;
    return `<b>${esc(item.label)}</b> không thuộc nhóm <b>${esc(wrong.label)}</b>. Bạn thử ô khác nhé!`;
  }

  function clearCard() {
    offCard?.();
    offCard = null;
    card?.remove();
    card = null;
  }

  function next(via) {
    if (idx >= total) { onComplete?.({ correct, total }); return; }
    misses = 0;
    const item = queue[idx];
    const pic = visual(item, 'sort-pic');
    card = h('button', { type: 'button', class: 'sort-card anim-pop', 'aria-label': `Món đồ: ${item.label}` },
      pic, h('span', { class: 'sort-card-label' }, item.label));
    if (!pic) card.classList.add('no-pic');
    offCard = dnd.add(card);
    pile.dataset.left = String(Math.min(total - idx, 3));
    pile.append(card);
    count.textContent = `${idx + 1}/${total}`;
    if (via === 'key') card.focus();
  }

  el.append(root);
  onProgress?.({ done: 0, total });
  next();

  return () => {
    t.clear();
    dnd.destroy();
    root.remove();
  };
}
