// ECO HOME – màn chào (Ebi + dải biến đổi + CTA) và bản đồ 6 khu (#/home/map).
import { h, css, esc, icon, imgUrl, pick, reducedMotion, say } from '../core/ui.js';
import { ebi, setEbi, react } from '../core/ebi.js';
import store from '../core/store.js';
import site from '../data/site.js';
import stats from '../data/stats.js';
import timeline from '../data/timeline.js';
import codes from '../data/codes.js';

// Dải biến đổi chai → sản phẩm (ảnh public/img/step-*.webp). Lời bám theo src/data/lab.js.
const STEPS = [
  { img: 'step-1-bottle', name: 'Chai đã dùng', text: 'Thu gom, phân loại riêng chai PET.' },
  { img: 'step-2-flakes', name: 'Mảnh nhựa', text: 'Băm thành mảnh rồi rửa sạch.' },
  { img: 'step-3-pellets', name: 'Hạt nhựa', text: 'Nấu chảy, lọc rồi tạo thành hạt.' },
  { img: 'step-4-yarn', name: 'Sợi polyester', text: 'Có thể kéo sợi để dệt vải.' },
  { img: 'step-5-products', name: 'Sản phẩm mới', text: 'Có thể thành áo, ba lô, gấu bông.' },
];
const STEP_MS = 2800;

// Câu Ebi nói khi được chạm
const LINES = [
  'Chai PET tái chế có thể thành <b>sợi polyester</b> để dệt vải đấy!',
  'Lật đáy chai lên xem có <b>con số</b> trong hình tam giác không nhé!',
  'Uống xong thì <b>đổ cạn</b> chai rồi đưa đến điểm thu gom nha!',
  'Chơi minigame ở <b>ECO PLAY</b> để tích ECO POINT cùng mình nào!',
  'Mỗi chiếc chai phân loại đúng là một cơ hội <b>tái sinh</b>!',
  '<b>Một chiếc chai, muôn vàn khả năng</b> – nhớ giúp mình nha!',
  'Đi hết <b>5 chặng ECO JOURNEY</b> để ghép tranh vòng đời nhé!',
  'Hihi, nhột quá! Bạn chạm nhẹ thôi nha!',
];
const POSE_CYCLE = ['cheer', 'thumbs', 'recycle', 'earth', 'plant', 'megaphone'];

// 6 khu còn lại trên bản đồ
function places() {
  const s = store.summary();
  const labDone = store.isDone('lab:recycle');
  const next = timeline.find((t) => t.status === 'now') || timeline.find((t) => t.status === 'upcoming');
  const viewed = Math.min(s.codesViewed, codes.length);
  return [
    { id: 'discover', desc: `Khám phá ${codes.length} mã`, tone: 'aqua', value: viewed, total: codes.length, unit: 'mã đã xem' },
    { id: 'journey', desc: 'Theo chân chai', tone: 'sun', value: s.stagesDone, total: s.stagesTotal, unit: 'chặng' },
    { id: 'lab', desc: 'Thử tái chế', tone: 'pink', value: labDone ? 1 : 0, total: 1, unit: 'thí nghiệm' },
    { id: 'play', desc: `${s.gamesTotal} trò vui`, tone: 'green', value: s.gamesDone, total: s.gamesTotal, unit: 'trò đã xong' },
    { id: 'passport', desc: 'Huy hiệu của bạn', tone: 'terra', value: s.badges, total: s.badgesTotal, unit: 'huy hiệu' },
    { id: 'connect', desc: next ? next.title : 'Tin chiến dịch', tone: 'sand', note: next?.status === 'now' ? 'Đang diễn ra' : 'Sắp tới' },
  ];
}

const nf = new Intl.NumberFormat('vi-VN');
const fmt = (v) => (v == null ? null : nf.format(v));

