// ECO PASSPORT – hộ chiếu (#/passport), thẻ thành tích PNG (#/passport/card), hình nền (#/passport/wallpapers).
import { h, css, icon, modal, toast } from '../core/ui.js';
import { ebi, ebiSvg, POSES } from '../core/ebi.js';
import store, { BADGES, LEVELS } from '../core/store.js';
import site from '../data/site.js';

const AVATARS = POSES.slice(0, 6); // 6 tư thế gốc: thumbs, earth, megaphone, plant, arms, recycle
const NAME_MAX = 24;
const DEFAULT_NAME = 'Bạn của Ebi';

const INK = '#24402E';
const DISPLAY = '"Baloo 2", "Be Vietnam Pro", system-ui, sans-serif';
const BODY = '"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const EMOJI = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const displayName = () => (store.state.profile.name || '').trim() || DEFAULT_NAME;

/** Thanh chuyển 3 màn – nằm dưới đáy vì toast huy hiệu có thể che mép trên. */
function seg(active) {
  const items = [
    { id: 'main', href: '/passport', label: 'Hộ chiếu' },
    { id: 'card', href: '/passport/card', label: 'Thẻ' },
    { id: 'walls', href: '/passport/wallpapers', label: 'Hình nền' },
  ];
  return h('nav', { class: 'pp-seg', 'aria-label': 'Màn trong ECO PASSPORT' },
    items.map((it) => h('a', { class: 'pp-seg-item', href: `#${it.href}`, 'aria-current': it.id === active ? 'page' : null }, it.label)));
}

