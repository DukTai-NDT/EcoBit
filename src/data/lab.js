// ECO LAB – TN1 tái chế chai PET + TN3 thanh trượt trước/sau. (Agent D viết, Agent E dựng)
export default {
  disclaimer: 'Đây là mô phỏng giáo dục về một quy trình tái chế PET. Nhà máy thực tế có thể dùng những công đoạn và thiết bị khác nhau.',
  steps: [
    {
      id: 'choose',
      title: 'Chọn nguyên liệu',
      text: 'Hãy chọn các món đồ có ghi mã nhựa PET số 1. Đừng chỉ đoán chất liệu bằng màu sắc hay độ trong suốt!',
      ebi: 'Mình là Ebi! Bạn hãy xem ký hiệu nhựa trên từng món rồi chọn đúng nguyên liệu PET nhé!',
      choices: [
        {
          id: 'c1',
          label: 'Chai nước suối ghi PET 1',
          img: 'code-pet',
          isPet: true,
          why: 'Đúng rồi! Mã PET 1 cho biết thân chai làm từ polyethylene terephthalate. Việc thu gom còn tùy nơi tiếp nhận.'
        },
        {
          id: 'c2',
          label: 'Chai nước ngọt ghi PET 1',
          img: 'item-soda-bottle',
          isPet: true,
          why: 'Chính xác! PET số 1 thường được dùng làm thân chai nước ngọt có ga.'
        },
        {
          id: 'c3',
          label: 'Hộp trái cây có mã PET 1',
          img: 'item-clear-box',
          isPet: true,
          why: 'Đúng! Hộp này có ghi PET 1. Hộp trong suốt khác có thể làm từ loại nhựa khác, nên hãy đọc ký hiệu.'
        },
        {
          id: 'c4',
          label: 'Can nước giặt ghi HDPE 2',
          img: 'item-detergent',
          isPet: false,
          why: 'Đây là HDPE số 2, không phải PET. Nếu được tiếp nhận để tái chế, nó cần được phân loại phù hợp.'
        },
        {
          id: 'c5',
          label: 'Khay xốp ghi PS 6',
          img: 'item-foam-tray',
          isPet: false,
          why: 'Đây là PS số 6, không phải PET. Cục An toàn thực phẩm khuyên không dùng hộp xốp PS đựng thức ăn đang nóng.'
        },
        {
          id: 'c6',
          label: 'Hộp đựng cơm ghi PP 5',
          img: 'item-lunchbox',
          isPet: false,
          why: 'Đây là PP số 5, không phải PET. Muốn hâm bằng lò vi sóng, vẫn cần xem nhãn hướng dẫn của hộp.'
        }
      ]
    },
    {
      id: 'sort',
      title: 'Đưa vào khu PET',
      text: 'Những món có mã PET 1 được tập hợp để kiểm tra, phân loại và loại bớt nhãn, tạp chất.',
      ebi: 'Giỏi lắm! Mình sẽ đứng ngoài quan sát, còn những chiếc chai PET được đưa vào khu sơ chế nhé!',
      bins: [
        { id: 'pet', label: 'Khu PET', sub: 'Mã số 1', color: 'var(--code-pet)' },
        { id: 'other', label: 'Để riêng', sub: 'Mã khác', color: 'var(--sand-200)' }
      ]
    },
    {
      id: 'wash',
      title: 'Băm và rửa mảnh nhựa',
      text: 'Những chiếc chai được băm thành mảnh rồi rửa. Trong bể nước, mảnh PET thường chìm, còn PP/HDPE từ nắp thường nổi.',
      ebi: 'Bạn thấy không? Những mảnh PET chìm, còn mảnh nhựa từ nắp thường nổi. Mình chỉ đứng xem thôi!',
      img: 'lab-shredder',
      phases: [
        { img: 'lab-shredder', label: 'Băm thành mảnh', from: 'step-1-bottle', to: 'step-2-flakes', fx: 'flake' },
        { img: 'lab-wash', label: 'Rửa mảnh nhựa', from: 'step-2-flakes', to: 'step-2-flakes', fx: 'bubble' }
      ]
    },
    {
      id: 'make',
      title: 'Tạo nguyên liệu mới',
      text: 'Mảnh PET sạch, khô được nấu chảy và lọc. Trong mô phỏng này, nhựa được tạo thành hạt rPET rồi dùng để kéo sợi.',
      ebi: 'Những chiếc chai cũ đã thành nguyên liệu mới rồi! Có dây chuyền tạo hạt trước, có dây chuyền kéo sợi từ mảnh PET sạch.',
      img: 'lab-extruder',
      phases: [
        { img: 'lab-extruder', label: 'Tạo hạt rPET', from: 'step-2-flakes', to: 'step-3-pellets', fx: 'pellet' },
        { img: 'lab-extruder', label: 'Kéo sợi polyester', from: 'step-3-pellets', to: 'step-4-yarn', fx: 'thread' }
      ]
    },
    {
      id: 'product',
      title: 'Chọn sản phẩm',
      text: 'Sợi polyester tái chế có thể làm vải và bông nhồi. Hạt rPET cũng có thể được dùng để sản xuất những vật dụng phù hợp.',
      ebi: 'Đến gian sản phẩm rồi! Bạn hãy chọn món mình thích để khám phá công dụng của nhựa PET tái chế nhé!'
    }
  ],
  products: [
    {
      id: 'shirt',
      label: 'Áo polyester',
      emoji: '👕',
      img: 'step-5-products',
      fact: 'Một số áo được dệt từ sợi polyester tái chế từ chai PET. Số chai cần dùng thay đổi theo khối lượng chai, kích thước áo và thành phần vải.'
    },
    {
      id: 'backpack',
      label: 'Ba lô đi học',
      emoji: '🎒',
      img: 'step-5-products',
      fact: 'Vải polyester tái chế từ PET có thể được dùng để may ba lô và túi xách. Độ bền của sản phẩm còn phụ thuộc cấu trúc vải và cách may.'
    },
    {
      id: 'plushie',
      label: 'Gấu bông',
      emoji: '🧸',
      img: 'step-5-products',
      fact: 'Xơ polyester tái chế có thể dùng làm vật liệu nhồi gấu bông hoặc gối. Không phải mọi con gấu bông đều dùng loại xơ này.'
    },
    {
      id: 'interior',
      label: 'Vải bọc ghế và thảm',
      emoji: '🛋️',
      img: 'step-5-products',
      fact: 'Sợi polyester tái chế có thể dùng trong một số loại thảm và vải bọc ghế. Tính năng sản phẩm còn tùy cách dệt và xử lý vải.'
    }
  ],
  slider: {
    frames: [
      {
        img: 'step-1-bottle',
        label: 'Chai PET',
        caption: 'Những chiếc chai PET đã dùng được thu gom, phân loại và loại bớt tạp chất.'
      },
      {
        img: 'step-3-pellets',
        label: 'Hạt rPET',
        caption: 'Trong quy trình minh họa, mảnh PET sạch được sấy khô, nấu chảy, lọc rồi cắt thành hạt rPET.'
      },
      {
        img: 'step-4-yarn',
        label: 'Sợi polyester',
        caption: 'Hạt rPET được nấu chảy rồi đưa qua lỗ khuôn nhỏ để tạo sợi polyester.'
      },
      {
        img: 'step-5-products',
        label: 'Sản phẩm mới',
        caption: 'Sợi polyester tái chế có thể dùng làm áo, vải ba lô, xơ nhồi hoặc vải nội thất.'
      }
    ]
  }
};
