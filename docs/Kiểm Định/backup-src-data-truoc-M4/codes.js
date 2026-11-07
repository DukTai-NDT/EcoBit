// // 7 mã nhựa (Resin Identification Code). Bản nháp – chờ khách duyệt (xem docs/CONTENT-REVIEW.md).
// // recycle.level: 'cao' | 'trung bình' | 'thấp'
// export default [
//   {
//     id: 'pet', num: 1, abbr: 'PET', name: 'Polyethylene terephthalate', vn: 'Nhựa PET',
//     color: 'var(--code-pet)', img: 'code-pet', object: 'Chai nước',
//     traits: 'Trong suốt, nhẹ, bền, ngăn khí và hơi nước tốt nên giữ được ga cho nước ngọt.',
//     products: ['Chai nước suối', 'Chai nước ngọt', 'Hộp, khay trong đựng bánh trái'],
//     recycle: { level: 'cao', text: 'Được thu gom và tái chế nhiều nhất. Có thể thành sợi polyester để may áo, ba lô, nhồi gấu bông, hoặc thành chai mới.' },
//     fact: 'Chai PET sạch, đã phân loại kỹ có thể được tái chế thành chai mới – gọi là tái chế “chai thành chai”.',
//   },
//   {
//     id: 'hdpe', num: 2, abbr: 'HDPE', name: 'High-density polyethylene', vn: 'Polyethylene mật độ cao',
//     color: 'var(--code-hdpe)', img: 'code-hdpe', object: 'Can sữa',
//     traits: 'Đục, cứng cáp, chịu va đập và chịu được nhiều loại hoá chất tẩy rửa.',
//     products: ['Can sữa, can nước', 'Chai dầu gội, nước giặt', 'Nắp chai, thùng nhựa'],
//     recycle: { level: 'cao', text: 'Dễ tái chế. Nhựa HDPE tái chế thường thành ống, thùng rác, chậu cây, ghế công viên.' },
//     fact: 'Chai nước giặt và can sữa trông khác nhau nhưng thường cùng là HDPE – nhựa số 2.',
//   },
//   {
//     id: 'pvc', num: 3, abbr: 'PVC', name: 'Polyvinyl chloride', vn: 'Nhựa PVC',
//     color: 'var(--code-pvc)', img: 'code-pvc', object: 'Ống nước',
//     traits: 'Cứng chắc khi làm ống; trở nên mềm dẻo khi được thêm chất hoá dẻo. Trong thành phần có clo.',
//     products: ['Ống nước, khung cửa', 'Vỏ bọc dây điện', 'Áo mưa, màng bọc mềm'],
//     recycle: { level: 'thấp', text: 'Khó tái chế chung với nhựa khác và không nên đốt vì sinh khí độc. Thường chỉ tái chế riêng ở cơ sở chuyên biệt.' },
//     fact: 'Chỉ một lượng nhỏ PVC lẫn vào mẻ chai PET cũng có thể làm hỏng chất lượng cả mẻ tái chế.',
//   },
//   {
//     id: 'ldpe', num: 4, abbr: 'LDPE', name: 'Low-density polyethylene', vn: 'Polyethylene mật độ thấp',
//     color: 'var(--code-ldpe)', img: 'code-ldpe', object: 'Túi ni lông',
//     traits: 'Mềm, dẻo, nhẹ, kéo giãn được, chống thấm nước.',
//     products: ['Túi ni lông', 'Màng bọc thực phẩm', 'Túi đựng bánh mì, lớp lót bao bì'],
//     recycle: { level: 'thấp', text: 'Có thể tái chế nhưng ít nơi thu gom: túi mỏng nhẹ, dễ bẩn và hay quấn vào máy phân loại.' },
//     fact: 'Túi ni lông nhẹ nên dễ theo gió ra sông, ra biển. Mang túi vải khi đi chợ là cách giảm LDPE đơn giản nhất.',
//   },
//   {
//     id: 'pp', num: 5, abbr: 'PP', name: 'Polypropylene', vn: 'Nhựa PP',
//     color: 'var(--code-pp)', img: 'code-pp', object: 'Cốc nhựa và hộp đựng thức ăn',
//     traits: 'Chịu nhiệt tốt hơn nhiều loại nhựa khác, dai, ít bị nứt khi gập.',
//     products: ['Hộp đựng thức ăn dùng lò vi sóng', 'Nắp chai, ống hút', 'Một số cốc, hũ đựng thực phẩm (xem số dưới đáy)'],
//     recycle: { level: 'trung bình', text: 'Tái chế được thành hộp, chậu, móc treo, chi tiết đồ gia dụng – nhưng tỉ lệ thu gom còn thấp.' },
//     fact: 'Hộp có ghi “dùng được trong lò vi sóng” thường làm từ PP vì loại nhựa này chịu nhiệt tốt.',
//   },
//   {
//     id: 'ps', num: 6, abbr: 'PS', name: 'Polystyrene', vn: 'Nhựa PS (gồm cả xốp)',
//     color: 'var(--code-ps)', img: 'code-ps', object: 'Hộp xốp',
//     traits: 'Dạng cứng: giòn, dễ gãy. Dạng xốp: rất nhẹ, cách nhiệt, chủ yếu là không khí.',
//     products: ['Hộp xốp, ly xốp', 'Khay xốp đựng thịt', 'Dao, thìa, dĩa nhựa dùng một lần'],
//     recycle: { level: 'thấp', text: 'Xốp nhẹ, cồng kềnh, hay dính thức ăn nên chi phí thu gom cao; phần lớn không được tái chế.' },
//     fact: 'Hộp xốp có tới khoảng 95% là không khí. Không nên dùng hộp xốp đựng đồ ăn nóng, nhiều dầu mỡ hay hâm trong lò vi sóng.',
//   },
//   {
//     id: 'other', num: 7, abbr: 'OTHER', name: 'Các loại nhựa khác', vn: 'Nhóm nhựa khác (PC, ABS, PLA, nhựa nhiều lớp…)',
//     color: 'var(--code-other)', img: 'code-other', object: 'Đồ chơi lắp ghép và bình nước cứng',
//     traits: 'Nhóm “còn lại”: nhựa cứng PC, nhựa ABS, nhựa sinh học PLA, bao bì nhiều lớp ghép.',
//     products: ['Bình nước cứng dùng nhiều lần', 'Đồ chơi lắp ghép', 'Gói bim bim nhiều lớp'],
//     recycle: { level: 'thấp', text: 'Rất khó tái chế vì gồm nhiều loại khác nhau hoặc nhiều lớp dính chặt vào nhau.' },
//     fact: 'BPA – chất hay được nhắc tới – liên quan tới nhựa polycarbonate (PC) thuộc nhóm số 7, không phải nhựa PET.',
//   },
// ];
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
    traits: 'Trong suốt, nhẹ, bền và cản khí tốt, phù hợp làm chai nước ngọt có ga.',
    products: [
      'Chai nước suối',
      'Chai nước ngọt có ga',
      'Chai trà xanh đóng chai'
    ],
    recycle: {
      level: 'cao',
      text: 'Chai PET được thu gom khá phổ biến. Khi xử lý đúng, nhựa có thể thành sợi polyester hoặc chai mới.'
    },
    fact: 'Mình bật mí nhé! Chai PET sạch, được xử lý đạt chuẩn có thể trở thành chai mới. PET không sử dụng BPA để sản xuất.'
  },
  {
    id: 'hdpe',
    num: 2,
    abbr: 'HDPE',
    name: 'High-density polyethylene',
    vn: 'Nhựa polyethylene mật độ cao',
    color: 'var(--code-hdpe)',
    img: 'code-hdpe',
    object: 'Can sữa',
    traits: 'Thường có màu đục, cứng cáp, chịu va đập và chịu được nhiều loại hóa chất tẩy rửa.',
    products: [
      'Can sữa',
      'Can nước giặt',
      'Chai đựng nước tẩy'
    ],
    recycle: {
      level: 'cao',
      text: 'Có thể tái chế thành ống, thùng, chậu cây hoặc vật dụng khác. Việc thu gom tùy thuộc địa phương.'
    },
    fact: 'Can nước giặt và chai nước tẩy có thể cùng làm từ HDPE số 2. Bạn hãy xem mã trên bao bì để biết chính xác nhé!'
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
      'Khung cửa nhựa PVC',
      'Vỏ bọc dây điện'
    ],
    recycle: {
      level: 'thấp',
      text: 'Cần được phân loại và xử lý riêng. PVC lẫn vào PET có thể làm giảm chất lượng nhựa tái chế.'
    },
    fact: 'Mình nhắc nhỏ: chỉ một lượng rất ít PVC lẫn vào PET cũng có thể làm giảm chất lượng mẻ tái chế đấy!'
  },
  {
    id: 'ldpe',
    num: 4,
    abbr: 'LDPE',
    name: 'Low-density polyethylene',
    vn: 'Nhựa polyethylene mật độ thấp',
    color: 'var(--code-ldpe)',
    img: 'code-ldpe',
    object: 'Túi ni lông',
    traits: 'Mềm, dẻo, nhẹ, chống thấm nước và thường được dùng làm màng hoặc túi mỏng.',
    products: [
      'Túi ni lông mềm bằng LDPE',
      'Màng bọc bằng LDPE',
      'Túi đựng bánh mì bằng LDPE'
    ],
    recycle: {
      level: 'thấp',
      text: 'Có thể tái chế khi sạch và được thu gom riêng. Túi, màng mỏng dễ mắc vào máy phân loại.'
    },
    fact: 'Mình thích dùng túi nhiều lần để giảm rác thải. Bạn nhớ nhé: không phải túi ni lông nào cũng làm từ LDPE!'
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
    traits: 'Dai, chịu nhiệt khá tốt, phù hợp làm hộp thực phẩm và các bộ phận cần gập mở nhiều lần.',
    products: [
      'Hộp cơm PP có nắp gài',
      'Ly nhựa PP',
      'Ống hút nhựa PP'
    ],
    recycle: {
      level: 'trung bình',
      text: 'Có thể tái chế thành chậu, hộp hoặc đồ gia dụng, nhưng cần được phân loại và có nơi tiếp nhận.'
    },
    fact: 'Mình nhắc bạn: PP số 5 không tự bảo đảm dùng được trong lò vi sóng. Hãy kiểm tra hướng dẫn trên hộp nhé!'
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
    traits: 'Dạng cứng thường giòn, dễ gãy. Dạng xốp EPS rất nhẹ, có khả năng cách nhiệt.',
    products: [
      'Hộp cơm xốp',
      'Ly xốp',
      'Khay xốp đựng thực phẩm'
    ],
    recycle: {
      level: 'thấp',
      text: 'Xốp PS nhẹ, cồng kềnh và thường dính thức ăn nên ít nơi tiếp nhận tái chế.'
    },
    fact: 'Xốp EPS có thể chứa khoảng 98% không khí! Bạn không nên dùng hộp xốp thông thường để hâm nóng thức ăn.'
  },
  {
    id: 'other',
    num: 7,
    abbr: 'OTHER',
    name: 'Các loại nhựa khác',
    vn: 'Nhóm nhựa khác (PC, ABS, PLA…)',
    color: 'var(--code-other)',
    img: 'code-other',
    object: 'Đồ chơi lắp ghép và bình nước cứng',
    traits: 'Gồm nhiều loại nhựa ngoài nhóm 1–6, như PC, ABS, PLA và một số cấu trúc nhựa nhiều lớp.',
    products: [
      'Đồ chơi lắp ghép ABS',
      'Bình nước cứng bằng PC',
      'Một số bao bì nhiều lớp'
    ],
    recycle: {
      level: 'thấp',
      text: 'Khó tái chế chung vì gồm nhiều vật liệu khác nhau. Cần xác định đúng loại nhựa và nơi tiếp nhận.'
    },
    fact: 'Mình bật mí: không phải mọi nhựa số 7 đều chứa BPA. BPA liên quan đến một số loại nhựa như PC, chứ không phải PET!'
  }
];