# M7 – Sửa lỗi theo QA-REPORT (Claude Code, phiên MỚI – sau khi gộp M6)

Nhiệm vụ cho Claude Code trong dự án ECObit HUB (CLAUDE.md ở gốc đã nạp sẵn quy tắc chung). Mục tiêu: bản đủ sạch để gửi khách xem trước ngày **09/11**.
**Đọc trước: `docs/QA-REPORT.md` (bảng lỗi B01–B26, có số dòng nghi ngờ), `docs/PLAN.md` mục 2.2 và 5.** Không đọc lại cả repo, chỉ mở file của từng mục.

## Sở hữu
- Lõi: `src/core/{router,store,ui}.js` · `src/styles/{tokens,base,shell}.css`
- Engine: `src/engines/{order,quiz}.js` · `src/styles/engines.css`
- Khu: `src/zones/{home,play,discover,journey,lab,passport}.js` · `src/styles/zones/{home,play,discover,journey,lab,connect}.css`
- Dữ liệu: `src/data/{quiz,detective,journey,match,lab}.js` (chỉ những trường nêu dưới)
- `scripts/validate_data.mjs` · `scripts/qa_*.py` · `.gitignore` (tạo mới) · thư mục `raw/` (tạo mới)
Chỉ sửa đúng chỗ của từng mục, không refactor, không đổi giao diện ngoài phạm vi.

## P1 – Phải xong (3 lỗi Cao + lỗi đi ngược kiến thức/giáo dục)
1. **B02 – Lời giải thích trái kết quả.** Viết lại câu mở đầu của 19 trường `explain` trong `quiz.js`, `detective.js`, `journey.js`: bỏ "Đúng rồi!/Chính xác!/Chuẩn luôn!/Rất tốt!/Tuyệt lắm!/Bắt được lỗi rồi!/Bạn tìm đúng rồi!/Đúng,…", câu bắt đầu thẳng vào kiến thức. **Giữ nguyên nội dung kiến thức**, chỉ cắt cụm khen (nếu cắt xong câu cụt thì sửa tối thiểu cho trôi). Lời đúng/sai do engine nói (`verdict`). Thêm luật vào `validate_data.mjs`: báo **lỗi** nếu `explain` mở đầu bằng từ khen/đúng/sai. Soát thêm mọi trường lời Ebi hiển thị **bất kể đúng hay sai** (vd `learn`, `why`) – nếu có lời khen cố định cũng sửa.
2. **B01 – Puzzle chồng ô ở 360×740, 375×667.** `order.js:118`: không giữ `minHeight` của kho khi kho chỉ còn nút "Kiểm tra" (hoặc giữ nhưng trả chỗ cho cột ô); hàng lưới không thấp hơn ô (ô ≥ 44px, nhãn 2 dòng đọc được). Máy thấp thì thu gọn lời Ebi. Đo lại: 0 chỗ chồng.
3. **B03 – Điện thoại xoay ngang.** Thêm `@media (max-height: 480px) and (orientation: landscape)` cho Journey, Home và mọi màn có nút chính: ảnh + lời xếp hàng ngang, thanh nút không bị phần tử nào đè. Ở khung này **được phép cuộn sân khấu**, nhưng mọi nút chính phải bấm được. Kiểm ở 740×360, 667×375, 844×390.
4. **B11 – Trộn phương án Quiz/Detective.** Đã có bản làm sẵn ở commit `0dda8d7` (nhánh `claude/pm-duyet-fixes-e51db7`, chưa gộp): `git show 0dda8d7 -- src/engines/quiz.js` → áp lại đúng phần trộn (`order = shuffle(...)`, chữ A-B-C-D theo vị trí hiển thị, chấm theo `answer` gốc). Chỉ lấy file engine, **không** lấy file data ở commit đó (đã cũ).
5. **B16 – Ảnh lộ đáp án.** Quiz Q3: bỏ `img`. Q7, Q9: nếu ảnh trùng hoặc gợi thẳng đáp án thì bỏ `img`; ghi lại quyết định trong báo cáo.
6. **B22 – Lời chào Home.** Thay "chiếc chai nhựa muốn được tái sinh" (dễ hiểu Ebi sẽ vào máy) bằng: `Xin chào! Mình là <b>Ebi</b>. Cùng mình xem một chiếc chai có thể trở thành những gì nhé!`

