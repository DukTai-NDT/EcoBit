export default {
  prompt: 'Thám tử nhựa ơi, câu nào dưới đây là SAI?',
  questions: [
    {
      q: 'Vòng 1: Hồ sơ chai nước PET (số 1)',
      img: 'item-soda-bottle',
      options: [
        'PET (số 1) thường được dùng làm chai nước giải khát.',
        'BPA là nguyên liệu bắt buộc để sản xuất nhựa PET.',
        'Chai PET đã dùng có thể tái chế thành sợi polyester.',
      ],
      answer: 1,
      explain: 'Bắt được lỗi rồi! BPA không phải nguyên liệu sản xuất PET. Một số chai có thể có vết BPA do nhiễm bẩn từ nguồn khác.',
    },
    {
      q: 'Vòng 2: Giải mã con số trên đồ nhựa',
      img: 'code-pet',
      options: [
        'Hễ có mã nhựa từ 1 đến 7 thì chắc chắn được tái chế.',
        'Mã số nhựa cho biết loại vật liệu nhựa của sản phẩm.',
        'Khả năng tái chế còn tùy sản phẩm và nơi thu gom.',
      ],
      answer: 0,
      explain: 'Đúng! Mã số cho biết loại nhựa, không bảo đảm món đồ sẽ được tái chế. Bạn cần xem nơi thu gom có tiếp nhận không.',
    },
    {
      q: 'Vòng 3: Bí mật của hộp xốp đựng cơm',
      img: 'item-foam-tray',
      options: [
        'Hộp xốp đựng cơm thường làm từ nhựa PS dạng xốp.',
        'Hộp xốp cồng kềnh nên thường khó được thu gom tái chế.',
        'Hộp xốp PS rất thích hợp để đựng canh đang sôi.',
      ],
      answer: 2,
      explain: 'Đúng, câu đó sai! Cục An toàn thực phẩm khuyên không đựng nước sôi hay thức ăn đang nóng trong hộp xốp PS.',
    },
    {
      q: 'Vòng 4: Nhựa tái chế có giới hạn không?',
      img: 'step-3-pellets',
      options: [
        'Tái chế cơ học thường cần phân loại và làm sạch nhựa.',
        'Nhựa có thể nấu chảy vô hạn lần mà chất lượng không đổi.',
        'Gia công lặp lại có thể làm giảm chất lượng nhựa.',
      ],
      answer: 1,
      explain: 'Bạn tìm đúng rồi! Nhiệt và quá trình gia công có thể làm chất lượng nhựa suy giảm sau nhiều lần tái chế.',
    },
    {
      q: 'Vòng 5: Hành trình của túi ni lông',
      emoji: '🛍️',
      options: [
        'Túi ni lông thông thường tự biến mất hoàn toàn sau vài tháng.',
        'Túi ni lông có thể vỡ thành các mảnh nhựa nhỏ ngoài môi trường.',
        'Dùng lại túi sẵn có giúp giảm nhu cầu lấy túi mới.',
      ],
      answer: 0,
      explain: 'Đúng! Túi ni lông thông thường không tự biến mất nhanh. Chúng có thể tồn tại lâu và vỡ thành những mảnh nhựa nhỏ.',
    },
    {
      q: 'Vòng 6: Chuẩn bị chai trước khi tái chế',
      img: 'step-1-bottle',
      options: [
        'Nên đổ hết đồ uống còn lại trước khi thu gom chai.',
        'Nên làm theo hướng dẫn phân loại của điểm thu gom.',
        'Cứ để nguyên thức ăn thừa trong chai vì càng bẩn càng dễ tái chế.',
      ],
      answer: 2,
      explain: 'Chính xác! Thức ăn thừa và cặn bẩn gây khó khăn cho khâu xử lý. Bạn hãy đổ cạn, tráng sơ khi cần và để chai ráo nhé!',
    },
  ],
};
