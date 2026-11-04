# Agent D – Nội dung & kiến thức (cần web search)

Bạn là Agent D trong dự án ECObit HUB – web giáo dục tái chế nhựa cho **học sinh Việt Nam** (THCS/THPT). **Đọc trước: `docs/agents/RULES.md`, `docs/PLAN.md` (mục 1, 2.3, 2.4), toàn bộ `src/data/*.js` (đang là dữ liệu MẪU – giữ nguyên schema), `src/core/store.js`.**
Ebi là người dẫn chuyện, **không bao giờ bị nghiền** – khi nói về nghiền thì nói "những chiếc chai".

## Sở hữu
`src/data/*` trừ `site.js, stats.js, timeline.js, partners.js, gallery.js` · `docs/CONTENT-REVIEW.md`

Ảnh dùng được (tên không đuôi): `code-pet, code-hdpe, code-pvc, code-ldpe, code-pp, code-ps, code-other, step-1-bottle` (chai trong giỏ), `step-2-flakes` (mảnh + chậu rửa), `step-3-pellets` (hạt), `step-4-yarn` (sợi), `step-5-products` (áo, ba lô, gấu bông). Không có ảnh → dùng `emoji`.

## Việc cần làm
1. **codes.js** – rà soát 7 mã (giữ trường). Tránh lỗi bản phác thảo của khách: mã 3 là **PVC** (không phải PC); LDPE = Low-density polyethylene; **PET không chứa BPA**; PP không phải "nhựa số 4"; không khuyên dùng hộp xốp PS đựng đồ ăn nóng/lâu.
   ⚠️ Đã phát hiện: nhiều hũ sữa chua ở Việt Nam (VD Vinamilk) là **PS**, không phải PP → mọi ví dụ phải là vật có loại nhựa phổ biến rõ ràng ở VN.
2. **facts.js** – ≥16 thẻ "Bạn có biết?" (≤200 ký tự, có `tag`).
3. **quiz.js** – `timer: 20`, đúng 10 câu, 4 phương án, đáp án đúng phân bố đều vị trí, `explain` 1–2 câu.
4. **sort.js** – 4 ô PET/HDPE/PP/PS, 12 vật quen thuộc (3 vật/ô).
5. **match.js** – đủ 7 cặp mã ↔ sản phẩm điển hình, `right.img` = `code-*`.
6. **puzzle.js** – 5–6 bước chai PET → sản phẩm, nhãn ≤8 từ, dùng ảnh step-*.
7. **detective.js** – 6 vòng × 3 nhận định, đúng 1 câu SAI (`answer` = chỉ số câu sai), `explain` nói vì sao sai + câu đúng. Lồng ngộ nhận: PET có BPA; tam giác số = chắc chắn tái chế được; hộp xốp đựng đồ nóng an toàn; nhựa tái chế vô hạn lần; túi ni lông tự phân huỷ nhanh…
8. **journey.js** – `intro`, `finale`, 5 chặng đúng brief:
   1 "Chuyện gì xảy ra sau khi sử dụng?" · 2 "Đi tìm đúng nơi" (thu gom, phân loại – **engine `sort`**, ~6 vật vào 2–3 ô) · 3 "Bí mật bên trong nhà máy" (làm sạch, nghiền – gợi ý `order`) · 4 "Cuộc biến đổi kỳ diệu" (mảnh → hạt → sợi – `quiz` 2 câu hoặc `match`) · 5 "Một vòng đời mới" (sản phẩm – `quiz`/`sort`).
   Mỗi chặng: `id, title, scene (ảnh step-*), piece (tên mảnh ghép), lines (3–4 câu Ebi, ≤160 ký tự), task {engine, config}` (config đúng schema engine PLAN 2.3) + `learn` (1–2 câu chốt kiến thức).
9. **lab.js** – `disclaimer`; `steps` TN1 "Tự tay tái chế chai PET" 5 bước (chọn nguyên liệu – `steps[0].choices`: ~6 vật `{id,label,img|emoji,isPet,why}`; phân loại vào khu PET; làm sạch & nghiền; tạo nguyên liệu; chọn sản phẩm), mỗi step `{id,title,text,ebi,img?}`; `products` 4 cái (áo polyester, ba lô, gấu bông, nội thất – VD vải bọc ghế/thảm) `{id,label,img?,emoji,fact}`; `slider.frames` 3–4 khung có `label` + `caption`.
   Không đưa con số kiểu "X chai = 1 áo" nếu không có nguồn tin cậy.
10. **docs/CONTENT-REVIEW.md** – bảng: file · mục · nhận định · nguồn tham khảo · cần khách xác nhận? + danh sách đã sửa trong codes.js.

## Chất lượng
- Kiểm chứng mọi con số/nhận định không hiển nhiên bằng nguồn uy tín (EPA, hiệp hội tái chế, tổ chức môi trường, báo khoa học). Thà bỏ con số còn hơn sai.
- Tiếng Việt chuẩn, câu ngắn, ngoặc kép “ ”, không doạ dẫm.
- Mỗi file `export default …` hợp lệ. Kiểm tra: `node -e "import('./src/data/quiz.js').then(m=>console.log(m.default.questions.length))"`; kiểm tra `answer` trong khoảng, `bin` tồn tại, id không trùng.
