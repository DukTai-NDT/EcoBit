// ECO JOURNEY – bản đồ 5 chặng · mỗi chặng: cảnh → nhiệm vụ → nhận mảnh · tranh vòng đời khi đủ 5 mảnh.
import { h, css, esc, say, bubble, icon, confetti, reducedMotion } from '../core/ui.js';
import { ebi, setEbi, react } from '../core/ebi.js';
import { BADGES } from '../core/store.js';
import { visual, timers } from '../engines/common.js';
import { mountSort } from '../engines/sort.js';
import { mountQuiz } from '../engines/quiz.js';
import { mountOrder } from '../engines/order.js';
import { mountMatch } from '../engines/match.js';
import data from '../data/journey.js';

const ENGINES = { sort: mountSort, quiz: mountQuiz, order: mountOrder, match: mountMatch };

// Dàn cảnh từng chặng (chỉ là trang trí, không phải nội dung kiến thức)
const POSE = { 1: 'wave', 2: 'recycle', 3: 'arms', 4: 'think', 5: 'cheer' };
const FX = { 1: 'leaf', 2: 'spark', 3: 'bubble', 4: 'flake', 5: 'spark' };

const HOLD_PIECE = 900;    // ms: mảnh đứng yên cho kịp đọc tên
const FLIGHT = 800;        // khớp transition .jr-tile.is-flying

const stages = data.stages;

/** Chặng chưa có mảnh kế tiếp, tính vòng từ sau chặng `from` (1..5). Hết → null. */
function nextMissing(got, from = 0) {
  for (let n = 0; n < stages.length; n++) {
    const s = stages[(from + n) % stages.length];
    if (!got[s.id - 1]) return s;
  }
  return null;
}

/** Khung tranh 5 mảnh: mảnh đã nhận hiện rõ, chưa nhận mờ. */
function frame(got) {
  const slots = stages.map((s, i) => h('div', {
    class: `jr-slot ${got[i] ? 'is-got' : ''}`,
    role: 'img',
    'aria-label': got[i] ? `Mảnh ${s.id}: ${s.piece}` : `Mảnh ${s.id}: chưa nhận`,
  }, visual({ img: s.pieceImg, label: '' }, 'jr-slot-img')));
  return { el: h('div', { class: 'jr-frame' }, slots), slots };
}

/** Thanh điều hướng ở đáy màn: trái · giữa · phải. Trả về { el, set }. */
function bottomNav() {
  const el = h('nav', { class: 'jr-nav', 'aria-label': 'Điều hướng chặng' });
  return { el, set: (left, mid, right) => el.replaceChildren(left, h('div', { class: 'jr-nav-mid' }, mid), right || '') };
}

const mapLink = () => h('a', { class: 'btn', href: '#/journey' }, h('span', { 'aria-hidden': 'true' }, '←'), 'Bản đồ');

