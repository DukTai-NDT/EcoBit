# QA-REPORT – ECObit HUB (M6, QA độc lập)

Ngày chạy: 07/11/2026. Bản kiểm: commit `c12b824`. Trình duyệt: Chromium 156 (Playwright), cảm ứng giả lập.
**Không sửa dòng code nào của app.** Mọi lỗi dưới đây chỉ được báo, kể cả lỗi có thể sửa một dòng, để PM quyết định.

## Kết luận

- **Definition of Done: đạt 8/8**, trong đó mục 3 và 5 mới kiểm trên cảm ứng giả lập, chưa kiểm trên máy thật.
- **Không có lỗi mức Chặn.** Có **3 lỗi Cao** nên sửa trước khi in QR cho ECObit Day 21/11: B01, B02, B03.
- Tổng 26 mục: 0 Chặn · 3 Cao · 9 Trung bình · 14 Thấp.

| Bộ kiểm | Kết quả |
|---|---|
| Hành vi (`qa_play.py`) | 206/216 ca đạt. 10 ca hỏng đều là lỗi thật: B06 (3 ca), B07, B10, B12 (3 ca), B13, B15 |
| Bố cục (`qa_screens.py`) | 1.126 trạng thái. 6 khung nhìn yêu cầu: không cuộn trang, không cuộn ngang ở bất kỳ trạng thái nào |
| Console, 404 | Không lỗi, không 404. Riêng link hỏng ở B06 gây `URI malformed` |
| Tải lần đầu | 875 KB ở `#/home` trên 360×740, nặng nhất trong các lượt đo (`qa_audit.py`) |

## Trạng thái sau M7 (07/11/2026)

Kiểm lại sau M7: `qa_play.py` **216/216** (10 ca hỏng của M6 đều đạt); `qa_screens.py` 1.624 trạng thái, 6 khung yêu cầu không cuộn, không cuộn ngang, không lỗi console, không 404; khung xoay ngang 740×360, 667×375, 844×390 mọi nút chính bấm được (cuộn tới rồi `elementFromPoint`); Puzzle 0 chỗ chồng; `validate_data.mjs` 0 lỗi. Ảnh sau sửa: `M7-B03-journey-740x360.png`, `M7-B01-puzzle-360x740.png`.

| ID | Trạng thái | Ghi chú |
|---|---|---|
| B01 | **Đã sửa M7** | Bỏ `minHeight` của kho; thẻ đã vào ô thì kho thu lại; ô đã điền ≥ 44px. Ô trống (chưa bấm được) được thấp tới 24px trên điện thoại cao ≤ 760px; máy cao ≤ 700px ẩn Ebi của Puzzle |
| B02 | **Đã sửa M7** | 19 `explain` bỏ cụm khen; `validate_data.mjs` báo lỗi nếu `explain` mở đầu bằng lời khen/đúng/sai |
| B03 | **Đã sửa M7** | Khối `@media (max-height: 480px) and (orientation: landscape)` cho khung app, Journey, Home, Quiz, hình nền Passport |
| B04 | **Đã sửa M7** | Chỉ sửa CSS (padding, cỡ chữ 15px ở máy thấp), không rút gọn nhãn `match.js` |
| B05 | **Đã sửa M7** | Ẩn ảnh câu hỏi khi hiện giải thích; máy thấp ẩn Ebi trong khung giải thích |
| B06 | **Đã sửa M7** | Giải mã từng đoạn link có try/catch; đoạn hỏng coi như link sai |
| B07 | **Đã sửa M7** | Đổi route thì đóng mọi hộp thoại |
| B08 | **Đã sửa M7** | `.btn-primary` và các nhãn chữ trắng trên nền xanh dùng `--green-700` |
| B09 | **Đã sửa M7** | Nhãn tab 12px, xuống 2 dòng (ngoại lệ PM duyệt); chip/nhãn phụ 14px |
| B10 | **Đã sửa M7** | `store` nạp lại khi có sự kiện `storage`, `pageshow`, `visibilitychange` |
| B11 | **Đã sửa M7** | Trộn phương án (lấy phần engine từ `0dda8d7`) |
| B12 | **Đã sửa M7** | Tiêu điểm vào `#stage` khi đổi màn; hộp thoại giữ tiêu điểm; đổi avatar xong về nút "Đổi" |
| B13 | **Đã sửa M7** | `ctx.replace()` cho link con sai ở Play, Discover, Journey, Lab |
| B14 | **Đã sửa M7** | Sảnh Play gọn lại ở máy thấp, 0px cuộn |
| B15 | **Đã sửa M7** | Ghi mảnh ngay khi xong nhiệm vụ; hoạt ảnh bay chỉ để hiển thị |
| B16 | **Đã sửa M7** | Bỏ `img` ở Q3, Q7 (hộp nhựa nắp gài gợi thẳng "hộp PP"), Q9 (áo, ba lô, gấu bông gợi thẳng "sợi dệt vải") |
| B17 | Để M8 | |
| B18 | Để M8 | |
| B19 | **Đã sửa M7** | Chip điểm, logo, tab máy tính, `.modal-close` ≥ 44px |
| B20 | Để M8 | Riêng `#/journey/finale` ở 360/320px đã sửa (mục 17): nhãn xuống dòng, không chạm mép, nút không bị đè |
| B21 | Để M8 | |
| B22 | **Đã sửa M7** | Lời chào mới theo brief (lời Home vẫn viết trong code, chuyển vào `src/data/` ở M8) |
| B23 | Để M8 | |
| B24 | **Đã sửa M7** | `.modal` có dòng `vh` trước `dvh`; `:focus` dự phòng cho trình duyệt chưa có `:focus-visible` |
| B25 | Để M8 | |
| B26 | Để M8 | |

