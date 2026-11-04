// Ký hiệu mã nhựa (Resin Identification Code) vẽ bằng SVG – dùng chung cho mọi khu.
//
//   resinBadge(1, 'PET')                                  → chuỗi SVG, màu theo currentColor
//   resinBadge(5, 'PP', { size: 48, color: 'var(--code-pp)', outline: true })
//   resinBadge(7, 'OTHER', { abbr: false })              → chỉ tam giác + số
//   el.innerHTML = resinBadge(...)  hoặc  resinEl(...) → phần tử <svg>
//
// Tuỳ chọn:
//   size     bề rộng px (mặc định 64); cao tự tính theo tỉ lệ
//   color    màu mũi tên & chữ – chuỗi CSS bất kỳ, kể cả var(--code-pet) (mặc định currentColor)
//   abbr     true/false – hiện chữ viết tắt dưới tam giác (mặc định true)
//   outline  true (viền --ink) | chuỗi màu | false – viền kiểu sticker quanh mũi tên
//   numColor màu con số (mặc định = color)
//   title    nhãn cho trình đọc màn hình (mặc định "Mã nhựa số N – ABBR"); title: '' → ẩn khỏi trình đọc
//   cls      class thêm vào <svg>

const V = [[50, 6], [93, 80], [7, 80]]; // đỉnh trên, phải dưới, trái dưới (chiều kim đồng hồ)
const R = 9;          // bán kính bo góc
const HEAD_LEN = 13;  // chiều dài đầu mũi tên
const HEAD_HALF = 9;  // nửa bề rộng đầu mũi tên
const T_START = 0.6;  // điểm bắt đầu mũi tên trên cạnh trước (tính từ đỉnh trước)
const T_TIP = 0.48;   // vị trí mũi nhọn trên cạnh sau (tính từ góc)

const r2 = (n) => Math.round(n * 10) / 10;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l, l]; };
const pt = (p) => `${r2(p[0])} ${r2(p[1])}`;

// Tính sẵn 3 mũi tên: mỗi mũi tên vòng qua một góc của tam giác.
const ARROWS = V.map((cur, i) => {
  const prev = V[(i + 2) % 3];
  const next = V[(i + 1) % 3];
  const [ux1, uy1] = unit(prev, cur);
  const [ux2, uy2] = unit(cur, next);
  const start = lerp(prev, cur, T_START);
  const before = [cur[0] - ux1 * R, cur[1] - uy1 * R];
  const after = [cur[0] + ux2 * R, cur[1] + uy2 * R];
  const tip = lerp(cur, next, T_TIP);
  const base = [tip[0] - ux2 * HEAD_LEN, tip[1] - uy2 * HEAD_LEN];
  const lineEnd = [base[0] + ux2 * 1.2, base[1] + uy2 * 1.2];
  const nx = -uy2, ny = ux2;
  const shaft = `M${pt(start)} L${pt(before)} Q${pt(cur)} ${pt(after)} L${pt(lineEnd)}`;
  const head = `M${pt(tip)} L${pt([base[0] + nx * HEAD_HALF, base[1] + ny * HEAD_HALF])} L${pt([base[0] - nx * HEAD_HALF, base[1] - ny * HEAD_HALF])}Z`;
  return { shaft, head };
});

const escAttr = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Trả về chuỗi SVG ký hiệu mã nhựa. */
export function resinBadge(num, abbr = '', opts = {}) {
  const {
    size = 64, color = 'currentColor', abbr: showAbbr = true, outline = false,
    numColor = null, title = null, cls = '',
  } = opts;
  const withAbbr = showAbbr && abbr;
  const vbH = withAbbr ? 114 : 90;
  const height = Math.round(size * vbH / 100);
  const label = title == null ? `Mã nhựa số ${num}${abbr ? ` – ${abbr}` : ''}` : title;
  const a11y = label ? `role="img" aria-label="${escAttr(label)}"` : 'aria-hidden="true" focusable="false"';
  const ink = outline === true ? 'var(--ink, #24402E)' : outline;
  const sw = 7.5;
  const num$ = String(num);
  const numSize = num$.length > 1 ? 30 : 37;
  const numFill = numColor ? `style="fill:${escAttr(numColor)}"` : 'fill="currentColor"';
  const fontFamily = `font-family="'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"`;

  let arrows = '';
  if (ink) {
    arrows += `<g style="stroke:${escAttr(ink)};fill:${escAttr(ink)}" stroke-width="${sw + 5}" stroke-linejoin="round" stroke-linecap="round">`
      + ARROWS.map((a) => `<path d="${a.shaft}" fill="none"/><path d="${a.head}" stroke-width="5"/>`).join('')
      + '</g>';
  }
  arrows += `<g stroke="currentColor" fill="currentColor" stroke-width="${sw}" stroke-linejoin="round">`
    + ARROWS.map((a) => `<path d="${a.shaft}" fill="none"/><path d="${a.head}" stroke-width="1.5"/>`).join('')
    + '</g>';

  const numText = `<text x="50" y="${r2(55 + numSize * 0.36)}" text-anchor="middle" ${fontFamily} font-weight="800" font-size="${numSize}" ${numFill}>${escAttr(num$)}</text>`;
  const abbrSize = String(abbr).length > 4 ? 19 : 22;
  const abbrText = withAbbr
    ? `<text x="50" y="108" text-anchor="middle" ${fontFamily} font-weight="800" font-size="${abbrSize}" letter-spacing=".5" ${numFill}>${escAttr(abbr)}</text>`
    : '';

  return `<svg class="resin ${escAttr(cls)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${vbH}" width="${size}" height="${height}" style="color:${escAttr(color)};overflow:visible" ${a11y}>${arrows}${numText}${abbrText}</svg>`;
}

/** Như resinBadge nhưng trả về phần tử <svg>. */
export function resinEl(num, abbr, opts) {
  const t = document.createElement('template');
  t.innerHTML = resinBadge(num, abbr, opts);
  return t.content.firstElementChild;
}

export default resinBadge;
