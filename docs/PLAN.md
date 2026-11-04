# ECObit HUB – Kế hoạch dự án & hợp đồng kỹ thuật (v1)

PM/PO: Claude (agent điều phối). Cập nhật: 04/11/2026.
Mục tiêu: bản **production v1** chạy được trên điện thoại học sinh trước ECObit Day 21/11, có QR.

---

## 0. Thay đổi yêu cầu mới (04/11)
**Khách yêu cầu hiển thị theo tab, mỗi khu là một màn hình riêng — không làm trang dài cuộn xuống.**

Hệ quả thiết kế:
- 7 khu = 7 tab. Đổi tab = đổi màn hình (hiệu ứng trượt/mờ), URL đổi theo `#/home`, `#/discover`, … để chia sẻ link và nút Back hoạt động.
- Mỗi màn hình vừa khít khung nhìn (`100dvh` trừ thanh trên/dưới). Nội dung dài → chia **màn con** (sub-screen): danh sách → chi tiết, chặng 1 → chặng 2, câu 1 → câu 2. Không dựa vào cuộn.
  Ngoại lệ chấp nhận: điện thoại rất thấp (<640px cao) được phép cuộn nhẹ bên trong một màn.
- Màn con cũng có URL: `#/play/sort`, `#/discover/pet`, `#/journey/3`.
- Ý tưởng "cuộn có chuyển động" ở ECO HOME chuyển thành **chuỗi 3 khung tự chạy / bấm tiếp** (chai → mảnh → sợi → sản phẩm) trong cùng một màn.
- Máy tính: thanh tab nằm ngang trên đầu. Điện thoại: thanh tab cố định ở đáy (7 biểu tượng + nhãn ngắn).

## 1. Phạm vi v1

| Khu | v1 làm | Hoãn (v1.1+) |
|---|---|---|
| ECO HOME | Ebi chào, 2 nút CTA, chuỗi biến đổi chai→sản phẩm, bản đồ 6 khu dạng "địa điểm", 3 số liệu chiến dịch | Hiệu ứng parallax nặng |
| ECO DISCOVER | 7 thẻ mã nhựa (ảnh + 5 trường), thử thách "Đoán mã nhựa" 7 đồ vật, thẻ lật "Bạn có biết?" ngẫu nhiên | Thư viện kiến thức 3 nhóm |
| ECO JOURNEY | 5 chặng, mỗi chặng: cảnh + lời Ebi + 1 nhiệm vụ nhỏ → mảnh ghép; đủ 5 mảnh → tranh vòng đời | — |
| ECO LAB | TN1 tái chế chai PET 5 bước (ghi "mô phỏng giáo dục"), TN3 thanh trượt trước/sau | ECO MIX (TN2) |
| ECO PLAY | SORT, MATCH, PUZZLE, QUIZ (có giờ), DETECTIVE + ECO POINT | Bảng xếp hạng |
| ECO PASSPORT | Tên, chọn tư thế Ebi làm avatar, cấp độ, điểm, tiến độ, 5 huy hiệu, thẻ thành tích PNG (tải về / chia sẻ), hình nền Ebi mở khoá theo cấp | Avatar tuỳ biến từng bộ phận |
| ECO CONNECT | Timeline 4 mốc, bảng số liệu đã xác minh (JSON), mục ảnh (ẩn khi chưa có ảnh), đối tác (ẩn tới khi khách xác nhận) | Tường chia sẻ, thư viện video |

## 2. Kiến trúc

- **Không build, không phụ thuộc npm**: HTML + CSS + ES modules thuần. Deploy nguyên thư mục lên Netlify/Vercel/GitHub Pages. Lý do: thời gian 1 tuần, dev tự sửa nội dung, web có thể tắt sau chiến dịch.
- Nội dung nằm trong `src/data/*.js` (`export default {...}`) — sửa chữ không cần đụng code.
- Lưu tiến độ bằng `localStorage` (không đăng nhập).
- Font: Baloo 2 (tiêu đề) + Be Vietnam Pro (nội dung) từ Google Fonts, có tiếng Việt.
- Ảnh: `public/img/*.webp` (đã tách nền, viền sticker trắng) — tạo lại bằng `npm run stickers`.
- Ebi: SVG vẽ bằng code (`src/core/ebi.js`), 9 tư thế + 4 biểu cảm + chớp mắt/vẫy tay. Khi có PNG gốc của khách: bỏ vào `public/img/ebi/<pose>.webp`, bật `site.ebiPng = true`.

```
index.html
public/img/            ảnh sticker (code-*.webp, step-*.webp)
src/main.js            khởi động: shell + router + đăng ký 7 khu
src/core/
  router.js            hash router  (#/zone/param1/param2)
  store.js             tiến độ, ECO POINT, huy hiệu, cấp độ, sự kiện
  ui.js                h(), toast, modal, confetti, say(), img(), shuffle()
  ebi.js               mascot SVG
src/engines/           engine tương tác dùng chung (Agent A)
src/zones/<zone>.js    mỗi khu 1 module
src/styles/            tokens.css, base.css, shell.css, zones/<zone>.css
src/data/              nội dung (Agent D)
docs/                  PLAN, CONTENT-REVIEW, QA-REPORT, DEPLOY
scripts/               sticker.py, qa_screens.py
```