Làm thêm trong M7: hàng đợi toast (1 cái, 1,8 giây, không chặn chạm); Lab bước 1 chỉ hiện tên đồ vật, mã nhựa hiện sau khi chọn; `.btn-back` 16px; đuôi bong bóng `.eng-coach`; `.gitignore`; 3 file `gemini-code-*.js` chuyển vào `raw/`.
Còn lại ngoài phạm vi: chip "Đổi" ở Passport lệch 3px (chủ ý thiết kế); hộp thoại chọn avatar cuộn 16–46px khi xoay ngang.

## Bảng lỗi

Ảnh chụp nằm ở `docs/qa-evidence/`. Toàn bộ ảnh theo route tạo lại bằng `python3 scripts/qa_screens.py` vào `qa-shots/` (97 MB, không commit).

### Cao

| ID | Route | Viewport | Mô tả | Cách tái hiện | Ảnh | File nghi ngờ |
|---|---|---|---|---|---|---|
| B01 | `#/play/puzzle` | 360×740, 375×667 | 6 ô đáp án chồng lên nhau, dòng thứ hai của nhãn bị ô sau đè nên không đọc được, đúng lúc người chơi cần soát thứ tự. Đo được: 5 chỗ chồng ở cả hai khung nhìn; ô cao tối thiểu 44px nhưng hàng lưới nhỏ hơn. Ngay dưới đó lại có một khoảng trống lớn | Xếp đủ 6 thẻ, nhìn cột ô trước khi bấm "Kiểm tra" | `B01-puzzle-360x740.png`, `B01-puzzle-375x667.png` | `src/engines/order.js:118` (giữ `minHeight` của kho khi kho chỉ còn nút), `src/styles/engines.css:146` |
| B02 | `#/play/quiz`, `#/play/detective`, `#/journey/1`, `#/journey/5` | Mọi khung nhìn | Trả lời sai hoặc hết giờ, ô phản hồi vẫn ghi "Chưa đúng rồi!" rồi ngay sau là "Đúng rồi!", "Chính xác!", "Chuẩn luôn!". Cả 19/19 lời giải thích đều mở đầu kiểu khen, nên học sinh nhận hai thông điệp trái nhau | Chọn sai câu 1 Quiz: hiện "Chưa đúng rồi! Đúng rồi! PET (số 1) thường…" | `B02-quiz-sai-nhung-dung-roi.png` | `src/data/quiz.js`, `detective.js`, `journey.js` (trường `explain`), `src/engines/quiz.js:108` |
| B03 | `#/journey/1`–`5`, `#/home` | Điện thoại xoay ngang (740×360) | Không đi tiếp được: nút "Tiếp" của chặng bị khung cảnh đè, chạm không có tác dụng kể cả khi đã cuộn. Hai nút CTA ở Home cũng bị ảnh đè. Khung này ngoài 6 khung yêu cầu, nhưng trang web không khoá được chiều xoay | Xoay ngang, mở `#/journey/1`, cuộn xuống đáy, chạm "Tiếp" | `B03-journey-740x360.png`, `B03-home-740x360.png` | `src/styles/zones/journey.css:81-88`, `src/styles/zones/home.css` |

