# M4 – Nhập nội dung đã duyệt + ảnh mới (Claude Code)

Nhiệm vụ cho Claude Code trong dự án ECObit HUB (CLAUDE.md đã nạp quy tắc chung).
Chạy sau khi PM đã duyệt nội dung từ Gemini/ChatGPT. Người dùng đặt sẵn:
- `content-in/*.js` – các file nội dung đã duyệt (codes.js, sort.js, match.js, facts.js, quiz.js, detective.js, journey.js, lab.js, puzzle.js) và `content-in/CONTENT-REVIEW.md`
- `raw/*.png` – ảnh Nano Banana mới, đã đặt đúng tên theo `docs/agents/images/IMAGE-PROMPTS.md`

## Sở hữu
`src/data/*` (trừ site, stats, timeline, partners, gallery) · `public/img/*` · `docs/CONTENT-REVIEW.md` · `scripts/validate_data.mjs` (tạo mới)

## Việc cần làm
1. Ảnh: `python3 scripts/sticker.py raw/ public/img/` (cần Pillow, numpy, scipy). Mở vài ảnh kết quả xem tách nền có sạch không; ảnh nào lỗi (nền lọt vào trong, mất chi tiết trắng) → ghi vào báo cáo, không tự chỉnh tay.
2. Viết `scripts/validate_data.mjs` (chạy bằng `node scripts/validate_data.mjs`) kiểm tra mọi file `src/data`:
   - đúng schema trong `docs/PLAN.md` mục 2.3–2.4; id không trùng;
   - `answer` nằm trong khoảng `options`; mỗi `item.bin` có trong `bins`; mỗi `img` có file `public/img/<img>.webp`;
   - journey có đúng 5 chặng, `task.engine` thuộc sort/quiz/order/match; quiz đúng 10 câu; detective mỗi vòng đúng 3 nhận định;
   - cảnh báo chuỗi quá dài làm vỡ bố cục: câu hỏi > 140 ký tự, phương án > 90, lời Ebi > 160, fact > 200.
3. Chép nội dung từ `content-in/` vào `src/data/` (giữ comment đầu file), chạy validate tới khi sạch. Chép `CONTENT-REVIEW.md` vào `docs/`.
4. Mở các màn có nhiều chữ nhất ở 360×740 (`python3 scripts/qa_screens.py play/quiz play/detective discover/pet discover/facts`) – nếu chữ thật làm tràn màn, ghi lại route + nội dung gây tràn trong báo cáo (PM sẽ quyết rút gọn nội dung hay chỉnh giao diện).

## Báo cáo cuối
Số mục mỗi file · ảnh đã xử lý (ảnh lỗi) · kết quả validate · các chỗ tràn bố cục.
