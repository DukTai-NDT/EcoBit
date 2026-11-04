// ECO HOME – màn chào (Ebi + chuỗi biến đổi + CTA) và bản đồ 6 khu (#/home/map). Agent C.
import { h, css, esc, icon, imgUrl, pick, reducedMotion, say } from '../core/ui.js';
import { ebi, setEbi, react } from '../core/ebi.js';
import store from '../core/store.js';
import site from '../data/site.js';
import stats from '../data/stats.js';
import timeline from '../data/timeline.js';
import codes from '../data/codes.js';

// Chuỗi biến đổi chai → sản phẩm (ảnh public/img/step-*.webp)
const STEPS = [
  { img: 'step-1-bottle', name: 'Chai nhựa đã dùng', text: 'Được thu gom và phân loại riêng chai PET.' },
  { img: 'step-2-flakes', name: 'Mảnh nhựa', text: 'Rửa sạch rồi nghiền thành mảnh nhỏ.' },
  { img: 'step-3-pellets', name: 'Hạt nhựa', text: 'Nung chảy và ép thành hạt nhựa.' },
  { img: 'step-4-yarn', name: 'Sợi polyester', text: 'Kéo thành sợi để dệt vải.' },
  { img: 'step-5-products', name: 'Sản phẩm mới', text: 'Thành áo, ba lô, gấu bông…' },
];
const STEP_MS = 2800;

// Câu Ebi nói khi được chạm
const LINES = [
  'Bạn biết không? Chai PET tái chế có thể thành <b>sợi polyester</b> để may áo đấy!',
  'Lật đáy chai lên xem có <b>con số</b> trong hình tam giác không nhé!',
  'Uống xong thì <b>rửa sạch, bóp dẹp</b> chai rồi bỏ vào thùng tái chế nha!',
  'Chơi minigame ở <b>ECO PLAY</b> để tích ECO POINT cùng mình nào!',
  'Mỗi chiếc chai được phân loại đúng là một cơ hội để <b>tái sinh</b>!',
  '<b>Một chiếc chai, muôn vàn khả năng</b> – nhớ câu này giúp mình nha!',
  'Đi hết <b>5 chặng ECO JOURNEY</b> để ghép bức tranh vòng đời của mình nhé!',
  'Hihi, nhột quá! Bạn chạm nhẹ thôi nha 😆',
];
const POSE_CYCLE = ['cheer', 'thumbs', 'recycle', 'earth', 'plant', 'megaphone'];

// 6 khu còn lại trên bản đồ
function places() {
  const s = store.summary();
  const labDone = store.isDone('lab:recycle');
  const next = timeline.find((t) => t.status === 'now') || timeline.find((t) => t.status === 'upcoming');
  return [
    { id: 'discover', name: 'DISCOVER', desc: `Tìm hiểu ${codes.length} mã nhựa`, tone: 'aqua',
      status: s.codesViewed ? `Đã xem ${Math.min(s.codesViewed, codes.length)}/${codes.length}` : 'Chưa ghé', done: s.codesViewed >= codes.length },
    { id: 'journey', name: 'JOURNEY', desc: 'Theo chân chiếc chai', tone: 'sun',
      status: `Chặng ${s.stagesDone}/${s.stagesTotal}`, done: s.stagesDone >= s.stagesTotal },
    { id: 'lab', name: 'LAB', desc: 'Thí nghiệm tái chế', tone: 'pink',
      status: labDone ? 'Đã làm' : 'Chưa thử', done: labDone },
    { id: 'play', name: 'PLAY', desc: '5 minigame vui', tone: 'green',
      status: `${s.gamesDone}/${s.gamesTotal} trò`, done: s.gamesDone >= s.gamesTotal },
    { id: 'passport', name: 'PASSPORT', desc: 'Huy hiệu của bạn', tone: 'terra',
      status: `${s.badges}/${s.badgesTotal} huy hiệu`, done: s.badges >= s.badgesTotal },
    { id: 'connect', name: 'CONNECT', desc: 'Tin chiến dịch', tone: 'sand',
      status: next ? `${next.title}` : 'Tin chiến dịch', done: false, info: true },
  ];
}

const nf = new Intl.NumberFormat('vi-VN');
const fmt = (v) => (v == null ? null : nf.format(v));

function seg(active) {
  const items = [
    { id: 'welcome', href: '/home', label: 'Chào mừng' },
    { id: 'map', href: '/home/map', label: 'Bản đồ khu' },
  ];
  return h('nav', { class: 'zseg', 'aria-label': 'Màn trong ECO HOME' },
    items.map((it) => h('a', { class: 'zseg-item', href: `#${it.href}`, 'aria-current': it.id === active ? 'page' : null }, it.label)));
}