### Trung bình

| ID | Route | Viewport | Mô tả | Cách tái hiện | Ảnh | File nghi ngờ |
|---|---|---|---|---|---|---|
| B04 | `#/play/match` | 360×740 (2px), 375×667 (6px) | Nhãn 3 dòng ở cột phải tràn qua viền ô, chữ dính vào đường viền | Mở trò, xem "Màng bọc co và túi bóng dẻo", "Ống dẫn nước sinh hoạt cứng" | `B04-match-375x667.png` | `src/styles/engines.css:120-133`, `src/data/match.js` (nhãn dài) |
| B05 | `#/play/quiz`, `#/play/detective`, `#/journey/1` | 375×667 | Khi hiện khung giải thích, 12 trạng thái bị vùng cuộn con +5 đến +25px: đáp án đỏ bị cắt nửa dòng dưới khung | Chọn sai câu 2 Quiz, hoặc chặng 1 | `B05-giai-thich-375x667.png` | `src/styles/engines.css:83,106-115` |
| B06 | `#/%`, `#/%E0%A4%A`, `#/play/%ZZ` | Mọi khung nhìn | Link hỏng làm trắng sân khấu thay vì về Home, kèm lỗi `URI malformed`. Thanh tab vẫn dùng được. Link sai thông thường (`#/xyz`, `#/journey/9`…) đều chạy đúng | Mở trực tiếp `#/%` | – | `src/core/router.js:10` (`decodeURIComponent` không có try/catch) |
| B07 | `#/passport` | Mọi khung nhìn | Hộp thoại không đóng khi đổi màn: bấm Back khi đang mở "Làm lại từ đầu" thì hộp thoại đè lên màn khác, vẫn bấm "Xoá hết" được | Mở hộp thoại, bấm Back | `B07-modal-sau-back.png` | `src/core/ui.js:84`, `src/core/router.js` (không dọn modal khi đổi route) |
| B08 | Mọi nút `.btn-primary`: "BẮT ĐẦU KHÁM PHÁ", "Tiếp", "Tải ảnh"… | Mọi khung nhìn | Chữ trắng trên `--green-500` chỉ đạt 2,79:1, cần 4,5:1 (nút chính của toàn site). `--green-700` đạt yêu cầu | Đo bằng `qa_audit.py` | – | `src/styles/base.css:98` |
| B09 | Thanh tab, `#/play` | ≤ 860px | Nhãn tab 9,9px, thấp hơn nhiều so với quy tắc chữ ≥ 16px; ở 360px "Khám phá" và "Hành trình" gần như dính nhau. Chip 13px trên sảnh Play, nhãn ECO POINT 11,5px | Xem đáy màn ở 360×740 | Mọi ảnh 360×740 | `src/styles/shell.css:91`, `tokens.css` (`--fs-xs`) |
| B10 | Mở 2 tab | Mọi khung nhìn | Tab cũ ghi đè tiến độ tab mới: tab A chơi được 30 điểm, tab B (mở từ trước) sửa tên, điểm về 0. Dễ gặp khi học sinh mở lại link QR | `qa_play.py points` | – | `src/core/store.js` (`save()` ghi cả `mem`, không nghe sự kiện `storage`) |
| B11 | `#/play/quiz`, `#/play/detective` | Mọi khung nhìn | Phương án không được trộn: đáp án Quiz theo mẫu A-B-C-D-A-B-C-D-B-C, Detective B-A-C-B-A-C. Chơi lại là thuộc vị trí. Đây là mục B1 của PM-DUYET còn treo | Chơi 2 lần | – | `src/engines/quiz.js` |
| B12 | Toàn site | Mọi khung nhìn | Bàn phím: đổi màn thì tiêu điểm rơi về `<body>` (mọi route); Tab thoát khỏi hộp thoại ra nền sau 2 lần nhấn; đổi avatar xong tiêu điểm cũng về `<body>` | `qa_play.py kb`, `edge` | – | `src/core/router.js`, `src/core/ui.js:84`, `src/zones/passport.js:62` |

