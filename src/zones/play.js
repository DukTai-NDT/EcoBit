// ECO PLAY – sảnh 5 trò và màn chơi từng trò.
import { h, css, icon, backBtn } from '../core/ui.js';
import { ebi } from '../core/ebi.js';
import { mountSort } from '../engines/sort.js';
import { mountMatch } from '../engines/match.js';
import { mountOrder } from '../engines/order.js';
import { mountQuiz } from '../engines/quiz.js';
import { showResult } from '../engines/result.js';
import sortData from '../data/sort.js';
import matchData from '../data/match.js';
import puzzleData from '../data/puzzle.js';
import quizData from '../data/quiz.js';
import detectiveData from '../data/detective.js';

const GAMES = [
  { id: 'sort', name: 'ECO SORT', desc: 'Xếp đồ vào đúng nhóm nhựa', emoji: '🗑️', color: 'var(--code-pet)',
    start: (el, on) => mountSort(el, sortData, on) },
  { id: 'match', name: 'ECO MATCH', desc: 'Ghép mã nhựa với sản phẩm', emoji: '🧩', color: 'var(--code-ldpe)',
    start: (el, on) => mountMatch(el, matchData, on) },
  { id: 'puzzle', name: 'ECO PUZZLE', desc: 'Xếp hành trình của chiếc chai', emoji: '🪜', color: 'var(--code-pp)',
    start: (el, on) => mountOrder(el, puzzleData, on) },
  { id: 'quiz', name: 'ECO QUIZ', desc: 'Trả lời nhanh trước khi hết giờ', emoji: '⏱️', color: 'var(--code-hdpe)',
    start: (el, on) => mountQuiz(el, { ...quizData, variant: 'quiz' }, on) },
  { id: 'detective', name: 'ECO DETECTIVE', desc: 'Tìm ra câu nói sai', emoji: '🔍', color: 'var(--code-ps)',
    start: (el, on) => mountQuiz(el, { ...detectiveData, variant: 'detective' }, on) },
];

const activity = (store, id) => store.state.activities[`play:${id}`];

/** Trạng thái + điểm còn có thể nhận của một trò. */
function statusOf(store, id) {
  const a = activity(store, id);
  if (!a?.done) return { text: 'Chưa chơi', points: 30, cls: '' };
  if (!a.perfect) return { text: 'Đã xong', points: 10, cls: 'chip-green' };
  return { text: '⭐ Đúng hết', points: 0, cls: 'chip-sun' };
}

/** Trò chưa xong kế tiếp, tính vòng từ sau trò hiện tại. */
function nextGame(store, id) {
  const at = GAMES.findIndex((g) => g.id === id);
  for (let n = 1; n < GAMES.length; n++) {
    const g = GAMES[(at + n) % GAMES.length];
    if (!activity(store, g.id)?.done) return g;
  }
  return null;
}

function renderHub(el, { store }) {
  const doneCount = GAMES.filter((g) => activity(store, g.id)?.done).length;

  const cards = GAMES.map((g) => {
    const st = statusOf(store, g.id);
    const a = h('a', { class: 'play-card', href: `#/play/${g.id}` },
      h('span', { class: 'play-ico', 'aria-hidden': 'true' }, g.emoji),
      h('span', { class: 'play-text' },
        h('span', { class: 'play-top' },
          h('b', { class: 'play-name' }, g.name),
          h('span', { class: `chip ${st.cls}` }, st.points ? `${st.text} · +${st.points}đ` : st.text)),
        h('span', { class: 'play-desc' }, g.desc)));
    a.style.setProperty('--game', g.color);
    return a;
  });

  const strip = h('aside', { class: 'play-points', 'aria-label': 'Cách tính ECO POINT' },
    h('b', { class: 'play-points-title', html: icon('star', 20) }, 'ECO POINT'),
    h('div', { class: 'play-rules' },
      h('span', { class: 'chip' }, '20đ/trò lần đầu'),
      h('span', { class: 'chip' }, '+10 nếu đúng hết'),
      h('span', { class: 'chip' }, '100đ khi xong Journey')),
    h('p', null, 'Điểm mở khoá huy hiệu và hình nền Ebi, không đổi quà.'));

  el.append(h('div', { class: 'screen-inner play-hub' },
    h('header', { class: 'play-hub-head' },
      ebi({ pose: 'cheer', mood: 'happy', size: 40, still: true }),
      h('h1', null, 'ECO PLAY'),
      h('span', { class: 'chip chip-green' }, `${doneCount}/${GAMES.length} trò`)),
    h('div', { class: 'play-grid stagger' }, cards, strip)));
}

function renderGame(el, ctx, game) {
  const { store, go } = ctx;
  const bar = h('div', { class: 'progress play-progress', role: 'progressbar', 'aria-label': 'Tiến độ', 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('span'));
  const host = h('div', { class: 'play-host' });
  el.append(h('div', { class: 'screen-inner play-game' },
    h('header', { class: 'play-head' }, backBtn('/play', 'Sảnh'), h('h1', { class: 'play-title' }, game.name), bar),
    host));

  const setProgress = (ratio) => {
    const p = Math.round(ratio * 100);
    bar.style.setProperty('--p', `${p}%`);
    bar.setAttribute('aria-valuenow', String(p));
  };

  let stop = null;
  const halt = () => { if (stop) { stop(); stop = null; } };

  function start() {
    halt();
    host.replaceChildren();
    setProgress(0);
    stop = game.start(host, {
      onProgress: ({ done, total }) => setProgress(total ? done / total : 0),
      onComplete: finish,
    });
  }

  function finish({ correct, total }) {
    halt();
    const res = store.complete(`play:${game.id}`, { correct, total });
    const next = nextGame(store, game.id);
    setProgress(1);
    stop = showResult(host, {
      title: game.name,
      correct,
      total,
      gained: res.gained,
      perfect: res.perfect,
      onReplay: start,
      onNext: () => go(next ? `/play/${next.id}` : '/play'),
      nextLabel: next ? 'Trò tiếp theo' : 'Về sảnh',
    });
  }

  start();
  return halt;
}

export default {
  id: 'play', title: 'ECO PLAY', short: 'Chơi', icon: 'play',
  mount(el, ctx) {
    css('zones/play.css');
    const sub = ctx.params[0];
    if (!sub) { renderHub(el, ctx); return undefined; }
    const game = GAMES.find((g) => g.id === sub);
    if (!game) { ctx.replace('/play'); return undefined; }
    return renderGame(el, ctx, game);
  },
};
