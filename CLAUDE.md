# CLAUDE.md – ECObit HUB

Claude Code là agent **implement** của dự án. PM/PO là Claude chat (điều phối, review, nghiệm thu). Nghiên cứu nội dung do Gemini/ChatGPT, ảnh do Gemini (Nano Banana).
Nhiệm vụ cụ thể nằm trong `docs/agents/code/M*.md` – người dùng sẽ dán từng nhiệm vụ vào.

## Cách làm việc (tiết kiệm token)
- Mỗi nhiệm vụ M* = 1 phiên. Xong nhiệm vụ → commit (`git commit -m "M1: ..."`) → người dùng `/clear` trước nhiệm vụ sau.
- **Không tạo subagent.** Chỉ đọc file cần cho nhiệm vụ; không đọc lại file vừa ghi; không in cả file lớn ra màn hình.
- Không viết lại file ngoài phạm vi "Sở hữu" của nhiệm vụ.
- Báo cáo cuối ngắn (≤ 25 dòng) để người dùng chuyển cho PM.

## Dự án
Website giáo dục tái chế nhựa cho học sinh Việt Nam. "ECObit HUB – Thế giới tái chế trong tầm tay", concept "Một chiếc chai, muôn vàn khả năng". Mascot **Ebi** (chai nhựa nắp xanh, lá non, khăn tái chế) là người dẫn chuyện/quan sát – **không bao giờ bị nghiền**.

## Kỹ thuật
- **Không build, không npm, không thư viện ngoài.** HTML + CSS + JavaScript ES modules thuần. Chạy trên Safari iOS 15+ và Chrome Android đời cũ (tránh cú pháp quá mới như import attributes, `:has()` cho logic quan trọng).
- Chạy thử: `python3 -m http.server 5173` tại thư mục gốc → mở `http://localhost:5173`.
- Khi cần hiểu khung: `docs/PLAN.md`, `src/core/{ui,store,ebi,router}.js`, `src/main.js`, `src/styles/{tokens,base,shell}.css`.
- Module khu (zone) theo hợp đồng PLAN 2.1: `export default { id, title, short, icon, mount(el, ctx) { …; return cleanup } }`. `ctx.params`, `ctx.go('/zone/sub')`, `ctx.store`.
- Tiến độ/điểm chỉ qua `store` (PLAN 2.2). **Không** gọi `localStorage` trực tiếp.
- Ảnh: `ui.img('code-pet', 'alt')` → `public/img/code-pet.webp`. Danh sách ảnh: `code-{pet,hdpe,pvc,ldpe,pp,ps,other}`, `step-1-bottle`, `step-2-flakes`, `step-3-pellets`, `step-4-yarn`, `step-5-products`.
- Ebi: `ebi({pose, mood, size})`, `setEbi(el, opts)`, `react(el, ok)` trong `src/core/ebi.js`. Tư thế: thumbs, earth, megaphone, plant, arms, recycle, wave, cheer, think. Biểu cảm: happy, smile, wow, sad, wink.
- Tiện ích `src/core/ui.js`: `h()`, `css()`, `img()`, `toast()`, `modal()`, `confetti()`, `bubble()`, `say()`, `backBtn()`, `icon()`, `shuffle()`, `vibrate()`.
- CSS riêng của khu: `src/styles/zones/<zone>.css`, nạp trong `mount` bằng `css('zones/<zone>.css')`.

## Bố cục THEO TAB – quan trọng nhất
- 7 khu = 7 tab. Mỗi màn hình **vừa khít khung nhìn, không cuộn trang**.
- Vùng sân khấu thực tế: điện thoại 360×740 → **≈ 360×620 px** (trừ thanh trên 56 + thanh tab đáy 64); máy tính 1366×768 → ≈ 1366×704.
- Nội dung dài → chia **màn con có URL** (`#/zone/sub`) hoặc tab nhỏ trong màn; không dựa vào cuộn. Riêng máy rất thấp (<640px) được phép cuộn nhẹ (đã có `overflow-y:auto` dự phòng).

## Phong cách "sticker"
- Viền 3px màu `--ink`, bóng lệch `--lift`, bo tròn, nền kem; tiêu đề font Baloo 2; chữ ≥16px; vùng chạm ≥44px.
- Dùng token trong `tokens.css` và class `.btn .btn-primary .btn-sun .card .chip .bubble .progress .dots .anim-pop .stagger` trong `base.css`. Màu 7 mã: `var(--code-pet)` … `var(--code-other)`.
- Ebi xuất hiện kèm bong bóng lời thoại để hướng dẫn/phản hồi (cheer khi đúng, think hoặc mood sad khi sai).
- Tôn trọng `prefers-reduced-motion` (đã có trong base.css).

## Ngôn ngữ
Mọi chữ hiển thị tiếng Việt có dấu, câu ngắn, giọng Ebi xưng "mình" gọi "bạn". Nội dung kiến thức lấy từ `src/data/*`, không viết cứng trong code.

## Ranh giới file
Chỉ sửa file trong mục "Sở hữu" của brief. Cần đổi file khác → ghi đề xuất ở báo cáo cuối, không tự sửa.

## Tự kiểm tra trước khi báo xong
- Mở từng route ở 360×740 (DevTools chế độ điện thoại, bật cảm ứng) và 1366×768: không cuộn, không cuộn ngang, không lỗi console.
- Chạy `python3 scripts/qa_screens.py <route…>` (cần `pip install playwright && playwright install chromium`; hoặc đặt `CHROME_PATH`) để chụp màn hình vào `qa-shots/`.

## Báo cáo cuối (tiếng Việt, ngắn)
File đã tạo/sửa · route · API (nếu có) · đã test gì · vấn đề còn lại · đề xuất sửa file người khác.