// ---------------- Màn chào ----------------
function mountWelcome(el) {
  const name = (store.state.profile.name || '').trim();
  const greet = name
    ? `Chào <b>${esc(name)}</b>! Mình là <b>Ebi</b>. Đi khám phá tiếp nhé!`
    : 'Xin chào! Mình là <b>Ebi</b> – chiếc chai nhựa muốn được tái sinh!';

  const bub = h('div', { class: 'bubble hm-bubble anim-pop', html: greet, 'aria-live': 'polite' });
  let ebiEl = ebi({ pose: 'wave', size: 200, title: 'Ebi đang vẫy tay chào' });
  const ebiBtn = h('button', { class: 'hm-ebi', type: 'button', 'aria-label': 'Chạm vào Ebi để nghe Ebi nói' }, ebiEl);

  let lastLine = -1;
  let poseIdx = 0;
  let hovering = false;
  function setPose(pose, mood = 'happy') {
    ebiEl = setEbi(ebiEl, { pose, mood, title: 'Ebi' });
  }
  ebiBtn.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    hovering = true;
    setPose('cheer', 'wow');
    say(bub, 'Ơ kìa, bạn tìm thấy mình rồi! <b>Bấm vào mình</b> nhé!');
  });
  ebiBtn.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !hovering) return;
    hovering = false;
    setPose('wave');
  });
  ebiBtn.addEventListener('click', () => {
    let i;
    do { i = Math.floor(Math.random() * LINES.length); } while (i === lastLine);
    lastLine = i;
    poseIdx = (poseIdx + 1) % POSE_CYCLE.length;
    setPose(POSE_CYCLE[poseIdx], pick(['happy', 'wink', 'smile']));
    react(ebiEl, true);
    say(bub, LINES[i]);
  });

  const strip = buildStrip();

  el.append(h('div', { class: 'screen-inner hm hm-welcome' },
    h('div', { class: 'hm-title' },
      h('h1', null,
        h('span', { class: 'hm-brand' }, h('b', null, 'ECObit'), ' HUB'),
        h('span', { class: 'hm-tagline' }, `– ${site.tagline}`)),
      h('p', { class: 'hm-slogan' }, site.concept)),
    h('a', { class: 'btn btn-sm btn-aqua hm-switch', href: '#/home/map' }, 'Bản đồ', h('span', { html: icon('arrow', 18) })),
    h('div', { class: 'hm-greet' }, ebiBtn, bub),
    strip.el,
    h('div', { class: 'hm-cta' },
      h('a', { class: 'btn btn-primary', href: '#/journey' }, 'BẮT ĐẦU KHÁM PHÁ'),
      h('a', { class: 'btn btn-sun', href: '#/connect' }, 'TÌM HIỂU VỀ ECObit'))));

  return () => strip.stop();
}

function buildStrip() {
  let idx = 0;
  let timer = null;
  let playing = !reducedMotion();

  const imgs = STEPS.map((s, i) => h('img', {
    class: `sticker hm-strip-img${i === 0 ? ' on' : ''}`, src: imgUrl(s.img), alt: s.name, decoding: 'async', draggable: 'false',
  }));
  const num = h('span', { class: 'hm-strip-num', 'aria-hidden': 'true' });
  const capName = h('b', null);
  const capText = h('span', null);
  const cap = h('p', { class: 'hm-strip-cap' }, num, h('span', { class: 'hm-strip-captext' }, capName, capText));
  const pauseBtn = h('button', { class: 'btn btn-sm btn-icon hm-strip-pause', type: 'button', onclick: () => toggle() });

  const thumbs = STEPS.map((s, i) => h('button', {
    class: 'hm-thumb', type: 'button', 'aria-label': `Bước ${i + 1}: ${s.name}`,
    onclick: () => { show(i); pause(); },
  }, h('img', { src: imgUrl(s.img), alt: '', decoding: 'async', draggable: 'false' })));

  const view = h('div', { class: 'hm-strip-view' }, imgs);
  const el = h('section', { class: 'hm-strip card', 'aria-label': 'Hành trình biến đổi của chiếc chai', 'aria-roledescription': 'trình chiếu' },
    h('div', { class: 'hm-strip-main' }, view, cap),
    h('div', { class: 'hm-chain' },
      h('div', { class: 'hm-thumbs', role: 'group', 'aria-label': 'Chọn bước biến đổi' }, thumbs),
      pauseBtn));

  function show(i) {
    idx = (i + STEPS.length) % STEPS.length;
    imgs.forEach((im, k) => im.classList.toggle('on', k === idx));
    thumbs.forEach((t, k) => {
      t.classList.toggle('on', k === idx);
      t.classList.toggle('past', k < idx);
      if (k === idx) t.setAttribute('aria-current', 'step'); else t.removeAttribute('aria-current');
    });
    num.textContent = idx + 1;
    capName.textContent = STEPS[idx].name;
    capText.textContent = STEPS[idx].text;
  }
  function renderPause() {
    pauseBtn.innerHTML = playing
      ? '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>';
    pauseBtn.setAttribute('aria-label', playing ? 'Tạm dừng trình chiếu' : 'Tự chạy trình chiếu');
  }
  function tick() { show(idx + 1); }
  function play() { playing = true; clearInterval(timer); timer = setInterval(tick, STEP_MS); renderPause(); }
  function pause() { playing = false; clearInterval(timer); timer = null; renderPause(); }
  function toggle() { if (playing) pause(); else { play(); tick(); } }

  show(0);
  if (playing) play(); else renderPause();
  return { el, stop: () => clearInterval(timer) };
}

