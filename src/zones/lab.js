// ECO LAB – sảnh · TN1 tái chế chai PET 5 bước · TN3 thanh trượt trước/sau. Ghi chú mô phỏng luôn hiển thị.
import { h, css, esc, bubble, say, icon, vibrate, reducedMotion } from '../core/ui.js';
import { ebi, setEbi, react } from '../core/ebi.js';
import { visual, timers, shake } from '../engines/common.js';
import { mountSort } from '../engines/sort.js';
import { showResult } from '../engines/result.js';
import data from '../data/lab.js';

const PHASE_MS = 2200;     // thời gian chạy mỗi công đoạn máy
const TAP_MS = 280;        // nhấn ngắn hơn mức này = "bấm 1 lần", máy tự chạy tới hết

const RUN_HINT = 'Giữ nút để chạy máy, hoặc bấm 1 lần cho máy tự chạy nhé!';

/** Ghi chú "mô phỏng giáo dục" – có mặt ở mọi màn Lab. */
const note = () => h('p', { class: 'lab-note' }, data.disclaimer);

// ---------------- Sảnh ----------------
function renderHub(el, { store }) {
  const done = store.isDone('lab:recycle');
  const card = (cfg) => {
    const inner = [
      h('span', { class: 'lab-card-pic' }, visual({ img: cfg.img, label: '' }, 'lab-card-img')),
      h('span', { class: 'lab-card-text' },
        h('b', { class: 'lab-card-name' }, cfg.name),
        h('span', { class: 'lab-card-desc' }, cfg.desc),
        h('span', { class: `chip ${cfg.chipCls}` }, cfg.chip)),
    ];
    return cfg.href
      ? h('a', { class: 'lab-card', href: `#${cfg.href}` }, inner)
      : h('div', { class: 'lab-card is-soon', 'aria-disabled': 'true' }, inner);
  };

  el.append(h('div', { class: 'screen-inner lab lab-hub' },
    h('header', { class: 'lab-hub-head' },
      ebi({ pose: 'plant', mood: 'happy', size: 56, still: true }),
      h('h1', null, 'ECO LAB')),
    h('div', { class: 'lab-cards stagger' },
      card({ img: 'lab-wash', name: 'Tự tay tái chế chai PET', desc: '5 bước từ chai cũ đến sản phẩm mới', href: '/lab/recycle',
        chip: done ? 'Đã xong' : 'Chưa làm · +30đ', chipCls: done ? 'chip-green' : 'chip-sun' }),
      card({ img: 'step-4-yarn', name: 'Trước & sau', desc: 'Kéo thanh trượt xem chai đổi dạng', href: '/lab/slider',
        chip: 'Thử ngay', chipCls: 'chip-aqua' }),
      card({ img: 'lab-extruder', name: 'ECO MIX', desc: 'Thí nghiệm mới đang được chuẩn bị', chip: 'Sắp ra mắt', chipCls: '' })),
    note()));
}

