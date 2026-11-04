# R1 – ChatGPT: 7 mã nhựa + trò SORT + trò MATCH

Dán toàn bộ nội dung dưới đây vào ChatGPT (bật Search).

---
Bạn là chuyên gia nội dung giáo dục môi trường. Hãy viết/rà soát nội dung cho 3 file dữ liệu của một website.

## Bối cảnh (đọc kỹ)
Website "ECObit HUB – Thế giới tái chế trong tầm tay" dạy tái chế nhựa cho **học sinh Việt Nam (THCS/THPT)**. Mascot **Ebi** là một chai nhựa nắp xanh, đóng vai người dẫn chuyện – Ebi **không bao giờ bị nghiền**; khi nói về nghiền thì nói "những chiếc chai". Giọng Ebi: xưng "mình", gọi "bạn", vui, ngắn gọn, không doạ dẫm.

## Yêu cầu chung
- **Bật tìm kiếm web.** Kiểm chứng mọi con số và nhận định không hiển nhiên bằng nguồn uy tín (US EPA, Plastics Europe, Ellen MacArthur Foundation, UNEP, WWF, Bộ TN&MT Việt Nam, báo khoa học). Thà bỏ con số còn hơn sai. Không bịa nguồn.
- Ví dụ đồ vật phải **đúng với thị trường Việt Nam** (lưu ý: nhiều hũ sữa chua ở VN như Vinamilk là PS số 6, không phải PP). Chỉ chọn đồ vật mà loại nhựa phổ biến là rõ ràng; vật hay thay đổi loại nhựa thì bỏ.
- Tiếng Việt chuẩn, có dấu, ngoặc kép “ ”. Câu hỏi ≤ 140 ký tự, phương án ≤ 90, lời Ebi ≤ 160, sự thật ≤ 200.
- **Đầu ra bắt buộc**: mỗi file là một khối code JavaScript hoàn chỉnh bắt đầu bằng `export default`, đúng schema bên dưới (giữ nguyên tên trường tiếng Anh), sau đó là **bảng nguồn**: | File | Mục | Nhận định | Nguồn (link) | Mức chắc chắn (cao/vừa/thấp) |.
- Ảnh dùng được (trường `img`, tên không đuôi): code-pet, code-hdpe, code-pvc, code-ldpe, code-pp, code-ps, code-other, step-1-bottle (chai trong giỏ), step-2-flakes (mảnh nhựa + chậu rửa), step-3-pellets (hạt nhựa), step-4-yarn (sợi), step-5-products (áo, ba lô, gấu bông), item-shampoo, item-detergent, item-lunchbox, item-foam-cup, item-foam-tray, item-soda-bottle, item-clear-box, item-straws. Không có ảnh phù hợp → bỏ `img`, dùng `emoji`.

## File 1 – codes.js (RÀ SOÁT bản nháp dưới đây)
Giữ nguyên các trường và id. Sửa chỗ sai/chưa chuẩn, giữ ngắn gọn. Lỗi đã biết của bản phác thảo khách cần tránh: mã 3 là PVC (không phải PC); LDPE = Low-density polyethylene; PET KHÔNG chứa BPA; PP không phải "nhựa số 4"; không khuyên dùng hộp xốp PS đựng đồ ăn nóng/lâu. Trường `object` là tên đồ vật trong ảnh minh hoạ – giữ đúng với ảnh (PET: chai nước; HDPE: can sữa; PVC: ống nước; LDPE: túi ni lông; PP: cốc nhựa + hộp đựng thức ăn có nắp gài; PS: hộp xốp; OTHER: đồ chơi lắp ghép + bình nước cứng).

