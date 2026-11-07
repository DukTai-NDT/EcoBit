// ECO DISCOVER – lưới 7 mã nhựa, thẻ chi tiết, thử thách đoán mã, thẻ "Bạn có biết?".
import { h, css, esc, img, icon, bubble, backBtn, shuffle, pick, vibrate } from '../core/ui.js';
import { ebi } from '../core/ebi.js';
import { resinBadge } from '../core/resin.js';
import { coach, visual, shake } from '../engines/common.js';
import { showResult } from '../engines/result.js';
import codes from '../data/codes.js';
import facts from '../data/facts.js';

const ACTIVITY = 'discover:identify';
const TITLE_IDENTIFY = 'Đoán mã nhựa';
const TITLE_FACTS = 'Bạn có biết?';
const DESKTOP = '(min-width: 861px)';
const FACTS_PHONE = 3;
const FACTS_DESKTOP = 6;

/** Gán màu mã nhựa cho phần tử (CSS dùng qua --c). */
function tinted(el, code) {
  el.style.setProperty('--c', code.color);
  return el;
}

/** Ký hiệu tam giác kiểu sticker; tên viết tắt do chữ bên cạnh đảm nhiệm. */
const resin = (code, size) => h('span', {
  class: 'dv-resin',
  html: resinBadge(code.num, code.abbr, { size, abbr: false, color: code.color, outline: true, numColor: 'var(--ink)', title: '' }),
});

/** Khung ảnh cố định: ảnh sticker tỉ lệ nào cũng nằm gọn nhờ object-fit: contain. */
const stickerBox = (code, alt = '') => h('span', { class: 'dv-pic' }, img(code.img, alt));

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/* ---------- #/discover ---------- */

function codeCard(code, seen) {
  return tinted(h('a', {
    class: `dv-card ${seen ? 'is-seen' : ''}`,
    href: `#/discover/${code.id}`,
    'aria-label': `${code.abbr} – ${code.vn}${seen ? ' (đã xem)' : ''}`,
  },
  stickerBox(code),
  h('span', { class: 'dv-foot' }, resin(code, 30), h('b', { class: 'dv-abbr' }, code.abbr)),
  h('span', { class: 'dv-card-vn' }, code.vn),
  seen ? h('span', { class: 'dv-check', html: icon('check', 16) }) : null), code);
}

function entry(href, cls, ico, label, done) {
  return h('a', { class: `dv-entry ${cls}`, href },
    h('span', { class: 'dv-entry-ico', 'aria-hidden': 'true', html: ico }),
    h('span', { class: 'dv-entry-text' }, label),
    done ? h('span', { class: 'dv-entry-done', role: 'img', 'aria-label': 'Đã hoàn thành', html: icon('check', 18) }) : null);
}

function renderHome(el, { store }) {
  const viewed = store.state.codesViewed;
  const count = codes.filter((c) => viewed.includes(c.id)).length;
  const line = count >= codes.length
    ? 'Bạn đã xem đủ các mã rồi! Thử thách đoán mã nào.'
    : 'Chào bạn! Chạm một mã nhựa để khám phá nhé.';

  const guide = coach(line, { pose: 'wave', mood: 'happy', size: 44 });

  el.append(h('div', { class: 'screen-inner dv-home' },
    h('header', { class: 'dv-home-head' },
      h('h1', { class: 'dv-home-title' }, 'ECO DISCOVER'),
      guide.el,
      h('span', { class: 'chip chip-green dv-count', 'aria-label': `Đã xem ${count} trên ${codes.length} mã` }, `${count}/${codes.length}`),
      img('loc-discover', '', { class: 'dv-home-deco' })),
    h('div', { class: 'dv-grid stagger' },
      codes.map((c) => codeCard(c, viewed.includes(c.id))),
      h('div', { class: 'dv-entries' },
        entry('#/discover/identify', 'dv-entry-quiz', icon('discover', 26), `Thử thách: ${TITLE_IDENTIFY}`, store.isDone(ACTIVITY)),
        entry('#/discover/facts', 'dv-entry-facts', icon('star', 26), TITLE_FACTS)))));
}

/* ---------- #/discover/<mã> ---------- */

const LEVELS = ['thấp', 'trung bình', 'cao'];

