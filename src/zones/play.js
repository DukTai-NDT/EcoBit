// ECO PLAY – khung tạm (PM). Agent phụ trách thay toàn bộ file này.
import { h } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export default {
  id: 'play', title: 'ECO PLAY', short: 'Chơi', icon: 'play',
  mount(el, ctx) {
    el.append(h('div', { class: 'screen-inner center', style: { alignItems: 'center', justifyContent: 'center' } },
      ebi({ pose: 'cheer', size: 180 }),
      h('h1', null, 'ECO PLAY'),
      h('p', { class: 'lead' }, 'Đang xây dựng… tham số: ' + (ctx.params.join(' / ') || '—'))));
  },
};