## P2 – Nên xong trước 09/11 (Trung bình + việc đã gom từ M2–M5)
7. **Hàng đợi toast** (gom từ M5, ưu tiên cao): `toast()` hiện **lần lượt, tối đa 1 cái**, ~1,8 giây/cái, đặt mép trên ngay dưới thanh trên, `pointer-events: none`, không che lời Ebi. Cuối Journey (+100đ + 2 huy hiệu + confetti) và cuối Lab không còn che vòng tranh/lời Ebi.
8. **B08 – Tương phản nút chính:** `.btn-primary { --btn-bg: var(--green-700) }`. Soát chỗ khác có chữ trắng trên `--green-500`/`--ok`, đạt ≥ 4,5:1.
9. **B06 – Link hỏng:** bọc `decodeURIComponent` trong `router.js` bằng try/catch, lỗi thì coi như link sai (về Home bằng `replaceState`).
10. **B07 + B12 + B13 – Router:** khi đổi route thì đóng mọi modal đang mở; chuyển tiêu điểm vào `#stage` (`tabindex="-1"`, `preventScroll`); modal **giữ tiêu điểm bên trong** (Tab/Shift+Tab vòng trong hộp), đóng thì trả về phần tử cũ. Thêm `ctx.replace(path)` (dùng `replaceState`) và dùng nó cho link con sai ở `play.js:135`, `discover.js:372`, `journey.js:318`, `lab.js:452`. Passport đổi avatar xong: tiêu điểm về nút "Đổi".
11. **B10 – Hai tab ghi đè điểm:** `store` nghe sự kiện `storage` (và `pageshow`/`visibilitychange` khi trang hiện lại) → nạp lại `mem` từ localStorage rồi `emit('change')`. Không gọi `localStorage` ngoài `store.js`.
12. **B15 – Mất mảnh khi tải lại lúc mảnh đang bay:** lưu mảnh vào store **ngay khi xong nhiệm vụ**; hoạt ảnh bay chỉ là hiển thị. Toast/điểm hiện lúc nào cũng được, miễn qua hàng đợi ở mục 7.
13. **B05 – Khung giải thích ở 375×667:** đáp án và giải thích hiện đủ, không có vùng cuộn con cắt chữ (thu ảnh/Ebi khi khung giải thích mở).
14. **B04 – Nhãn Match tràn viền:** sửa ở `engines.css` (cỡ chữ co theo ô, padding). Chỉ khi CSS không đủ mới rút gọn nhãn trong `match.js`, giữ nguyên nghĩa, ghi vào báo cáo.
15. **B14 – Sảnh Play cuộn +8px ở 375×667:** về 0.
16. **B09 + B19 – Thanh tab và vùng chạm.** Quyết định của PM: nhãn thanh tab là **ngoại lệ** của quy tắc chữ ≥ 16px: tối thiểu **12px**, cho xuống 2 dòng (`Hành / trình`), các nhãn không dính nhau ở 360px; chip/nhãn phụ ≥ 14px. Vùng chạm ≥ 44px: chip điểm, logo, tab máy tính, `.modal-close`.
17. **Gom từ M2–M5:** `.btn-back` 16px trong `base.css`, bỏ ghi đè trong `discover.css`; đuôi bong bóng `.eng-coach` khi 1 dòng (`engines.css`), bỏ ghi đè trong `discover.css`; màn tranh vòng đời (`#/journey/finale`) ở 360px và 320px: nhãn "Mảnh PET sạch", "Sản phẩm mới" không chạm/tràn mép.
18. **Lab bước 1:** nhãn vật không ghi sẵn "PET 1 / HDPE 2" – chỉ hiện tên đồ vật (nếu cần, huy hiệu mã nhỏ chỉ hiện **sau khi** chọn).
19. **B24 (tương thích iOS 15.0–15.3):** mọi chỗ dùng `dvh` phải có dòng `vh` dự phòng đứng trước; `:focus-visible` có dự phòng `:focus` cho trình duyệt cũ.
20. **Dọn repo:** chuyển 3 file `gemini-code-*.js` ở gốc vào `raw/` (thêm `raw/README.md` 1 dòng: "bản nháp, không deploy"). Tạo `.gitignore`: `qa-shots/`, `__pycache__/`, `.claude/worktrees/`.

## Để sang M8 (không làm trong M7)
B17, B18, B20 (chấp nhận, trừ finale ở mục 17), B21, B23, B25, B26, `site.about`, chuyển lời Home vào `src/data/`, ảnh `loc-*` thu nhỏ, bố cục Lab trên máy tính.

## Kiểm tra trước khi báo xong
- `node scripts/validate_data.mjs`: 0 lỗi (có luật mới ở mục 1).
- `python3 scripts/qa_play.py` và `qa_screens.py`: 10 ca hỏng của M6 (B06, B07, B10, B12, B13, B15) chuyển sang đạt, không ca cũ nào hỏng thêm.
- Thêm vào `qa_screens.py`/`qa_play.py`: khung **740×360, 667×375, 844×390**, kiểm mọi nút chính bấm được (`elementFromPoint` ở tâm nút trả về chính nút, sau khi cuộn tới); đo chồng ô Puzzle = 0.
- 6 khung nhìn yêu cầu vẫn: không cuộn trang, không cuộn ngang, không lỗi console, không 404.
- Hết token giữa chừng: dừng sau P1 hoặc sau một mục P2 trọn vẹn, commit, ghi rõ mục còn lại.

## Kết thúc
Commit `M7: sửa lỗi QA (B01–B16, toast, router, store)`. Báo cáo ≤ 25 dòng: mục đã xong theo số, mục bỏ/hoãn và lý do, kết quả `qa_play`/`validate_data`, ảnh 740×360 của Journey trước/sau, file ngoài "Sở hữu" (nếu có).
