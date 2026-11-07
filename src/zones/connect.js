// ECO CONNECT – giới thiệu + dòng thời gian (#/connect), số liệu (#/connect/stats), Ảnh/Đối tác khi được bật.
import { h, css, icon } from '../core/ui.js';
import { ebi } from '../core/ebi.js';
import site from '../data/site.js';
import stats from '../data/stats.js';
import timeline from '../data/timeline.js';
import gallery from '../data/gallery.js';
import partners from '../data/partners.js';

const PENDING = 'Đang cập nhật';
const STATUS = { done: 'Đã xong', now: 'Đang diễn ra', upcoming: 'Sắp tới' };
const GALLERY_PAGE = 4;

const nf = new Intl.NumberFormat('vi-VN');

const hasGallery = () => site.showGallery && gallery.length > 0;
const hasPartners = () => site.showPartners && partners.length > 0;

function seg(active) {
  const items = [
    { id: 'about', href: '/connect', label: 'Chiến dịch' },
    { id: 'stats', href: '/connect/stats', label: 'Số liệu' },
  ];
  if (hasGallery()) items.push({ id: 'gallery', href: '/connect/gallery', label: 'Ảnh' });
  if (hasPartners()) items.push({ id: 'partners', href: '/connect/partners', label: 'Đối tác' });
  return h('nav', { class: 'cn-seg', 'aria-label': 'Màn trong ECO CONNECT' },
    items.map((it) => h('a', { class: 'cn-seg-item', href: `#${it.href}`, 'aria-current': it.id === active ? 'page' : null }, it.label)));
}

function coach(pose, text) {
  return h('div', { class: 'cn-coach' }, ebi({ pose, size: 96, title: 'Ebi' }), h('div', { class: 'bubble', html: text }));
}

// ---------------- Chiến dịch ----------------
function mountAbout(el) {
  const nextId = (timeline.find((t) => t.status === 'now') || timeline.find((t) => t.status === 'upcoming'))?.id;
  const items = timeline.map((t) => h('li', { class: `cn-step is-${t.status}${t.id === nextId ? ' is-next' : ''}` },
    h('span', { class: 'cn-dot', 'aria-hidden': 'true', html: t.status === 'done' ? icon('check', 18) : t.status === 'now' ? icon('star', 18) : '' }),
    h('div', { class: 'cn-step-body' },
      h('p', { class: 'cn-step-meta' }, t.date, h('span', { class: 'cn-status' }, STATUS[t.status] || '')),
      h('h2', null, t.title),
      h('p', { class: 'cn-step-text' }, t.text))));

  el.append(h('div', { class: 'screen-inner cn cn-about' },
    seg('about'),
    h('div', { class: 'cn-about-grid' },
      coach('megaphone', `<b>${site.organizer}</b> mang câu chuyện tái chế nhựa đến với các bạn học sinh. ${site.concept}!`),
      h('ol', { class: 'cn-timeline', 'aria-label': 'Các mốc chiến dịch' }, items))));
}

// ---------------- Số liệu ----------------
function dateVN(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : PENDING;
}

function mountStats(el) {
  const rows = stats.items.map((s) => h('tr', null,
    h('td', { class: 'cn-ico', 'aria-hidden': 'true' }, s.icon),
    h('th', { scope: 'row' }, s.label),
    h('td', { class: 'cn-val' }, s.value == null
      ? h('span', { class: 'cn-pending' }, PENDING)
      : h('b', null, nf.format(s.value), ' ', h('span', null, s.unit)))));

  el.append(h('div', { class: 'screen-inner cn cn-stats' },
    seg('stats'),
    h('div', { class: 'cn-stats-grid' },
      coach('arms', 'Mình chỉ đăng số liệu <b>đã xác minh</b> thôi nhé!'),
      h('div', { class: 'cn-stats-main' },
        h('table', { class: 'cn-table' },
          h('caption', { class: 'sr-only' }, 'Số liệu chiến dịch đã xác minh'),
          h('tbody', null, rows)),
        h('p', { class: 'cn-source' }, `Nguồn: ${stats.source}. Cập nhật: ${dateVN(stats.updatedAt)}.`)))));
}

// ---------------- Ảnh (chỉ khi site.showGallery bật và có dữ liệu) ----------------
function mountGallery(el) {
  const pages = Math.ceil(gallery.length / GALLERY_PAGE);
  let page = 0;
  const grid = h('div', { class: 'cn-gallery' });
  const prev = h('button', { class: 'btn btn-sm btn-icon', type: 'button', 'aria-label': 'Trang ảnh trước', onclick: () => show(page - 1) }, '‹');
  const next = h('button', { class: 'btn btn-sm btn-icon', type: 'button', 'aria-label': 'Trang ảnh sau', onclick: () => show(page + 1) }, '›');
  const label = h('span', { class: 'cn-pager-label' });

  function show(i) {
    page = (i + pages) % pages;
    grid.replaceChildren(...gallery.slice(page * GALLERY_PAGE, (page + 1) * GALLERY_PAGE).map((g) => h('figure', { class: 'cn-photo' },
      h('img', { src: g.src, alt: g.alt || '', loading: 'lazy', decoding: 'async' }),
      g.caption ? h('figcaption', null, g.caption) : null)));
    label.textContent = `${page + 1}/${pages}`;
  }

  el.append(h('div', { class: 'screen-inner cn cn-photos' },
    seg('gallery'), grid,
    pages > 1 ? h('div', { class: 'cn-pager' }, prev, label, next) : null));
  show(0);
}

// ---------------- Đối tác (chỉ khi site.showPartners bật và có dữ liệu) ----------------
function mountPartners(el) {
  el.append(h('div', { class: 'screen-inner cn cn-partners' },
    seg('partners'),
    h('ul', { class: 'cn-partner-list' }, partners.map((p) => h('li', { class: 'card' },
      p.logo ? h('img', { src: p.logo, alt: '', loading: 'lazy', decoding: 'async' }) : null,
      h('b', null, p.name),
      p.role ? h('span', null, p.role) : null)))));
}

export default {
  id: 'connect', title: 'ECO CONNECT', short: 'Kết nối', icon: 'connect',
  mount(el, ctx) {
    css('zones/connect.css');
    const sub = ctx.params[0];
    if (sub === 'stats') return mountStats(el);
    if (sub === 'gallery' && hasGallery()) return mountGallery(el);
    if (sub === 'partners' && hasPartners()) return mountPartners(el);
    if (sub) history.replaceState(null, '', '#/connect');
    return mountAbout(el);
  },
};