### 2.1 Hợp đồng module khu (zone)
```js
// src/zones/play.js
export default {
  id: 'play', title: 'ECO PLAY', short: 'Chơi', icon: '🎮',
  mount(el, ctx) {            // el: <section class="screen">, đã rỗng
    // ctx.params: mảng tham số URL, ví dụ ['sort']
    // ctx.go(path): điều hướng, ví dụ ctx.go('/play/quiz')
    // ctx.store: store (xem 2.2)
    return () => {};          // tuỳ chọn: hàm dọn dẹp (timer, listener)
  }
};
```
Router luôn gọi cleanup rồi mount lại khi hash đổi. Mỗi khu tự nạp CSS riêng bằng `ui.css('zones/play.css')`.

### 2.2 Store (`src/core/store.js`) — đã viết, dùng nguyên
```js
store.state                         // đọc
store.complete(activityId, { correct, total })  // → { gained, perfect, first, newBadges }
store.journeyPiece(stageIndex)      // 0..4 → { gained, newBadges, done }
store.viewCode(codeId)              // ghi nhận đã xem thẻ mã
store.setProfile({ name, avatar })
store.level()                       // { idx, name, min, next, progress }
store.on('change'|'badge'|'points', fn) → off()
store.reset()
```
ID hoạt động: `play:sort`, `play:match`, `play:puzzle`, `play:quiz`, `play:detective`, `discover:identify`, `lab:recycle`.
Điểm: hoàn thành lần đầu **+20**, lần đầu đúng hết **+10**; xong cả 5 chặng Journey **+100**; Lab **+30**. Không cộng lặp khi chơi lại.
Huy hiệu tự cấp và tự hiện toast — khu không cần làm gì thêm.

### 2.3 Engine dùng chung (`src/engines/`, Agent A)
Mọi engine: `mountX(el, config, { onComplete }) → cleanup`. `onComplete({ correct, total })`.
Bắt buộc: chạy được bằng **chạm** (Pointer Events), có **chế độ chạm-để-chọn** thay kéo thả (chạm vật → chạm ô), chữ ≥ 16px, vùng chạm ≥ 44px, phản hồi đúng/sai ngay (màu + rung nhẹ + lời Ebi).

| Engine | File | Config |
|---|---|---|
| Kéo thả phân nhóm | `sort.js` | `{ prompt, bins:[{id,label,sub?,color?}], items:[{id,label,img?,emoji?,bin}] }` |
| Trắc nghiệm | `quiz.js` | `{ prompt?, timer?: giây/câu, variant?: 'quiz'|'detective', questions:[{q, options:[...], answer, explain, img?}] }` |
| Ghép cặp | `match.js` | `{ prompt, pairs:[{id, left:{label,img?}, right:{label,img?}}] }` |
| Sắp thứ tự | `order.js` | `{ prompt, items:[{id,label,img?}] }` (mảng đúng thứ tự; engine tự xáo) |
| Màn kết quả | `result.js` | `showResult(el, { title, correct, total, gained, perfect, onReplay, onNext, nextLabel })` |
| Kéo thả chung | `drag.js` | tiện ích pointer-drag có fallback chạm-chọn, dùng nội bộ |

### 2.4 Schema nội dung (`src/data/`, Agent D)
- `codes.js` – 7 mã: `{ id, num, abbr, name, vn, color, img, object, traits, products[], recycle:{level:'cao'|'trung bình'|'thấp', text}, fact }`
- `facts.js` – ≥ 16 thẻ "Bạn có biết?": `{ id, text, tag }`
- `quiz.js` – `{ timer: 20, questions: [10 câu] }`
- `sort.js`, `match.js`, `puzzle.js`, `detective.js` – theo config engine ở 2.3
- `journey.js` – 5 chặng `{ id, title, scene, lines[], task:{ engine, config }, piece }`
- `lab.js` – `{ disclaimer, steps[], products[], slider:{ frames[] } }`
- `stats.js`, `timeline.js`, `site.js` – số liệu, mốc, cấu hình chung (GA id, link, cờ ẩn/hiện)

Mọi kiến thức phải đúng; mục nào cần khách xác nhận ghi vào `docs/CONTENT-REVIEW.md`.

## 3. Đội agent

> **Cập nhật 04/11 – đội thực tế:** Claude chat = PM/PO · Claude Code = implement (nhiệm vụ M1–M7, `CLAUDE.md` + `docs/agents/code/`) · ChatGPT + Gemini = nghiên cứu & viết nội dung, kiểm tra chéo lẫn nhau (`docs/agents/research/`) · Gemini Nano Banana = ảnh (`docs/agents/images/`). Bảng vai A–F bên dưới giữ để tham chiếu phạm vi file; luồng & lịch xem `docs/agents/00-HUONG-DAN.md`.

