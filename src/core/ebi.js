// Ebi – mascot chai nhựa nắp xanh, lá non, khăn tái chế.
// Bản SVG thay thế cho PNG gốc của khách. Khi có PNG tách sẵn:
//   đặt file vào public/img/ebi/<pose>.webp và bật site.ebiPng = true (src/data/site.js).
import site from '../data/site.js';

const INK = '#24402E';
const BODY = '#CDEEF1';
const CAP = '#3E9B4F';
const LEAF = '#7CC85A';
const SCARF = '#2E7D4F';
const CHEEK = '#F28FA0';

// 6 tư thế gốc của khách + 3 tư thế bổ sung cho phản hồi trong game
export const POSES = [
  { id: 'thumbs', label: 'Giơ ngón cái' },
  { id: 'earth', label: 'Ôm trái đất' },
  { id: 'megaphone', label: 'Cầm loa' },
  { id: 'plant', label: 'Ôm chậu cây' },
  { id: 'arms', label: 'Khoanh tay' },
  { id: 'recycle', label: 'Giơ biểu tượng tái chế' },
  { id: 'wave', label: 'Vẫy tay' },
  { id: 'cheer', label: 'Reo vui' },
  { id: 'think', label: 'Suy nghĩ' },
];
export const MOODS = ['happy', 'smile', 'wow', 'sad', 'wink'];

const SH_L = [46, 118];
const SH_R = [154, 118];
const DOWN_L = [30, 166];
const DOWN_R = [170, 166];

function limb(from, to, ctrl) {
  const d = ctrl
    ? `M${from[0]} ${from[1]} Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`
    : `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`;
  return `<path d="${d}" stroke="${INK}" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="${d}" stroke="${BODY}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
}
function hand(p, r = 8.5) {
  return `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${BODY}" stroke="${INK}" stroke-width="4"/>`;
}
function arm(from, to, ctrl, cls = '') {
  const origin = `transform-origin:${from[0]}px ${from[1]}px`;
  return `<g class="${cls}" style="${origin}">${limb(from, to, ctrl)}${hand(to)}</g>`;
}

const PROPS = {
  earth: `<g>
    <circle cx="100" cy="194" r="28" fill="#7FCBE6" stroke="${INK}" stroke-width="4.5"/>
    <path d="M80 182c8-6 16 0 14 8s-12 6-14 14c-4-6-6-16 0-22z" fill="${LEAF}" stroke="${INK}" stroke-width="3"/>
    <path d="M106 174c10 0 18 8 18 16-6 0-8 6-16 4s-8-14-2-20z" fill="${LEAF}" stroke="${INK}" stroke-width="3"/>
    <path d="M102 208c6-2 12 2 10 8-6 2-12 0-10-8z" fill="${LEAF}" stroke="${INK}" stroke-width="3"/>
  </g>`,
  plant: `<g>
    <path d="M100 186c0-16 0-22 0-30" stroke="${INK}" stroke-width="4" fill="none"/>
    <path d="M100 166c-14-14-30-6-28 2 10 8 22 6 28-2z" fill="${LEAF}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M100 160c12-16 30-10 30-2-10 10-24 8-30 2z" fill="${LEAF}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M74 184h52l-7 34a6 6 0 0 1-6 5H87a6 6 0 0 1-6-5z" fill="#D2664A" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    <rect x="70" y="180" width="60" height="11" rx="4" fill="#E08A6E" stroke="${INK}" stroke-width="4"/>
  </g>`,
  megaphone: `<g transform="rotate(-28 176 100)">
    <path d="M172 92l30-16v40l-30-16z" fill="#F5BE3B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="162" y="90" width="13" height="16" rx="3" fill="${CAP}" stroke="${INK}" stroke-width="4"/>
    <path d="M210 84q6 12 0 24M218 78q10 18 0 36" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>`,
  recycle: `<g>
    <path d="M180 76v-6" stroke="${INK}" stroke-width="4"/>
    <circle cx="182" cy="50" r="20" fill="#4FAE5A" stroke="${INK}" stroke-width="4.5"/>
    <circle cx="182" cy="50" r="10.5" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 5" stroke-linecap="round"/>
    <path d="M190 39l3 6-7 1z" fill="#fff"/>
  </g>`,
};

function arms(pose) {
  const idleL = arm(SH_L, DOWN_L, [30, 136]);
  const idleR = arm(SH_R, DOWN_R, [170, 136]);
  switch (pose) {
    case 'wave':
      return idleL + arm(SH_R, [182, 80], [176, 112], 'ebi-arm-wave');
    case 'cheer':
      return arm(SH_L, [18, 82], [24, 112]) + arm(SH_R, [182, 82], [176, 112]);
    case 'thumbs':
      return idleL + `<g>${limb(SH_R, [180, 108], [172, 126])}
        <rect x="174" y="88" width="10" height="20" rx="5" fill="${BODY}" stroke="${INK}" stroke-width="4"/>
        ${hand([180, 110], 10)}</g>`;
    case 'earth':
      return PROPS.earth + arm(SH_L, [76, 196], [40, 180]) + arm(SH_R, [124, 196], [160, 180]);
    case 'plant':
      return PROPS.plant + arm(SH_L, [76, 200], [40, 186]) + arm(SH_R, [124, 200], [160, 186]);
    case 'megaphone':
      return idleL + arm(SH_R, [170, 100], [168, 120]) + PROPS.megaphone;
    case 'recycle':
      return idleL + arm(SH_R, [180, 80], [176, 112]) + PROPS.recycle;
    case 'arms':
      return arm(SH_L, [124, 178], [60, 176]) + arm(SH_R, [76, 178], [140, 176]);
    case 'think':
      return idleL + arm(SH_R, [124, 166], [160, 176]);
    default:
      return idleL + idleR;
  }
}

