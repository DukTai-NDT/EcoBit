# R3 – ChatGPT: lời thoại ECO JOURNEY + ECO LAB + ECO PUZZLE

Dán toàn bộ nội dung dưới đây vào ChatGPT (bật Search).

---
Bạn là biên kịch nội dung giáo dục cho học sinh. Hãy viết nội dung cho 3 file dữ liệu của một website.

## Bối cảnh (đọc kỹ)
Website "ECObit HUB – Thế giới tái chế trong tầm tay" dạy tái chế nhựa cho **học sinh Việt Nam (THCS/THPT)**. Mascot **Ebi** là một chai nhựa nắp xanh, đóng vai người dẫn chuyện – Ebi **không bao giờ bị nghiền**; khi nói về nghiền thì nói "những chiếc chai". Giọng Ebi: xưng "mình", gọi "bạn", vui, ngắn gọn, không doạ dẫm.

## Yêu cầu chung
- **Bật tìm kiếm web.** Kiểm chứng mọi con số và nhận định không hiển nhiên bằng nguồn uy tín (US EPA, Plastics Europe, Ellen MacArthur Foundation, UNEP, WWF, Bộ TN&MT Việt Nam, báo khoa học). Thà bỏ con số còn hơn sai. Không bịa nguồn.
- Ví dụ đồ vật phải **đúng với thị trường Việt Nam** (lưu ý: nhiều hũ sữa chua ở VN như Vinamilk là PS số 6, không phải PP). Chỉ chọn đồ vật mà loại nhựa phổ biến là rõ ràng; vật hay thay đổi loại nhựa thì bỏ.
- Tiếng Việt chuẩn, có dấu, ngoặc kép “ ”. Câu hỏi ≤ 140 ký tự, phương án ≤ 90, lời Ebi ≤ 160, sự thật ≤ 200.
- **Đầu ra bắt buộc**: mỗi file là một khối code JavaScript hoàn chỉnh bắt đầu bằng `export default`, đúng schema bên dưới (giữ nguyên tên trường tiếng Anh), sau đó là **bảng nguồn**: | File | Mục | Nhận định | Nguồn (link) | Mức chắc chắn (cao/vừa/thấp) |.
- Ảnh dùng được (trường `img`, tên không đuôi): code-pet, code-hdpe, code-pvc, code-ldpe, code-pp, code-ps, code-other, step-1-bottle (chai trong giỏ), step-2-flakes (mảnh nhựa + chậu rửa), step-3-pellets (hạt nhựa), step-4-yarn (sợi), step-5-products (áo, ba lô, gấu bông), item-shampoo, item-detergent, item-lunchbox, item-foam-cup, item-foam-tray, item-soda-bottle, item-clear-box, item-straws. Không có ảnh phù hợp → bỏ `img`, dùng `emoji`.

Ảnh cảnh Journey sẽ có thêm: scene-1 (ghế đá trường + chai rỗng), scene-2 (3 thùng phân loại), scene-3 (nhà máy: băng chuyền → bể rửa → máy nghiền), scene-4 (máy biến hạt nhựa thành sợi), scene-5 (giá treo áo, ba lô, gấu bông, thảm). Ảnh Lab: lab-wash, lab-shredder, lab-extruder.

## Schema nhiệm vụ (task.config) – dùng đúng
- `sort`: { prompt, bins:[{id,label}], items:[{id,label,img?,emoji?,bin}] }
- `quiz`: { questions:[{q, options:[2–4], answer, explain}] }
- `order`: { prompt, items:[{id,label,img?}] } – mảng theo **thứ tự đúng**, 4–5 mục
- `match`: { prompt, pairs:[{id, left:{label}, right:{label,img?}}] } – 3–4 cặp

## File 1 – journey.js: 5 chặng theo kịch bản của khách
1 "Chuyện gì xảy ra sau khi sử dụng?" · 2 "Đi tìm đúng nơi" (thu gom, phân loại – **bắt buộc engine sort**, ~6 vật vào 2–3 ô) · 3 "Bí mật bên trong nhà máy" (làm sạch, nghiền – gợi ý order) · 4 "Cuộc biến đổi kỳ diệu" (mảnh → hạt nhựa → sợi – quiz 2 câu hoặc match) · 5 "Một vòng đời mới" (sản phẩm – quiz/sort).
```js
export default {
  intro: '…',   // Ebi mời bạn đi 5 chặng để nhận 5 mảnh ghép
  finale: '…',  // khi ghép xong bức tranh vòng đời mới
  stages: [
    { id: 1, title: 'Chuyện gì xảy ra sau khi sử dụng?', scene: 'scene-1', piece: 'Chai đã dùng',
      lines: ['…', '…', '…'],          // 3–4 câu Ebi kể chuyện
      task: { engine: 'quiz', config: { questions: [ … ] } },
      learn: '…' },                    // 1–2 câu chốt kiến thức sau nhiệm vụ
    // … đủ 5 chặng
  ],
};
```

## File 2 – lab.js: thí nghiệm "Tự tay tái chế chai PET" (mô phỏng giáo dục)
```js
export default {
  disclaimer: 'Đây là mô phỏng giáo dục, đã lược bớt nhiều công đoạn so với nhà máy thật.',
  steps: [
    { id: 'choose', title: 'Chọn nguyên liệu', text: '…', ebi: '…',
      choices: [ { id: 'c1', label: 'Chai nước suối', img: 'code-pet', isPet: true, why: '…' }, /* ~6 vật, 3–4 là PET */ ] },
    { id: 'sort', title: 'Đưa vào khu PET', text: '…', ebi: '…' },
    { id: 'wash', title: 'Làm sạch & nghiền', text: '…', ebi: '…', img: 'lab-shredder' },
    { id: 'make', title: 'Tạo nguyên liệu mới', text: '…', ebi: '…', img: 'lab-extruder' },
    { id: 'product', title: 'Chọn sản phẩm', text: '…', ebi: '…' },
  ],
  products: [ { id: 'shirt', label: 'Áo polyester', emoji: '👕', img: 'step-5-products', fact: '…' }, /* ba lô, gấu bông, nội thất (vải bọc ghế/thảm) */ ],
  slider: { frames: [
    { img: 'step-1-bottle', label: 'Chai PET', caption: '…' },
    { img: 'step-3-pellets', label: 'Hạt nhựa', caption: '…' },
    { img: 'step-4-yarn', label: 'Sợi polyester', caption: '…' },
    { img: 'step-5-products', label: 'Sản phẩm mới', caption: '…' },
  ] },
};
```
Không dùng con số kiểu "X chai làm được 1 áo" nếu không có nguồn tin cậy; nếu dùng, ghi nguồn.

## File 3 – puzzle.js: xếp 5–6 bước tái chế chai PET theo đúng thứ tự
```js
export default {
  prompt: 'Sắp xếp hành trình của chiếc chai PET theo đúng thứ tự.',
  items: [ { id: 's1', label: 'Thu gom chai đã dùng', img: 'step-1-bottle' }, /* nhãn ≤ 8 từ, theo thứ tự đúng */ ],
};
```
