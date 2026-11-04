// Tiện ích giao diện dùng chung cho mọi khu & engine.

/** Tạo phần tử: h('div', {class:'card', onclick: fn}, 'chữ', h('b', null, 'đậm')) */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/** Chèn chuỗi HTML, trả về phần tử đầu tiên. */
export function frag(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Nạp CSS riêng của khu/engine một lần: css('zones/play.css') */
const loadedCss = new Set();
export function css(path) {
  if (loadedCss.has(path)) return;
  loadedCss.add(path);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `src/styles/${path}`;
  document.head.append(l);
}

/** Ảnh sticker trong public/img: img('code-pet', 'Chai nước', {class:'...'}) */
export function img(name, alt = '', attrs = {}) {
  return h('img', {
    src: `public/img/${name}.webp`, alt, loading: 'lazy', decoding: 'async', draggable: 'false',
    ...attrs, class: `sticker ${attrs.class || ''}`.trim(),
  });
}
export function imgUrl(name) { return `public/img/${name}.webp`; }

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function vibrate(pattern = 30) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* bỏ qua */ }
}

/** Thông báo nhỏ ở trên cùng. type: 'info' | 'points' | 'badge' */
export function toast(text, { icon = '🌿', type = 'info', ms = 2600 } = {}) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const t = h('div', { class: `toast ${type}`, role: 'status' }, h('span', { class: 'toast-ico', 'aria-hidden': 'true' }, icon), h('span', null, text));
  box.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, ms);
}

/** Hộp thoại. content: Node | string. Trả về {close, el}. */
export function modal(content, { label = 'Hộp thoại', onClose } = {}) {
  const prevFocus = document.activeElement;
  const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': label });
  const closeBtn = h('button', { class: 'btn btn-sm btn-icon modal-close', 'aria-label': 'Đóng', onclick: () => close() }, '✕');
  box.append(closeBtn);
  if (typeof content === 'string') box.insertAdjacentHTML('beforeend', content); else box.append(content);
  const back = h('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target === back) close(); } }, box);
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  document.body.append(back);
  closeBtn.focus();
  function close() {
    document.removeEventListener('keydown', onKey);
    back.remove();
    if (prevFocus && prevFocus.focus) prevFocus.focus();
    onClose && onClose();
  }
  return { close, el: box };
}

/** Pháo giấy ăn mừng. */
export function confetti(n = 70) {
  if (reducedMotion()) return;
  const colors = ['#4FAE5A', '#F5BE3B', '#4DB6C4', '#F28FA0', '#D2664A', '#A8DB8F'];
  const layer = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < n; i++) {
    const c = h('i');
    c.style.left = `${Math.random() * 100}%`;
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--x', `${(Math.random() - .5) * 240}px`);
    c.style.setProperty('--r', `${(Math.random() - .5) * 1080}deg`);
    c.style.setProperty('--d', `${1.4 + Math.random() * 1.4}s`);
    c.style.animationDelay = `${Math.random() * .35}s`;
    if (i % 3 === 0) c.style.borderRadius = '50%';
    layer.append(c);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 3200);
}

/** Bong bóng lời thoại. dir: 'left' (đuôi trái) | 'right' | 'top' */
export function bubble(text, dir = 'left') {
  const cls = dir === 'right' ? 'from-right' : dir === 'top' ? 'from-top' : '';
  return h('div', { class: `bubble ${cls}`, html: text });
}

/** Đổi nội dung bong bóng có hiệu ứng. */
export function say(bubbleEl, text) {
  if (!bubbleEl) return;
  bubbleEl.innerHTML = text;
  bubbleEl.classList.remove('anim-pop');
  void bubbleEl.offsetWidth;
  bubbleEl.classList.add('anim-pop');
}

/** Nút quay lại trong màn con. */
export function backBtn(href, label = 'Quay lại') {
  return h('a', { class: 'btn btn-back', href: `#${href}` }, h('span', { 'aria-hidden': 'true' }, '←'), label);
}

/** Bộ biểu tượng nét (24×24). */
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  discover: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/><path d="M8 9.5a3 3 0 0 1 3-2.5"/>',
  journey: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/><circle cx="18" cy="19" r="2"/><path d="M5 19h4c3 0 3-4 6-4"/>',
  lab: '<path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7.5 15h9"/>',
  play: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.8" cy="13.8" r="1" fill="currentColor"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="10" r="3"/><path d="M8.5 17h7"/>',
  connect: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-3.5 3-5.5 5.5-5.5s5 2 5.5 5.5"/><path d="M14 15.5c1-.7 2-1 3-1 2 0 4 1.5 4.5 4.5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/>',
};
export function icon(name, size = 24) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}
