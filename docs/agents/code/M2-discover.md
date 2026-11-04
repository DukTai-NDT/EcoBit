# M2 – ECO DISCOVER (Claude Code)

Nhiệm vụ cho Claude Code trong dự án ECObit HUB (CLAUDE.md ở gốc đã nạp sẵn quy tắc chung). **Đọc trước: `docs/PLAN.md` (mục 0, 1, 2.1–2.4, 5), `src/core/*` (gồm `resin.js` đã có), `src/data/{codes,facts}.js`. Xem 7 ảnh `public/img/code-*.webp`.**

## Sở hữu
`src/zones/discover.js` · `src/styles/zones/discover.css` · `src/core/resin.js` (đã viết sẵn hàm vẽ ký hiệu tam giác mã nhựa – kiểm tra, dùng, chỉnh nếu cần; khu khác cũng sẽ dùng nên giữ API)

## Việc cần làm
1. **`#/discover`** – Ebi chào 1 câu + **lưới 7 thẻ mã nhựa** (ảnh sticker, ký hiệu tam giác, tên viết tắt, màu mã; thẻ đã xem có ✓ theo `store.state.codesViewed`) + 2 lối vào: "Thử thách: Đoán mã nhựa", "Bạn có biết?". Vừa 360×620 (gợi ý điện thoại 2–3 cột thẻ gọn; máy tính 4+3 hoặc 7 cột).
2. **`#/discover/<pet|hdpe|pvc|ldpe|pp|ps|other>`** – thẻ chi tiết: ảnh lớn, ký hiệu, tên đầy đủ + tên tiếng Việt; 4 mục **Đặc điểm / Sản phẩm thường gặp / Khả năng tái chế** (thang trực quan cao–trung bình–thấp) **/ Sự thật thú vị** bằng tab nhỏ trong thẻ (không cuộn); nút ← → sang mã trước/sau; gọi `store.viewCode(id)`.
3. **`#/discover/identify`** – "nhấn đồ vật trong hình để biết loại nhựa": 7 đồ vật sticker bày như một kệ/cảnh; chạm đồ vật → chọn 1 trong 7 nút ký hiệu; đúng → hiện nhãn (`codes[].object`) + 1 câu giải thích, Ebi khen; sai → gợi ý, chọn lại (chỉ tính đúng nếu đúng lần đầu). Xong 7 → `store.complete('discover:identify', {correct, total: 7})` → màn kết quả (dùng `showResult` của `src/engines/result.js` nếu M1 đã xong; chưa có thì tự làm gọn). Đúng cả 7 tự mở huy hiệu PLASTIC DETECTIVE (store lo).
4. **`#/discover/facts`** – thẻ lật "Bạn có biết?": mỗi lần vào chọn ngẫu nhiên (3 thẻ trên điện thoại, 6 trên máy tính, hoặc 1 thẻ lớn + nút "Thẻ khác"), chạm để lật 3D (có phương án reduced-motion), nút đổi bộ thẻ.

Không viết cứng kiến thức trong code – tất cả từ `codes.js`, `facts.js` (nội dung thật nhập ở M4; facts sẽ ≥16 thẻ).

## Nghiệm thu
Chơi trọn thử thách đoán mã bằng cảm ứng ở 360×740; xem đủ 7 thẻ không cuộn; không lỗi console.
