// Tiến độ người chơi – lưu trên trình duyệt (localStorage), không đăng nhập.
const KEY = 'ecobit.v1';

export const GAMES = ['play:sort', 'play:match', 'play:puzzle', 'play:quiz', 'play:detective'];
export const CORE = [...GAMES, 'discover:identify', 'lab:recycle'];

// Điểm: lần đầu hoàn thành + base, lần đầu đúng hết + bonus. Không cộng lặp.
const POINTS = {
  'play:sort': [20, 10],
  'play:match': [20, 10],
  'play:puzzle': [20, 10],
  'play:quiz': [20, 10],
  'play:detective': [20, 10],
  'discover:identify': [20, 10],
  'lab:recycle': [30, 0],
};
export const JOURNEY_BONUS = 100;
export const JOURNEY_STAGES = 5;

export const LEVELS = [
  { name: 'Hạt mầm', min: 0, emoji: '🌰' },
  { name: 'Chồi non', min: 50, emoji: '🌱' },
  { name: 'Cây non', min: 120, emoji: '🌿' },
  { name: 'Cây xanh', min: 200, emoji: '🌳' },
  { name: 'Đại thụ ECO', min: 300, emoji: '🏆' },
];

export const BADGES = [
  { id: 'beginner', emoji: '🌱', name: 'ECO BEGINNER', desc: 'Hoàn thành thử thách đầu tiên',
    test: (s) => Object.values(s.activities).some((a) => a.done) || s.journey.some(Boolean) },
  { id: 'detective', emoji: '🔍', name: 'PLASTIC DETECTIVE', desc: 'Nhận diện đúng cả 7 mã nhựa',
    test: (s) => !!s.activities['discover:identify']?.perfect },
  { id: 'scientist', emoji: '🧪', name: 'ECO SCIENTIST', desc: 'Hoàn thành thí nghiệm ở ECO LAB',
    test: (s) => !!s.activities['lab:recycle']?.done },
  { id: 'explorer', emoji: '♻️', name: 'RECYCLING EXPLORER', desc: 'Đi hết 5 chặng ECO JOURNEY',
    test: (s) => s.journeyDone },
  { id: 'master', emoji: '🏆', name: 'ECO MASTER', desc: 'Hoàn thành toàn bộ thử thách cốt lõi',
    test: (s) => s.journeyDone && CORE.every((id) => s.activities[id]?.done) },
];

function fresh() {
  return {
    v: 1,
    profile: { name: '', avatar: 'thumbs' },
    points: 0,
    activities: {},
    journey: Array(JOURNEY_STAGES).fill(false),
    journeyDone: false,
    codesViewed: [],
    badges: {},
    createdAt: Date.now(),
  };
}

let mem = null;
let lastRaw = null;   // chuỗi đã đọc/ghi gần nhất: khác đi nghĩa là tab khác vừa ghi
function readRaw() {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
}
function load() {
  try {
    const raw = readRaw();
    lastRaw = raw;
    if (raw) {
      const s = { ...fresh(), ...JSON.parse(raw) };
      if (!Array.isArray(s.journey) || s.journey.length !== JOURNEY_STAGES) s.journey = Array(JOURNEY_STAGES).fill(false);
      return s;
    }
  } catch (e) { /* localStorage bị chặn → dùng bộ nhớ tạm */ }
  return fresh();
}
function save() {
  try {
    const raw = JSON.stringify(mem);
    localStorage.setItem(KEY, raw);
    lastRaw = raw;
  } catch (e) { /* bỏ qua */ }
}

const listeners = {};
function emit(ev, data) { (listeners[ev] || []).forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); }

function checkBadges() {
  const got = [];
  for (const b of BADGES) {
    if (!mem.badges[b.id] && b.test(mem)) {
      mem.badges[b.id] = Date.now();
      got.push(b);
    }
  }
  return got;
}

function commit(gained, newBadges) {
  if (gained) mem.points += gained;
  save();
  if (gained) emit('points', { gained, total: mem.points });
  newBadges.forEach((b) => emit('badge', b));
  emit('change', mem);
}

mem = load();

/** Tab khác đã ghi: nạp lại để không ghi đè tiến độ mới bằng bản cũ. */
function syncFromStorage() {
  if (readRaw() === lastRaw) return;
  mem = load();
  emit('change', mem);
}
window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) syncFromStorage(); });
window.addEventListener('pageshow', syncFromStorage);
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncFromStorage(); });

export const store = {
  get state() { return mem; },

  /** Ghi nhận hoàn thành một hoạt động. */
  complete(id, { correct = 0, total = 0 } = {}) {
    const perfect = total > 0 && correct >= total;
    const a = mem.activities[id] || { done: false, perfect: false, plays: 0, best: null };
    const [base, bonus] = POINTS[id] || [0, 0];
    let gained = 0;
    const first = !a.done;
    if (first) gained += base;
    if (perfect && !a.perfect) gained += bonus;
    a.done = true;
    a.perfect = a.perfect || perfect;
    a.plays += 1;
    if (!a.best || correct / (total || 1) > a.best.correct / (a.best.total || 1)) a.best = { correct, total };
    a.at = Date.now();
    mem.activities[id] = a;
    const newBadges = checkBadges();
    commit(gained, newBadges);
    return { gained, perfect, first, newBadges };
  },

  /** Nhận mảnh ghép chặng Journey (0..4). */
  journeyPiece(i) {
    let gained = 0;
    mem.journey[i] = true;
    const done = mem.journey.every(Boolean);
    if (done && !mem.journeyDone) { mem.journeyDone = true; gained = JOURNEY_BONUS; }
    const newBadges = checkBadges();
    commit(gained, newBadges);
    return { gained, newBadges, done };
  },

  viewCode(codeId) {
    if (!mem.codesViewed.includes(codeId)) { mem.codesViewed.push(codeId); save(); emit('change', mem); }
  },

  setProfile(p) {
    mem.profile = { ...mem.profile, ...p };
    save(); emit('change', mem);
  },

  level() {
    let idx = 0;
    LEVELS.forEach((l, i) => { if (mem.points >= l.min) idx = i; });
    const cur = LEVELS[idx];
    const next = LEVELS[idx + 1] || null;
    const progress = next ? (mem.points - cur.min) / (next.min - cur.min) : 1;
    return { idx, ...cur, next, progress: Math.max(0, Math.min(1, progress)) };
  },

  summary() {
    return {
      gamesDone: GAMES.filter((g) => mem.activities[g]?.done).length,
      gamesTotal: GAMES.length,
      stagesDone: mem.journey.filter(Boolean).length,
      stagesTotal: JOURNEY_STAGES,
      codesViewed: mem.codesViewed.length,
      badges: Object.keys(mem.badges).length,
      badgesTotal: BADGES.length,
    };
  },

  isDone(id) { return !!mem.activities[id]?.done; },

  on(ev, fn) {
    (listeners[ev] = listeners[ev] || []).push(fn);
    return () => { listeners[ev] = listeners[ev].filter((f) => f !== fn); };
  },

  reset() {
    mem = fresh(); save(); emit('change', mem);
  },
};

export default store;
