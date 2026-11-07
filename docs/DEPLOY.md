# Triển khai ECObit HUB

## Netlify (khuyên dùng – kéo thả)
1. Đóng gói: `python3 scripts/pack_deploy.py` → tạo `deploy/ecobit-hub/` (và `deploy/ecobit-hub.zip`).
   Script chỉ chép `index.html`, `netlify.toml`, `src/`, `public/`, tự kiểm không lọt `raw/`, `docs/`, `scripts/`, `qa-shots/` và mọi ảnh/import đều có file. Thấy `OK` ở dòng cuối mới kéo thả.
2. Vào https://app.netlify.com/drop
3. Kéo thả **thư mục `deploy/ecobit-hub/`** vào trang (không kéo cả repo).
4. Đổi tên site trong *Site configuration → Change site name* (VD `ecobit-hub` → `ecobit-hub.netlify.app`).
5. Cập nhật: đóng gói lại rồi kéo thả `deploy/ecobit-hub/` vào *Deploys* của site đó.

Mặc định là **bản xem trước** (`--preview`): bản chép `index.html` có `<meta name="robots" content="noindex, nofollow">` và `robots.txt` chặn toàn bộ, để Google không lập chỉ mục. `index.html` gốc không bị sửa.

**Bản phát hành chính thức (sau M8):** điền `publicUrl` trong `src/data/site.js` trước, rồi chạy `python3 scripts/pack_deploy.py --release` (không chặn máy tìm kiếm) và kéo thả như trên.

Kiểm gói trước khi gửi: `QA_ROOT=deploy/ecobit-hub python3 scripts/qa_screens.py home discover play/quiz journey lab/recycle passport/card connect` – phải 0 lỗi console, 0 lỗi 404.

`netlify.toml` đã cấu hình cache cho ảnh và vẫn chặn `raw/`, `scripts/`, `docs/` nếu lỡ kéo cả repo.

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
Sửa `src/data/stats.js` → chạy `python3 scripts/pack_deploy.py` rồi kéo thả lại `deploy/ecobit-hub/` lên Netlify (hoặc commit nếu dùng GitHub).