function recycleMeter(level) {
  const at = LEVELS.indexOf(level);
  return h('div', { class: `dv-meter lv-${at}`, role: 'img', 'aria-label': `Khả năng tái chế: ${level}` },
    LEVELS.map((l, i) => h('span', {
      class: `dv-seg ${i <= at ? 'on' : ''} ${i === at ? 'cur' : ''}`,
    }, h('i'), l.charAt(0).toUpperCase() + l.slice(1))));
}

const TABS = [
  { id: 'traits', short: 'Đặc điểm', title: 'Đặc điểm',
    body: (c) => h('p', { class: 'dv-text' }, c.traits) },
  { id: 'products', short: 'Sản phẩm', title: 'Sản phẩm thường gặp',
    body: (c) => h('ul', { class: 'dv-list' }, c.products.map((p) => h('li', null, p))) },
  { id: 'recycle', short: 'Tái chế', title: 'Khả năng tái chế',
    body: (c) => [recycleMeter(c.recycle.level), h('p', { class: 'dv-text' }, c.recycle.text)] },
  { id: 'fact', short: 'Thú vị', title: 'Sự thật thú vị',
    body: (c) => h('div', { class: 'dv-fact' }, ebi({ pose: 'megaphone', mood: 'wink', size: 56, still: true }), bubble(esc(c.fact))) },
];

let keepTab = 0; // giữ tab đang mở khi bấm ← → sang mã khác, để dễ so sánh các mã