```js
// 7 mã nhựa (Resin Identification Code). Bản nháp – chờ khách duyệt (xem docs/CONTENT-REVIEW.md).
// recycle.level: 'cao' | 'trung bình' | 'thấp'
export default [
  {
    id: 'pet', num: 1, abbr: 'PET', name: 'Polyethylene terephthalate', vn: 'Nhựa PET',
    color: 'var(--code-pet)', img: 'code-pet', object: 'Chai nước',
    traits: 'Trong suốt, nhẹ, bền, ngăn khí và hơi nước tốt nên giữ được ga cho nước ngọt.',
    products: ['Chai nước suối', 'Chai nước ngọt', 'Hộp, khay trong đựng bánh trái'],
    recycle: { level: 'cao', text: 'Được thu gom và tái chế nhiều nhất. Có thể thành sợi polyester để may áo, ba lô, nhồi gấu bông, hoặc thành chai mới.' },
    fact: 'Chai PET sạch, đã phân loại kỹ có thể được tái chế thành chai mới – gọi là tái chế “chai thành chai”.',
  },
  {
    id: 'hdpe', num: 2, abbr: 'HDPE', name: 'High-density polyethylene', vn: 'Polyethylene mật độ cao',
    color: 'var(--code-hdpe)', img: 'code-hdpe', object: 'Can sữa',
    traits: 'Đục, cứng cáp, chịu va đập và chịu được nhiều loại hoá chất tẩy rửa.',
    products: ['Can sữa, can nước', 'Chai dầu gội, nước giặt', 'Nắp chai, thùng nhựa'],
    recycle: { level: 'cao', text: 'Dễ tái chế. Nhựa HDPE tái chế thường thành ống, thùng rác, chậu cây, ghế công viên.' },
    fact: 'Chai nước giặt và can sữa trông khác nhau nhưng thường cùng là HDPE – nhựa số 2.',
  },
  {
    id: 'pvc', num: 3, abbr: 'PVC', name: 'Polyvinyl chloride', vn: 'Nhựa PVC',
    color: 'var(--code-pvc)', img: 'code-pvc', object: 'Ống nước',
    traits: 'Cứng chắc khi làm ống; trở nên mềm dẻo khi được thêm chất hoá dẻo. Trong thành phần có clo.',
    products: ['Ống nước, khung cửa', 'Vỏ bọc dây điện', 'Áo mưa, màng bọc mềm'],
    recycle: { level: 'thấp', text: 'Khó tái chế chung với nhựa khác và không nên đốt vì sinh khí độc. Thường chỉ tái chế riêng ở cơ sở chuyên biệt.' },
    fact: 'Chỉ một lượng nhỏ PVC lẫn vào mẻ chai PET cũng có thể làm hỏng chất lượng cả mẻ tái chế.',
  },
  {
    id: 'ldpe', num: 4, abbr: 'LDPE', name: 'Low-density polyethylene', vn: 'Polyethylene mật độ thấp',
    color: 'var(--code-ldpe)', img: 'code-ldpe', object: 'Túi ni lông',
    traits: 'Mềm, dẻo, nhẹ, kéo giãn được, chống thấm nước.',
    products: ['Túi ni lông', 'Màng bọc thực phẩm', 'Túi đựng bánh mì, lớp lót bao bì'],
    recycle: { level: 'thấp', text: 'Có thể tái chế nhưng ít nơi thu gom: túi mỏng nhẹ, dễ bẩn và hay quấn vào máy phân loại.' },
    fact: 'Túi ni lông nhẹ nên dễ theo gió ra sông, ra biển. Mang túi vải khi đi chợ là cách giảm LDPE đơn giản nhất.',
  },
  {
    id: 'pp', num: 5, abbr: 'PP', name: 'Polypropylene', vn: 'Nhựa PP',
    color: 'var(--code-pp)', img: 'code-pp', object: 'Cốc nhựa và hộp đựng thức ăn',
    traits: 'Chịu nhiệt tốt hơn nhiều loại nhựa khác, dai, ít bị nứt khi gập.',
    products: ['Hộp đựng thức ăn dùng lò vi sóng', 'Nắp chai, ống hút', 'Một số cốc, hũ đựng thực phẩm (xem số dưới đáy)'],
    recycle: { level: 'trung bình', text: 'Tái chế được thành hộp, chậu, móc treo, chi tiết đồ gia dụng – nhưng tỉ lệ thu gom còn thấp.' },
    fact: 'Hộp có ghi “dùng được trong lò vi sóng” thường làm từ PP vì loại nhựa này chịu nhiệt tốt.',
  },
  {
    id: 'ps', num: 6, abbr: 'PS', name: 'Polystyrene', vn: 'Nhựa PS (gồm cả xốp)',
    color: 'var(--code-ps)', img: 'code-ps', object: 'Hộp xốp',
    traits: 'Dạng cứng: giòn, dễ gãy. Dạng xốp: rất nhẹ, cách nhiệt, chủ yếu là không khí.',
    products: ['Hộp xốp, ly xốp', 'Khay xốp đựng thịt', 'Dao, thìa, dĩa nhựa dùng một lần'],
    recycle: { level: 'thấp', text: 'Xốp nhẹ, cồng kềnh, hay dính thức ăn nên chi phí thu gom cao; phần lớn không được tái chế.' },
    fact: 'Hộp xốp có tới khoảng 95% là không khí. Không nên dùng hộp xốp đựng đồ ăn nóng, nhiều dầu mỡ hay hâm trong lò vi sóng.',
  },
  {
    id: 'other', num: 7, abbr: 'OTHER', name: 'Các loại nhựa khác', vn: 'Nhóm nhựa khác (PC, ABS, PLA, nhựa nhiều lớp…)',
    color: 'var(--code-other)', img: 'code-other', object: 'Đồ chơi lắp ghép và bình nước cứng',
    traits: 'Nhóm “còn lại”: nhựa cứng PC, nhựa ABS, nhựa sinh học PLA, bao bì nhiều lớp ghép.',
    products: ['Bình nước cứng dùng nhiều lần', 'Đồ chơi lắp ghép', 'Gói bim bim nhiều lớp'],
    recycle: { level: 'thấp', text: 'Rất khó tái chế vì gồm nhiều loại khác nhau hoặc nhiều lớp dính chặt vào nhau.' },
    fact: 'BPA – chất hay được nhắc tới – liên quan tới nhựa polycarbonate (PC) thuộc nhóm số 7, không phải nhựa PET.',
  },
];
```
Cuối phần này liệt kê ngắn những gì bạn đã sửa và lý do.

