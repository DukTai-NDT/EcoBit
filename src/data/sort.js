// ECO SORT – kéo thả đồ vật vào đúng mã nhựa. item.bin = id ô đúng.
// Mục không có ảnh phù hợp → chỉ hiện chữ (không dùng emoji vẽ sai chất liệu – PM-DUYET A4).
export default {
  prompt: 'Mình có 12 món đồ quen thuộc đây! Bạn hãy kéo từng món vào đúng nhóm nhựa nhé!',
  bins: [
    {
      id: 'pet',
      label: 'PET',
      sub: 'Số 1',
      color: 'var(--code-pet)'
    },
    {
      id: 'hdpe',
      label: 'HDPE',
      sub: 'Số 2',
      color: 'var(--code-hdpe)'
    },
    {
      id: 'pp',
      label: 'PP',
      sub: 'Số 5',
      color: 'var(--code-pp)'
    },
    {
      id: 'ps',
      label: 'PS',
      sub: 'Số 6',
      color: 'var(--code-ps)'
    }
  ],
  items: [
    {
      id: 'i1',
      label: 'Chai nước suối trong suốt',
      img: 'code-pet',
      bin: 'pet'
    },
    {
      id: 'i2',
      label: 'Chai nước ngọt có ga',
      img: 'item-soda-bottle',
      bin: 'pet'
    },
    {
      id: 'i3',
      label: 'Chai trà xanh đóng chai',
      bin: 'pet'
    },
    {
      id: 'i4',
      label: 'Can nước giặt vỏ đục',
      img: 'item-detergent',
      bin: 'hdpe'
    },
    {
      id: 'i5',
      label: 'Chai nước tẩy bồn cầu',
      emoji: '🧴',
      bin: 'hdpe'
    },
    {
      id: 'i6',
      label: 'Bình dầu nhớt xe máy',
      bin: 'hdpe'
    },
    {
      id: 'i7',
      label: 'Hộp cơm nhựa nắp gài',
      img: 'item-lunchbox',
      bin: 'pp'
    },
    {
      id: 'i8',
      label: 'Ghế nhựa đúc',
      bin: 'pp'
    },
    {
      id: 'i9',
      label: 'Hộp nhựa hâm lò vi sóng',
      emoji: '🍱',
      bin: 'pp'
    },
    {
      id: 'i10',
      label: 'Hộp cơm xốp trắng',
      img: 'code-ps',
      bin: 'ps'
    },
    {
      id: 'i11',
      label: 'Ly mì xốp',
      img: 'item-foam-cup',
      bin: 'ps'
    },
    {
      id: 'i12',
      label: 'Khay xốp đựng thịt',
      img: 'item-foam-tray',
      bin: 'ps'
    }
  ]
};