// ---------------- TN1: bộ chạy máy (giữ / bấm 1 lần / Enter / Space) ----------------
function machine(step, finished, onDone) {
  const phases = step.phases;
  const total = PHASE_MS * phases.length;
  let p = finished ? 1 : 0;
  let idx = finished ? phases.length - 1 : 0;
  let holding = false;
  let auto = false;
  let raf = 0;
  let last = 0;
  let downAt = 0;
  let over = finished;

  const slot = (name, cls, label) => h('div', { class: `lab-thumb ${cls}` }, visual({ img: name, label }, 'lab-thumb-img'));
  const fromBox = h('div', { class: 'lab-end' });
  const toBox = h('div', { class: 'lab-end' });
  const main = h('div', { class: 'lab-unit' });
  const fx = h('div', { class: 'lab-fx', 'aria-hidden': 'true' }, Array.from({ length: 7 }, () => h('i')));
  const rig = h('div', { class: 'lab-rig' }, main, fx);
  const phaseLabel = h('b', { class: 'lab-phase' });
  const bar = h('div', { class: 'progress lab-bar', role: 'progressbar', 'aria-label': 'Tiến độ máy', 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('span'));
  const btn = h('button', { type: 'button', class: 'btn btn-sun lab-run', html: `${icon('refresh', 20)}Chạy máy` });

  function show(n) {
    const ph = phases[n];
    fromBox.replaceChildren(slot(ph.from, '', ph.label));
    toBox.replaceChildren(slot(ph.to, 'is-output', ph.label));
    main.replaceChildren(visual({ img: ph.img, label: ph.label }, 'lab-unit-img'));
    fx.className = `lab-fx fx-${ph.fx}`;
    phaseLabel.textContent = `${n + 1}/${phases.length} · ${ph.label}`;
  }

  function paint() {
    const n = Math.min(Math.floor(p * phases.length), phases.length - 1);
    if (n !== idx) { idx = n; show(n); }
    const pct = Math.round(p * 100);
    bar.style.setProperty('--p', `${pct}%`);
    bar.setAttribute('aria-valuenow', String(pct));
    // kết quả của công đoạn lộ dần cùng thanh tiến độ
    const inPhase = Math.min(1, p * phases.length - idx);
    toBox.style.setProperty('--out', String(inPhase));
  }

  function setRunning(on) {
    rig.classList.toggle('is-running', on);
    btn.classList.toggle('is-running', on);
  }

  function complete() {
    over = true;
    holding = false;
    auto = false;
    cancelAnimationFrame(raf);
    raf = 0;
    p = 1;
    paint();
    setRunning(false);
    toBox.classList.add('is-done');
    btn.remove();
    onDone();
  }

  function frame(now) {
    const dt = Math.max(0, Math.min(now - last, 100));    // mốc rAF có thể sớm hơn performance.now()
    last = now;
    if (!holding && !auto) { raf = 0; setRunning(false); return; }
    p = Math.min(1, p + dt / total);
    paint();
    if (p >= 1) { complete(); return; }
    raf = requestAnimationFrame(frame);
  }

  function run() {
    if (over) return;
    if (reducedMotion()) { complete(); return; }
    setRunning(true);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  btn.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    try { btn.setPointerCapture(e.pointerId); } catch (err) { /* máy cũ */ }
    downAt = performance.now();
    holding = true;
    run();
  });
  const release = (e) => {
    if (!holding) return;
    holding = false;
    if (e.type === 'pointerup' && performance.now() - downAt < TAP_MS) { auto = true; run(); }
  };
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', release);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());   // giữ lâu trên điện thoại không bật menu
  btn.addEventListener('click', (e) => { if (e.detail === 0) { auto = true; run(); } });   // Enter / Space

  show(idx);
  paint();
  if (finished) toBox.classList.add('is-done');

  const el = h('div', { class: 'lab-machine' },
    h('div', { class: 'lab-flow' }, fromBox, h('span', { class: 'lab-arrow', html: icon('arrow', 22) }), rig, h('span', { class: 'lab-arrow', html: icon('arrow', 22) }), toBox),
    h('div', { class: 'lab-meter' }, phaseLabel, bar),
    finished ? null : btn);
  return { el, stop: () => { cancelAnimationFrame(raf); raf = 0; } };
}

