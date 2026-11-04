# Triển khai ECObit HUB

## Netlify (khuyên dùng – kéo thả)
1. Vào https://app.netlify.com/drop
2. Kéo nguyên thư mục dự án (có `index.html` ở gốc) vào trang.
3. Đổi tên site trong *Site configuration → Change site name* (VD `ecobit-hub` → `ecobit-hub.netlify.app`).
4. Điền link này vào `publicUrl` trong `src/data/site.js`, kéo thả lại để cập nhật.

`netlify.toml` đã cấu hình cache cho ảnh và chặn thư mục `raw/`, `scripts/`, `docs/` khỏi bị truy cập công khai.

## Vercel
`vercel` (CLI) hoặc import repo GitHub → Framework: *Other*, Build command: để trống, Output: `.`

## GitHub Pages
Settings → Pages → Deploy from branch → `/ (root)`.

## Trước khi phát hành
- [ ] `site.js`: `publicUrl`, `gaId` (nếu dùng Google Analytics 4)
- [ ] `stats.js`: số liệu đã xác minh + `updatedAt`
- [ ] `timeline.js`: trạng thái các mốc
- [ ] Khách duyệt `docs/CONTENT-REVIEW.md`
- [ ] Test trên 1 iPhone + 1 Android thật (kéo thả, quiz có giờ, tải thẻ thành tích)
- [ ] Tạo QR trỏ tới `publicUrl` cho ECObit Day 21/11 (gợi ý: thêm `?utm_source=qr&utm_medium=offline&utm_campaign=ecobitday` để đo trong GA)

## Cập nhật số liệu sau sự kiện
Sửa `src/data/stats.js` → kéo thả lại thư mục lên Netlify (hoặc commit nếu dùng GitHub).
