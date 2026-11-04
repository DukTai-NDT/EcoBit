// ECO JOURNEY – khung tạm (PM). Agent phụ trách thay toàn bộ file này.
import { h } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export default {
  id: 'journey', title: 'ECO JOURNEY', short: 'Hành trình', icon: 'journey',
  mount(el, ctx) {
    el.append(h('div', { class: 'screen-inner center', style: { alignItems: 'center', justifyContent: 'center' } },
      ebi({ pose: 'earth', size: 180 }),
      h('h1', null, 'ECO JOURNEY'),
      h('p', { class: 'lead' }, 'Đang xây dựng… tham số: ' + (ctx.params.join(' / ') || '—'))));
  },
};
