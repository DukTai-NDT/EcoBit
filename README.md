# ECObit HUB – Thế giới tái chế trong tầm tay

Website giáo dục tái chế nhựa cho chiến dịch ECObit. 7 khu hiển thị theo tab, mỗi khu một màn hình:
ECO HOME · ECO DISCOVER · ECO JOURNEY · ECO LAB · ECO PLAY · ECO PASSPORT · ECO CONNECT.

- Không cần build, không cần cài thư viện: HTML + CSS + JavaScript module thuần.
- Tiến độ, ECO POINT, huy hiệu lưu trên trình duyệt (localStorage) – không đăng nhập.

## Chạy thử trên máy
```bash
python3 -m http.server 5173      # hoặc: npx serve .
# mở http://localhost:5173
```
(Phải chạy qua server; mở thẳng file index.html sẽ không tải được module.)

## Sửa nội dung – chỉ cần sửa `src/data/`
| File | Nội dung |
|---|---|
| `site.js` | Tên, link công khai, mã Google Analytics, bật/tắt mục đối tác, ảnh, PNG Ebi |
| `stats.js` | Số liệu chiến dịch đã xác minh (`null` = "Đang cập nhật") |
| `timeline.js` | Các mốc chiến dịch, trạng thái done/now/upcoming |
| `codes.js` | 7 mã nhựa |
| `facts.js` | Thẻ "Bạn có biết?" |
| `quiz.js`, `sort.js`, `match.js`, `puzzle.js`, `detective.js` | 5 trò ECO PLAY |
| `journey.js`, `lab.js` | 5 chặng Journey, thí nghiệm Lab |
| `partners.js`, `gallery.js` | Đối tác, ảnh sự kiện (ẩn tới khi bật trong site.js) |

Nội dung cần khách duyệt: xem `docs/CONTENT-REVIEW.md`.

## Ảnh
- Ảnh gốc AI để trong `raw/`, chạy `python3 scripts/sticker.py raw/ public/img/` để tách nền + thêm viền sticker (cần Pillow, numpy, scipy).
- Ebi hiện là SVG (`src/core/ebi.js`). Khi có PNG tách nền của khách: lưu thành `public/img/ebi/{thumbs,earth,megaphone,plant,arms,recycle}.webp` rồi đặt `ebiPng: true` trong `site.js`.

## Triển khai
Xem `docs/DEPLOY.md`.

## Tài liệu
- `docs/PLAN.md` – kế hoạch, kiến trúc, hợp đồng module
- `docs/CONTENT-REVIEW.md` – nội dung cần duyệt
- `docs/QA-REPORT.md` – kết quả kiểm thử