// ---------------- TN1: 5 bước ----------------
function renderRecycle(el, { store, go }) {
  const steps = data.steps;
  const choices = steps[0].choices;
  const t = timers();

  const fresh = () => ({ at: 0, done: steps.map(() => false), picked: new Set(), wrong: new Set(), sortCorrect: 0, sortTotal: 0, product: null });
  let run = fresh();
  let stopStep = null;
  let stopResult = null;

  const head = h('header', { class: 'lab-head' });
  const text = h('p', { class: 'lab-text' });
  const stageEl = h('div', { class: 'lab-stage' });
  const nav = h('nav', { class: 'lab-nav', 'aria-label': 'Các bước thí nghiệm' });
  const flow = h('div', { class: 'lab-steps' }, head, text, stageEl);
  el.append(h('div', { class: 'screen-inner lab lab-run-screen' }, flow, note(), nav));

  const halt = () => { if (stopStep) { stopStep(); stopStep = null; } };

  /** Thanh đáy: ← · stepper · Tiếp. Gọi lại mỗi khi trạng thái bước đổi. */
  function paintNav(focusNext) {
    const last = run.at === steps.length - 1;
    const back = h('button', {
      type: 'button',
      class: 'btn btn-icon',
      'aria-label': run.at ? 'Quay lại bước trước' : 'Về sảnh ECO LAB',
      onclick: (e) => (run.at ? open(run.at - 1, e.detail === 0) : go('/lab')),
    }, h('span', { 'aria-hidden': 'true' }, '←'));
    const stepper = h('ol', { class: 'lab-stepper', 'aria-label': `Bước ${run.at + 1} trên ${steps.length}` },
      steps.map((s, n) => h('li', {
        class: n === run.at ? 'is-cur' : run.done[n] ? 'is-done' : null,
        'aria-current': n === run.at ? 'step' : null,
      }, h('span', { 'aria-hidden': 'true', html: run.done[n] && n !== run.at ? icon('check', 16) : String(n + 1) }), h('span', { class: 'sr-only' }, s.title))));
    const next = h('button', {
      type: 'button',
      class: `btn ${run.done[run.at] ? 'btn-primary' : ''}`,
      disabled: !run.done[run.at],
      onclick: (e) => (last ? finish() : open(run.at + 1, e.detail === 0)),
    }, last ? 'Xong' : 'Tiếp', h('span', { 'aria-hidden': 'true' }, '→'));
    nav.replaceChildren(back, stepper, next);
    if (focusNext) next.focus({ preventScroll: true });
  }

  function markDone() {
    run.done[run.at] = true;
    paintNav(true);
  }

  function talkRow(line, opts = {}) {
    let face = ebi({ pose: opts.pose || 'wave', mood: opts.mood || 'smile', size: 56, still: true });
    const box = bubble(esc(line));
    box.setAttribute('aria-live', 'polite');
    return {
      el: h('div', { class: 'lab-talk' }, face, box),
      say(next, ok) {
        face = setEbi(face, { pose: ok === false ? 'think' : 'cheer', mood: ok === false ? 'sad' : 'happy', size: 56, still: true });
        say(box, esc(next));
        if (ok != null) react(face, ok);
      },
    };
  }

  // Ký hiệu tam giác mũi tên + chỉ con số (như nhãn dập dưới đáy hộp), không chữ.
  function resinMark(code) {
    const n = String(code || '').match(/\d+/);
    if (!n) return null;
    return h('span', { class: 'lab-resin', role: 'img', 'aria-label': `Ký hiệu nhựa số ${n[0]}`, html:
      '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">'
      + '<path class="lab-resin-line" d="M18.1 7L25.6 20.7M24.8 26.8L9.8 26.8M5.1 23L12.6 9.3"/>'
      + '<path class="lab-resin-head" d="M27.2 23.5L21.7 20.6L27.6 17.3ZM6.6 26.8L11.8 23.4L11.8 30.2ZM14.2 6.5L14.6 12.7L8.7 9.4Z"/>'
      + `<text x="16" y="24.8" text-anchor="middle">${n[0]}</text></svg>` });
  }

  // --- Bước 1: chọn món PET ---
  function stepChoose(step) {
    const talk = talkRow(step.ebi, { pose: 'think' });
    const buttons = choices.map((c) => {
      const btn = h('button', { type: 'button', class: 'lab-choice', onclick: () => tap(c, btn) },
        h('span', { class: 'lab-choice-pic' }, visual({ img: c.img, label: '' }, 'lab-choice-img'), resinMark(c.code)),
        h('span', { class: 'lab-choice-label' }, c.label));
      if (run.picked.has(c.id)) mark(c, btn);
      return btn;
    });
    function mark(c, btn) {
      btn.classList.add(c.isPet ? 'is-ok' : 'is-bad');
      btn.setAttribute('aria-pressed', 'true');
      // mã nhựa chỉ hiện sau khi chọn
      if (c.code && !btn.querySelector('.lab-choice-code')) btn.querySelector('.lab-choice-label').append(h('span', { class: 'chip lab-choice-code' }, c.code));
    }
    function tap(c, btn) {
      const again = run.picked.has(c.id);
      if (!again) {
        run.picked.add(c.id);
        if (!c.isPet) run.wrong.add(c.id);
        mark(c, btn);
      }
      if (!c.isPet) { vibrate(); shake(btn); }
      talk.say(c.why, c.isPet);
      const found = choices.filter((x) => x.isPet).every((x) => run.picked.has(x.id));
      if (found && !run.done[run.at]) markDone();
    }
    stageEl.append(talk.el, h('div', { class: 'lab-choices' }, buttons));
  }

  // --- Bước 2: đưa vào khu PET ---
  function stepSort(step) {
    const summary = () => {
      const talk = talkRow(step.ebi, { pose: 'thumbs', mood: 'happy' });
      stageEl.replaceChildren(talk.el, h('div', { class: 'lab-pile' },
        choices.filter((c) => c.isPet).map((c) => visual({ img: c.img, label: c.label }, 'lab-pile-img'))));
    };
    if (run.done[run.at]) { summary(); return; }
    const host = h('div', { class: 'lab-host' });
    stageEl.append(host);
    stopStep = mountSort(host, {
      prompt: step.text,
      bins: step.bins,
      items: choices.map((c) => ({ id: c.id, label: c.label, img: c.img, bin: c.isPet ? 'pet' : 'other' })),
    }, {
      onComplete: ({ correct, total }) => {
        run.sortCorrect = correct;
        run.sortTotal = total;
        halt();
        summary();
        markDone();
      },
    });
  }

  // --- Bước 3, 4: chạy máy ---
  function stepMachine(step) {
    const finished = run.done[run.at];
    const talk = talkRow(finished ? step.ebi : RUN_HINT, finished ? { pose: 'cheer', mood: 'happy' } : { pose: 'arms' });
    const unit = machine(step, finished, () => {
      talk.say(step.ebi, true);
      markDone();
    });
    stopStep = unit.stop;
    stageEl.append(talk.el, unit.el);
  }

  // --- Bước 5: chọn sản phẩm ---
  function stepProduct(step) {
    const talk = talkRow(step.ebi, { pose: 'wave' });
    const show = h('div', { class: 'lab-show' }, visual({ img: 'step-5-products', label: '' }, 'lab-show-img'));
    const buttons = data.products.map((p) => h('button', {
      type: 'button',
      class: 'lab-product',
      'aria-pressed': 'false',
      onclick: () => choose(p),
    }, h('span', { class: 'lab-product-ico', 'aria-hidden': 'true' }, p.emoji), h('span', null, p.label)));

    function choose(p, silent) {
      run.product = p.id;
      data.products.forEach((x, n) => {
        buttons[n].classList.toggle('is-sel', x === p);
        buttons[n].setAttribute('aria-pressed', x === p ? 'true' : 'false');
      });
      show.replaceChildren(h('span', { class: 'lab-show-pop', role: 'img', 'aria-label': p.label }, p.emoji));
      show.classList.add('has-product');
      text.hidden = true;     // nhường chỗ cho sản phẩm và lời Ebi
      talk.say(p.fact, silent ? undefined : true);
      if (!run.done[run.at]) markDone();
    }

    stageEl.append(h('div', { class: 'lab-products' }, buttons), show, talk.el);
    const again = data.products.find((p) => p.id === run.product);
    if (again) choose(again, true);
  }

  const RENDER = { choose: stepChoose, sort: stepSort, wash: stepMachine, make: stepMachine, product: stepProduct };

  function open(n, byKey) {
    halt();
    t.clear();
    run.at = n;
    const step = steps[n];
    head.replaceChildren(h('span', { class: 'chip chip-sun' }, `Bước ${n + 1}/${steps.length}`), h('h1', null, step.title));
    text.textContent = step.text;
    text.hidden = step.id === 'sort' && !run.done[n];   // ở bước kéo thả, lời này đã nằm trong bong bóng của engine
    stageEl.replaceChildren();
    stageEl.className = `lab-stage is-${step.id} anim-up`;
    flow.dataset.step = step.id;
    paintNav();
    RENDER[step.id](step);
    if (byKey) stageEl.querySelector('button')?.focus();
  }

  function finish() {
    halt();
    const total = choices.length + run.sortTotal;
    const correct = choices.length - run.wrong.size + run.sortCorrect;
    const res = store.complete('lab:recycle', { correct, total });
    nav.replaceChildren();
    nav.hidden = true;
    head.replaceChildren();
    text.hidden = true;
    stageEl.className = 'lab-stage is-result';
    stopResult = showResult(stageEl, {
      title: 'Hoàn thành thí nghiệm!',
      correct,
      total,
      gained: res.gained,
      perfect: res.perfect,
      onReplay: () => {
        stopResult?.();
        stopResult = null;
        run = fresh();
        nav.hidden = false;
        open(0);
      },
      onNext: () => go('/lab'),
      nextLabel: 'Về sảnh Lab',
    });
  }

  open(0);
  return () => {
    t.clear();
    halt();
    stopResult?.();
  };
}