function face(mood, pose) {
  const eyesOpen = `<g class="ebi-eyes">
      <ellipse cx="82" cy="128" rx="7.5" ry="9.5" fill="${INK}"/>
      ${mood === 'wink'
        ? `<path d="M110 130q8-9 16 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
        : `<ellipse cx="118" cy="128" rx="7.5" ry="9.5" fill="${INK}"/>`}
      <circle cx="84.5" cy="124" r="2.6" fill="#fff"/>
      ${mood === 'wink' ? '' : '<circle cx="120.5" cy="124" r="2.6" fill="#fff"/>'}
    </g>`;
  const brows = mood === 'sad'
    ? `<path d="M74 113l12 4M126 113l-12 4" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
    : pose === 'think'
      ? `<path d="M74 114q8-5 15-1M111 111q8-4 15 1" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      : '';
  let mouth;
  switch (mood) {
    case 'wow':
      mouth = `<ellipse cx="100" cy="151" rx="6" ry="7.5" fill="${INK}"/>`; break;
    case 'sad':
      mouth = `<path d="M90 154q10-8 20 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`; break;
    case 'smile':
      mouth = `<path d="M89 145q11 11 22 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`; break;
    default:
      mouth = `<path d="M88 142q12 20 24 0z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="100" cy="151" rx="5" ry="3" fill="${CHEEK}"/>`;
  }
  return `${brows}${eyesOpen}
    <ellipse cx="68" cy="146" rx="9" ry="5.5" fill="${CHEEK}" opacity=".85"/>
    <ellipse cx="132" cy="146" rx="9" ry="5.5" fill="${CHEEK}" opacity=".85"/>
    ${mouth}`;
}

/** Trả về chuỗi SVG của Ebi. */
export function ebiSvg({ pose = 'wave', mood = 'happy', size = 200, title = 'Ebi', still = false, cls = '' } = {}) {
  const h = Math.round(size * 1.3);
  return `<svg class="ebi ${still ? 'is-still' : ''} ${cls}" viewBox="-10 0 230 266" width="${size}" height="${h}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
  <g class="ebi-bob">
    <ellipse cx="100" cy="256" rx="58" ry="7" fill="${INK}" opacity=".12"/>
    <g>
      <rect x="70" y="226" width="16" height="20" rx="6" fill="${BODY}" stroke="${INK}" stroke-width="4.5"/>
      <rect x="114" y="226" width="16" height="20" rx="6" fill="${BODY}" stroke="${INK}" stroke-width="4.5"/>
      <path d="M62 250q0-9 16-9t16 9z" fill="${CAP}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M106 250q0-9 16-9t16 9z" fill="${CAP}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    </g>
    <g class="ebi-leaf">
      <path d="M100 32V14" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M100 22c-10-14-26-10-26-2 6 8 18 9 26 2z" fill="${LEAF}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M100 18c10-16 30-14 30-4-6 10-22 11-30 4z" fill="${LEAF}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    </g>
    <path d="M80 62c0 18-36 20-36 46v104q0 20 18 20h76q18 0 18-20V108c0-26-36-28-36-46z" fill="${BODY}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="56" y="104" width="9" height="74" rx="4.5" fill="#fff" opacity=".75"/>
    <path d="M52 204q48 10 96 0" stroke="${INK}" stroke-width="2.5" fill="none" opacity=".3"/>
    <path d="M52 216q48 10 96 0" stroke="${INK}" stroke-width="2.5" fill="none" opacity=".3"/>
    <rect x="78" y="30" width="44" height="26" rx="6" fill="${CAP}" stroke="${INK}" stroke-width="5"/>
    <path d="M89 35v16M100 35v16M111 35v16" stroke="${INK}" stroke-width="2.5" opacity=".45" stroke-linecap="round"/>
    <path d="M68 70q32 18 64 0l3 12q-35 20-70 0z" fill="${SCARF}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M120 86l16 26-12 4-10-24z" fill="${SCARF}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="100" cy="86" r="8.5" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <circle cx="100" cy="86" r="4.2" fill="none" stroke="${SCARF}" stroke-width="2.6" stroke-dasharray="6 2.8"/>
    ${face(mood, pose)}
    ${arms(pose)}
  </g>
</svg>`;
}

/** Trả về phần tử DOM của Ebi (SVG, hoặc <img> nếu đã có PNG gốc). */
export function ebi(opts = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'ebi-wrap';
  if (site.ebiPng && ['thumbs', 'earth', 'megaphone', 'plant', 'arms', 'recycle'].includes(opts.pose)) {
    wrap.innerHTML = `<img class="ebi sticker" src="public/img/ebi/${opts.pose}.webp" width="${opts.size || 200}" alt="${opts.title || 'Ebi'}">`;
  } else {
    wrap.innerHTML = ebiSvg(opts);
  }
  return wrap.firstElementChild;
}

/** Đổi tư thế/biểu cảm tại chỗ (giữ vị trí trong DOM). */
export function setEbi(el, opts) {
  if (!el) return el;
  const size = opts.size || parseInt(el.getAttribute('width'), 10) || 200;
  const next = ebi({ ...opts, size });
  el.replaceWith(next);
  return next;
}

/** Ebi nhảy lên (đúng) hoặc lắc (sai). */
export function react(el, ok) {
  if (!el) return;
  el.classList.remove('hop', 'nope');
  void el.getBoundingClientRect();
  el.classList.add(ok ? 'hop' : 'nope');
}
