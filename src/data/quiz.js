// ECO QUIZ – trắc nghiệm có giờ. answer = chỉ số đáp án đúng (0-based). 10 câu.
export default {
  timer: 20,
  questions: [
    {
      q: 'Chai nước khoáng và nước ngọt trong suốt thường làm từ loại nhựa nào?',
      img: 'item-soda-bottle',
      options: [
        'Nhựa PET (mã số 1)',
        'Nhựa PVC (mã số 3)',
        'Nhựa PS (mã số 6)',
        'Nhựa LDPE (mã số 4)',
      ],
      answer: 0,
      explain: 'PET (số 1) thường được dùng làm chai nước giải khát. Mình cũng là một chai PET đấy bạn!',
    },
    {
      q: 'Dưới đáy can nước giặt có ghi mã số 2. Con số này cho biết can làm từ loại nhựa nào?',
      img: 'item-detergent',
      options: [
        'Nhựa Polyvinyl chloride (PVC)',
        'Nhựa Polyethylene mật độ cao (HDPE)',
        'Nhựa Polystyrene (PS)',
        'Nhựa Polyethylene terephthalate (PET)',
      ],
      answer: 1,
      explain: 'HDPE là polyethylene mật độ cao, mang mã số 2. Loại nhựa này thường làm chai dầu gội, can nước giặt.',
    },
    {
      q: 'Nhóm đồ vật nào thường được làm từ nhựa PS (số 6)?',
      options: [
        'Ống nước cứng và khung cửa nhựa',
        'Hộp đựng thức ăn có nắp gài',
        'Khay xốp và hộp xốp đựng thức ăn',
        'Can nước giặt và chai nước tẩy',
      ],
      answer: 2,
      explain: 'Hộp xốp thường làm từ PS dạng xốp. Một số hũ sữa chua cũng bằng PS, nhưng có loại làm từ PP.',
    },
    {
      q: 'Đâu là một trình tự đúng để tái chế chai PET thành sợi polyester?',
      img: 'step-2-flakes',
      options: [
        'Kéo sợi, thu gom, băm mảnh rồi rửa',
        'Băm mảnh, kéo sợi, thu gom rồi rửa',
        'Tạo hạt, thu gom, dệt áo rồi băm mảnh',
        'Thu gom, băm và rửa, tạo hạt, kéo sợi',
      ],
      answer: 3,
      explain: 'Thu gom, băm và rửa, tạo hạt rồi kéo sợi là một quy trình phổ biến. Những chiếc chai được phân loại, băm và rửa trước khi tạo nguyên liệu để kéo sợi.',
    },
    {
      q: 'Vì sao nên đổ hết nước thừa và làm sạch cặn trong chai trước khi phân loại?',
      img: 'step-1-bottle',
      options: [
        'Chai sạch giúp khâu tái chế dễ hơn',
        'Giúp chai tự phân hủy sinh học nhanh hơn',
        'Biến chai thành hạt nhựa ngay tại nhà',
        'Làm chai nặng hơn để xe chở dễ hơn',
      ],
      answer: 0,
      explain: 'Chai ít cặn bẩn sẽ thuận lợi cho thu gom và xử lý. Bạn nhớ để chai ráo nước nhé!',
    },
    {
      q: 'Trong bể nước, nhà máy có thể tách mảnh nắp PP/HDPE khỏi mảnh thân chai PET thế nào?',
      emoji: '🧪',
      options: [
        'Dùng nam châm hút mảnh nắp nhựa',
        'PET chìm, nắp PP/HDPE nổi',
        'Đốt cháy mảnh nắp để loại bỏ',
        'Dùng kính hiển vi gắp từng mảnh',
      ],
      answer: 1,
      explain: 'Mảnh PET thường chìm trong nước, còn PP và HDPE thường nổi. Nhờ đó, nhà máy có thể tách hai nhóm nhựa.',
    },
    {
      q: 'Hộp nào dưới đây phù hợp nhất để hâm thức ăn trong lò vi sóng?',
      options: [
        'Hộp xốp PS dùng một lần',
        'Túi ni lông mỏng không có nhãn',
        'Hộp PP có nhãn “dùng lò vi sóng”',
        'Hộp PVC không có hướng dẫn sử dụng',
      ],
      answer: 2,
      explain: 'Với hộp nhựa, hãy tìm nhãn cho phép dùng trong lò vi sóng. Chỉ thấy số 5 thôi thì chưa đủ đâu bạn!',
    },
    {
      q: 'Điều nào đúng về việc tái chế cơ học nhựa nhiều lần?',
      img: 'step-3-pellets',
      options: [
        'Có thể lặp vô hạn mà chất lượng không đổi',
        'Lặp hàng trăm lần mà luôn giữ nguyên độ bền',
        'Không có loại nhựa nào nấu chảy lại được',
        'Chất lượng có thể giảm sau nhiều lần gia công',
      ],
      answer: 3,
      explain: 'Nhiệt và quá trình gia công có thể làm nhựa suy giảm chất lượng. Số lần tái chế còn tùy loại nhựa và công nghệ.',
    },
    {
      q: 'Chai nhựa PET đã qua sử dụng có thể được tái chế thành vật liệu nào?',
      options: [
        'Thép không gỉ để làm thìa',
        'Sợi polyester dùng để dệt vải',
        'Thủy tinh nguyên khối để làm cốc',
        'Đất sét tự nhiên để làm gạch',
      ],
      answer: 1,
      explain: 'Những chiếc chai PET có thể được tái chế thành sợi polyester dùng để sản xuất vải và quần áo.',
    },
    {
      q: 'Vì sao ống hút nhựa dùng một lần thường khó được thu gom và tái chế?',
      img: 'item-straws',
      options: [
        'Vì tất cả ống hút đều chứa kim loại nặng',
        'Vì ống hút tự tan ngay trong nước mưa',
        'Vì chúng nhỏ, dễ bẩn và khó phân loại',
        'Vì mọi loại nhựa làm ống hút đều không nóng chảy',
      ],
      answer: 2,
      explain: 'Ống hút rất nhỏ, thường dính đồ uống và khó thu gom riêng. Bạn có thể giảm dùng ống hút một lần nhé!',
    },
  ],
};
