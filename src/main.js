// ECObit HUB – khởi động ứng dụng.
import { startRouter, onRoute } from './core/router.js';
import store from './core/store.js';
import { h, icon, toast, confetti } from './core/ui.js';
import site from './data/site.js';

import home from './zones/home.js';
import discover from './zones/discover.js';
import journey from './zones/journey.js';
import lab from './zones/lab.js';
import play from './zones/play.js';
import passport from './zones/passport.js';
import connect from './zones/connect.js';

// Thứ tự tab = thứ tự khu trong brief
const ZONES = [home, discover, journey, lab, play, passport, connect];

// ---------- Thanh tab ----------
const tabbar = document.getElementById('tabbar');
const tabs = {};
for (const z of ZONES) {
  const a = h('a', { class: 'tab', href: `#/${z.id}`, 'data-zone': z.id },
    h('span', { html: icon(z.icon) }),
    h('span', { class: 'tab-lbl-long' }, z.title.replace(/^ECO\s+/, '')),
    h('span', { class: 'tab-lbl-short' }, z.short));
  a.firstChild.replaceWith(a.firstChild.firstChild);
  tabs[z.id] = a;
  tabbar.append(a);
}
onRoute(({ zone }) => {
  for (const [id, a] of Object.entries(tabs)) {
    if (id === zone.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  if (zone.id === 'passport') tabs.passport.querySelector('.tab-dot')?.remove();
  track(zone.id);
});

// ---------- ECO POINT ----------
const pointsVal = document.getElementById('pointsVal');
const pointsChip = document.getElementById('pointsChip');
function renderPoints() { pointsVal.textContent = store.state.points; }
renderPoints();
store.on('change', renderPoints);
store.on('points', ({ gained }) => {
  pointsChip.classList.remove('bump'); void pointsChip.offsetWidth; pointsChip.classList.add('bump');
  toast(`+${gained} ECO POINT`, { icon: '⭐', type: 'points' });
});
store.on('badge', (b) => {
  setTimeout(() => {
    toast(`Huy hiệu mới: ${b.name}`, { icon: b.emoji, type: 'badge', ms: 3600 });
    confetti();
    if (!tabs.passport.querySelector('.tab-dot')) tabs.passport.append(h('span', { class: 'tab-dot', 'aria-label': 'Có huy hiệu mới' }));
  }, 500);
});

// ---------- Google Analytics (tuỳ chọn) ----------
function track(page) {
  if (window.gtag) window.gtag('event', 'page_view', { page_title: page, page_location: location.href });
}
if (site.gaId) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`;
  document.head.append(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', site.gaId, { send_page_view: false });
}

startRouter(ZONES, document.getElementById('stage'));
