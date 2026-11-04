// Phần dùng chung nội bộ của các engine: Ebi hướng dẫn, ảnh có dự phòng, hẹn giờ.
import { h, img, bubble, say } from '../core/ui.js';
import { ebi, setEbi, react } from '../core/ebi.js';

/**
 * Ebi nhỏ kèm bong bóng lời thoại.
 * @param {string} html  lời thoại (HTML – chuỗi từ dữ liệu phải qua esc())
 * @returns {{el:HTMLElement, say:(html:string, opts?:{ok?:boolean, pose?:string, mood?:string})=>void}}
 */
export function coach(html, { pose = 'wave', mood = 'smile', size = 52 } = {}) {
  let face = ebi({ pose, mood, size, still: true });
  const box = bubble(html);
  box.setAttribute('aria-live', 'polite');
  const el = h('div', { class: 'eng-coach' }, face, box);
  return {
    el,
    say(text, { ok, pose: p, mood: m } = {}) {
      const nextPose = p || (ok === true ? 'cheer' : ok === false ? 'think' : pose);
      const nextMood = m || (ok === true ? 'happy' : ok === false ? 'sad' : mood);
      face = setEbi(face, { pose: nextPose, mood: nextMood, size, still: true });
      say(box, text);
      if (ok != null) react(face, ok);
    },
  };
}

/**
 * Phần hình của một mục: ảnh sticker; ảnh hỏng/thiếu → emoji; không có emoji → bỏ hình (nhãn chữ vẫn còn).
 * @param {{img?:string, emoji?:string, label?:string}} item
 * @returns {HTMLElement|null}
 */
export function visual(item, cls = '') {
  const fallback = () => (item.emoji
    ? h('span', { class: `eng-emoji ${cls}`.trim(), 'aria-hidden': 'true' }, item.emoji)
    : null);
  if (!item.img) return fallback();
  const pic = img(item.img, item.label || '', {
    class: `eng-img ${cls}`.trim(),
    onerror: () => { const f = fallback(); if (f) pic.replaceWith(f); else pic.remove(); },
  });
  return pic;
}

/** Hẹn giờ gom một chỗ để cleanup huỷ hết một lần. */
export function timers() {
  const ids = new Set();
  return {
    later(fn, ms) {
      const id = setTimeout(() => { ids.delete(id); fn(); }, ms);
      ids.add(id);
      return id;
    },
    clear() { ids.forEach(clearTimeout); ids.clear(); },
  };
}

/** Chạy lại hoạt ảnh rung trên phần tử. */
export function shake(el) {
  el.classList.remove('anim-shake');
  void el.offsetWidth;
  el.classList.add('anim-shake');
}

/** Màn dự phòng khi dữ liệu rỗng. Trả về cleanup. */
export function emptyState(el) {
  const box = h('div', { class: 'eng eng-empty' }, h('p', { class: 'lead' }, 'Nội dung đang được cập nhật, bạn quay lại sau nhé!'));
  el.append(box);
  return () => box.remove();
}