| Agent | Vai trò | Sở hữu file (chỉ agent này được sửa) | Đợt |
|---|---|---|---|
| **PM/PO (Claude)** | Kế hoạch, hợp đồng, khung, Ebi, xử lý ảnh, tích hợp, nghiệm thu, deploy | `index.html`, `src/main.js`, `src/core/*`, `src/styles/{tokens,base,shell}.css`, `docs/PLAN.md` | 0, 3 |
| **A – Engine & ECO PLAY** | 5 engine + màn kết quả + khu PLAY (sảnh 5 trò, ECO POINT) | `src/engines/*`, `src/zones/play.js`, `src/styles/zones/play.css`, `src/styles/engines.css` | 1 |
| **B – ECO DISCOVER** | Lưới 7 mã, thẻ chi tiết, thử thách đoán mã, thẻ lật | `src/zones/discover.js`, `src/styles/zones/discover.css` | 1 |
| **C – HOME · PASSPORT · CONNECT** | Màn chào + bản đồ khu, hộ chiếu + thẻ thành tích canvas + hình nền, timeline + số liệu | `src/zones/{home,passport,connect}.js`, CSS tương ứng | 1 |
| **D – Nội dung & kiến thức** | Viết toàn bộ nội dung tiếng Việt, kiểm tra tính chính xác, danh sách cần khách duyệt | `src/data/*`, `docs/CONTENT-REVIEW.md` | 1 |
| **E – JOURNEY & LAB** | 5 chặng tái dùng engine, mảnh ghép, tranh vòng đời; TN1 + thanh trượt | `src/zones/{journey,lab}.js`, CSS tương ứng (được sửa `journey.js`/`lab.js` trong data) | 2 |
| **F – QA độc lập** | Chạy thử headless Chrome ở 360×740 và 1366×768, kiểm tra luồng, lỗi console, nội dung sai, khả năng truy cập | `docs/QA-REPORT.md`, `scripts/qa_screens.py` | 3 |

Đề xuất thêm (khi có thời gian/ngân sách): **G – Minh hoạ** (tạo thêm ảnh AI cho cảnh Journey 1–5 và bản đồ ECO HOME theo khối phong cách sẵn có), **H – Nội dung khách** (đổ nội dung chính thức khi khách gửi).

Quy tắc chung cho mọi agent: chỉ sửa file mình sở hữu; cần đổi file người khác → ghi đề xuất vào cuối báo cáo; không thêm thư viện ngoài; không dùng `localStorage` trực tiếp (đi qua store); toàn bộ chữ hiển thị bằng tiếng Việt có dấu.

## 4. Lộ trình

| Đợt | Việc | Đầu ra | Phụ thuộc |
|---|---|---|---|
| 0 | Khung, router tab, store, Ebi, ảnh sticker, dữ liệu mẫu | Chạy được 7 tab rỗng | — |
| 1 | A, B, C, D song song | 5 trò chơi, Discover, Home/Passport/Connect, nội dung thật | Đợt 0 |
| 2 | E | Journey + Lab | Engine của A, nội dung của D |
| 3 | F rồi PM | Báo cáo QA → sửa → bản xem trước → zip | 1, 2 |
| 4 | Dev (người) | Gửi khách link xem trước, 2 vòng sửa, gắn GA, tên miền, QR, deploy | 3 |

## 5. Tiêu chí nghiệm thu (Definition of Done)
1. 7 tab chuyển qua lại không tải lại trang; Back/Forward của trình duyệt đúng; mở thẳng link `#/play/quiz` được.
2. Ở 360×740 không màn nào cần cuộn trang để thấy nút hành động chính; không cuộn ngang.
3. Mọi trò chơi chơi trọn bằng ngón tay; không lỗi console.
4. Điểm/huy hiệu đúng quy tắc 2.2, còn nguyên sau khi tải lại trang; chơi lại không cộng điểm lần 2.
5. Thẻ thành tích tải về được PNG 1080×1350; trên điện thoại hỗ trợ Web Share thì chia sẻ thẳng ảnh.
6. Nội dung kiến thức không có lỗi đã biết (BPA–PET, PVC ghi PC, tên LDPE sai, PP "nhựa số 4", PS đựng đồ ăn lâu dài).
7. Tổng dung lượng tải lần đầu < 1,5 MB; ảnh lazy-load.
8. Có `prefers-reduced-motion`, ảnh có `alt`, nút có nhãn.

## 6. Rủi ro & xử lý
| Rủi ro | Xử lý |
|---|---|
| Khách gửi nội dung 7 mã muộn | D soạn nháp chuẩn; khách chỉ duyệt/sửa trong `src/data/codes.js` |
| Chưa có PNG Ebi tách sẵn | Ebi SVG thay thế, đổi sang PNG bằng 1 cờ |
| Thiếu ảnh cảnh Journey | Dùng 5 ảnh bước tái chế + nền minh hoạ CSS |
| Điện thoại cũ / Safari | Không dùng cú pháp quá mới; test Pointer Events + `dvh` có fallback `vh` |
| Số liệu chưa xác minh | Hiển thị "Đang cập nhật" thay vì số 0 |
