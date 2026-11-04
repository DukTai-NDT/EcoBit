// Màn kết quả dùng chung sau mỗi trò/nhiệm vụ.
/**
 * showResult(el, options) → cleanup()
 * Xoá nội dung cũ của `el` rồi hiển thị kết quả.
 *
 * options: {
 *   title?: string,          // mặc định "Hoàn thành!"
 *   correct: number, total: number,
 *   gained?: number,         // điểm vừa nhận; 0 → "Bạn đã nhận điểm trò này rồi"
 *   perfect?: boolean,       // đúng hết → pháo giấy (mặc định suy ra từ correct/total)
 *   onReplay?: () => void,   // có → hiện nút "Chơi lại"
 *   onNext?: () => void,     // có → hiện nút chính
 *   nextLabel?: string       // mặc định "Tiếp tục"
 * }
 * Sao: đúng hết 3 · từ 60% 2 · còn lại 1.
 */
import { h, esc, bubble, icon, confetti } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export function starsFor(correct, total) {
  const ratio = total > 0 ? correct / total : 0;
  return ratio >= 1 ? 3 : ratio >= 0.6 ? 2 : 1;
}

export function showResult(el, { title = 'Hoàn thành!', correct = 0, total = 0, gained = 0, perfect, onReplay, onNext, nextLabel = 'Tiếp tục' } = {}) {
  const allRight = perfect ?? (total > 0 && correct >= total);
  const stars = starsFor(correct, total);
  const cheer = stars >= 2;

  const line = allRight ? 'Đúng hết luôn! Bạn siêu quá!'
    : cheer ? 'Làm tốt lắm! Thêm chút nữa là đúng hết rồi.'
      : 'Không sao đâu, chơi lại là giỏi hơn ngay!';

  const starRow = h('div', { class: 'res-stars', role: 'img', 'aria-label': `Đạt ${stars} trên 3 sao` });
  for (let n = 1; n <= 3; n++) {
    starRow.append(h('span', { class: `res-star ${n <= stars ? 'on' : ''}`, style: { animationDelay: `${n * 0.12}s` }, html: icon('star', 40) }));
  }

  const buttons = h('div', { class: 'res-actions' },
    onReplay ? h('button', { type: 'button', class: 'btn', onclick: onReplay, html: `${icon('refresh', 20)}Chơi lại` }) : null,
    onNext ? h('button', { type: 'button', class: 'btn btn-primary', onclick: onNext }, nextLabel) : null);

  const root = h('div', { class: 'eng eng-result' },
    h('div', { class: 'res-talk' },
      ebi({ pose: cheer ? 'cheer' : 'thumbs', mood: cheer ? 'happy' : 'smile', size: 92 }),
      bubble(esc(line))),
    h('h2', { class: 'res-title' }, title),
    starRow,
    h('p', { class: 'res-score' }, `Đúng ${correct}/${total}`),
    h('p', { class: `res-points ${gained ? 'got' : ''}` }, gained ? `+${gained} ECO POINT` : 'Bạn đã nhận điểm trò này rồi'),
    buttons);

  el.replaceChildren(root);
  if (allRight) confetti();
  (buttons.querySelector('.btn-primary') || buttons.querySelector('.btn'))?.focus({ preventScroll: true });
  return () => root.remove();
}
