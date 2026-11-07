# PM DUYỆT NỘI DUNG – ECObit HUB

Ngày: 04/11/2026 · Người duyệt: PM (Claude) · Phạm vi: 9 file `.js` + 4 báo cáo trong `docs/Kiểm Định`

## Kết luận

**DUYỆT CÓ ĐIỀU KIỆN.** Nội dung đủ chất lượng để đưa vào M4 sau khi áp dụng **8 sửa bắt buộc (mục A)**. Mục B nên sửa cùng lúc (nhanh). Mục C gửi khách xác nhận, **không chặn** M4.

Đánh giá chung: đội research làm tốt. Hai báo cáo kiểm định chéo bắt được đúng các lỗi nặng (BPA, lò vi sóng, 9–12 chai/áo, 5 g vi nhựa/tuần, "tái chế vô hạn", Ebi không vào máy). CONTENT-REVIEW trung thực về trạng thái nguồn.

| Báo cáo | Đánh giá |
|---|---|
| BAO_CAO_KIEM_DINH_detec_facts_quiz | Tốt – mỗi lỗi có link nguồn cụ thể |
| BAO_CAO_KIEM_DINH_journey_lab_puzzle | Tốt – có thẩm định cả độ tin cậy của nguồn cũ |
| REVIEW_REPORT_code_match_sort | **Yếu về nguồn** – cột Nguồn không có link ("Thực tế bao bì FMCG", "Plastics Europe / Ellen MacArthur"). Ý sửa đúng nhưng không kiểm chứng được |
| CONTENT-REVIEW | Tốt – phân hạng ✅🔵🟡🟠⚠️ rõ ràng |

## Kiểm tra kỹ thuật (PM tự chạy)

- 9/9 file import được dưới dạng ES module.
- `quiz` answer = `[0,1,2,3,0,1,2,3,1,2]`; `detective` = `[1,0,2,1,0,2]`, mỗi vòng đúng 1 câu sai.
- Không có câu nào để Ebi bị băm/nghiền/nấu chảy; Ebi chỉ dẫn chuyện và quan sát.
- 27 mã ảnh được tham chiếu; 15 ảnh `item-*`, `scene-*`, `lab-*` chưa có (khớp CONTENT-REVIEW).
- Vượt giới hạn từ: `sort` i11, i12 (6 từ) và `puzzle` s3 (9 từ).

## Quyết định cho 7 mục CONTENT-REVIEW chờ PM

| # | Mục | Quyết định |
|---|---|---|
| 1 | f12 – 62% | **Đổi thành "hơn 60%".** PM đã đọc trang World Bank: "More than 60 percent of plastics items are single use plastics". Số 62% không có trên trang |
| 2 | f15, Q4 – nguồn EPA sai | Duyệt thay nguồn: f15 → EPA *How do I recycle common recyclables*; Q4 → RSC Sustainability 2025 |
| 3 | sort i8, match hdpe | i8 ghế nhựa: giữ (PP), gửi khách xác nhận. match hdpe: **thay** (xem A3) |
| 4 | f4, Q3 – hũ sữa chua | Giữ. Câu đã viết dạng "một số… một số…" nên an toàn. Gửi khách xem mã trên vài hũ thật |
| 5 | match dùng emoji | Chấp nhận emoji, **trừ emoji vẽ sai chất liệu** (xem A4) |
| 6 | Vượt số từ | Rút gọn (xem A6) |
| 7 | f14 – Điều 64 NĐ 08/2022 | **Thay f14 bằng thẻ khác.** Ngày 31/10/2026, Bộ NN&MT đưa ra dự thảo nghị định đề xuất lùi lộ trình dừng sản xuất, nhập khẩu túi ni lông mỏng đến 2031. Quy định đang có thể thay đổi đúng dịp ECObit Day |

## A. Sửa bắt buộc trước M4