// ---------------- TN3: thanh trượt trước/sau ----------------
function renderSlider(el) {
  const frames = data.slider.frames;
  const max = frames.length - 1;
  let v = 0;
  let shown = -1;
  let dragging = false;

  const pics = frames.map((f) => visual({ img: f.img, label: f.label }, 'lab-frame-img'));
  const view = h('div', { class: 'lab-view' }, pics);
  const tag = h('span', { class: 'chip chip-sun lab-view-tag' });
  view.append(tag);

  const box = bubble('');
  box.setAttribute('aria-live', 'polite');
  const talk = h('div', { class: 'lab-talk' }, ebi({ pose: 'thumbs', mood: 'smile', size: 56, still: true }), box);

  const fill = h('span', { class: 'lab-track-fill' });
  const grip = h('span', {
    class: 'lab-grip', role: 'slider', tabindex: '0',
    'aria-label': 'Trước và sau tái chế',
    'aria-valuemin': '0', 'aria-valuemax': String(max),
    html: '<span aria-hidden="true">↔</span>',
  });
  const ticks = frames.map((f, n) => h('i', { class: 'lab-tick', style: { left: `${(n / max) * 100}%` } }));
  const track = h('div', { class: 'lab-track' }, h('span', { class: 'lab-track-line' }, fill), ticks, grip);
  const ends = h('div', { class: 'lab-ends', 'aria-hidden': 'true' }, h('span', null, 'Trước'), h('span', null, 'Sau'));

  function paint() {
    const pos = `${(v / max) * 100}%`;
    fill.style.width = pos;
    grip.style.left = pos;
    pics.forEach((p, n) => { if (p) p.style.opacity = String(Math.max(0, 1 - Math.abs(v - n))); });
    const near = Math.round(v);
    grip.setAttribute('aria-valuenow', v.toFixed(2));
    if (near !== shown) {
      shown = near;
      tag.textContent = frames[near].label;
      grip.setAttribute('aria-valuetext', frames[near].label);
      say(box, esc(frames[near].caption));
      ticks.forEach((tk, n) => tk.classList.toggle('on', n <= near));
    }
  }
  const set = (next) => { v = Math.max(0, Math.min(max, next)); paint(); };

  function fromPointer(e) {
    const r = track.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * max);
  }
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    try { track.setPointerCapture(e.pointerId); } catch (err) { /* máy cũ */ }
    grip.focus({ preventScroll: true });
    fromPointer(e);
  });
  track.addEventListener('pointermove', (e) => { if (dragging) fromPointer(e); });
  const end = () => { dragging = false; };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);

  grip.addEventListener('keydown', (e) => {
    const map = {
      ArrowRight: v + 0.25, ArrowUp: v + 0.25, ArrowLeft: v - 0.25, ArrowDown: v - 0.25,
      PageUp: Math.floor(v) + 1, PageDown: Math.ceil(v) - 1, Home: 0, End: max,
    };
    if (e.key in map) { e.preventDefault(); set(map[e.key]); }
  });

  el.append(h('div', { class: 'screen-inner lab lab-slider' },
    h('header', { class: 'lab-head' }, h('span', { class: 'chip chip-aqua' }, 'Thí nghiệm'), h('h1', null, 'Trước & sau')),
    view,
    talk,
    h('div', { class: 'lab-range' }, track, ends),
    note(),
    h('nav', { class: 'lab-nav', 'aria-label': 'Điều hướng' },
      h('a', { class: 'btn', href: '#/lab' }, h('span', { 'aria-hidden': 'true' }, '←'), 'Sảnh Lab'))));
  paint();
}

export default {
  id: 'lab', title: 'ECO LAB', short: 'Lab', icon: 'lab',
  mount(el, ctx) {
    css('zones/lab.css');
    const sub = ctx.params[0];
    if (!sub) { renderHub(el, ctx); return undefined; }
    if (sub === 'recycle') return renderRecycle(el, ctx);
    if (sub === 'slider') { renderSlider(el); return undefined; }
    ctx.replace('/lab');
    return undefined;
  },
};
