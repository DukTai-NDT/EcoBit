// 7 mã nhựa (Resin Identification Code). Đã PM duyệt 04/11/2026 – xem docs/CONTENT-REVIEW.md.
// recycle.level: 'cao' | 'trung bình' | 'thấp'
// hdpe.img dùng tạm 'item-detergent' (can nước giặt) vì ảnh code-hdpe vẫn là can sữa kiểu Mỹ (PM-DUYET A7).
export default [
  {
    id: 'pet',
    num: 1,
    abbr: 'PET',
    name: 'Polyethylene terephthalate',
    vn: 'Nhựa PET',
    color: 'var(--code-pet)',
    img: 'code-pet',
    object: 'Chai nước',
    traits: 'Trong suốt, nhẹ, bền và cản khí tốt, phù hợp làm chai nước ngọt có ga, nước suối.',
    products: [
      'Chai nước suối',
      'Chai nước ngọt có ga',
      'Chai trà đóng chai'
    ],
    recycle: {
      level: 'cao',
      text: 'Chai PET được thu gom phổ biến để tái chế thành sợi polyester hoặc chai mới, nhưng không thể tái chế vô hạn lần.'
    },
    fact: 'Mình bật mí nhé! PET không dùng BPA làm nguyên liệu. Chai PET sạch có thể tái chế thành chai mới hoặc sợi vải, nhưng chất lượng nhựa có thể giảm sau nhiều lần tái chế đấy!'
  },
  {
    id: 'hdpe',
    num: 2,
    abbr: 'HDPE',
    name: 'High-density polyethylene',
    vn: 'Nhựa polyethylene mật độ cao',
    color: 'var(--code-hdpe)',
    img: 'item-detergent',
    object: 'Can nước giặt',
    traits: 'Thường có màu đục, cứng cáp, chịu va đập và chịu được nhiều loại hóa chất tẩy rửa.',
    products: [
      'Can nước giặt',
      'Chai dầu gội, sữa tắm',
      'Chai đựng nước tẩy'
    ],
    recycle: {
      level: 'cao',
      text: 'Có thể tái chế thành ống nhựa, thùng rác, chậu cây hoặc chai lọ phi thực phẩm. Việc thu gom tùy thuộc địa phương.'
    },
    fact: 'Can nước giặt và chai dầu gội vỏ đục thường cùng làm từ HDPE số 2. Bạn hãy tìm mã số dưới đáy chai để kiểm chứng nhé!'
  },
  {
    id: 'pvc',
    num: 3,
    abbr: 'PVC',
    name: 'Polyvinyl chloride',
    vn: 'Nhựa PVC',
    color: 'var(--code-pvc)',
    img: 'code-pvc',
    object: 'Ống nước',
    traits: 'Có dạng cứng để làm ống, khung cửa; cũng có dạng mềm khi thêm chất hóa dẻo. Cấu trúc nhựa chứa clo.',
    products: [
      'Ống cấp thoát nước',
      'Khung cửa nhựa',
      'Vỏ bọc dây điện'
    ],
    recycle: {
      level: 'thấp',
      text: 'Cần được phân loại và xử lý riêng. PVC lẫn vào PET có thể sinh axit khi gia nhiệt và làm giảm chất lượng mẻ nhựa tái chế.'
    },
    fact: 'Mình nhắc nhỏ: chỉ một lượng nhỏ PVC lẫn vào PET cũng có thể làm giảm chất lượng mẻ tái chế, vì hai loại nhựa này có thành phần hóa học khác nhau!'
  },
  {
    id: 'ldpe',
    num: 4,
    abbr: 'LDPE',
    name: 'Low-density polyethylene',
    vn: 'Nhựa polyethylene mật độ thấp',
    color: 'var(--code-ldpe)',
    img: 'code-ldpe',
    object: 'Túi ni lông mềm',
    traits: 'Mềm, dẻo, dai, chống thấm nước và thường được dùng làm màng bọc hoặc túi bóng dẻo.',
    products: [
      'Túi ni lông mềm, dẻo',
      'Màng co bọc lốc nước ngọt',
      'Túi zip mềm đựng đồ'
    ],
    recycle: {
      level: 'thấp',
      text: 'Có thể tái chế khi sạch và thu gom riêng, nhưng thực tế ít được nhặt vì nhẹ và dễ kẹt vào máy phân loại.'
    },
    fact: 'Mình thích dùng túi vải nhiều lần để giảm rác. Bạn nhớ nhé: túi bóng cứng sột soạt ngoài chợ thường là HDPE, còn túi mềm dẻo mới là LDPE!'
  },
  {
    id: 'pp',
    num: 5,
    abbr: 'PP',
    name: 'Polypropylene',
    vn: 'Nhựa PP',
    color: 'var(--code-pp)',
    img: 'code-pp',
    object: 'Cốc nhựa và hộp đựng thức ăn có nắp gài',
    traits: 'Dai, hơi mờ, chịu nhiệt khá tốt, phù hợp làm hộp thực phẩm và nắp chai.',
    products: [
      'Hộp nhựa đựng thức ăn',
      'Ly nhựa trà sữa dẻo',
      'Ghế nhựa đúc'
    ],
    recycle: {
      level: 'trung bình',
      text: 'Có thể tái chế thành chậu cây, rổ rá hoặc đồ gia dụng, nhưng cần làm sạch thức ăn thừa trước khi phân loại.'
    },
    fact: 'Mình mách nhỏ: hộp PP chịu nhiệt khá tốt, nhưng muốn hâm lò vi sóng thì bạn vẫn phải tìm dòng chữ cho phép trên hộp. Chỉ thấy số 5 thôi thì chưa đủ đâu!'
  },
  {
    id: 'ps',
    num: 6,
    abbr: 'PS',
    name: 'Polystyrene',
    vn: 'Nhựa PS (gồm cả dạng xốp)',
    color: 'var(--code-ps)',
    img: 'code-ps',
    object: 'Hộp xốp',
    traits: 'Dạng cứng thường trong hoặc trắng, giòn, dễ gãy (như một số hũ sữa chua, muỗng dùng 1 lần). Dạng xốp EPS rất nhẹ, cách nhiệt.',
    products: [
      'Hộp cơm xốp',
      'Khay xốp đựng thực phẩm tươi',
      'Hũ sữa chua nhựa giòn'
    ],
    recycle: {
      level: 'thấp',
      text: 'Xốp PS rất nhẹ, cồng kềnh và thường bám dầu mỡ thức ăn nên ít nơi tiếp nhận tái chế.'
    },
    fact: 'Xốp EPS có hơn 95% là không khí! Bạn tuyệt đối không nên dùng hộp xốp để đựng đồ ăn đang rất nóng hoặc cho vào lò vi sóng nhé!'
  },
  {
    id: 'other',
    num: 7,
    abbr: 'OTHER',
    name: 'Other plastics',
    vn: 'Nhóm nhựa khác (PC, ABS, PLA…)',
    color: 'var(--code-other)',
    img: 'code-other',
    object: 'Đồ chơi lắp ghép và bình nước cứng',
    traits: 'Gồm các loại nhựa ngoài nhóm 1–6 (như PC, ABS, nhựa sinh học PLA) hoặc bao bì màng ghép nhiều lớp.',
    products: [
      'Gạch đồ chơi lắp ghép (ABS)',
      'Bình nước thể thao cứng (PC/Tritan)',
      'Túi bánh kẹo màng ghép nhiều lớp'
    ],
    recycle: {
      level: 'thấp',
      text: 'Rất khó tái chế chung vì pha trộn nhiều loại polymer khác nhau. Cần quy trình thu hồi và xử lý chuyên biệt.'
    },
    fact: 'Mình bật mí: không phải nhựa số 7 nào cũng chứa BPA! BPA liên quan tới nhựa PC thuộc nhóm này. Còn nhựa PET số 1 thì không dùng BPA làm nguyên liệu.'
  }
];
