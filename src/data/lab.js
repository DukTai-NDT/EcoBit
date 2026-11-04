// ECO LAB – TN1 tái chế chai PET + TN3 thanh trượt trước/sau. (Agent D viết, Agent E dựng)
export default {
  disclaimer: 'Đây là mô phỏng giáo dục, đã lược bớt nhiều công đoạn so với nhà máy thật.',
  steps: [
    { id: 'choose', title: 'Chọn nguyên liệu', text: 'Chọn những vật làm từ PET.' },
  ],
  products: [
    { id: 'shirt', label: 'Áo polyester', fact: '' },
  ],
  slider: { frames: [
    { img: 'step-1-bottle', label: 'Chai PET' },
    { img: 'step-4-yarn', label: 'Sợi polyester' },
    { img: 'step-5-products', label: 'Sản phẩm mới' },
  ] },
};
