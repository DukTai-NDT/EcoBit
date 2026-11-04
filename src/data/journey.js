// ECO JOURNEY – 5 chặng. task.engine: 'sort' | 'quiz' | 'order' | 'match'; task.config theo schema engine.
// (Agent D viết lời thoại & nhiệm vụ; Agent E dựng màn)
export default {
  intro: 'Theo chân chiếc chai PET qua 5 chặng để thu thập 5 mảnh ghép nhé!',
  finale: 'Tuyệt vời! Bạn đã ghép xong bức tranh vòng đời mới của chiếc chai.',
  stages: [
    { id: 1, title: 'Chuyện gì xảy ra sau khi sử dụng?', scene: 'step-1-bottle', piece: 'Chai đã dùng',
      lines: ['Uống xong rồi, chiếc chai sẽ đi đâu nhỉ?'],
      task: { engine: 'quiz', config: { questions: [{ q: 'Uống xong chai nước, bạn nên làm gì?', options: ['Vứt xuống cống', 'Bỏ vào thùng tái chế', 'Đốt đi'], answer: 1, explain: 'Bỏ đúng nơi để chai được thu gom và tái chế.' }] } } },
  ],
};
