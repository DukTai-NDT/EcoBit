# M6 – QA độc lập (Claude Code, phiên MỚI – sau khi mọi khu xong)

Nhiệm vụ cho Claude Code trong dự án ECObit HUB (CLAUDE.md ở gốc đã nạp sẵn quy tắc chung). Bạn **không** viết tính năng; chỉ tìm lỗi và báo cáo (được sửa lỗi chính tả/lỗi một dòng hiển nhiên, ghi rõ trong báo cáo).
**Đọc trước: `docs/PLAN.md` (đặc biệt mục 5 – Definition of Done), `docs/CONTENT-REVIEW.md`.**

## Sở hữu
`docs/QA-REPORT.md` · `scripts/qa_screens.py` và script test mới trong `scripts/`

## Kiểm tra
1. **Điều hướng tab**: 7 tab, Back/Forward, mở thẳng link sâu (`#/play/quiz`, `#/discover/pvc`, `#/journey/3`, `#/lab/recycle`, `#/passport/card`), link sai → về Home.
2. **Không cuộn** ở 360×740, 375×667 (iPhone SE), 390×844, 768×1024, 1366×768, 1920×1080: không cuộn dọc ở màn chính, không bao giờ cuộn ngang. Chụp màn hình mọi route.
3. **Chơi trọn** mọi trò / chặng / thí nghiệm bằng cảm ứng (has_touch) và chuột; thử thả sai, hết giờ quiz, chơi lại.
4. **Điểm & huy hiệu** đúng quy tắc PLAN 2.2: lần đầu +20, đúng hết +10, Journey +100, Lab +30, không cộng lặp; 5 huy hiệu mở đúng điều kiện; còn nguyên sau khi tải lại; "Làm lại từ đầu" xoá sạch.
5. **Thẻ thành tích**: PNG 1080×1350, chữ tiếng Việt không vỡ; hình nền 1080×1920.
6. **Nội dung**: soát chính tả tiếng Việt, kiến thức đối chiếu `CONTENT-REVIEW.md`; đặc biệt các lỗi đã biết (BPA–PET, PVC/PC, tên LDPE, PP "số 4", hộp xốp, cốc sữa chua PS/PP).
7. **Khả năng truy cập**: ảnh có alt, nút có nhãn, điều khiển bằng bàn phím, tương phản chữ, `prefers-reduced-motion`.
8. **Hiệu năng**: tổng dung lượng tải lần đầu < 1,5 MB, không lỗi console, không 404.

## Báo cáo `docs/QA-REPORT.md`
Bảng lỗi: mức (Chặn / Cao / Trung bình / Thấp) · route · viewport · mô tả · cách tái hiện · ảnh chụp · file nghi ngờ. Cuối báo cáo: checklist Definition of Done (đạt/không đạt).
