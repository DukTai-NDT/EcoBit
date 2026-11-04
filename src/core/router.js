// Hash router: mỗi khu là một màn hình. URL dạng #/zone/param1/param2
import store from './store.js';

let zones = [];
let current = { zone: null, params: [], cleanup: null, el: null };
let stage;
const hooks = [];

export function parse(hash = location.hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  return { id: parts[0] || 'home', params: parts.slice(1) };
}

export function go(path) {
  const target = '#' + (path.startsWith('/') ? path : '/' + path);
  if (location.hash === target) render(); else location.hash = target;
}

export function onRoute(fn) { hooks.push(fn); }

function render() {
  const { id, params } = parse();
  const zone = zones.find((z) => z.id === id);
  if (!zone) { history.replaceState(null, '', '#/home'); return render(); }
  const same = current.zone === zone && current.params.join('/') === params.join('/');
  if (same && current.el) return;

  // dọn màn cũ
  if (typeof current.cleanup === 'function') { try { current.cleanup(); } catch (e) { console.error(e); } }
  const prevIdx = current.zone ? zones.indexOf(current.zone) : -1;
  const nextIdx = zones.indexOf(zone);
  const old = current.el;
  if (old) {
    old.classList.add('leaving');
    old.setAttribute('aria-hidden', 'true');
    setTimeout(() => old.remove(), 260);
  }

  const el = document.createElement('section');
  el.className = 'screen';
  el.dataset.zone = zone.id;
  el.setAttribute('aria-label', zone.title);
  if (prevIdx === -1 || prevIdx === nextIdx) el.classList.add('enter-fade');
  else el.classList.add(nextIdx > prevIdx ? 'enter-right' : 'enter-left');
  stage.append(el);

  current = { zone, params, el, cleanup: null };
  try {
    current.cleanup = zone.mount(el, { params, go, store, zone }) || null;
  } catch (e) {
    console.error(e);
    el.innerHTML = '<div class="screen-inner center"><h2>Ôi, có lỗi rồi!</h2><p>Bạn thử tải lại trang nhé.</p></div>';
  }
  el.scrollTop = 0;
  document.title = `${zone.title} · ECObit HUB`;
  hooks.forEach((fn) => fn({ zone, params }));
}

export function startRouter(list, stageEl) {
  zones = list;
  stage = stageEl;
  window.addEventListener('hashchange', render);
  render();
}
