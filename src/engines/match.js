// Engine ghép cặp: hai cột, chạm một bên rồi chạm bên kia.
/**
 * mountMatch(el, config, { onComplete, onProgress }) → cleanup()
 *
 * config: {
 *   prompt: string,
 *   pairs: [{ id, left: { label, img? }, right: { label, img? } }]
 * }
 * Cột phải tự xáo. Chạm được theo cả hai chiều (trái → phải hoặc phải → trái).
 * onProgress({ done, total })    sau mỗi cặp đúng
 * onComplete({ correct, total }) correct = số cặp ghép đúng mà chưa từng bị sai
 *
 * `el` phải có chiều cao xác định (engine lấp đầy el).
 */
import { h, esc, shuffle, vibrate } from '../core/ui.js';
import { coach, visual, timers, shake, emptyState } from './common.js';

const COLORS = ['pet', 'pp', 'ldpe', 'hdpe', 'ps', 'other', 'pvc'];

export function mountMatch(el, config, { onComplete, onProgress } = {}) {
  const { prompt = '', pairs = [] } = config;
  const total = pairs.length;
  if (!total) return emptyState(el);

  const t = timers();
  const ebiLine = coach(esc(prompt), { pose: 'thumbs' });
  const missed = new Set();
  let done = 0;
  let sel = null;   // { side, id, btn }

  function cell(side, pair) {
    const info = pair[side];
    const btn = h('button', {
      type: 'button',
      class: `match-cell ${side}`,
      'aria-pressed': 'false',
      onclick: () => tap(side, pair.id, btn),
    }, visual(info, 'match-pic'), h('span', { class: 'match-label' }, info.label));
    return btn;
  }

  const leftCol = pairs.map((p) => cell('left', p));
  let order = shuffle(pairs);
  if (total > 1) while (order.every((p, n) => p === pairs[n])) order = shuffle(pairs);
  const rightCol = order.map((p) => cell('right', p));

  const grid = h('div', { class: 'match-grid', style: { gridTemplateRows: `repeat(${total}, minmax(0, 1fr))` } });
  leftCol.forEach((b, n) => { b.style.gridRow = String(n + 1); b.style.gridColumn = '1'; });
  rightCol.forEach((b, n) => { b.style.gridRow = String(n + 1); b.style.gridColumn = '2'; });
  grid.append(...leftCol, ...rightCol);
  const root = h('div', { class: 'eng eng-match' }, ebiLine.el, grid);

  function select(next) {
    if (sel) { sel.btn.classList.remove('is-sel'); sel.btn.setAttribute('aria-pressed', 'false'); }
    sel = next;
    if (sel) { sel.btn.classList.add('is-sel'); sel.btn.setAttribute('aria-pressed', 'true'); }
  }

  function tap(side, id, btn) {
    if (!sel) { select({ side, id, btn }); return; }
    if (sel.btn === btn) { select(null); return; }
    if (sel.side === side) { select({ side, id, btn }); return; }

    const other = sel;
    select(null);
    if (other.id === id) {
      done++;
      lock(other.btn, btn, done);
      if (done === total) {
        ebiLine.say('Bạn ghép xong hết rồi!', { ok: true });
        t.later(() => onComplete?.({ correct: total - missed.size, total }), 800);
      } else {
        ebiLine.say('Đúng rồi, ghép tiếp nào!', { ok: true });
      }
      onProgress?.({ done, total });
      return;
    }
    // sai: tính lỗi cho cặp của ô đang ở cột trái
    missed.add(side === 'left' ? id : other.id);
    vibrate();
    [other.btn, btn].forEach((b) => { b.classList.add('is-bad'); shake(b); });
    t.later(() => [other.btn, btn].forEach((b) => b.classList.remove('is-bad')), 420);
    ebiLine.say('Chưa khớp rồi, bạn thử lại nhé!', { ok: false });
  }

  function lock(a, b, n) {
    const color = `var(--code-${COLORS[(n - 1) % COLORS.length]})`;
    [a, b].forEach((btn) => {
      btn.classList.add('is-done');
      btn.disabled = true;
      btn.style.setProperty('--pair', color);
      btn.append(h('span', { class: 'match-tag', 'aria-hidden': 'true' }, n));
    });
  }

  el.append(root);
  onProgress?.({ done: 0, total });

  return () => {
    t.clear();
    root.remove();
  };
}
