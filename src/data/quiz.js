// ECO QUIZ – trắc nghiệm có giờ. answer = chỉ số đáp án đúng (0-based). (Agent D: 10 câu)
export default {
  timer: 20,
  questions: [
    { q: 'Chai nước suối thường làm từ loại nhựa nào?', options: ['PET (số 1)', 'PVC (số 3)', 'PS (số 6)', 'LDPE (số 4)'], answer: 0,
      explain: 'Chai nước suối, nước ngọt thường là PET – loại nhựa được tái chế nhiều nhất.' },
    { q: 'Hộp xốp đựng cơm thuộc nhóm nhựa nào?', options: ['PP (số 5)', 'PS (số 6)', 'HDPE (số 2)', 'PET (số 1)'], answer: 1,
      explain: 'Hộp xốp là polystyrene dạng xốp – nhựa số 6, rất khó tái chế.' },
  ],
};
