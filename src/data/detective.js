// ECO DETECTIVE – mỗi vòng có vài nhận định, tìm câu SAI. answer = chỉ số câu sai.
export default {
  prompt: 'Thám tử nhựa ơi, câu nào dưới đây là SAI?',
  questions: [
    { q: 'Vòng 1', options: [
        'Chai PET có thể tái chế thành sợi polyester.',
        'Nhựa PET chứa BPA.',
        'Hộp xốp là nhựa số 6.',
      ], answer: 1,
      explain: 'Sai! BPA liên quan tới nhựa polycarbonate (nhóm số 7), không phải PET.' },
  ],
};