// ---------------- Bản đồ khu ----------------
/** Ảnh địa điểm; ảnh lỗi thì tự về biểu tượng trong khung tròn. */
function placePic(id) {
  const box = h('span', { class: 'hm-pic' });
  box.append(h('img', {
    class: 'sticker', src: imgUrl(`loc-${id}`), alt: '', loading: 'lazy', decoding: 'async', draggable: 'false',
    onerror: () => { box.classList.add('is-icon'); box.innerHTML = icon(id, 30); },
  }));
  return box;
}

function placeCard(p) {
  const counted = p.total != null;
  const done = counted && p.value >= p.total;
  const name = `ECO ${p.id.toUpperCase()}`;
  const summary = counted ? `${p.value}/${p.total} ${p.unit}` : p.note;
  let prog;
  if (counted) {
    const pct = `${Math.round((p.value / p.total) * 100)}%`;
    const label = p.total === 1 ? (done ? 'Xong' : 'Chưa') : `${p.value}/${p.total}`;
    prog = h('span', { class: 'hm-prog', 'aria-hidden': 'true' },
      h('b', null, done ? h('span', { html: icon('check', 18) }) : null, label),
      h('span', { class: 'progress', style: `--p:${pct}` }, h('span')));
  } else {
    prog = h('span', { class: 'hm-prog is-note', 'aria-hidden': 'true' }, p.note);
  }
  return h('a', {
    class: `hm-place tone-${p.tone}${done ? ' is-done' : ''}`, href: `#/${p.id}`,
    'aria-label': `${name}: ${p.desc}. ${summary}`,
  },
  placePic(p.id), prog,
  h('span', { class: 'hm-place-name' }, name),
  h('span', { class: 'hm-place-desc' }, p.desc));
}

function mountMap(el) {
  const map = h('div', { class: 'hm-map stagger' }, places().map(placeCard));

  const homeStats = stats.items.filter((s) => s.home).slice(0, 3);
  const statBox = h('a', { class: 'hm-stats', href: '#/connect/stats', 'aria-label': 'Xem tất cả số liệu chiến dịch' },
    homeStats.map((s) => {
      const v = fmt(s.value);
      return h('span', { class: 'hm-stat' },
        h('span', { class: 'hm-stat-ico', 'aria-hidden': 'true' }, s.icon),
        h('span', { class: 'hm-stat-lbl' }, s.label),
        v ? h('b', { class: 'hm-stat-val' }, v, ' ', h('small', null, s.unit)) : h('b', { class: 'hm-stat-val is-pending' }, 'Đang cập nhật'));
    }));

  el.append(h('div', { class: 'screen-inner hm hm-mapscreen' },
    h('div', { class: 'hm-map-head' },
      h('h1', null, 'Bản đồ ECObit'),
      h('a', { class: 'btn btn-sm btn-aqua hm-switch', href: '#/home' }, h('span', { class: 'hm-flip', html: icon('arrow', 18) }), 'Chào mừng')),
    h('div', { class: 'hm-map-grid' }, map, statBox)));
}

export default {
  id: 'home', title: 'ECO HOME', short: 'Nhà', icon: 'home',
  mount(el, ctx) {
    css('zones/home.css');
    if (ctx.params[0] === 'map') return mountMap(el);
    if (ctx.params.length) history.replaceState(null, '', '#/home');
    return mountWelcome(el);
  },
};
