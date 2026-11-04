# R2 – Gemini: "Bạn có biết?" + ECO QUIZ + ECO DETECTIVE

Dán toàn bộ nội dung dưới đây vào Gemini (dùng chế độ có tìm kiếm / Deep Research nếu có).

---
Bạn là chuyên gia nội dung giáo dục môi trường. Hãy viết nội dung cho 3 file dữ liệu của một website.

## Bối cảnh (đọc kỹ)
Website "ECObit HUB – Thế giới tái chế trong tầm tay" dạy tái chế nhựa cho **học sinh Việt Nam (THCS/THPT)**. Mascot **Ebi** là một chai nhựa nắp xanh, đóng vai người dẫn chuyện – Ebi **không bao giờ bị nghiền**; khi nói về nghiền thì nói "những chiếc chai". Giọng Ebi: xưng "mình", gọi "bạn", vui, ngắn gọn, không doạ dẫm.

## Yêu cầu chung
- **Bật tìm kiếm web.** Kiểm chứng mọi con số và nhận định không hiển nhiên bằng nguồn uy tín (US EPA, Plastics Europe, Ellen MacArthur Foundation, UNEP, WWF, Bộ TN&MT Việt Nam, báo khoa học). Thà bỏ con số còn hơn sai. Không bịa nguồn.
- Ví dụ đồ vật phải **đúng với thị trường Việt Nam** (lưu ý: nhiều hũ sữa chua ở VN như Vinamilk là PS số 6, không phải PP). Chỉ chọn đồ vật mà loại nhựa phổ biến là rõ ràng; vật hay thay đổi loại nhựa thì bỏ.
- Tiếng Việt chuẩn, có dấu, ngoặc kép “ ”. Câu hỏi ≤ 140 ký tự, phương án ≤ 90, lời Ebi ≤ 160, sự thật ≤ 200.
- **Đầu ra bắt buộc**: mỗi file là một khối code JavaScript hoàn chỉnh bắt đầu bằng `export default`, đúng schema bên dưới (giữ nguyên tên trường tiếng Anh), sau đó là **bảng nguồn**: | File | Mục | Nhận định | Nguồn (link) | Mức chắc chắn (cao/vừa/thấp) |.
- Ảnh dùng được (trường `img`, tên không đuôi): code-pet, code-hdpe, code-pvc, code-ldpe, code-pp, code-ps, code-other, step-1-bottle (chai trong giỏ), step-2-flakes (mảnh nhựa + chậu rửa), step-3-pellets (hạt nhựa), step-4-yarn (sợi), step-5-products (áo, ba lô, gấu bông), item-shampoo, item-detergent, item-lunchbox, item-foam-cup, item-foam-tray, item-soda-bottle, item-clear-box, item-straws. Không có ảnh phù hợp → bỏ `img`, dùng `emoji`.

## File 1 – facts.js: ≥ 16 thẻ "Bạn có biết?"
Ngắn, bất ngờ, đúng; trộn chủ đề: ký hiệu mã nhựa, tái chế PET, đại dương, thói quen hằng ngày, vi nhựa, Việt Nam.
```js
export default [
  { id: 'f1', tag: 'PET', text: '…' },   // tag: 'PET' | 'Ký hiệu' | 'Tái chế' | 'Đại dương' | 'Thói quen' | 'Việt Nam' | 'Vi nhựa'
];
```

## File 2 – quiz.js: đúng 10 câu trắc nghiệm có giờ
4 phương án/câu, vị trí đáp án đúng phân bố đều (mỗi vị trí 0–3 dùng 2–3 lần), `answer` là chỉ số (0–3), `explain` 1–2 câu. Trộn: nhận biết mã nhựa, quy trình tái chế, thói quen đúng.
```js
export default {
  timer: 20,
  questions: [
    { q: '…?', options: ['…', '…', '…', '…'], answer: 0, explain: '…' },
  ],
};
```

## File 3 – detective.js: 6 vòng "tìm thông tin SAI"
Mỗi vòng đúng 3 nhận định, trong đó đúng 1 câu SAI; `answer` = chỉ số câu sai; `explain` nói vì sao sai và câu đúng là gì. Lồng các ngộ nhận phổ biến: PET chứa BPA; có tam giác số = chắc chắn tái chế được; hộp xốp đựng đồ nóng an toàn; nhựa tái chế được vô hạn lần; túi ni lông tự phân huỷ nhanh; rửa sạch chai trước khi bỏ là không cần thiết…
```js
export default {
  prompt: 'Thám tử nhựa ơi, câu nào dưới đây là SAI?',
  questions: [
    { q: 'Vòng 1', options: ['…', '…', '…'], answer: 1, explain: '…' },
  ],
};
```
