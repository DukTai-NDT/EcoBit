# Agent A – Engine tương tác & ECO PLAY

Bạn là Agent A trong dự án ECObit HUB. **Đọc trước: `docs/agents/RULES.md`, `docs/PLAN.md` (mục 0, 2.1–2.4, 5), `src/core/*`, `src/data/{sort,match,puzzle,quiz,detective}.js`.**

## Sở hữu (chỉ sửa các file này)
`src/engines/*` (tạo mới) · `src/zones/play.js` · `src/styles/zones/play.css` · `src/styles/engines.css` (đã được index.html nạp sẵn)

## 1. Engine dùng chung – `src/engines/`
Agent E sẽ dùng lại ở ECO JOURNEY và ECO LAB, nên API phải sạch, có JSDoc ở đầu file, không phụ thuộc play.js.
Chữ ký chung: `export function mountX(el, config, { onComplete, onProgress }) → cleanup()`; `onComplete({ correct, total })`.

| File | Hàm | Config | Hành vi bắt buộc |
|---|---|---|---|
| `drag.js` | tiện ích | — | Kéo bằng Pointer Events (`touch-action:none` trên vật, bóng vật theo ngón tay, tô sáng ô đích qua `elementFromPoint`) **+ chạm-để-chọn** (chạm vật → chạm ô) **+ bàn phím** (Enter/Space) |
| `sort.js` | `mountSort` | `{ prompt, bins:[{id,label,sub?,color?}], items:[{id,label,img?,emoji?,bin}] }` | Hiện **từng vật một** (xấp thẻ giữa màn, đếm 3/12), 2–5 ô nhóm xung quanh/bên dưới. Thả sai → rung, quay về, Ebi gợi ý. "Đúng" = đúng ngay lần đầu |
| `quiz.js` | `mountQuiz` | `{ prompt?, timer?, variant?: 'quiz'\|'detective', questions:[{q,options,answer,explain,img?}] }` | 1 câu/màn, 2–4 nút lớn; timer = thanh đếm ngược, hết giờ = sai; chọn xong tô đúng/sai + khung giải thích + nút "Tiếp". `detective`: tiêu đề "Câu nào SAI?", phương án là nhận định dài |
| `match.js` | `mountMatch` | `{ prompt, pairs:[{id,left:{label,img?},right:{label,img?}}] }` | 2 cột (phải đã xáo), chạm trái rồi phải; đúng → khoá cùng màu; sai → rung. 7 cặp vẫn vừa 620px cao |
| `order.js` | `mountOrder` | `{ prompt, items:[{id,label,img?}] }` (mảng = thứ tự đúng) | Ô trống đánh số + kho thẻ đã xáo; chạm thẻ → vào ô trống kế; chạm thẻ trong ô → trả về; đủ ô → "Kiểm tra" tô đúng/sai từng vị trí, cho sửa tới khi đúng. `correct` = số vị trí đúng ở lần kiểm tra **đầu** |
| `result.js` | `showResult(el, {title, correct, total, gained, perfect, onReplay, onNext, nextLabel})` | — | Ebi reo vui / động viên, 1–3 sao theo tỉ lệ, "+N ECO POINT" hoặc "Bạn đã nhận điểm trò này rồi", `confetti()` khi đúng hết |

Phản hồi: `vibrate()` khi sai, màu `--ok`/`--bad`, hoạt ảnh ngắn. Code phải chạy với số mục bất kỳ (dữ liệu hiện là mẫu, Agent D đang viết bản đầy đủ cùng schema).

## 2. Khu ECO PLAY – `src/zones/play.js`
- `#/play` – sảnh 5 thẻ: ECO SORT, ECO MATCH, ECO PUZZLE, ECO QUIZ, ECO DETECTIVE. Mỗi thẻ: tên, 1 dòng mô tả, biểu tượng, trạng thái (chưa chơi / đã xong / đúng hết ⭐ – đọc `store.state.activities['play:<id>']`), điểm có thể nhận. Dải nhỏ giải thích ECO POINT: 20đ/trò lần đầu, +10 nếu đúng hết, 100đ khi xong Journey; điểm mở khoá huy hiệu và hình nền Ebi; không đổi quà. **Tất cả vừa 360×620.**
- `#/play/<sort|match|puzzle|quiz|detective>` – thanh đầu (`backBtn('/play')`, tên trò, tiến độ) + engine với dữ liệu tương ứng. Xong → `store.complete('play:<id>', {correct,total})` → `showResult`; nút "Trò tiếp theo" đi tới trò chưa xong kế tiếp (`ctx.go`).
- Quiz dùng `quiz.timer` từ dữ liệu; Detective dùng `mountQuiz` với `variant:'detective'`.

## Nghiệm thu
Chơi trọn cả 5 trò bằng chuột **và** bằng cảm ứng ở 360×740; điểm cộng đúng quy tắc và không cộng lần 2 khi chơi lại; không màn nào cuộn; không lỗi console.

## Báo cáo cuối
File · **API từng engine (chữ ký + config) cho Agent E** · đã test · tồn đọng · đề xuất.
