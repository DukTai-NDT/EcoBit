// ECO PASSPORT – khung tạm (PM). Agent phụ trách thay toàn bộ file này.
import { h } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export default {
  id: 'passport', title: 'ECO PASSPORT', short: 'Hộ chiếu', icon: 'passport',
  mount(el, ctx) {
    el.append(h('div', { class: 'screen-inner center', style: { alignItems: 'center', justifyContent: 'center' } },
      ebi({ pose: 'recycle', size: 180 }),
      h('h1', null, 'ECO PASSPORT'),
      h('p', { class: 'lead' }, 'Đang xây dựng… tham số: ' + (ctx.params.join(' / ') || '—'))));
  },
};