// ---------------- Hộ chiếu ----------------
function mountMain(el) {
  function render() {
    el.replaceChildren(h('div', { class: 'screen-inner pp pp-main' },
      h('div', { class: 'pp-grid' },
        identityCard(), levelCard(), statsRow(), badgesCard(),
        h('button', { class: 'btn btn-ghost pp-reset', type: 'button', onclick: confirmReset },
          h('span', { html: icon('refresh', 18) }), 'Làm lại từ đầu')),
      seg('main')));
  }

  function identityCard() {
    let avatar = ebi({ pose: store.state.profile.avatar, size: 110, still: true, title: 'Ebi của bạn' });
    const input = h('input', {
      class: 'pp-input', id: 'pp-name', type: 'text', maxlength: NAME_MAX, autocomplete: 'off', enterkeyhint: 'done',
      placeholder: 'Nhập tên của bạn', value: store.state.profile.name || '',
      oninput: (e) => store.setProfile({ name: e.target.value }),
      onkeydown: (e) => { if (e.key === 'Enter') e.target.blur(); },
    });
    return h('section', { class: 'card pp-id' },
      h('button', {
        class: 'pp-avatar', type: 'button', 'aria-label': 'Đổi tư thế Ebi', onclick: pickAvatar,
      }, avatar, h('span', { class: 'pp-avatar-edit' }, 'Đổi')),
      h('div', { class: 'pp-id-body' },
        h('label', { class: 'pp-label', for: 'pp-name' }, 'Tên hiển thị'),
        input,
        h('p', { class: 'pp-hint' }, 'Chạm Ebi để đổi tư thế nhé!')));
  }

  function pickAvatar() {
    const cur = store.state.profile.avatar;
    const grid = h('div', { class: 'pp-pick' }, AVATARS.map((p) => h('button', {
      class: 'pp-pick-item', type: 'button', 'aria-pressed': p.id === cur ? 'true' : 'false',
      onclick: () => { store.setProfile({ avatar: p.id }); dlg.close(); render(); },
    }, ebi({ pose: p.id, size: 76, still: true, title: '' }), h('span', null, p.label))));
    const dlg = modal(h('div', null, h('h2', { class: 'pp-modal-title' }, 'Chọn Ebi của bạn'), grid), { label: 'Chọn tư thế Ebi' });
  }

  function levelCard() {
    const lv = store.level();
    const note = lv.next
      ? `Còn ${lv.next.min - store.state.points} điểm nữa là lên ${lv.next.name}!`
      : 'Bạn đã đạt cấp cao nhất rồi!';
    return h('section', { class: 'card pp-level' },
      h('div', { class: 'pp-level-top' },
        h('span', { class: 'pp-level-emoji', 'aria-hidden': 'true' }, lv.emoji),
        h('div', { class: 'pp-level-name' }, h('span', { class: 'pp-label' }, 'Cấp độ'), h('b', null, lv.name))),
      h('div', {
        class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': Math.round(lv.progress * 100),
        'aria-label': 'Tiến độ lên cấp sau', style: `--p:${Math.round(lv.progress * 100)}%`,
      }, h('span')),
      h('p', { class: 'pp-level-note' }, note));
  }

  function statsRow() {
    const s = store.summary();
    const tile = (value, label) => h('div', { class: 'pp-stat' }, h('b', null, value), h('span', null, label));
    return h('section', { class: 'pp-stats', 'aria-label': 'Tiến độ của bạn' },
      tile(store.state.points, 'ECO POINT'),
      tile(`${s.gamesDone}/${s.gamesTotal}`, 'Trò đã xong'),
      tile(`${s.stagesDone}/${s.stagesTotal}`, 'Chặng Journey'));
  }

  function badgesCard() {
    const got = store.state.badges;
    const s = store.summary();
    return h('section', { class: 'card pp-badges', 'aria-label': 'Huy hiệu' },
      h('h2', null, `Huy hiệu ${s.badges}/${s.badgesTotal}`),
      h('div', { class: 'pp-badge-row' }, BADGES.map((b) => {
        const open = !!got[b.id];
        return h('button', {
          class: `pp-badge${open ? ' is-open' : ''}`, type: 'button',
          'aria-label': `${b.name}: ${open ? 'đã mở' : 'chưa mở'}. Chạm để xem cách mở`,
          onclick: () => showBadge(b),
        },
        h('span', { class: 'pp-badge-ico', 'aria-hidden': 'true' }, open ? b.emoji : h('span', { html: icon('lock', 24) })),
        h('span', { class: 'pp-badge-name', 'aria-hidden': 'true' }, b.name));
      })));
  }

  function showBadge(b) {
    const at = store.state.badges[b.id];
    modal(h('div', { class: 'pp-badge-detail' },
      h('span', { class: `pp-badge-big${at ? ' is-open' : ''}`, 'aria-hidden': 'true' }, at ? b.emoji : h('span', { html: icon('lock', 40) })),
      h('h2', null, b.name),
      h('p', { class: `chip ${at ? 'chip-green' : 'chip-sun'}` }, at ? `Đã mở ngày ${new Date(at).toLocaleDateString('vi-VN')}` : 'Chưa mở'),
      h('p', null, h('b', null, 'Cách mở: '), `${b.desc}.`)), { label: `Huy hiệu ${b.name}` });
  }

  function confirmReset() {
    const dlg = modal(h('div', { class: 'pp-confirm' },
      h('h2', null, 'Làm lại từ đầu?'),
      h('p', null, 'Điểm, huy hiệu, tiến độ và tên của bạn trên máy này sẽ bị xoá. Bạn không lấy lại được đâu nhé!'),
      h('div', { class: 'pp-confirm-btns' },
        h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Giữ lại'),
        h('button', {
          class: 'btn pp-danger', type: 'button',
          onclick: () => { store.reset(); dlg.close(); render(); toast('Đã làm lại từ đầu. Cùng bắt đầu nhé!', { icon: '🌱' }); },
        }, 'Xoá hết'))), { label: 'Xác nhận làm lại từ đầu' });
  }

  render();
}

// ---------------- Vẽ canvas ----------------
/** Chờ đúng font + đúng bộ dấu tiếng Việt. Google Fonts chia nhóm ký tự nên phải nạp theo chữ thật. */
async function loadFonts(text) {
  const specs = [
    ['800', '"Baloo 2"'], ['700', '"Baloo 2"'],
    ['700', '"Be Vietnam Pro"'], ['600', '"Be Vietnam Pro"'], ['500', '"Be Vietnam Pro"'],
  ];
  const sample = `${text} Tiếng Việt ắẳẵặấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ`;
  if (!document.fonts?.load) return;
  const loading = Promise.all(specs.map(([w, f]) => document.fonts.load(`${w} 40px ${f}`, sample))).then(() => document.fonts.ready);
  const timeout = new Promise((r) => { setTimeout(r, 4000); }); // mất mạng thì vẫn vẽ bằng font hệ thống
  await Promise.race([loading.catch(() => {}), timeout]);
}

