// ECO MATCH – ghép mã nhựa với sản phẩm tiêu biểu.
export default {
  prompt: 'Mình thử tài quan sát của bạn nhé! Chạm một mã nhựa rồi chọn sản phẩm tương ứng.',
  pairs: [
    {
      id: 'pet',
      left: {
        label: 'PET · số 1'
      },
      right: {
        label: 'Chai dầu ăn trong suốt'
      }
    },
    {
      id: 'hdpe',
      left: {
        label: 'HDPE · số 2'
      },
      right: {
        label: 'Can nước giặt vỏ đục',
        img: 'item-detergent'
      }
    },
    {
      id: 'pvc',
      left: {
        label: 'PVC · số 3'
      },
      right: {
        label: 'Ống dẫn nước sinh hoạt cứng',
        img: 'code-pvc'
      }
    },
    {
      id: 'ldpe',
      left: {
        label: 'LDPE · số 4'
      },
      right: {
        label: 'Màng bọc co và túi bóng dẻo',
        img: 'code-ldpe'
      }
    },
    {
      id: 'pp',
      left: {
        label: 'PP · số 5'
      },
      right: {
        label: 'Hộp đựng thức ăn có nắp gài',
        img: 'code-pp'
      }
    },
    {
      id: 'ps',
      left: {
        label: 'PS · số 6'
      },
      right: {
        label: 'Thùng xốp giữ lạnh',
        emoji: '🧊'
      }
    },
    {
      id: 'other',
      left: {
        label: 'OTHER · số 7'
      },
      right: {
        label: 'Gạch đồ chơi lắp ghép cứng',
        emoji: '🧩'
      }
    }
  ]
};
