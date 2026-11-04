# M5 – ECO JOURNEY & ECO LAB (Claude Code – sau M1 và M4)

Nhiệm vụ cho Claude Code trong dự án ECObit HUB (CLAUDE.md ở gốc đã nạp sẵn quy tắc chung). **Đọc trước: `docs/PLAN.md`, `src/core/*`, toàn bộ `src/engines/*` (từ M1 – dùng lại, KHÔNG viết engine mới cho kéo thả/trắc nghiệm/sắp xếp), `src/data/{journey,lab}.js` (nội dung thật đã nhập ở M4), `src/zones/play.js` (tham khảo cách gọi engine).**

## Sở hữu
`src/zones/{journey,lab}.js` · `src/styles/zones/{journey,lab}.css` · được chỉnh `src/data/{journey,lab}.js` nếu cần cho khớp engine (ghi lại trong báo cáo)

## 1. ECO JOURNEY
- **`#/journey`** – màn bản đồ hành trình: 5 chặng nối nhau như con đường, mỗi chặng hiện trạng thái (khoá mềm: gợi ý đi theo thứ tự nhưng vẫn cho chọn), **khung tranh 5 mảnh ghép** (mảnh đã nhận hiện, chưa nhận mờ) – lấy `store.state.journey`. Lời Ebi từ `journey.intro`.
- **`#/journey/<1..5>`** – mỗi chặng gồm các bước trong cùng màn (không cuộn):
  1. Hoạt cảnh 2D: ảnh `scene` + Ebi đứng cạnh, lời thoại `lines` hiện lần lượt (bấm "Tiếp" hoặc tự chạy), hiệu ứng CSS nhẹ (ảnh trượt vào, bọt nước, mảnh rơi…).
  2. Nhiệm vụ: gọi engine theo `task.engine` (`mountSort` / `mountQuiz` / `mountOrder` / `mountMatch`) với `task.config`.
  3. Hoàn thành → hiện `learn` + hoạt ảnh **nhận mảnh ghép** bay vào khung tranh → `store.journeyPiece(i)` (i = 0..4) → nút "Chặng tiếp".
- Đủ 5 mảnh → màn **bức tranh vòng đời mới** (ghép 5 ảnh step thành vòng tròn/tranh hoàn chỉnh, `journey.finale`, confetti). Store tự cộng 100đ và mở huy hiệu RECYCLING EXPLORER.

## 2. ECO LAB (kèm dòng ghi chú "mô phỏng giáo dục" = `lab.disclaimer` luôn hiển thị)
- **`#/lab`** – sảnh: TN1 "Tự tay tái chế chai PET", TN3 "Trước & sau" (thẻ TN2 ECO MIX hiện nhãn "Sắp ra mắt").
- **`#/lab/recycle`** – TN1 dạng thanh 5 bước (stepper, mỗi bước một màn):
  1. Chọn nguyên liệu: chạm chọn các vật PET trong `steps[0].choices` (đúng/sai kèm `why`).
  2. Kéo vật PET vào khu PET (dùng `mountSort`).
  3. Làm sạch & nghiền: hoạt ảnh theo bước (bóc nhãn → rửa → nghiền thành mảnh, dùng ảnh step-2) – người chơi bấm/giữ nút để "chạy máy".
  4. Tạo nguyên liệu: mảnh → hạt → sợi (ảnh step-3, step-4) có hoạt ảnh.
  5. Chọn sản phẩm (4 `products`) → hoạt ảnh sản phẩm xuất hiện + `fact`.
  Xong → `store.complete('lab:recycle', {correct, total})` (correct/total từ bước 1–2) → `showResult`. Store tự mở huy hiệu ECO SCIENTIST.
- **`#/lab/slider`** – TN3 thanh trượt trước/sau qua `slider.frames` (Chai PET → sợi → áo/sản phẩm): kéo tay nắm (pointer + bàn phím) chuyển dần giữa các khung, nhãn + caption đổi theo.

## Nghiệm thu
Đi trọn 5 chặng và TN1 bằng cảm ứng ở 360×740; điểm 100đ Journey + 30đ Lab cộng đúng một lần; không màn nào cuộn; không lỗi console.