function ebiImage(pose, size) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('Không vẽ được Ebi'));
    im.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ebiSvg({ pose, size, still: true }))}`;
  });
}

function rr(c, x, y, w, h2, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h2, r);
  c.arcTo(x + w, y + h2, x, y + h2, r);
  c.arcTo(x, y + h2, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** Khối kiểu sticker: viền đậm, bóng lệch xuống dưới. */
function sticker(c, x, y, w, h2, r, fill, { line = 6, lift = 8 } = {}) {
  c.fillStyle = INK;
  rr(c, x, y + lift, w, h2, r); c.fill();
  c.fillStyle = fill;
  rr(c, x, y, w, h2, r); c.fill();
  c.lineWidth = line; c.strokeStyle = INK; c.stroke();
}
function circle(c, x, y, r, fill, line) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (line) { c.lineWidth = line; c.strokeStyle = INK; c.stroke(); }
}
function dots(c, w, h2, step, color) {
  c.fillStyle = color;
  for (let y = step / 2; y < h2; y += step) for (let x = step / 2; x < w; x += step) { c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill(); }
}
/** Vẽ chữ có cỡ tự co để vừa bề ngang; trả về cỡ đã dùng. */
function fitText(c, text, x, y, maxW, size, minSize, weight, family) {
  let s = size;
  c.font = `${weight} ${s}px ${family}`;
  while (s > minSize && c.measureText(text).width > maxW) { s -= 2; c.font = `${weight} ${s}px ${family}`; }
  c.fillText(text, x, y, maxW);
  return s;
}
function wrap(c, text, maxW) {
  const lines = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    const test = cur ? `${cur} ${word}` : word;
    if (c.measureText(test).width > maxW && cur) { lines.push(cur); cur = word; } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}
/** Chip chữ kèm emoji, bề ngang đo một chỗ để canh hàng đúng. */
function chipWidth(c, text, emoji) {
  c.font = `800 44px ${DISPLAY}`;
  const tw = c.measureText(text).width;
  c.font = `38px ${EMOJI}`;
  const ew = c.measureText(emoji).width + 14;
  return { ew, w: tw + ew + 64 };
}
function chip(c, x, y, text, emoji, fill) {
  const { ew, w } = chipWidth(c, text, emoji);
  c.textAlign = 'left'; c.textBaseline = 'middle';
  sticker(c, x, y, w, 80, 40, fill, { line: 5, lift: 6 });
  c.fillStyle = INK;
  c.font = `38px ${EMOJI}`;
  c.fillText(emoji, x + 32, y + 42);
  c.font = `800 44px ${DISPLAY}`;
  c.fillText(text, x + 32 + ew, y + 44);
  return w;
}
function brandMark(c, x, y, s) {
  c.lineWidth = 6 * s; c.strokeStyle = INK;
  c.fillStyle = '#4FAE5A'; rr(c, x + 7 * s, y, 30 * s, 16 * s, 5 * s); c.fill(); c.stroke();
  c.fillStyle = '#9ED9E0'; rr(c, x, y + 14 * s, 44 * s, 58 * s, 15 * s); c.fill(); c.stroke();
}
const webAddress = () => (site.publicUrl || `${location.origin}${location.pathname}`)
  .replace(/^https?:\/\//, '').replace(/index\.html$/, '').replace(/\/$/, '');

/** Ảnh 1080×1350. Chữ nào vẽ thì phải nạp font theo đúng chữ đó trước. */
async function drawCard(canvas) {
  const name = displayName();
  const lv = store.level();
  const earned = BADGES.filter((b) => store.state.badges[b.id]);
  const address = webAddress();
  const avatar = await ebiImage(store.state.profile.avatar, 460);
  await loadFonts([name, lv.name, site.name, site.hashtag, site.organizer, 'THẺ THÀNH TÍCH ECO POINT Huy hiệu đã đạt', address, ...BADGES.map((b) => b.name)].join(' '));

  const W = 1080; const H = 1350;
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  c.fillStyle = '#FEF8E4'; c.fillRect(0, 0, W, H);
  circle(c, 120, 170, 300, 'rgba(168,219,143,.4)');
  circle(c, 980, 1200, 340, 'rgba(158,217,224,.4)');
  dots(c, W, H, 44, 'rgba(36,64,46,.08)');

  sticker(c, 44, 40, W - 88, H - 96, 56, '#FFFDF7', { line: 8, lift: 14 });

  // đầu thẻ
  brandMark(c, 96, 84, 1);
  c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2E7D4F';
  c.font = `800 60px ${DISPLAY}`;
  c.fillText('ECObit', 160, 132);
  const bw = c.measureText('ECObit ').width;
  c.fillStyle = INK; c.fillText('HUB', 160 + bw, 132);
  const tag = 'THẺ THÀNH TÍCH';
  c.font = `800 34px ${DISPLAY}`;
  const tw = c.measureText(tag).width + 48;
  sticker(c, W - 96 - tw, 98, tw, 64, 32, '#FFF1C9', { line: 5, lift: 5 });
  c.fillStyle = INK; c.fillText(tag, W - 96 - tw + 24, 133);

  // Ebi
  circle(c, W / 2, 400, 216, '#DDF3F5', 6);
  c.drawImage(avatar, W / 2 - 180, 176, 360, 468);

  // tên, cấp, điểm
  c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = INK;
  fitText(c, name, W / 2, 740, W - 200, 92, 54, 800, DISPLAY);
  const ptText = `${store.state.points} ECO POINT`;
  const lvW = chipWidth(c, lv.name, lv.emoji).w;
  const ptW = chipWidth(c, ptText, '⭐').w;
  const gap = 28;
  const left = W / 2 - (lvW + ptW + gap) / 2;
  chip(c, left, 776, lv.name, lv.emoji, '#E3F4D8');
  chip(c, left + lvW + gap, 776, ptText, '⭐', '#FFF1C9');

  // huy hiệu đã có
  c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = '#2E7D4F';
  c.font = `800 38px ${DISPLAY}`;
  c.fillText(`Huy hiệu đã đạt ${earned.length}/${BADGES.length}`, W / 2, 922);
  if (earned.length) {
    const slot = Math.min(176, (W - 160) / earned.length);
    const x0 = W / 2 - (slot * (earned.length - 1)) / 2;
    earned.forEach((b, i) => {
      const x = x0 + slot * i;
      circle(c, x, 1000, 58, '#FFF1C9', 5);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = INK;
      c.font = `56px ${EMOJI}`;
      c.fillText(b.emoji, x, 1004);
      c.textBaseline = 'alphabetic';
      c.font = `700 24px ${BODY}`;
      wrap(c, b.name, slot - 10).forEach((ln, k) => c.fillText(ln, x, 1092 + k * 29));
    });
  } else {
    c.fillStyle = '#4A6455';
    c.font = `600 34px ${BODY}`;
    c.fillText('Cùng Ebi mở huy hiệu đầu tiên nhé!', W / 2, 1006);
  }

  // chân thẻ
  c.strokeStyle = 'rgba(36,64,46,.25)'; c.lineWidth = 4; c.setLineDash([14, 12]);
  c.beginPath(); c.moveTo(96, 1158); c.lineTo(W - 96, 1158); c.stroke(); c.setLineDash([]);
  c.textBaseline = 'alphabetic'; c.textAlign = 'center'; c.fillStyle = '#2E7D4F';
  c.font = `800 54px ${DISPLAY}`;
  c.fillText(site.hashtag, W / 2, 1224);
  c.fillStyle = '#4A6455';
  c.font = `600 30px ${BODY}`;
  c.fillText(address, W / 2, 1272, W - 180);
}

/** Ba hình nền 1080×1920, chừa phần trên cho đồng hồ màn hình khoá. Vẽ trong hệ toạ độ 1080×1920. */
const WALLS = [
  { id: 'binh-minh', title: 'Bình minh', level: LEVELS[1], pose: 'plant', draw: wallSunrise },
  { id: 'vuon-la', title: 'Vườn lá', level: LEVELS[2], pose: 'earth', draw: wallGarden },
  { id: 'dem-sao', title: 'Đêm sao', level: LEVELS[4], pose: 'cheer', draw: wallNight },
];

function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function vertical(c, stops) {
  const g = c.createLinearGradient(0, 0, 0, 1920);
  stops.forEach(([p, col]) => g.addColorStop(p, col));
  c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
}
function hill(c, y, amp, fill) {
  c.beginPath(); c.moveTo(-20, 1940); c.lineTo(-20, y);
  c.bezierCurveTo(300, y - amp, 700, y + amp, 1100, y - amp / 2);
  c.lineTo(1100, 1940); c.closePath();
  c.fillStyle = fill; c.fill(); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
}
function leaf(c, x, y, s, rot, fill) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.beginPath(); c.moveTo(0, -60); c.bezierCurveTo(46, -30, 46, 30, 0, 60); c.bezierCurveTo(-46, 30, -46, -30, 0, -60); c.closePath();
  c.fillStyle = fill; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.beginPath(); c.moveTo(0, -44); c.lineTo(0, 44); c.lineWidth = 4; c.stroke();
  c.restore();
}
function star(c, x, y, r, fill) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r * .45 : r;
    c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  c.closePath(); c.fillStyle = fill; c.fill();
}
function wallSunrise(c) {
  vertical(c, [[0, '#9ED9E0'], [.55, '#DDF3F5'], [.8, '#FFF1C9']]);
  circle(c, 800, 900, 170, '#F5BE3B', 10);
  hill(c, 1270, 120, '#A8DB8F');
  hill(c, 1500, 90, '#4FAE5A');
}
function wallGarden(c) {
  vertical(c, [[0, '#E3F4D8'], [1, '#A8DB8F']]);
  const r = seeded(7);
  for (let i = 0; i < 26; i++) {
    const y = 620 + r() * 1300;
    leaf(c, r() * 1080, y, .6 + r() * .7, r() * Math.PI * 2, i % 3 ? '#7CC85A' : '#4FAE5A');
  }
  circle(c, 540, 1070, 400, '#FFFDF7', 10);
}
function wallNight(c) {
  vertical(c, [[0, '#0F2E22'], [.6, '#1F5E39'], [1, '#2E7D4F']]);
  const r = seeded(11);
  for (let i = 0; i < 70; i++) star(c, r() * 1080, r() * 1500, 5 + r() * 12, i % 4 ? '#FFF1C9' : '#F5BE3B');
  circle(c, 540, 1070, 400, '#F5BE3B', 10);
  circle(c, 540, 1070, 340, '#FFF1C9', 10);
  hill(c, 1600, 70, '#1F5E39');
}
async function drawWall(canvas, wall, scale) {
  const avatar = await ebiImage(wall.pose, 640);
  await loadFonts(`${site.concept} ${site.name} ${site.hashtag}`);
  canvas.width = Math.round(1080 * scale); canvas.height = Math.round(1920 * scale);
  const c = canvas.getContext('2d');
  c.setTransform(scale, 0, 0, scale, 0, 0);
  wall.draw(c);
  c.drawImage(avatar, 220, 690, 640, 832);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const [a, b] = site.concept.split(', ');
  const text = b ? [`${a},`, b] : [site.concept];
  const top = 1490;
  const lines = text.length * 76;
  sticker(c, 110, top, 860, lines + 150, 48, '#FFFDF7', { line: 8, lift: 12 });
  c.fillStyle = INK;
  c.font = `800 68px ${DISPLAY}`;
  text.forEach((ln, i) => c.fillText(ln, 540, top + 84 + i * 76));
  c.fillStyle = '#2E7D4F';
  c.font = `800 42px ${DISPLAY}`;
  c.fillText(`${site.name} ${site.hashtag}`, 540, top + 84 + lines);
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Không tạo được ảnh'))), 'image/png');
  });
}
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ---------------- Thẻ thành tích ----------------
function mountCard(el) {
  let alive = true;
  const canvas = h('canvas', { class: 'pp-card-canvas', width: 1080, height: 1350, role: 'img', 'aria-label': `Thẻ thành tích của ${displayName()}` });
  const shareUrl = site.publicUrl || `${location.origin}${location.pathname}`;
  let file = null;

  const saveBtn = h('button', { class: 'btn btn-primary', type: 'button', disabled: true, onclick: onSave }, h('span', { html: icon('download', 20) }), 'Tải ảnh');
  const shareBtn = h('button', { class: 'btn btn-sun', type: 'button', disabled: true, hidden: true, onclick: onShare }, h('span', { html: icon('share', 20) }), 'Chia sẻ ảnh');
  const fbBtn = h('a', {
    class: 'btn btn-aqua pp-fb', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, target: '_blank', rel: 'noopener',
  }, 'Chia sẻ Facebook');

  async function onSave() {
    try { saveBlob(await canvasBlob(canvas), 'ecobit-the-thanh-tich.png'); toast('Đã tải thẻ về máy!', { icon: '📥' }); } catch (e) { fail(e); }
  }
  async function onShare() {
    try {
      await navigator.share({ files: [file], title: 'Thẻ thành tích ECObit', text: `${site.concept} ${site.hashtag}` });
    } catch (e) { if (e.name !== 'AbortError') fail(e); }
  }
  function fail(e) { console.warn(e); toast('Chưa làm được, bạn thử lại nhé!', { icon: '🛠️' }); }

  el.append(h('div', { class: 'screen-inner pp pp-cardscreen' },
    h('div', { class: 'pp-card-grid' },
      h('div', { class: 'pp-card-view' }, canvas),
      h('div', { class: 'pp-card-side' },
        h('div', { class: 'pp-card-coach' },
          ebi({ pose: 'thumbs', size: 96, title: 'Ebi' }),
          h('div', { class: 'bubble' }, 'Thẻ này là của riêng bạn. Khoe với bạn bè nhé!')),
        h('div', { class: 'pp-card-btns' }, saveBtn, shareBtn, fbBtn),
        h('p', { class: 'pp-note' }, 'Instagram không đăng thẳng từ web, hãy tải ảnh rồi đăng.'))),
    seg('card')));

  drawCard(canvas).then(async () => {
    if (!alive) return;
    saveBtn.disabled = false;
    const blob = await canvasBlob(canvas);
    if (!alive) return;
    const f = new File([blob], 'ecobit-the-thanh-tich.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [f] })) {
      file = f;
      shareBtn.hidden = false;
      shareBtn.disabled = false;
    }
  }).catch(fail);

  return () => { alive = false; };
}

// ---------------- Hình nền ----------------
function mountWalls(el) {
  let alive = true;
  let drawId = 0;
  const pts = store.state.points;
  const isOpen = (w) => pts >= w.level.min;
  const nextWall = WALLS.find((w) => !isOpen(w));
  const talk = nextWall
    ? `Bạn có <b>${pts} ECO POINT</b>. Đủ ${nextWall.level.min} điểm là mở được <b>${nextWall.title}</b>!`
    : 'Bạn đã mở hết hình nền rồi. <b>Giỏi quá!</b>';

  const preview = h('canvas', { class: 'pp-wall-canvas', width: 360, height: 640, role: 'img' });
  const lock = h('span', { class: 'pp-wall-lock', html: icon('lock', 30) });
  const action = h('div', { class: 'pp-wall-action' });

  const options = WALLS.map((w) => h('button', {
    class: `pp-wall-opt${isOpen(w) ? '' : ' is-locked'}`, type: 'button', onclick: () => select(w),
  },
  h('b', null, w.title),
  h('span', null, isOpen(w) ? 'Đã mở' : `Cần ${w.level.min} điểm`)));

  async function save(w) {
    try {
      const full = document.createElement('canvas');
      await drawWall(full, w, 1);
      saveBlob(await canvasBlob(full), `ecobit-hinh-nen-${w.id}.png`);
      if (alive) toast(`Đã tải hình nền ${w.title}!`, { icon: '📥' });
    } catch (e) { console.warn(e); toast('Chưa làm được, bạn thử lại nhé!', { icon: '🛠️' }); }
  }

  function select(w) {
    const open = isOpen(w);
    options.forEach((b, i) => b.setAttribute('aria-pressed', WALLS[i] === w ? 'true' : 'false'));
    preview.setAttribute('aria-label', open ? `Xem trước hình nền ${w.title}` : `Hình nền ${w.title} đang khoá`);
    preview.classList.toggle('is-locked', !open);
    lock.hidden = open;
    action.replaceChildren(open
      ? h('button', { class: 'btn btn-primary pp-wall-btn', type: 'button', onclick: () => save(w) },
        h('span', { html: icon('download', 20) }), 'Tải về')
      : h('p', { class: 'pp-wall-need' }, `Đạt cấp ${w.level.name} để mở`));
    const id = ++drawId;
    const off = document.createElement('canvas');
    drawWall(off, w, 1 / 3).then(() => {
      if (id === drawId) preview.getContext('2d').drawImage(off, 0, 0);
    }).catch((e) => console.warn(e));
  }

  el.append(h('div', { class: 'screen-inner pp pp-wallscreen' },
    h('div', { class: 'pp-card-coach pp-wall-coach' },
      ebi({ pose: 'recycle', size: 96, title: 'Ebi' }),
      h('div', { class: 'bubble', html: talk })),
    h('div', { class: 'pp-wall-stage' },
      h('div', { class: 'pp-wall-view' }, preview, lock),
      h('div', { class: 'pp-wall-side' }, options, action)),
    seg('walls')));

  select([...WALLS].reverse().find(isOpen) || WALLS[0]);
  return () => { alive = false; };
}

export default {
  id: 'passport', title: 'ECO PASSPORT', short: 'Hộ chiếu', icon: 'passport',
  mount(el, ctx) {
    css('zones/passport.css');
    const sub = ctx.params[0];
    if (sub === 'card') return mountCard(el);
    if (sub === 'wallpapers') return mountWalls(el);
    if (sub) history.replaceState(null, '', '#/passport');
    return mountMain(el);
  },
};
