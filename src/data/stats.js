// Số liệu chiến dịch ĐÃ XÁC MINH. value = null → hiển thị "Đang cập nhật". Dev sửa trực tiếp.
export default {
  updatedAt: null,          // ví dụ '2026-11-21'
  source: 'Ban tổ chức chiến dịch ECObit',
  items: [
    { id: 'participants', label: 'Lượt tham gia', value: null, unit: 'lượt', icon: '🙋', home: true },
    { id: 'bottles', label: 'Chai nhựa thu gom', value: null, unit: 'chai', icon: '🧴', home: true },
    { id: 'challenges', label: 'Lượt hoàn thành thử thách', value: null, unit: 'lượt', icon: '🏅', home: true },
    { id: 'checkins', label: 'Lượt check-in tại trạm', value: null, unit: 'lượt', icon: '📍' },
    { id: 'plays', label: 'Lượt chơi minigame', value: null, unit: 'lượt', icon: '🎮' },
    { id: 'weight', label: 'Khối lượng nhựa', value: null, unit: 'kg', icon: '⚖️' },
    { id: 'feedback', label: 'Lượt phản hồi', value: null, unit: 'lượt', icon: '💬' },
  ],
};