### Thấp

| ID | Route | Viewport | Mô tả | File nghi ngờ |
|---|---|---|---|---|
| B13 | `#/play/xyz` và tương tự | Mọi | Link con sai tạo bẫy Back: Back về lại link sai rồi bị đẩy về sảnh, không quay ra được. Link zone sai không bị vì đã dùng `replaceState` | `play.js:135`, `discover.js:372`, `journey.js:318`, `lab.js:452` (`ctx.go`) |
| B14 | `#/play` | 375×667 | Sảnh cuộn +8px, dòng cuối hộp ECO POINT bị cắt. Đây là lần duy nhất có cuộn trong màn ở 6 khung nhìn | `src/styles/zones/play.css` |
| B15 | `#/journey/n` | Mọi | Tải lại trong khoảng 1,7 giây mảnh ghép đang bay thì mất mảnh, phải làm lại nhiệm vụ. Rời màn bằng link thì không mất | `src/zones/journey.js:216-234` |
| B16 | `#/play/quiz` | Mọi | Ảnh minh hoạ lộ đáp án: Q3 ảnh khay xốp, đáp án "Khay xốp và hộp xốp"; Q7 và Q9 lộ một phần. CONTENT-REVIEW ghi Q3 đã sửa để tránh lộ | `src/data/quiz.js` |
| B17 | `#/play/detective`, `#/play/quiz` | Mọi | Dữ liệu viết ra nhưng không hiển thị: 6 tiêu đề vòng Detective ("Vòng 1: Hồ sơ chai nước PET…"), `emoji` ở Quiz Q6 và Detective vòng 5 | `src/engines/quiz.js` |
| B18 | `#/connect`, `#/connect/stats`, `#/home/map` | Mọi | Tương phản chưa đạt 4,5:1: "Đang cập nhật" 3,60:1, "Sắp tới" 3,44:1, nhãn tiến độ trên bản đồ 3,95–4,49:1 | `connect.css:43,60`, `home.css:122` |
| B19 | Thanh trên | Mọi | Vùng chạm dưới 44px: chip điểm cao 42px, logo 36px, tab máy tính 42px | `src/styles/shell.css` |
| B20 | Nhiều route | 320×568, 740×360 | Ngoài 6 khung yêu cầu. Máy thấp được phép "cuộn nhẹ" nhưng thực tế cuộn +120px (320×568) và +324px (740×360). `#/journey/finale` ở 320px có chú thích tràn ngang 5px | Các CSS khu |
| B21 | Toàn site | – | Chưa thống nhất kiểu bỏ dấu: "hoá/hoạ/khoá/xoá" lẫn "hóa/họa/tùy/thủy". Soát 878 từ trong 690 chuỗi, không thấy lỗi chính tả thật sự | `src/data/*`, `src/zones/*`, `src/engines/quiz.js` |
| B22 | `#/home` | Mọi | Lời chào "chiếc chai nhựa muốn được tái sinh" dễ hiểu là Ebi sẽ vào máy, trái quy tắc Ebi chỉ quan sát. Lời Ebi, 5 bước của dải biến đổi đang viết cứng trong code thay vì `src/data/` | `src/zones/home.js:57`, `:11`, `:21` |
| B23 | `index.html` | – | `aria-label` của chip điểm không có số điểm nên trình đọc màn hình không đọc điểm. 5 ảnh dải biến đổi (368 KB) không lazy-load | `index.html:30`, `src/zones/home.js:114` |
| B24 | Tương thích | Safari < 15.4, Chrome < 108 | `.modal` chỉ có `max-height` theo `dvh`, không có dự phòng `vh`; `:focus-visible` không có ở Safari < 15.4. Cần thử trên máy thật | `src/styles/shell.css:139`, `base.css:41` |
| B25 | Triển khai | – | `og:image` là đường dẫn tương đối và dạng webp nên Facebook có thể không hiện ảnh. `site.publicUrl` còn trống: thẻ thành tích sẽ in địa chỉ đang chạy, phải điền trước khi in QR | `index.html:11`, `src/data/site.js` |
| B26 | Tài liệu | – | `CONTENT-REVIEW.md` lệch nội dung thật: f12 còn ghi 62% (site ghi "hơn 60%"), f14 mô tả lệnh cấm túi ni lông (site nói 3 nhóm rác), mục "còn thiếu 15 ảnh" đã lỗi thời | `docs/CONTENT-REVIEW.md` |