**A1. `facts.js` f12** – `text`:
> Theo Ngân hàng Thế giới (2022), hơn 60% số món rác nhựa ghi nhận ở sông và bờ biển Việt Nam là đồ nhựa dùng một lần.

**A2. `facts.js` f14** – thay toàn bộ, giữ `id: 'f14'`, `tag: 'Việt Nam'`, `emoji: '🗑️'`:
> Ở Việt Nam, rác sinh hoạt được hướng dẫn chia thành 3 nhóm: có thể tái sử dụng, tái chế; chất thải thực phẩm; và rác còn lại.

Nguồn: Cổng TT Chính phủ (đã dùng ở journey chặng 2).

**A3. `match.js` hdpe** – `right: { label: 'Can nước giặt vỏ đục', img: 'item-detergent' }`
Lý do: "Can nhựa 20 lít đựng nước" + 💧 dễ bị hiểu là bình 20 lít của máy nước uống. Loại bình này thường là PC hoặc PET, không phải HDPE. Trùng ví dụ với `sort` i4 cũng được, vì nhất quán giúp học sinh nhớ.

**A4. Emoji vẽ sai chất liệu** – trong game phân loại vật liệu, emoji không được vẽ một vật làm từ chất liệu khác:

| Mục | Emoji hiện tại | Vấn đề | Xử lý |
|---|---|---|---|
| sort i3 – Chai trà xanh | 🍵 | Chén trà bằng sứ | Ảnh mới `item-tea-bottle` |
| sort i6 – Bình dầu nhớt | 🛢️ | Thùng phuy kim loại | Ảnh mới `item-motor-oil` |
| sort i8 – Ghế nhựa đúc | 🪑 | Ghế gỗ trên hầu hết điện thoại | Ảnh mới `item-plastic-chair` |
| match pet – Chai dầu ăn | 🫗 | Không hiển thị trên Android/iOS cũ; không phải chai | Ảnh mới `item-cooking-oil` |

→ Thêm 4 ảnh này vào Nhóm R của `IMAGE-PROMPTS.md`. Nếu chưa kịp có ảnh: **chỉ hiện chữ, không dùng emoji**.

**A5. `codes.js` pp.fact** – thẻ PP đang nói chủ yếu về PS (hũ sữa chua), dễ gây rối. Thay bằng:
> Mình mách nhỏ: hộp PP chịu nhiệt khá tốt, nhưng muốn hâm lò vi sóng thì bạn vẫn phải tìm dòng chữ cho phép trên hộp. Chỉ thấy số 5 thôi thì chưa đủ đâu!

(Ý hũ sữa chua đã có ở thẻ PS – `products` – và ở f4.)

**A6. Rút gọn nhãn**
- `sort` i11 → `Ly mì xốp`
- `sort` i12 → `Khay xốp đựng thịt`
- `puzzle` s3 → `Rửa, tách mảnh nhựa trong bể nước`

**A7. Ảnh `code-hdpe`** – ảnh hiện tại vẫn là can sữa kiểu Mỹ. Vẽ lại thành can nước giặt (đã có trong việc còn lại của CONTENT-REVIEW, nâng lên bắt buộc).

**A8. Watermark Gemini** – 3 ảnh PM đã mở (HDPE, PVC, PS) đều còn dấu ✦ của Gemini ở góc dưới phải. Nhiều khả năng cả 12 ảnh đều có. M4 cần kiểm tra cả 12 ảnh, cắt hoặc xoá dấu trước khi xuất ảnh web.

## B. Nên sửa (nhanh, làm cùng lúc)

**B1. Đáp án đúng luôn là câu dài nhất** – lỗi này xảy ra ở 6/10 câu quiz, 3/6 vòng detective và 3/3 câu trong journey. Học sinh sẽ học mẹo "chọn câu dài". Rút gọn đáp án đúng ở 5 chỗ lệch rõ nhất:

