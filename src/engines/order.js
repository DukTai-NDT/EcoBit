// Engine sắp thứ tự: chạm thẻ trong kho để điền vào ô trống kế tiếp.
/**
 * mountOrder(el, config, { onComplete, onProgress }) → cleanup()
 *
 * config: {
 *   prompt: string,
 *   items: [{ id, label, img? }]   // thứ tự trong mảng = thứ tự ĐÚNG; engine tự xáo
 * }
 * Chạm thẻ trong ô = trả về kho. Đủ ô → nút "Kiểm tra" tô đúng/sai từng vị trí, sửa tới khi đúng.
 * onProgress({ done, total })    số ô đang có thẻ
 * onComplete({ correct, total }) correct = số vị trí đúng ở lần kiểm tra ĐẦU
 *
 * `el` phải có chiều cao xác định (engine lấp đầy el).
 */
import { h, esc, shuffle, vibrate } from '../core/ui.js';
import { coach, visual, timers, emptyState } from './common.js';

export function mountOrder(el, config, { onComplete, onProgress } = {}) {
  const { prompt = '', items = [] } = config;
  const total = items.length;
  if (!total) return emptyState(el);

  const t = timers();
  const ebiLine = coach(esc(prompt), { pose: 'think', size: 44 });
  let stock = shuffle(items);
  if (total > 1) while (stock.every((it, n) => it === items[n])) stock = shuffle(items);

  const slots = Array(total).fill(null);   // mục đang ở từng ô
  const marks = Array(total).fill(null);   // 'ok' | 'bad' | null
  const inSlot = new Set();
  let firstCorrect = null;
  let finished = false;

  const slotBox = h('div', { class: 'order-slots', style: { gridTemplateRows: `repeat(${total}, minmax(0, 1fr))` } });
  const stockBox = h('div', { class: 'order-stock' });
  const root = h('div', { class: 'eng eng-order' }, ebiLine.el, slotBox, stockBox);

  const isFull = () => slots.every(Boolean);

  function put(item, byKey) {
    slots[slots.indexOf(null)] = item;
    inSlot.add(item.id);
    render(byKey ? 'stock' : null);
  }
  function takeBack(n, byKey) {
    inSlot.delete(slots[n].id);
    slots[n] = null;
    marks[n] = null;
    render(byKey ? 'stock' : null);
  }

  function check(byKey) {
    let right = 0;
    slots.forEach((item, n) => {
      const ok = item.id === items[n].id;
      marks[n] = ok ? 'ok' : 'bad';
      if (ok) right++;
    });
    if (firstCorrect == null) firstCorrect = right;

    if (right === total) {
      finished = true;
      render();
      ebiLine.say('Chuẩn cả hành trình luôn!', { ok: true });
      t.later(() => onComplete?.({ correct: firstCorrect, total }), 900);
      return;
    }
    vibrate();
    render(byKey ? 'slot' : null);
    ebiLine.say(`Đúng <b>${right}/${total}</b> vị trí. Chạm thẻ đỏ để trả về rồi sửa nhé!`, { ok: false });
  }

  function render(focus) {
    const placed = slots.filter(Boolean).length;
    const firstEmpty = slots.indexOf(null);

    slotBox.replaceChildren(...slots.map((item, n) => {
      const num = h('span', { class: 'order-num', 'aria-hidden': 'true' }, n + 1);
      if (!item) return h('div', { class: `order-slot ${n === firstEmpty ? 'is-next' : ''}` }, num, h('span', { class: 'sr-only' }, `Ô ${n + 1} còn trống`));
      return h('button', {
        type: 'button',
        class: `order-slot is-filled ${marks[n] ? `is-${marks[n]}` : ''}`,
        disabled: finished,
        'aria-label': `Ô ${n + 1}: ${item.label}. Chạm để trả về.`,
        onclick: (e) => takeBack(n, e.detail === 0),
      }, num, visual(item, 'order-pic'), h('span', { class: 'order-label' }, item.label));
    }));

    if (isFull()) {
      const locked = finished || marks.every(Boolean);   // đã kiểm tra, chưa đổi gì
      const btn = h('button', {
        type: 'button',
        class: `btn btn-sun order-check ${locked ? '' : 'anim-pop'}`,
        disabled: locked,
        onclick: (e) => check(e.detail === 0),
      }, 'Kiểm tra');
      stockBox.replaceChildren(btn);
      stockBox.classList.add('is-empty');
      if (focus) (focus === 'slot' ? slotBox.querySelector('.is-bad') : btn)?.focus();
    } else {
      stockBox.classList.remove('is-empty');
      stockBox.replaceChildren(...stock.map((item) => {
        if (inSlot.has(item.id)) return h('div', { class: 'order-gap', 'aria-hidden': 'true' });
        return h('button', {
          type: 'button',
          class: 'order-card',
          onclick: (e) => put(item, e.detail === 0),
        }, visual(item, 'order-pic'), h('span', { class: 'order-label' }, item.label));
      }));
      if (focus) stockBox.querySelector('.order-card')?.focus();
    }
    onProgress?.({ done: placed, total });
  }

  el.append(root);
  render();
  // giữ nguyên chiều cao kho khi nó nhường chỗ cho nút "Kiểm tra", để các ô không nhảy
  stockBox.style.minHeight = `${stockBox.offsetHeight}px`;

  return () => {
    t.clear();
    root.remove();
  };
}