function renderDetail(el, { store }, code) {
  store.viewCode(code.id);

  const at = codes.indexOf(code);
  const prev = codes[(at + codes.length - 1) % codes.length];
  const next = codes[(at + 1) % codes.length];
  let current = keepTab;
  keepTab = 0;

  const nav = (to, label, cls) => h('a', {
    class: `btn btn-icon dv-nav ${cls}`,
    href: `#/discover/${to.id}`,
    'aria-label': `${label}: ${to.abbr}`,
    html: icon('arrow', 22),
    onclick: () => { keepTab = current; },
  });

  const panel = h('div', { class: 'dv-tabpanel', id: 'dv-panel', role: 'tabpanel', tabindex: '0' });
  const tabs = TABS.map((t, i) => h('button', {
    type: 'button', class: 'dv-tab', role: 'tab', id: `dv-tab-${t.id}`, 'aria-controls': 'dv-panel',
    onclick: () => show(i),
  }, t.short));

  function show(i, focus = false) {
    current = i;
    tabs.forEach((b, n) => {
      b.setAttribute('aria-selected', String(n === i));
      b.tabIndex = n === i ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.replaceChildren(h('h2', { class: 'dv-panel-title' }, TABS[i].title), ...[TABS[i].body(code)].flat());
    if (focus) tabs[i].focus();
  }

  const onKey = (e) => {
    const n = TABS.length;
    const to = { ArrowRight: (current + 1) % n, ArrowLeft: (current + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (to == null) return;
    e.preventDefault();
    show(to, true);
  };

  el.append(tinted(h('div', { class: 'screen-inner dv-detail' },
    h('header', { class: 'dv-head' },
      backBtn('/discover', 'Các mã'),
      h('span', { class: 'dv-pager' },
        nav(prev, 'Mã trước', 'dv-nav-prev'),
        h('span', { class: 'dv-pager-num', 'aria-label': `Mã ${at + 1} trên ${codes.length}` }, `${at + 1}/${codes.length}`),
        nav(next, 'Mã sau', 'dv-nav-next'))),
    h('div', { class: 'dv-sheet anim-pop' },
      h('div', { class: 'dv-hero' },
        stickerBox(code, code.object),
        h('div', { class: 'dv-hero-text' },
          h('div', { class: 'dv-hero-code' }, resin(code, 44), h('h1', { class: 'dv-hero-abbr' }, code.abbr)),
          h('p', { class: 'dv-hero-name' }, code.name),
          h('p', { class: 'dv-hero-vn' }, code.vn))),
      h('div', { class: 'dv-tabs-wrap' },
        h('div', { class: 'dv-tabs', role: 'tablist', 'aria-label': `Thông tin ${code.abbr}`, onkeydown: onKey }, tabs),
        panel))), code));

  show(current);
}

/* ---------- #/discover/identify ---------- */

const PRAISE = ['Đúng rồi! Bạn tinh mắt ghê!', 'Chuẩn luôn! Bạn giỏi quá!', 'Chính xác! Mình phục bạn đó!'];

function renderIdentify(el, { store, go }) {
  const bar = h('div', { class: 'progress dv-progress', role: 'progressbar', 'aria-label': 'Tiến độ', 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('span'));
  const host = h('div', { class: 'dv-host' });
  el.append(h('div', { class: 'screen-inner dv-game' },
    h('header', { class: 'dv-head' }, backBtn('/discover', 'Các mã'), h('h1', { class: 'dv-title' }, TITLE_IDENTIFY), bar),
    host));

  const setProgress = (ratio) => {
    const p = Math.round(ratio * 100);
    bar.style.setProperty('--p', `${p}%`);
    bar.setAttribute('aria-valuenow', String(p));
  };

  let stop = null;
  const halt = () => { if (stop) { stop(); stop = null; } };

  function start() {
    halt();
    setProgress(0);

    const total = codes.length;
    const items = shuffle(codes);
    const rounds = new Map(items.map((c) => [c.id, { wrong: new Set(), solved: false }]));
    let cur = null;      // đồ vật đang chọn
    let solved = 0;
    let correct = 0;     // số đồ vật đúng ngay lần đầu

    const guide = coach('Chạm một đồ vật trên kệ nhé!', { pose: 'wave', size: 44 });
    const msg = h('p', { class: 'dv-msg', 'aria-live': 'polite' }, 'Mỗi đồ vật làm từ một loại nhựa. Bạn đoán xem!');

    // Ảnh rộng được ô rộng hơn trên kệ, ảnh cao và hẹp nhường chỗ lại.
    const fitWidth = ({ target: pic }) => {
      if (pic.naturalHeight) pic.parentElement.style.flexGrow = Math.min(1.7, Math.max(0.85, pic.naturalWidth / pic.naturalHeight));
    };

    const objects = new Map();
    const objectBtn = (c, n) => {
      const b = h('button', {
        type: 'button', class: 'dv-obj', 'aria-label': `Đồ vật ${n + 1}: ${c.object}`,
        onclick: () => select(c),
      }, img(c.img, '', { onload: fitWidth }));
      objects.set(c.id, b);
      return b;
    };

    const choices = new Map();
    const choiceBox = h('div', { class: 'dv-choices', role: 'group', 'aria-label': 'Chọn mã nhựa' },
      codes.map((c) => {
        const b = tinted(h('button', {
          type: 'button', class: 'dv-choice', disabled: true, 'aria-label': `Mã số ${c.num} – ${c.abbr}`,
          onclick: () => answer(c),
        }, resin(c, 24), h('b', null, c.abbr)), c);
        choices.set(c.id, b);
        return b;
      }));

    const shelf = h('div', { class: 'dv-shelf' },
      h('div', { class: 'dv-row' }, items.slice(0, 4).map(objectBtn)),
      h('div', { class: 'dv-row' }, items.slice(4).map((c, i) => objectBtn(c, i + 4))));
    const panel = h('div', { class: 'dv-panel' }, msg, choiceBox);

    function showInfo(c) {
      choiceBox.hidden = true;
      msg.replaceChildren(
        h('b', { class: 'dv-msg-label' }, `${c.object} · số ${c.num} ${c.abbr}`),
        h('span', null, c.traits));
    }

    function showChoices(c) {
      const round = rounds.get(c.id);
      choiceBox.hidden = false;
      choices.forEach((b, id) => {
        b.disabled = round.wrong.has(id);
        b.classList.toggle('is-wrong', round.wrong.has(id));
      });
      msg.textContent = round.wrong.size ? hint(c) : 'Đồ vật này mang mã nào?';
    }

    const hint = (c) => `Gợi ý: cùng mã này còn có ${c.products.slice(1).map(lowerFirst).join(', ')}.`;

    function select(c) {
      if (cur) objects.get(cur.id).classList.remove('is-on');
      cur = c;
      objects.get(c.id).classList.add('is-on');
      if (rounds.get(c.id).solved) showInfo(c); else showChoices(c);
    }

    function answer(c) {
      const round = rounds.get(cur.id);
      if (round.solved) return;
      if (c.id !== cur.id) {
        round.wrong.add(c.id);
        vibrate([30, 40, 30]);
        shake(choices.get(c.id));
        showChoices(cur);
        guide.say('Chưa đúng rồi, thử lại nhé!', { ok: false });
        return;
      }

      round.solved = true;
      solved += 1;
      if (!round.wrong.size) correct += 1;
      vibrate(20);
      setProgress(solved / total);
      const obj = objects.get(cur.id);
      obj.classList.add('is-solved');
      obj.append(tinted(h('span', { class: 'dv-obj-tag' }, cur.abbr), cur));
      showInfo(cur);

      const done = solved >= total;
      guide.say(done ? 'Xong cả kệ rồi!' : pick(PRAISE), { ok: true });
      if (done) {
        const btn = h('button', { type: 'button', class: 'btn btn-primary dv-finish', onclick: finish }, 'Xem kết quả');
        guide.el.querySelector('.bubble').replaceWith(btn);
        btn.focus({ preventScroll: true });
      }
    }

    function finish() {
      const res = store.complete(ACTIVITY, { correct, total });
      setProgress(1);
      stop = showResult(host, {
        title: TITLE_IDENTIFY,
        correct,
        total,
        gained: res.gained,
        perfect: res.perfect,
        onReplay: start,
        onNext: () => go('/discover'),
        nextLabel: 'Về các mã nhựa',
      });
    }

    const root = h('div', { class: 'dv-id' }, guide.el, shelf, panel);
    host.replaceChildren(root);
    stop = () => root.remove();
  }

  start();
  return halt;
}

/* ---------- #/discover/facts ---------- */

function flipCard(f) {
  const front = h('span', { class: 'dv-face dv-front' },
    h('span', { class: 'dv-pic' }, visual({ img: f.img, emoji: f.emoji })),
    h('span', { class: 'dv-front-text' },
      h('span', { class: 'chip chip-sun dv-tag' }, f.tag),
      h('b', { class: 'dv-front-title' }, TITLE_FACTS),
      h('span', { class: 'dv-front-hint' }, 'Chạm để lật')));
  const back = h('span', { class: 'dv-face dv-back', 'aria-hidden': 'true' }, f.text);

  const card = h('button', {
    type: 'button', class: 'dv-flip',
    onclick: () => {
      const flipped = card.classList.toggle('is-flipped');
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
    },
  }, h('span', { class: 'dv-flip-inner' }, front, back));
  return card;
}

function renderFacts(el) {
  const desktop = window.matchMedia(DESKTOP);
  const grid = h('div', { class: 'dv-flips stagger' });
  let deck = shuffle(facts);
  let at = 0;

  // Rút tuần tự cả bộ để bạn đọc hết các thẻ rồi mới gặp lại thẻ cũ.
  function deal() {
    const n = Math.min(desktop.matches ? FACTS_DESKTOP : FACTS_PHONE, facts.length);
    if (at + n > deck.length) {
      const split = Math.max(0, at - n);
      deck = [...deck.slice(at), ...shuffle(deck.slice(0, split)), ...deck.slice(split, at)];
      at = 0;
    }
    grid.replaceChildren(...deck.slice(at, at + n).map(flipCard));
    at += n;
  }

  el.append(h('div', { class: 'screen-inner dv-facts' },
    h('header', { class: 'dv-head' }, backBtn('/discover', 'Các mã'), h('h1', { class: 'dv-title' }, TITLE_FACTS)),
    grid,
    h('div', { class: 'dv-facts-foot' },
      coach('Chạm để lật!', { pose: 'think', size: 36 }).el,
      h('button', { type: 'button', class: 'btn btn-sun dv-deal', onclick: deal, html: `${icon('refresh', 20)}Đổi thẻ` }))));

  deal();
  desktop.addEventListener('change', deal);
  return () => desktop.removeEventListener('change', deal);
}

export default {
  id: 'discover', title: 'ECO DISCOVER', short: 'Khám phá', icon: 'discover',
  mount(el, ctx) {
    css('zones/discover.css');
    const sub = ctx.params[0];
    if (!sub) { renderHome(el, ctx); return undefined; }
    if (sub === 'identify') return renderIdentify(el, ctx);
    if (sub === 'facts') return renderFacts(el);
    const code = codes.find((c) => c.id === sub);
    if (!code) { ctx.replace('/discover'); return undefined; }
    return renderDetail(el, ctx, code);
  },
};