| Vị trí | Đáp án mới |
|---|---|
| quiz Q5 `options[0]` | `Chai sạch giúp khâu tái chế dễ hơn` |
| quiz Q7 `options[2]` | `Hộp PP có nhãn “dùng lò vi sóng”` |
| journey chặng 1 `options[1]` | `Đổ cạn rồi đưa đến điểm thu gom` |
| journey chặng 5 câu 2 `options[1]` | `Tùy kích thước chai và chiếc áo` |
| detective vòng 6 `options[2]` | `Cứ để thức ăn thừa trong chai cho dễ tái chế.` |

Engine nên trộn thứ tự phương án khi hiển thị nhưng vẫn chấm theo `answer` gốc (đã nêu trong báo cáo journey).

**B2.** `sort` i9 → `Hộp nhựa hâm lò vi sóng` (để loại trừ trường hợp hộp thủy tinh).
**B3.** `facts.js` f4: `img: 'code-ps'` là hộp xốp, không phải hũ sữa chua → đổi thành `emoji: '🔎'`.
**B4.** `facts.js` f8: `tag: 'Đại dương'` → `'Môi trường'`, vì nội dung là sông, hồ và biển.
**B5.** `lab.js` c4: `Chai nước giặt ghi HDPE 2` → `Can nước giặt ghi HDPE 2` để thống nhất với codes và sort.
**B6.** `codes.js` pp.products: `Ống hút nhựa` → `Ghế nhựa đúc`. f18 đã nói ống hút "có thể là PP hoặc nhựa khác", nên thẻ PP không nên liệt kê ống hút như ví dụ chắc chắn.

**Nguyên tắc chốt cho các vòng sau:** câu mô tả (thẻ mã, facts) được dùng ví dụ "thường là…". Đồ vật trong **trò chơi có chấm điểm** (sort, match, quiz, lab) chỉ dùng vật mà loại nhựa gần như không đổi.

## C. Gửi khách xác nhận (không chặn M4)

1. Ví dụ HDPE: can nước giặt, chai nước tẩy bồn cầu, bình dầu nhớt xe máy (sort i4–i6, codes).
2. Ghế nhựa đúc là PP (sort i8, codes sau B6).
3. Chai dầu ăn trong suốt là PET (match pet); thùng xốp giữ lạnh là PS (match ps).
4. Hũ sữa chua: chụp mã của 3–5 hiệu phổ biến (f4, Q3, codes pp/ps).
5. Túi sột soạt ngoài chợ là HDPE, túi mềm là LDPE (codes ldpe.fact).

## D. Ghi chú quy trình cho vòng sau

- Prompt R4 phải bắt buộc **link URL cho mỗi nhận định**. Không chấp nhận nguồn dạng "thực tế thị trường".
- Lưu bản thô R1–R3 vào `docs/Kiểm Định/raw/`. Lần này không có bản thô nên không đối chiếu ngược được.
- Còn 11 link 🟡 chưa có người mở trực tiếp. Link World Bank (f12, ⚠️) PM đã đọc và xử lý ở A1.
- Tiến độ: research xong R1–R4 ngày 04/11, sớm 1 ngày so với lịch.

## Nguồn PM đã kiểm tra

- World Bank, *Towards a National Single-Use Plastics Roadmap in Vietnam* (07/2022): https://www.worldbank.org/en/country/vietnam/publication/towards-a-national-single-use-plastics-roadmap-in-vietnam-strategies-and-options-for-reducing-priority-single-use-plasti
- World Bank, thông cáo báo chí 25/07/2022: https://www.worldbank.org/en/news/press-release/2022/07/25/a-roadmap-to-stop-single-use-plastic-pollution-in-vietnam
- VnBusiness (31/10/2026), *Bộ NN&MT đề xuất thu tiền túi nilon, đồ nhựa dùng một lần thay vì cấm hoàn toàn*: https://vnbusiness.vn/bo-nnmt-de-xuat-thu-tien-tui-nilon-do-nhua-dung-mot-lan-thay-vi-cam-hoan-toan.html
