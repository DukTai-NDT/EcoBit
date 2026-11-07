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
    fact: 'Mình bật mí nhé! PET không chứa BPA. Chai PET sạch có thể tái chế thành chai mới hoặc sợi vải, nhưng chất lượng nhựa sẽ giảm dần sau mỗi lần tái chế đấy!'
  },
  {
    id: 'hdpe',
    num: 2,
    abbr: 'HDPE',
    name: 'High-density polyethylene',
    vn: 'Nhựa polyethylene mật độ cao',
    color: 'var(--code-hdpe)',
    img: 'code-hdpe',
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
      text: 'Cần được phân loại và xử lý riêng. PVC lẫn vào PET sẽ sinh axit khi gia nhiệt, làm hỏng cả mẻ nhựa tái chế.'
    },
    fact: 'Mình nhắc nhỏ: chỉ một lượng rất ít PVC lẫn vào PET cũng làm hỏng mẻ tái chế vì chúng có nhiệt độ nóng chảy và thành phần hóa học khác nhau!'
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
    object: 'Hộp đựng thức ăn có nắp gài',
    traits: 'Dai, hơi mờ, chịu nhiệt khá tốt (tới khoảng 100–120°C), phù hợp làm hộp thực phẩm và nắp chai.',
    products: [
      'Hộp nhựa đựng thức ăn',
      'Ly nhựa trà sữa dẻo',
      'Ống hút nhựa'
    ],
    recycle: {
      level: 'trung bình',
      text: 'Có thể tái chế thành chậu cây, rổ rá hoặc đồ gia dụng, nhưng cần làm sạch thức ăn thừa trước khi phân loại.'
    },
    fact: 'Nhiều hũ sữa chua cứng giòn ở Việt Nam là nhựa PS số 6 chứ không phải PP số 5. Khi hâm lò vi sóng, bạn nhớ kiểm tra ký hiệu an toàn trên hộp nhé!'
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
      text: 'Xốp PS rất nhẹ, cồng kềnh và thường bám dầu mỡ thức ăn nên hầu như không được thu gom tái chế tại Việt Nam.'
    },
    fact: 'Xốp EPS chứa tới 98% là không khí! Bạn tuyệt đối không nên dùng hộp xốp để đựng đồ ăn đang rất nóng hoặc cho vào lò vi sóng nhé!'
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
    fact: 'Mình bật mí: không phải nhựa số 7 nào cũng chứa BPA! BPA chỉ có thể gặp ở một số nhựa PC cũ, còn nhựa PET số 1 thì hoàn toàn không dùng BPA.'
  }
];