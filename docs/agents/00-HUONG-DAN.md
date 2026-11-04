# ECObit HUB – Điều phối đội agent

## Đội
| Vai | Công cụ | Làm gì | Prompt |
|---|---|---|---|
| **PM/PO** | Claude chat (Project "Landing page Nhua Xanh") | Kế hoạch, duyệt nội dung & ảnh, review báo cáo code, quyết định phạm vi, nghiệm thu | — |
| **Dev** | Claude Code | Viết code theo từng nhiệm vụ M1–M6 | `CLAUDE.md` + `docs/agents/code/M*.md` |
| **Nghiên cứu 1** | ChatGPT (bật Search) | Mã nhựa, trò SORT/MATCH, lời thoại Journey/Lab/Puzzle; kiểm tra chéo bài của Gemini | `research/R1`, `R3`, `R4` |
| **Nghiên cứu 2** | Gemini | "Bạn có biết?", QUIZ, DETECTIVE; kiểm tra chéo bài của ChatGPT | `research/R2`, `R4` |
| **Minh hoạ** | Gemini Nano Banana | Ảnh địa điểm, đồ vật, cảnh Journey, máy Lab | `images/IMAGE-PROMPTS.md` |
| **Bạn** | — | Chuyển kết quả giữa các agent, test điện thoại thật, làm việc với khách | — |

## Luồng
```
ChatGPT R1, R3 ─┐                 ┌─ Gemini R4 kiểm tra R1, R3 ─┐
Gemini  R2     ─┴─► kết quả ─────►┤                              ├─► PM duyệt ─► content-in/ ─► Claude Code M4
                                  └─ ChatGPT R4 kiểm tra R2  ───┘
Nano Banana ─► raw/*.png (đặt đúng tên) ─────────────────────────────────────────────────► Claude Code M4

Claude Code: M1 ─► M2 ─► M3 ─► M4 ─► M5 ─► M6 (phiên mới) ─► PM review ─► M7 sửa lỗi
                    (M2, M3 chạy được song song với M1 ở 2 cửa sổ terminal)
```

## Lịch đề xuất (ra mắt trước ECObit Day 21/11)
| Ngày | Claude Code | ChatGPT / Gemini | Nano Banana | PM (Claude chat) |
|---|---|---|---|---|
| T4 04/11 | M1 Engine + PLAY | R1 (ChatGPT), R2 (Gemini) | Nhóm L + I | — |
| T5 05/11 | M2 DISCOVER | R3 (ChatGPT), R4 kiểm tra chéo | Nhóm J + M | Review M1 |
| T6 06/11 | M3 HOME · PASSPORT · CONNECT | sửa theo PM | ảnh làm lại (nếu có) | **Duyệt nội dung & ảnh** → content-in/ |
| T7 07/11 | M4 nhập nội dung + ảnh, M5 JOURNEY · LAB | — | — | Review M2–M4 |
| CN 08/11 | M6 QA (phiên mới) → M7 sửa | — | — | Review QA, lập danh sách M7 |
| T2 09/11 | deploy bản xem trước | — | — | Gửi khách link + danh sách nội dung cần duyệt |
| T3–T4 10–11/11 | vòng sửa 1–2 | — | — | Chốt phạm vi sửa |
| trước 21/11 | — | — | — | GA, tên miền, QR, test điện thoại thật |

## Quy trình mỗi bước
**Claude Code**
1. Lần đầu: `git init && git add . && git commit -m "M0: khung"` trong thư mục dự án.
2. Mở `claude` tại thư mục dự án (tự đọc `CLAUDE.md`). Dán nguyên văn 1 file `docs/agents/code/M*.md`.
3. Xong: Claude Code commit. Copy **báo cáo cuối** gửi PM. `/clear` trước nhiệm vụ sau.
4. Muốn chạy M2/M3 song song M1: mở terminal thứ 2 (file tách rời nên không đè nhau), hoặc dùng `git worktree`.

**ChatGPT / Gemini**
1. Dán nguyên văn file R*. Bật tìm kiếm web.
2. Dán kết quả sang mô hình còn lại kèm R4.
3. Gửi PM: bản đã sửa của R4 + bảng lỗi + bảng nguồn. PM duyệt xong sẽ trả lại các file `.js` cuối để đặt vào `content-in/`.

**Nano Banana**
Làm theo `images/IMAGE-PROMPTS.md`; lưu PNG đúng tên vào `raw/`. Gửi PM ảnh xem nhanh nếu muốn duyệt trước khi M4.

## Gửi PM gì để tiết kiệm token
- Báo cáo cuối của Claude Code (≤ 25 dòng), không cần gửi cả mã nguồn — chỉ gửi zip khi PM yêu cầu review sâu hoặc tích hợp.
- Nội dung: chỉ bản sau R4 (không gửi bản nháp).
- Ảnh: 1 ảnh ghép nhiều tấm (contact sheet) thay vì từng tấm.

## Trạng thái hiện tại (04/11)
- ✅ Khung app 7 tab, router, store điểm/huy hiệu, Ebi SVG 9 tư thế, 12 ảnh sticker, `codes.js` bản nháp, dữ liệu mẫu cho mọi file, README, DEPLOY, netlify.toml.
- 🟡 `src/core/resin.js` (ký hiệu tam giác mã nhựa) – đã viết, M2 dùng tiếp.
- 🟡 `src/zones/home.js` + `home.css` – bản dở (dải biến đổi quá nhỏ trên điện thoại, mô tả bản đồ bị cắt) – M3 sửa tiếp hoặc làm lại.
- ⚠️ Nhiều hũ sữa chua ở VN là PS (số 6) chứ không phải PP – đã sửa ví dụ trong `codes.js`, `sort.js`; R1–R4 đều được nhắc kiểm tra.