// ---------------- Bản đồ ----------------
function renderMap(el, { store }) {
  const got = store.state.journey;
  const count = got.filter(Boolean).length;
  const all = count === stages.length;
  const nextUp = nextMissing(got);

  const stops = stages.map((s, i) => {
    const done = got[i];
    const isNext = nextUp === s;
    const status = done ? 'Đã nhận mảnh' : isNext ? 'Đi tiếp nào' : 'Chưa đi';
    const disc = h('span', { class: 'jr-disc', html: done ? icon('check', 22) : String(s.id) });
    return h('a', {
      class: `jr-stop ${done ? 'is-done' : isNext ? 'is-next' : 'is-later'}`,
      href: `#/journey/${s.id}`,
      'aria-label': `Chặng ${s.id}: ${s.title}. ${status}.`,
    },
    disc,
    h('span', { class: 'jr-stop-card' },
      visual({ img: s.scene, label: '' }, 'jr-stop-img'),
      h('span', { class: 'jr-stop-text' },
        h('b', { class: 'jr-stop-title' }, s.title),
        h('span', { class: `chip ${done ? 'chip-green' : isNext ? 'chip-sun' : ''}` }, status))));
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'jr-path');
  svg.setAttribute('aria-hidden', 'true');
  const road = h('div', { class: 'jr-road' }, svg, stops);

  // Con đường nối tâm các chấm, vẽ lại khi đổi cỡ màn
  function drawRoad() {
    const pts = stops.map((a) => {
      const d = a.querySelector('.jr-disc');
      return [a.offsetLeft + d.offsetLeft + d.offsetWidth / 2, a.offsetTop + d.offsetTop + d.offsetHeight / 2];
    });
    svg.innerHTML = pts.slice(1).map((p, n) => {
      const a = pts[n];
      const lit = got[n] && got[n + 1];
      const [mx, my] = [(a[0] + p[0]) / 2, (a[1] + p[1]) / 2];
      const bend = (n % 2 ? -1 : 1) * 12;
      const vertical = Math.abs(p[1] - a[1]) > Math.abs(p[0] - a[0]);
      const ctrl = vertical ? `${mx + bend} ${my}` : `${mx} ${my + bend}`;
      return `<path class="${lit ? 'is-lit' : ''}" d="M${a[0]} ${a[1]} Q${ctrl} ${p[0]} ${p[1]}"/>`;
    }).join('');
  }

  el.append(h('div', { class: 'screen-inner jr-map' },
    h('header', { class: 'jr-map-head' },
      ebi({ pose: all ? 'cheer' : 'earth', mood: 'happy', size: 64, still: true }),
      bubble(esc(all ? data.finale : data.intro))),
    road,
    h('section', { class: 'jr-board', 'aria-label': 'Khung tranh 5 mảnh ghép' },
      h('div', { class: 'jr-board-head' },
        h('b', null, 'Khung tranh'),
        all
          ? h('a', { class: 'btn btn-sun btn-sm jr-see', href: '#/journey/finale' }, 'Xem bức tranh')
          : h('span', { class: 'chip chip-aqua' }, `${count}/${stages.length} mảnh`)),
      frame(got).el)));

  drawRoad();
  document.fonts?.ready.then(() => { if (road.isConnected) drawRoad(); });
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(drawRoad);
    ro.observe(road);
    return () => ro.disconnect();
  }
  window.addEventListener('resize', drawRoad);
  return () => window.removeEventListener('resize', drawRoad);
}