// ---------------- Màn chào ----------------
function mountWelcome(el, ctx) {
  const name = (store.state.profile.name || '').trim();
  const greet = name
    ? `Chào <b>${esc(name)}</b>! Mình là <b>Ebi</b> đây. Mình đi khám phá tiếp nhé!`
    : 'Xin chào! Mình là <b>Ebi</b> – chiếc chai nhựa mơ được tái sinh. Đi cùng mình nhé!';

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
    say(bub, 'Ơ kìa, bạn tìm thấy mình rồi! <b>Bấm vào mình</b> để nghe chuyện nhé!');
  });
  ebiBtn.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !hovering) return;
    hovering = false;
    setPose('wave');
  });
  ebiBtn.addEventListener('click', () => {
    let i;
    do { i = Math.floor(Math.random() * LINES.length); } while (i === lastLine && LINES.length > 1);
    lastLine = i;
    poseIdx = (poseIdx + 1) % POSE_CYCLE.length;
    setPose(POSE_CYCLE[poseIdx], pick(['happy', 'wink', 'smile']));
    react(ebiEl, true);
    say(bub, LINES[i]);
  });

  // dải biến đổi
  const strip = buildStrip();

  const hero = h('div', { class: 'hm-hero' },
    h('div', { class: 'hm-greet' }, ebiBtn, bub),
    h('div', { class: 'hm-title' },
      h('h1', null, h('span', { class: 'hm-brand' }, h('b', null, 'ECObit'), ' HUB'),
        h('span', { class: 'hm-tagline' }, `– ${site.tagline || 'Thế giới tái chế trong tầm tay'}`)),
      h('p', { class: 'hm-slogan' }, h('span', { 'aria-hidden': 'true' }, '♻'), site.concept || 'Một chiếc chai, muôn vàn khả năng')),
    h('div', { class: 'hm-cta' },
      h('a', { class: 'btn btn-primary hm-cta-main', href: '#/journey' }, 'BẮT ĐẦU KHÁM PHÁ', h('span', { html: icon('arrow', 20) })),
      h('a', { class: 'btn btn-sun', href: '#/connect' }, 'TÌM HIỂU VỀ ECObit')));

  el.append(h('div', { class: 'screen-inner hm hm-welcome' },
    h('div', { class: 'hm-top' }, seg('welcome')),
    h('div', { class: 'hm-welcome-grid' }, hero, strip.el)));

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
  const chain = h('div', { class: 'hm-chain', role: 'group', 'aria-label': 'Chọn bước biến đổi' });
  thumbs.forEach((t, i) => {
    chain.append(t);
    if (i < thumbs.length - 1) chain.append(h('span', { class: 'hm-chain-arrow', 'aria-hidden': 'true' }, '›'));
  });

  const view = h('div', { class: 'hm-strip-view' }, imgs);
  const el = h('section', { class: 'hm-strip card', 'aria-label': 'Hành trình biến đổi của chiếc chai', 'aria-roledescription': 'trình chiếu' },
    h('div', { class: 'hm-strip-main' }, view,
      h('div', { class: 'hm-strip-side' },
        h('div', { class: 'hm-strip-head' }, h('span', { class: 'eyebrow' }, 'Chiếc chai đi đâu?'), pauseBtn),
        cap)),
    chain);

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
function mountMap(el) {
  const list = places();
  const map = h('div', { class: 'hm-map stagger' }, list.map((p) => h('a', {
    class: `hm-place tone-${p.tone}${p.done ? ' is-done' : ''}`, href: `#/${p.id}`, 'aria-label': `ECO ${p.name}: ${p.desc}. ${p.status}`,
  },
  h('span', { class: 'hm-pin', html: icon(p.id, 22) }),
  h('span', { class: 'hm-place-name' }, h('small', null, 'ECO '), p.name),
  h('span', { class: 'hm-place-desc' }, p.desc),
  h('span', { class: `hm-place-status${p.info ? ' is-info' : ''}` },
    p.done ? h('span', { html: icon('check', 14) }) : null, p.status))));

  const homeStats = stats.items.filter((s) => s.home).slice(0, 3);
  const statBox = h('section', { class: 'hm-stats', 'aria-label': 'Số liệu chiến dịch' },
    homeStats.map((s) => {
      const v = fmt(s.value);
      return h('div', { class: 'hm-stat' },
        h('span', { class: 'hm-stat-ico', 'aria-hidden': 'true' }, s.icon),
        v ? h('b', { class: 'hm-stat-val' }, v, h('small', null, ` ${s.unit}`)) : h('b', { class: 'hm-stat-val is-pending' }, 'Đang cập nhật'),
        h('span', { class: 'hm-stat-lbl' }, s.label));
    }),
    h('a', { class: 'hm-stats-more', href: '#/connect/stats' }, 'Tất cả số liệu', h('span', { html: icon('arrow', 16) })));

  el.append(h('div', { class: 'screen-inner hm hm-mapscreen' },
    h('div', { class: 'hm-top' }, seg('map')),
    h('div', { class: 'hm-map-head' },
      h('h2', null, 'Bản đồ ECObit'),
      h('p', null, 'Chọn một địa điểm để ghé thăm nhé!')),
    h('div', { class: 'hm-map-grid' }, map, statBox)));
}

export default {
  id: 'home', title: 'ECO HOME', short: 'Nhà', icon: 'home',
  mount(el, ctx) {
    css('zones/home.css');
    if (ctx.params[0] === 'map') return mountMap(el, ctx);
    if (ctx.params.length) { history.replaceState(null, '', '#/home'); }
    return mountWelcome(el, ctx);
  },
};