## File 2 – sort.js (trò kéo đồ vật vào đúng nhóm nhựa)
4 ô PET / HDPE / PP / PS, **12 đồ vật** quen thuộc với học sinh Việt Nam, mỗi ô 3 vật.
```js
export default {
  prompt: 'Kéo từng món đồ vào đúng nhóm nhựa nhé!',
  bins: [
    { id: 'pet', label: 'PET', sub: 'Số 1', color: 'var(--code-pet)' },
    { id: 'hdpe', label: 'HDPE', sub: 'Số 2', color: 'var(--code-hdpe)' },
    { id: 'pp', label: 'PP', sub: 'Số 5', color: 'var(--code-pp)' },
    { id: 'ps', label: 'PS', sub: 'Số 6', color: 'var(--code-ps)' },
  ],
  items: [ { id: 'i1', label: 'Chai nước suối', img: 'code-pet', emoji: '🧴', bin: 'pet' }, /* … 12 vật, label ≤ 5 từ */ ],
};
```

## File 3 – match.js (ghép mã nhựa ↔ sản phẩm)
Đủ 7 cặp, mỗi mã 1 sản phẩm điển hình (khác ví dụ đã dùng ở sort nếu được).
```js
export default {
  prompt: 'Chạm một mã nhựa rồi chạm sản phẩm tương ứng.',
  pairs: [ { id: 'pet', left: { label: 'PET · số 1' }, right: { label: 'Chai nước suối', img: 'code-pet' } }, /* … đủ 7 */ ],
};
```
Cuối cùng: danh sách đồ vật bạn khuyên nên vẽ thêm ảnh (tên item-… + mô tả ngắn tiếng Anh).
