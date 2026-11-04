// Kéo thả dùng chung: Pointer Events + chạm-để-chọn + bàn phím.
/**
 * createDnd(options) → { add(itemEl) → off(), pick(itemEl|null), destroy() }
 *
 * options:
 *   targets      HTMLElement[]  các ô đích (nên là <button> để có sẵn Enter/Space)
 *   onDrop(item, target, via)   via: 'drag' | 'tap' | 'key'. Trả false = từ chối → bóng bay về chỗ cũ.
 *   onPick?(item|null, via)     khi chọn/bỏ chọn bằng chạm hoặc phím
 *   defaultItem?()              vật dùng khi chạm ô mà chưa chọn gì (trò chỉ có 1 vật một lúc)
 *
 * Vật (nên là <button>) có 3 cách dùng:
 *   - Kéo: bóng vật theo ngón tay, ô dưới ngón tay có class .is-over (dò bằng elementFromPoint).
 *   - Chạm vật (.is-picked, các ô thêm .is-armed) rồi chạm ô.
 *   - Bàn phím: Enter/Space trên vật → tiêu điểm nhảy tới ô đầu; Enter/Space trên ô; Esc để huỷ.
 *
 * Kiểu dáng bóng: .eng-ghost (engines.css). Phần tử bóng là bản sao của vật, gắn vào <body>.
 */
const THRESHOLD = 6;   // px, dưới mức này coi là chạm chứ không phải kéo

export function createDnd({ targets, onDrop, onPick, defaultItem }) {
  let picked = null;
  let drag = null;
  let justDragged = false;
  const items = new Map();
  const ghosts = new Set();

  function setPicked(el, via) {
    if (picked === el) return;
    if (picked) { picked.classList.remove('is-picked'); picked.setAttribute('aria-pressed', 'false'); }
    picked = el;
    if (el) { el.classList.add('is-picked'); el.setAttribute('aria-pressed', 'true'); }
    targets.forEach((t) => t.classList.toggle('is-armed', !!el));
    if (via !== 'silent') onPick?.(el, via);
    if (el && via === 'key') targets[0]?.focus();
  }

  function deliver(item, target, via) {
    setPicked(null, 'silent');
    const res = onDrop(item, target, via);
    if (res === false && via === 'key' && item.isConnected) item.focus();
    return res !== false;
  }

  // ---------- chạm / phím ----------
  function onItemClick(e) {
    if (justDragged) return;
    const via = e.detail === 0 ? 'key' : 'tap';
    const el = e.currentTarget;
    setPicked(picked === el ? null : el, via);
  }
  function onTargetClick(e) {
    const item = picked || defaultItem?.();
    if (item) deliver(item, e.currentTarget, e.detail === 0 ? 'key' : 'tap');
  }
  function onKey(e) {
    if (e.key === 'Escape' && picked) {
      const el = picked;
      setPicked(null, 'key');
      el.focus();
    }
  }

  // ---------- kéo ----------
  function moveGhost(g, x, y, extra = 'scale(.6) rotate(-3deg)') {
    g.style.transform = `translate3d(${x}px, ${y}px, 0) ${extra}`;
  }
  function beginGhost(d) {
    const g = d.el.cloneNode(true);
    g.classList.remove('is-picked');
    g.classList.add('eng-ghost');
    g.setAttribute('aria-hidden', 'true');
    g.tabIndex = -1;
    g.style.width = `${d.rect.width}px`;
    g.style.height = `${d.rect.height}px`;
    g.style.transformOrigin = `${d.ox}px ${d.oy}px`;
    document.body.append(g);
    ghosts.add(g);
    d.ghost = g;
    d.el.classList.add('is-dragging');
    setPicked(null, 'silent');
  }
  function endGhost(g, x, y, extra) {
    g.classList.add('is-landing');
    moveGhost(g, x, y, extra);
    setTimeout(() => { g.remove(); ghosts.delete(g); }, 200);
  }
  function hit(x, y) {
    const node = document.elementFromPoint(x, y);
    return node ? targets.find((t) => t === node || t.contains(node)) || null : null;
  }
  function setOver(d, t) {
    if (d.over === t) return;
    d.over?.classList.remove('is-over');
    t?.classList.add('is-over');
    d.over = t;
  }

  function onDown(e) {
    if (drag || e.button !== 0) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    drag = { el, id: e.pointerId, sx: e.clientX, sy: e.clientY, rect, ox: e.clientX - rect.left, oy: e.clientY - rect.top, ghost: null, over: null };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* trình duyệt cũ: vẫn nhận sự kiện trên phần tử */ }
  }
  function onMove(e) {
    const d = drag;
    if (!d || e.pointerId !== d.id) return;
    if (!d.ghost) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < THRESHOLD) return;
      beginGhost(d);
    }
    moveGhost(d.ghost, e.clientX - d.ox, e.clientY - d.oy);
    setOver(d, hit(e.clientX, e.clientY));
  }
  function finish(e, cancelled) {
    const d = drag;
    if (!d || e.pointerId !== d.id) return;
    drag = null;
    if (!d.ghost) return;           // chỉ là một cú chạm → để sự kiện click xử lý
    justDragged = true;
    setTimeout(() => { justDragged = false; }, 60);
    const target = cancelled ? null : hit(e.clientX, e.clientY);
    setOver(d, null);
    d.el.classList.remove('is-dragging');
    const accepted = target ? deliver(d.el, target, 'drag') : false;
    if (accepted) {
      const r = target.getBoundingClientRect();
      endGhost(d.ghost, r.left + r.width / 2 - d.ox, r.top + r.height / 2 - d.oy, 'scale(.2)');
    } else {
      endGhost(d.ghost, d.rect.left, d.rect.top, 'scale(1)');
    }
  }
  const onUp = (e) => finish(e, false);
  const onCancel = (e) => finish(e, true);
  const noMenu = (e) => e.preventDefault();   // giữ lâu trên điện thoại không bật menu ảnh

  function add(el) {
    el.style.touchAction = 'none';
    el.setAttribute('aria-pressed', 'false');
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
    el.addEventListener('click', onItemClick);
    el.addEventListener('contextmenu', noMenu);
    const off = () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
      el.removeEventListener('click', onItemClick);
      el.removeEventListener('contextmenu', noMenu);
      if (picked === el) setPicked(null, 'silent');
      items.delete(el);
    };
    items.set(el, off);
    return off;
  }

  targets.forEach((t) => t.addEventListener('click', onTargetClick));
  document.addEventListener('keydown', onKey);

  return {
    add,
    pick: (el) => setPicked(el, 'silent'),
    destroy() {
      document.removeEventListener('keydown', onKey);
      targets.forEach((t) => { t.removeEventListener('click', onTargetClick); t.classList.remove('is-armed', 'is-over'); });
      [...items.values()].forEach((off) => off());
      ghosts.forEach((g) => g.remove());
      ghosts.clear();
      drag = null;
    },
  };
}
