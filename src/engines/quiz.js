// Engine trắc nghiệm: mỗi màn một câu, có thể đếm ngược; biến thể "Thám tử" tìm câu SAI.
/**
 * mountQuiz(el, config, { onComplete, onProgress }) → cleanup()
 *
 * config: {
 *   prompt?: string,                 // lời Ebi trên đầu mỗi câu
 *   timer?: number,                  // giây/câu; bỏ trống = không tính giờ; hết giờ = sai
 *   variant?: 'quiz' | 'detective',  // detective: tiêu đề "Câu nào SAI?", phương án là nhận định dài
 *   questions: [{ q, options: string[], answer: number, explain, img? }]  // answer: chỉ số 0-based
 * }
 * onProgress({ done, total })    sau mỗi câu đã trả lời
 * onComplete({ correct, total })
 *
 * `el` phải có chiều cao xác định (engine lấp đầy el).
 */
import { h, esc, icon, vibrate } from '../core/ui.js';
import { ebi, react } from '../core/ebi.js';
import { coach, visual, emptyState } from './common.js';

const TICK = 200;

export function mountQuiz(el, config, { onComplete, onProgress } = {}) {
  const { prompt, timer, variant = 'quiz', questions = [] } = config;
  const total = questions.length;
  if (!total) return emptyState(el);

  const detective = variant === 'detective';
  const root = h('div', { class: `eng eng-quiz ${detective ? 'is-detective' : ''}` });
  let i = 0;
  let correct = 0;
  let tick = null;

  const stopTimer = () => { clearInterval(tick); tick = null; };

  function startTimer(bar, label, onEnd) {
    const ms = timer * 1000;
    const start = Date.now();
    const update = () => {
      const left = Math.max(0, ms - (Date.now() - start));
      bar.style.setProperty('--p', `${(left / ms) * 100}%`);
      bar.classList.toggle('is-low', left <= ms * 0.25);
      label.textContent = `${Math.ceil(left / 1000)} giây`;
      if (left <= 0) { stopTimer(); onEnd(); }
    };
    tick = setInterval(update, TICK);
    update();
  }

  function render(focusFirst) {
    stopTimer();
    const q = questions[i];
    let answered = false;

    const bar = h('div', { class: 'progress quiz-bar', 'aria-hidden': 'true' }, h('span'));
    const secs = h('span', { class: 'quiz-secs' });
    const head = h('div', { class: 'quiz-head' },
      h('span', { class: 'chip chip-sun' }, `${detective ? 'Vòng' : 'Câu'} ${i + 1}/${total}`),
      timer ? bar : null,
      timer ? h('span', { class: 'quiz-clock', html: icon('timer', 18) }, secs) : null);

    const line = prompt ? coach(esc(prompt), { pose: detective ? 'think' : 'wave', size: 44 }) : null;
    const pic = q.img ? visual({ img: q.img, label: 'Hình minh hoạ cho câu hỏi' }, 'quiz-pic') : null;
    const title = h('h2', { class: 'quiz-q' }, detective ? 'Câu nào SAI?' : q.q);

    const opts = q.options.map((text, n) => h('button', {
      type: 'button',
      class: 'quiz-opt',
      onclick: () => answer(n),
    }, h('span', { class: 'quiz-letter', 'aria-hidden': 'true' }, 'ABCD'[n] || n + 1), h('span', null, text)));

    const body = h('div', { class: 'quiz-body' },
      line ? line.el : null,
      h('div', { class: 'quiz-ask' }, title, pic),
      h('div', { class: 'quiz-opts' }, opts));
    const foot = h('div', { class: 'quiz-foot' });
    root.replaceChildren(head, body, foot);

    if (timer) startTimer(bar, secs, () => answer(-1));
    if (focusFirst) opts[0].focus();

    function answer(n) {
      if (answered) return;
      answered = true;
      stopTimer();
      const ok = n === q.answer;
      if (ok) correct++; else vibrate();
      line?.el.remove();

      opts.forEach((btn, k) => {
        btn.disabled = true;
        if (k === q.answer) btn.classList.add('is-ok');
        else if (k === n) btn.classList.add('is-bad', 'anim-shake');
        else btn.classList.add('is-out');   // gom chỗ cho khung giải thích
      });

      const verdict = n === -1 ? 'Hết giờ rồi!'
        : ok ? (detective ? 'Bắt đúng câu sai rồi!' : 'Chính xác!')
          : 'Chưa đúng rồi!';
      const face = ebi({ pose: ok ? 'cheer' : 'think', mood: ok ? 'happy' : 'sad', size: 48, still: true });
      const nextBtn = h('button', {
        type: 'button',
        class: 'btn btn-primary quiz-next',
        onclick: (e) => goNext(e.detail === 0),
      }, i + 1 < total ? 'Tiếp' : 'Xem kết quả');

      foot.append(h('div', { class: `quiz-explain anim-pop ${ok ? 'ok' : 'bad'}`, role: 'status' },
        face,
        h('div', null, h('b', { class: 'quiz-verdict' }, verdict), h('p', null, q.explain))));
      foot.append(nextBtn);
      react(face, ok);
      nextBtn.focus({ preventScroll: true });
      onProgress?.({ done: i + 1, total });
    }
  }

  function goNext(byKey) {
    i++;
    if (i < total) render(byKey);
    else onComplete?.({ correct, total });
  }

  el.append(root);
  onProgress?.({ done: 0, total });
  render(false);

  return () => {
    stopTimer();
    root.remove();
  };
}