## Kết quả theo 8 hạng mục M6

| # | Hạng mục | Kết quả |
|---|---|---|
| 1 | Điều hướng | 7 tab, Back/Forward, 15 link sâu, 15 link sai đều đúng, không tải lại trang. Hỏng: B06, B13, B07 |
| 2 | Không cuộn | Không cuộn ngang, không cuộn trang ở 6 khung nhìn. Cuộn trong màn: chỉ B14; vùng cuộn con: B05 |
| 3 | Chơi trọn | Mọi trò, chặng, thí nghiệm chạy trọn bằng cảm ứng, chuột và bàn phím; có thả sai, ghép sai, xếp sai, hết giờ thật 20 giây, chơi lại, huỷ giữa chừng, thả ra ngoài ô, giữ máy rồi thả. Không lỗi console |
| 4 | Điểm & huy hiệu | Đúng quy tắc: +20, +10, Journey +100, Lab +30, không cộng lặp; đường đi đo được 20→30→…→280. 5 huy hiệu mở đúng điều kiện, còn nguyên sau tải lại. "Làm lại từ đầu" xoá sạch, "Giữ lại" không xoá. Chịu được dữ liệu hỏng và localStorage bị chặn. Hỏng: B10, B15 |
| 5 | Thẻ & hình nền | PNG 1080×1350 và 1080×1920 đúng kích thước; dấu tiếng Việt không vỡ kể cả khi mất font (`OK-the-thanh-tich.png`); tên 24 ký tự vừa khung. Mở khoá hình nền đúng ở 50/120/300 điểm |
| 6 | Nội dung | Không còn lỗi đã biết (mục dưới). Hỏng: B02, B16, B22 |
| 7 | Truy cập | Ảnh đều có `alt`, nút đều có nhãn, chơi trọn bằng phím, `prefers-reduced-motion` đạt. Hỏng: B08, B09, B12, B18, B19 |
| 8 | Hiệu năng | Lượt nặng nhất 875 KB, ước tính sau gzip 715 KB, 60 request. Không 404. Đi hết mọi route: 2,7 MB |

### Đối chiếu lỗi đã biết

| Lỗi | Kết quả |
|---|---|
| BPA–PET | Đạt. `codes.js`, f1, Detective vòng 1 đều ghi PET không dùng BPA làm nguyên liệu |
| PVC/PC | Đạt. Mã 3 là PVC; PC thuộc nhóm 7 |
| Tên LDPE | Đạt. Low-density polyethylene |
| PP "số 4" | Đạt. PP luôn là số 5, LDPE là số 4 |
| Hộp xốp | Đạt. Không có chỗ nào khuyên đựng đồ nóng; f16 và Detective vòng 3 cảnh báo đúng |
| Cốc sữa chua PS/PP | Đạt. f4 và Quiz Q3 ghi có cả hai loại, dặn xem ký hiệu |

Mục "khách xác nhận" trong CONTENT-REVIEW vẫn mở: f4, f12, f13, f14, HDPE, LDPE, ghế nhựa (sort i8), các cặp match pet/hdpe/ps, chặng 2. Ảnh HDPE đang dùng tạm `item-detergent`.

## Checklist Definition of Done (PLAN mục 5)

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Tab không tải lại, Back/Forward đúng, mở thẳng link sâu | **Đạt** | |
| 2 | 360×740 không cần cuộn để thấy nút chính, không cuộn ngang | **Đạt** | 0 cuộn ở cả 177 trạng thái đã đo ở khung này |
| 3 | Mọi trò chơi trọn bằng ngón tay, không lỗi console | **Đạt** | Cảm ứng giả lập; B01 làm Puzzle khó đọc nhưng vẫn xong được |
| 4 | Điểm/huy hiệu đúng, còn sau tải lại, chơi lại không cộng | **Đạt** | |
| 5 | Tải PNG 1080×1350; có Web Share thì chia sẻ thẳng ảnh | **Đạt** | Web Share kiểm bằng hàm giả lập |
| 6 | Không có lỗi kiến thức đã biết | **Đạt** | |
| 7 | Tải lần đầu < 1,5 MB, ảnh lazy-load | **Đạt** | Trừ 5 ảnh dải Home (B23) |
| 8 | `prefers-reduced-motion`, `alt`, nút có nhãn | **Đạt** | |