// ---------------- Một chặng ----------------
function renderStage(el, { store, go }, stage) {
  const i = stage.id - 1;
  const t = timers();
  let stopEngine = null;
  let landed = null;     // cập nhật màn khi hoạt ảnh bay xong

  const title = h('header', { class: 'jr-title' },
    h('span', { class: 'chip chip-sun' }, `Chặng ${stage.id}/${stages.length}`),
    h('h1', null, stage.title));
  const body = h('div', { class: 'jr-body' });
  const nav = bottomNav();
  const root = h('div', { class: 'screen-inner jr-stage' }, title, body, nav.el);
  el.append(root);

  // --- Bước 1: hoạt cảnh ---
  function showScene() {
    root.classList.remove('is-task');
    let line = 0;
    const fx = h('div', { class: `jr-fx fx-${FX[stage.id]}`, 'aria-hidden': 'true' },
      Array.from({ length: 8 }, () => h('i')));
    const pic = visual({ img: stage.scene, label: stage.title }, 'jr-scene-img');
    const speech = bubble(esc(stage.lines[0]));
    speech.setAttribute('aria-live', 'polite');
    body.replaceChildren(h('div', { class: 'jr-scene' },
      h('div', { class: 'jr-scene-box' }, pic, fx),
      h('div', { class: 'jr-scene-talk' }, ebi({ pose: POSE[stage.id], mood: 'smile', size: 84 }), speech)));

    function paint() {
      const last = line === stage.lines.length - 1;
      const dots = h('div', { class: 'dots', 'aria-hidden': 'true' },
        stage.lines.map((_, n) => h('i', { class: n === line ? 'cur' : n < line ? 'on' : null })));
      const left = line > 0
        ? h('button', { type: 'button', class: 'btn', onclick: () => { line--; move(); } }, h('span', { 'aria-hidden': 'true' }, '←'), 'Quay lại')
        : mapLink();
      const right = h('button', {
        type: 'button',
        class: `btn ${last ? 'btn-sun' : 'btn-primary'}`,
        onclick: (e) => {
          if (last) showTask(e.detail === 0);
          else { line++; move(); }
        },
      }, last ? 'Nhiệm vụ' : 'Tiếp', h('span', { 'aria-hidden': 'true' }, '→'));
      nav.set(left, dots, right);
      return right;
    }
    function move() {
      say(speech, esc(stage.lines[line]));
      paint().focus({ preventScroll: true });
    }
    paint();
  }

  // --- Bước 2: nhiệm vụ ---
  function showTask(byKey) {
    root.classList.add('is-task');
    const bar = h('div', { class: 'progress jr-bar', role: 'progressbar', 'aria-label': 'Tiến độ nhiệm vụ', 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('span'));
    nav.set(mapLink(), bar);
    const host = h('div', { class: 'jr-host' });
    body.replaceChildren(host);
    const start = ENGINES[stage.task.engine];
    stopEngine = start(host, stage.task.config, {
      onProgress: ({ done, total }) => {
        const p = total ? Math.round((done / total) * 100) : 0;
        bar.style.setProperty('--p', `${p}%`);
        bar.setAttribute('aria-valuenow', String(p));
      },
      onComplete: () => {
        stopEngine?.();
        stopEngine = null;
        showReward();
      },
    });
    if (byKey) host.querySelector('button')?.focus();
  }

  // --- Bước 3: kiến thức + nhận mảnh ---
  function showReward() {
    root.classList.remove('is-task');
    const hadPiece = store.state.journey[i];
    const board = frame(store.state.journey.slice());   // khung vẽ trước khi ghi, mảnh mới sáng khi bay tới
    let face = ebi({ pose: 'cheer', mood: 'happy', size: 84, still: true });
    const tile = h('div', { class: 'jr-tile anim-pop' }, visual({ img: stage.pieceImg, label: '' }, 'jr-tile-img'));
    const note = h('p', { class: 'jr-gift-note', role: 'status' },
      hadPiece ? `Bạn đã có mảnh “${stage.piece}” rồi.` : 'Mảnh ghép mới: ', hadPiece ? null : h('b', null, stage.piece));

    body.replaceChildren(h('div', { class: 'jr-reward' },
      h('div', { class: 'card jr-learn anim-up' }, stage.learn),
      h('div', { class: 'jr-gift' }, face, h('div', { class: 'jr-gift-main' }, hadPiece ? null : tile, note)),
      board.el));

    const nextBtn = h('button', { type: 'button', class: 'btn btn-primary', disabled: !hadPiece, onclick: leave }, nextLabel(), h('span', { 'aria-hidden': 'true' }, '→'));
    nav.set(mapLink(), null, nextBtn);
    if (hadPiece) return;

    store.journeyPiece(i);      // xong nhiệm vụ là có mảnh; hoạt ảnh bay chỉ để hiển thị

    landed = () => {
      landed = null;
      tile.remove();
      board.slots[i].classList.add('is-got', 'is-new');
      board.slots[i].setAttribute('aria-label', `Mảnh ${stage.id}: ${stage.piece}`);
      note.replaceChildren('Đã ghép mảnh: ', h('b', null, stage.piece));
      face = setEbi(face, { pose: 'cheer', mood: 'happy', size: 84, still: true });
      react(face, true);
      nextBtn.replaceChildren(nextLabel(), h('span', { 'aria-hidden': 'true' }, '→'));
      nextBtn.disabled = false;
      nextBtn.focus({ preventScroll: true });
    };

    if (reducedMotion()) { landed(); return; }
    t.later(() => {
      fly(tile, board.slots[i]);
      t.later(() => landed?.(), FLIGHT + 40);
    }, HOLD_PIECE);
  }

  function fly(from, to) {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    from.classList.remove('anim-pop');
    from.classList.add('is-flying');
    from.style.transform = `translate(${dx}px, ${dy}px) scale(${b.width / a.width}) rotate(360deg)`;
  }

  function nextLabel() {
    const got = store.state.journey.slice();
    got[i] = true;
    return nextMissing(got, stage.id) ? 'Chặng tiếp' : 'Xem bức tranh';
  }

  function leave() {
    const s = nextMissing(store.state.journey, stage.id);
    go(s ? `/journey/${s.id}` : '/journey/finale');
  }

  showScene();
  return () => {
    t.clear();
    stopEngine?.();
  };
}

// ---------------- Bức tranh vòng đời ----------------
function renderFinale(el, { go, store }) {
  if (!store.state.journey.every(Boolean)) { go('/journey'); return undefined; }

  const t = timers();
  const n = data.cycle.length;
  const R = 38;   // bán kính vòng, % cạnh khung
  const at = (a) => [50 + R * Math.sin(a), 50 - R * Math.cos(a)];

  const nodes = data.cycle.map((c, k) => {
    const [x, y] = at((k / n) * 2 * Math.PI);
    return h('figure', { class: 'jr-node', style: { left: `${x}%`, top: `${y}%`, animationDelay: `${k * 0.14}s` } },
      visual({ img: c.img, label: c.label }, 'jr-node-img'),
      h('figcaption', null, c.label));
  });
  // mũi tên giữa hai khung, theo chiều kim đồng hồ
  const arrows = data.cycle.map((_, k) => {
    const a = ((k + 0.5) / n) * 2 * Math.PI;
    const [x, y] = at(a);
    return `<path d="M-1.8 -2.6 L1.8 0 L-1.8 2.6" transform="translate(${x} ${y}) rotate(${(a * 180) / Math.PI})"/>`;
  }).join('');
  const ring = h('div', { class: 'jr-ring' },
    h('div', { class: 'jr-ring-art', 'aria-hidden': 'true', html: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}"/>${arrows}</svg>` }),
    ebi({ pose: 'recycle', mood: 'happy', size: 96, cls: 'jr-ring-ebi' }),
    nodes);

  const badge = BADGES.find((b) => b.id === 'explorer');
  el.append(h('div', { class: 'screen-inner jr-finale' },
    h('h1', { class: 'jr-finale-title' }, 'Bức tranh vòng đời mới'),
    h('div', { class: 'jr-finale-body' },
      ring,
      h('div', { class: 'jr-finale-side' },
        bubble(esc(data.finale), 'top'),
        h('div', { class: 'jr-finale-chips' },
          h('span', { class: 'chip chip-sun' }, `${badge.emoji} ${badge.name}`)))),
    h('nav', { class: 'jr-nav', 'aria-label': 'Điều hướng' },
      mapLink(),
      h('div', { class: 'jr-nav-mid' }),
      h('a', { class: 'btn btn-primary', href: '#/passport' }, 'Xem huy hiệu', h('span', { 'aria-hidden': 'true' }, '→')))));

  t.later(() => confetti(), 400);
  return () => t.clear();
}

export default {
  id: 'journey', title: 'ECO JOURNEY', short: 'Hành trình', icon: 'journey',
  mount(el, ctx) {
    css('zones/journey.css');
    const sub = ctx.params[0];
    if (!sub) return renderMap(el, ctx);
    if (sub === 'finale') return renderFinale(el, ctx);
    const stage = stages.find((s) => String(s.id) === sub);
    if (!stage) { ctx.replace('/journey'); return undefined; }
    return renderStage(el, ctx, stage);
  },
};
