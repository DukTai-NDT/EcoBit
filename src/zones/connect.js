// ECO CONNECT – khung tạm (PM). Agent phụ trách thay toàn bộ file này.
import { h } from '../core/ui.js';
import { ebi } from '../core/ebi.js';

export default {
  id: 'connect', title: 'ECO CONNECT', short: 'Kết nối', icon: 'connect',
  mount(el, ctx) {
    el.append(h('div', { class: 'screen-inner center', style: { alignItems: 'center', justifyContent: 'center' } },
      ebi({ pose: 'megaphone', size: 180 }),
      h('h1', null, 'ECO CONNECT'),
      h('p', { class: 'lead' }, 'Đang xây dựng… tham số: ' + (ctx.params.join(' / ') || '—'))));
  },
};