## Giới hạn của đợt QA

- **Chưa thử trên máy thật.** Không có Safari iOS và Chrome Android đời cũ; cần thử cảm ứng, tải ảnh, Web Share và chiều cao `100dvh` trên iPhone và máy Android thật.
- Kiến thức chỉ đối chiếu với `CONTENT-REVIEW.md`, không mở lại nguồn gốc. 11 link 🟡 vẫn cần người mở.
- Dung lượng gzip là ước tính, vì server thử không nén. Font Google tải từ mạng thật, chưa đo trên Wi-Fi trường.
- Tương phản đo tự động, bỏ qua số trên tam giác mã nhựa vì là kết quả đo sai (chữ SVG). Chip "Đổi" lệch 3px ở Passport là chủ ý thiết kế.

**Không phải lỗi app:** sau một cú kéo cảm ứng, cú chạm kế tiếp đôi khi mất `click`. Trên trang trắng không có mã của app vẫn lặp lại, chỉ 1–2/8 lần có click. Đây là giới hạn của sự kiện giả lập qua CDP; bot đã có cách né. Vẫn nên để ý khi thử trên máy thật.

## Đề xuất sửa file người khác

Thứ tự đề xuất, chưa sửa gì:

1. **B02:** bỏ từ khen ở đầu 19 `explain`, để engine tự nói đúng/sai.
2. **B01:** trong `order.js`, bỏ `minHeight` của kho khi kho chỉ còn nút "Kiểm tra"; ở máy nhỏ thu gọn lời Ebi để nhường chỗ.
3. **B03:** thêm `@media (max-height: 480px)`: hàng ngang ảnh + lời, thanh nút không bị đè. Home tương tự.
4. **B08:** `.btn-primary { --btn-bg: var(--green-700) }`.
5. **B06:** bọc `decodeURIComponent` bằng try/catch, lỗi thì coi như link sai.
6. **B07, B12, B13:** router đóng modal khi đổi route, chuyển tiêu điểm vào `#stage`; thêm `ctx.replace()` cho link con sai.
7. **B10:** `store` nghe sự kiện `storage` để nạp lại khi tab khác ghi.
8. **B11:** trộn phương án trong engine quiz.
9. Thêm `.gitignore` cho `qa-shots/`.

Script mới: `scripts/qa_common.py`, `qa_screens.py` (đã mở rộng), `qa_play.py`, `qa_audit.py`. Ảnh bằng chứng: `docs/qa-evidence/` (mục này thêm ngoài phần "Sở hữu" để báo cáo có ảnh).

## Hồi quy trước bản xem trước (M7.2)

Commit đã kiểm: `127d16e` (M7.1, ký hiệu nhựa Lab bước 1) + script M7.2. Ngày 07/11/2026.

| Bộ test | Kết quả |
|---|---|
| `node scripts/validate_data.mjs` | 9 file · 0 lỗi · 0 cảnh báo |
| `python3 scripts/qa_play.py` (mọi nhóm) | **216/216 PASS** |
| `python3 scripts/qa_screens.py` (33 route, 10 khung, kèm trạng thái) | 1624 trạng thái · 0 lỗi console · 0 lỗi 404 · 6 khung chính không cuộn, không cuộn ngang · xoay ngang: mọi nút chính bấm được · Puzzle: 0 ô chồng |
| Gói `deploy/ecobit-hub` (`QA_ROOT`, 7 route đại diện) | 70 trạng thái · 0 lỗi console · 0 lỗi 404 |

PM đã chấp nhận, không sửa: chip "Đổi" ở Passport lệch 3px; hộp chọn avatar cuộn khi xoay ngang (+16…46px); ô trống Puzzle ≥ 24px.
Còn lại, để M8: khung phụ 320×568 vẫn cuộn +37…132px ở nhiều route (B20), `home/map` cuộn ngang 4px ở 320px.
