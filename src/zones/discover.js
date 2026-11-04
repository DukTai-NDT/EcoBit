// ECO DISCOVER – khung tạm (PM). Agent phụ trách thay toàn bộ file này.
import { h } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export default {
  id: 'discover', title: 'ECO DISCOVER', short: 'Khám phá', icon: 'discover',
  mount(el, ctx) {
    el.append(h('div', { class: 'screen-inner center', style: { alignItems: 'center', justifyContent: 'center' } },
      ebi({ pose: 'thumbs', size: 180 }),
      h('h1', null, 'ECO DISCOVER'),
      h('p', { class: 'lead' }, 'Đang xây dựng… tham số: ' + (ctx.params.join(' / ') || '—'))));
  },
};
