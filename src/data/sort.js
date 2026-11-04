// ECO SORT – kéo vật vào đúng nhóm nhựa. item.bin = id của bin. (Agent D: 10–12 vật, 4 nhóm)
export default {
  prompt: 'Kéo từng món đồ vào đúng nhóm nhựa nhé!',
  bins: [
    { id: 'pet', label: 'PET', sub: 'Số 1', color: 'var(--code-pet)' },
    { id: 'hdpe', label: 'HDPE', sub: 'Số 2', color: 'var(--code-hdpe)' },
    { id: 'pp', label: 'PP', sub: 'Số 5', color: 'var(--code-pp)' },
    { id: 'ps', label: 'PS', sub: 'Số 6', color: 'var(--code-ps)' },
  ],
  items: [
    { id: 'i1', label: 'Chai nước suối', emoji: '🧴', img: 'code-pet', bin: 'pet' },
    { id: 'i2', label: 'Can sữa', img: 'code-hdpe', bin: 'hdpe' },
    { id: 'i3', label: 'Hộp cơm dùng lò vi sóng', bin: 'pp', emoji: '🍱' },
    { id: 'i4', label: 'Hộp xốp', img: 'code-ps', bin: 'ps' },
  ],
};
