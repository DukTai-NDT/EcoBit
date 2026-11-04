# Agent C – ECO HOME · ECO PASSPORT · ECO CONNECT

Bạn là Agent C trong dự án ECObit HUB. **Đọc trước: `docs/agents/RULES.md`, `docs/PLAN.md` (mục 0, 1, 2.1–2.4, 5), `src/core/*`, `index.html`, `src/data/{site,stats,timeline,partners,gallery}.js`. Xem ảnh `public/img/step-1..5-*.webp`.**

## Sở hữu
`src/zones/{home,passport,connect}.js` · `src/styles/zones/{home,passport,connect}.css`
Lưu ý: `home.js`/`home.css` đang có bản dở của agent trước (dải biến đổi quá nhỏ trên điện thoại, mô tả trên bản đồ bị cắt) – sửa tiếp hoặc làm lại tuỳ bạn.

## 1. ECO HOME
- **`#/home`** – Ebi lớn vẫy tay + bong bóng "Xin chào! Mình là Ebi…" (giới thiệu ngắn), tiêu đề "ECObit HUB – Thế giới tái chế trong tầm tay", khẩu hiệu "Một chiếc chai, muôn vàn khả năng", nút **[BẮT ĐẦU KHÁM PHÁ] → `#/journey`**, **[TÌM HIỂU VỀ ECObit] → `#/connect`**. Rê chuột vào Ebi (máy tính) → đổi tư thế; chạm Ebi (điện thoại) → nói câu ngẫu nhiên.
  Thay "cuộn có chuyển động" bằng **dải biến đổi** chai → mảnh → hạt → sợi → sản phẩm (5 ảnh step), tự chạy tuần tự, có chấm điều hướng / nút dừng. Ảnh phải đủ lớn trên điện thoại.
- **`#/home/map`** – bản đồ 6 khu còn lại như "địa điểm" (nút sticker: biểu tượng, tên, 1 dòng mô tả, tiến độ từ `store.summary()`) + 3 số liệu chiến dịch (`stats.items` có `home:true`, `null` → "Đang cập nhật"). Có nút chuyển qua lại giữa 2 màn. Máy tính được gộp nhiều hơn nếu vừa.

## 2. ECO PASSPORT
- **`#/passport`** – tên hiển thị (ô nhập → `store.setProfile`), avatar = 1 trong 6 tư thế gốc (thumbs, earth, megaphone, plant, arms, recycle), cấp độ (`store.level()`: tên, emoji, thanh tới cấp sau), tổng ECO POINT, trò đã xong x/5, chặng Journey x/5, 5 huy hiệu (`BADGES` trong store.js; khoá/mở, chạm xem mô tả & cách mở). Nút "Làm lại từ đầu" (xác nhận bằng `modal`) → `store.reset()`.
- **`#/passport/card`** – thẻ thành tích PNG **1080×1350** bằng Canvas 2D: nền kem + hoạ tiết, Ebi tư thế avatar (vẽ `ebiSvg({pose, still:true})` lên canvas qua `Image` với data URL), tên, cấp, điểm, huy hiệu đã có, `site.hashtag`, địa chỉ web. Chờ `document.fonts.ready` trước khi vẽ. Nút **Tải ảnh** (download), **Chia sẻ ảnh** (`navigator.share({files})` khi `canShare` – trên điện thoại gửi được sang Instagram/Zalo), **Chia sẻ Facebook** (`https://www.facebook.com/sharer/sharer.php?u=` + `site.publicUrl` hoặc `location.origin+location.pathname`). Ghi chú: Instagram không đăng thẳng từ web, hãy tải ảnh rồi đăng.
- **`#/passport/wallpapers`** – 3 hình nền Ebi 1080×1920 vẽ bằng canvas, mở khoá theo cấp (VD Chồi non / Cây non / Đại thụ ECO theo `LEVELS`); khoá → ổ khoá + điều kiện; mở → tải về.

## 3. ECO CONNECT (chuyển màn con bằng segmented control trong màn)
- **`#/connect`** – giới thiệu ngắn chiến dịch + dòng thời gian `timeline.js` (done/now/upcoming).
- **`#/connect/stats`** – bảng số liệu đã xác minh (icon, nhãn, giá trị định dạng `vi-VN`, đơn vị; `null` → "Đang cập nhật"), nguồn + ngày cập nhật.
- Tab **Ảnh** / **Đối tác** chỉ xuất hiện khi `site.showGallery` / `site.showPartners` bật **và** mảng có dữ liệu.

## Nghiệm thu
Không màn nào cuộn ở 360×740; thẻ thành tích tải về được PNG đúng kích thước; giả lập điểm cao (đặt localStorage `ecobit.v1`) thấy huy hiệu/hình nền mở khoá; không lỗi console.
