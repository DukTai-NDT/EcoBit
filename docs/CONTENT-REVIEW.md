# CONTENT-REVIEW – ECObit HUB

Cập nhật: 04/11/2026. Phạm vi: 9 file nội dung trong `docs/Kiểm Định` sau vòng R4 và đợt rà soát của Claude Code. Trạng thái: **chờ PM duyệt**.

Cột "Khách xác nhận?" là đề xuất, PM quyết định cuối cùng.

## Quy ước trạng thái nguồn

| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ | Claude Code đã đọc trang nguồn và nội dung khớp |
| 🔵 | Link mở được, nhưng chưa đọc nội dung; dựa theo báo cáo R4 |
| 🟡 | Link chặn truy cập tự động; dựa theo báo cáo R4, cần người mở kiểm tra |
| 🟠 | Nguồn yếu hoặc chỉ là nguồn phụ, nên thay nếu có thể |
| ⚠️ | Nguồn không khớp hoặc chưa có nguồn, cần xử lý |

## Mục cần PM quyết định

| # | Mục | Vấn đề | Đề xuất |
|---|---|---|---|
| 1 | `facts.js` f12 | Giữ số 62% theo quyết định của người phụ trách, nhưng trang World Bank được trích ghi "hơn 60%" | Đổi thành "hơn 60%", hoặc đối chiếu báo cáo gốc rồi giữ 62% |
| 2 | `facts.js` f15; `quiz.js` Q4 | Trang EPA được trích không nói về bóp dẹp chai hay trình tự PET thành sợi | Thay nguồn (xem bảng dưới) |
| 3 | `sort.js` i8; `match.js` hdpe | Hai đồ vật mới chỉ có nguồn từ trang bán hàng hoặc nguồn nước ngoài | Khách xác nhận, hoặc chọn đồ vật khác |
| 4 | `facts.js` f4; `quiz.js` Q3 | Chưa có nguồn Việt Nam cho ý "hũ sữa chua có cả PS và PP" | Khách kiểm tra mã trên một số hũ sữa chua thật |
| 5 | `match.js` | 4/7 cặp dùng emoji, trong khi `D-content.md` yêu cầu `right.img` = `code-*` | Chấp nhận emoji, vì sản phẩm khác đồ vật trong ảnh `code-*` |
| 6 | `sort.js` i11, i12; `puzzle.js` s3 | Nhãn vượt số từ (6/5 và 9/8) | Rút gọn, hoặc nới giới hạn nếu giao diện vẫn vừa |
| 7 | `facts.js` f14 | Chưa xác nhận Điều 64 Nghị định 08/2022 có bị sửa đổi trong 2025–2026 hay không | Khách hoặc người phụ trách tra văn bản hiện hành |

## Bảng nhận định

### codes.js

| Mục | Nhận định | Nguồn | Trạng thái | Khách xác nhận? |
|---|---|---|---|---|
| Cả 7 mã | Mã 1–7 là PET, HDPE, PVC, LDPE, PP, PS, nhóm khác; LDPE là Low-density polyethylene | [NIH](https://orf.od.nih.gov/EnvironmentalProtection/WasteDisposal/Pages/PlasticResinCodes.aspx); [ASTM D7611](https://store.astm.org/d7611_d7611m-21.html) | 🔵 | Không |
| pet | PET không dùng BPA làm nguyên liệu | [BfR](https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/selected-questions-and-answers-on-pet-bottles/) | ✅ | Không |
| pet | Chất lượng nhựa có thể giảm sau nhiều lần tái chế; không tái chế vô hạn lần | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) | 🟡 | Không |
| hdpe | Can nước giặt, chai dầu gội đục thường là HDPE | Chưa có link; báo cáo R4 dựa trên thực tế bao bì | ⚠️ | Có |
| pvc | PVC lẫn vào PET có thể làm giảm chất lượng mẻ tái chế | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) | 🟡 | Không |
| ldpe | Túi mềm là LDPE; túi sột soạt ngoài chợ thường là HDPE | Chưa có link | ⚠️ | Có |
| pp | Hộp PP cần có nhãn cho phép mới dùng trong lò vi sóng | [FDA](https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens) | 🔵 | Không |
| pp | Nhiều hũ sữa chua cứng giòn ở Việt Nam là PS | [UEH Green Campus](https://gogreen.ueh.edu.vn/green-monday-series/green-monday-series-5-lam-sao-de-phan-loai-nhua-ban-chat-cua-chung-la-gi) (nêu hũ sữa chua thuộc PS) | ✅ | Có |
| ps | Xốp EPS có hơn 95% là không khí | [Britannica](https://www.britannica.com:443/video/187089/Styrofoam) (đọc qua kết quả tìm kiếm) | 🟠 | Không |
| ps | Không dùng hộp xốp đựng đồ đang nóng hoặc hâm lò vi sóng | [Cục An toàn thực phẩm](https://vfa.gov.vn/tin-tuc/huong-dan-bao-dam-attp-trong-su-dung-hop-xop-chua-dung-bao-quan-thuc-pham.html) | ✅ | Không |
| other | Không phải nhựa số 7 nào cũng chứa BPA; BPA liên quan tới PC | Chỉ có nguồn phụ từ kết quả tìm kiếm | 🟠 | Không |

### facts.js

| Mục | Nhận định | Nguồn | Trạng thái | Khách xác nhận? |
|---|---|---|---|---|
| f1 | BPA không phải nguyên liệu PET; có thể có vết từ nguồn khác | [BfR](https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/selected-questions-and-answers-on-pet-bottles/) | ✅ | Không |
| f2 | HDPE dùng làm chai dầu gội, can nước giặt; thu gom tùy địa phương | [ASTM D7611](https://store.astm.org/d7611_d7611m-21.html) | 🔵 | Không |
| f3 | Hâm lò vi sóng cần hộp có ghi rõ cho phép | [FDA](https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens) | 🔵 | Không |
| f4 | Hũ sữa chua ở Việt Nam có loại PS, có loại PP | [UEH](https://gogreen.ueh.edu.vn/green-monday-series/green-monday-series-5-lam-sao-de-phan-loai-nhua-ban-chat-cua-chung-la-gi) nêu PS; [PETRA](https://petresin.org/consumers-guide-to-recycling-codes/) nêu PP nhưng không riêng Việt Nam | 🟠 | Có |
| f5 | Mảnh PET thường chìm; mảnh PP/HDPE thường nổi | [IOM3](https://www.iom3.org/resource/pst-guides-separating-plastics.html) | 🔵 | Không |
| f6 | Số chai cho một áo thay đổi theo chai, vải, kiểu áo | [Neutral](https://neutral.com/blogs/okaynews/how-many-plastic-bottles-produces-a-recycled-performance-t-shirt) (12 chai cho sản phẩm của hãng). PETRA được trích trong báo cáo không nói về số chai | 🟡 | Không |
| f7 | Tái chế cơ học lặp lại có thể làm giảm chất lượng | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) | 🟡 | Không |
| f8 | Khoảng 19–23 triệu tấn rác nhựa mỗi năm vào hệ sinh thái nước | [UNEP](https://www.unep.org/en/what-we-do/ocean-seas-and-coasts/ecosystem-degradation-pollution/plastic-pollution-and-marine) | 🟡 | Không |
| f9 | LDPE là polyethylene mật độ thấp, mã số 4 | [NIH](https://orf.od.nih.gov/EnvironmentalProtection/WasteDisposal/Pages/PlasticResinCodes.aspx) | 🔵 | Không |
| f10 | Vi nhựa thường dưới 5 mm, có ở biển sâu và núi cao | [UNEP](https://www.unep.org/ru/node/40969) | 🟡 | Không |
| f11 | Vi nhựa có trong nước uống, thực phẩm, không khí; tác động lâu dài còn được nghiên cứu | [WHO](https://www.who.int/publications/i/item/9789241516198); [J. Hazard. Mater. Lett. 2022](https://www.sciencedirect.com/science/article/pii/S2666911022000247) | 🟡 | Không |
| f12 | Đồ nhựa dùng một lần chiếm 62% số món rác nhựa trong khảo sát | [World Bank](https://www.worldbank.org/en/country/vietnam/publication/towards-a-national-single-use-plastics-roadmap-in-vietnam-strategies-and-options-for-reducing-priority-single-use-plasti) ghi "hơn 60%"; [tóm tắt báo chí](https://vietnamnews.vn/society/1272494/viet-nam-discards-over-three-million-tonnes-of-plastic-waste-a-year.html) nêu 72% bờ sông, 52% bờ biển | ⚠️ | Có |
| f13 | Việt Nam có nhà máy "chai thành chai" tạo hạt rPET | [RMIT/Duy Tân](https://www.rmit.edu.vn/about-us/who-we-are/our-commitments/vietnam-country-commitment/strategic-innovation-challenge/sustainability-hub-for-educators/case-studies/duytan-recycling) | 🔵 | Có |
| f14 | Từ 1/1/2026 cấm sản xuất, nhập khẩu một số túi ni lông nhỏ, mỏng; có ngoại lệ | [Báo Chính phủ](https://baochinhphu.vn/khi-nao-dung-su-dung-cac-san-pham-nhua-dung-mot-lan-102240504084044436.htm) | ✅ | Có |
| f15 | Đổ hết, tráng sơ, để ráo; bóp dẹp theo hướng dẫn nơi thu gom | [EPA advanced recycling](https://www.epa.gov/plastics/advanced-recycling-plastics) không có nội dung này. Nên thay bằng [EPA – recycle common recyclables](https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables) sau khi kiểm tra | ⚠️ | Không |
| f16 | Không dùng hộp xốp PS đựng đồ nóng, nhiều dầu mỡ, hoặc hâm lò vi sóng | [Cục An toàn thực phẩm](https://vfa.gov.vn/tin-tuc/huong-dan-bao-dam-attp-trong-su-dung-hop-xop-chua-dung-bao-quan-thuc-pham.html) | ✅ | Không |
| f17 | Mảnh PVC lẫn với PET có thể giảm chất lượng nhựa tái sinh | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) | 🟡 | Không |
| f18 | Ống hút có thể là PP hoặc nhựa khác; nhỏ, dễ bẩn nên khó thu gom | [PETRA](https://petresin.org/consumers-guide-to-recycling-codes/) (nêu ống hút thuộc PP) | ✅ | Không |

### quiz.js và detective.js

Hai file dùng lại các nhận định ở `facts.js`, nên nguồn và trạng thái theo mục tương ứng.

| Mục | Dùng lại | Ghi chú | Khách xác nhận? |
|---|---|---|---|
| Quiz Q1, Q2, Q3, Q7 | Mã nhựa, f3, f4 | Q2, Q3 đã viết lại để không lộ đáp án | Không |
| Quiz Q4 | Trình tự PET thành sợi | ⚠️ Trang EPA được trích không có nội dung này; thay bằng [RSC Sustainability 2025](https://pubs.rsc.org/en/content/articlehtml/2025/su/d4su00571f) 🟡 | Không |
| Quiz Q5, Q6, Q8, Q9, Q10 | f15, f5, f7, f6, f18 | Không có số liệu cứng | Không |
| Detective vòng 1–6 | f1, ASTM, f16, f7, f10, f15 | Mỗi vòng 3 nhận định, đúng 1 câu sai | Không |

### journey.js, lab.js, puzzle.js

| Mục | Nhận định | Nguồn | Trạng thái | Khách xác nhận? |
|---|---|---|---|---|
| journey chặng 1 | Số 19–23 triệu tấn; chai có thể theo nước mưa ra sông, hồ, biển | [UNEP](https://www.unep.org/en/what-we-do/ocean-seas-and-coasts/ecosystem-degradation-pollution/plastic-pollution-and-marine) | 🟡 | Không |
| journey chặng 2 | Rác sinh hoạt chia 3 nhóm; tiếp nhận tùy địa phương | [Cổng TT Chính phủ](https://xaydungchinhsach.chinhphu.vn/huong-dan-ky-thuat-ve-phan-loai-chat-thai-ran-sinh-hoat-119231107185909363.htm) | 🔵 | Có |
| journey chặng 3; lab `wash` | Trình tự xử lý mảnh; PET chìm, PP/HDPE nổi nhờ khối lượng riêng | [RSC 2025](https://pubs.rsc.org/en/content/articlehtml/2025/su/d4su00571f); [MDPI 2023](https://www.mdpi.com/1996-1073/16/3/1406) | 🟡 | Không |
| journey chặng 4; lab `make`; puzzle s4–s5 | Tạo hạt rPET rồi kéo sợi là một quy trình minh họa; có dây chuyền kéo sợi từ mảnh | [RSC 2025](https://pubs.rsc.org/en/content/articlehtml/2025/su/d4su00571f); [Resour. Conserv. Recycl. 2010](https://www.sciencedirect.com/science/article/abs/pii/S0921344910001618) | 🟡 | Không |
| journey chặng 5; lab `products` | Sợi tái chế làm áo, ba lô, bông nhồi, thảm; không có số chai cố định | [EPA CPG](https://www.epa.gov/smm/comprehensive-procurement-guidelines-construction-products) 🔵; Neutral 🟡 | 🔵 | Không |
| lab `choose` | Chọn theo mã ghi trên món đồ, không đoán theo độ trong | [EPA](https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables); [PETRA FAQ](https://petresin.org/faqs/) | 🟡 | Không |

### sort.js và match.js

Hai file là ví dụ đồ vật, cần người hiểu thị trường Việt Nam xem lại.

| Mục | Đồ vật | Nhóm | Ghi chú | Khách xác nhận? |
|---|---|---|---|---|
| sort i1–i3 | Chai nước suối, nước ngọt, trà | PET | Phổ biến, rõ ràng | Không |
| sort i4–i6 | Can nước giặt, chai nước tẩy, bình dầu nhớt | HDPE | Chưa có link nguồn ⚠️ | Có |
| sort i7, i9 | Hộp cơm nắp gài, hộp hâm lò vi sóng | PP | Theo f3 | Không |
| sort i8 | Ghế nhựa đúc | PP | Chỉ có nguồn trang bán hàng ghế Duy Tân 🟠 | Có |
| sort i10–i12 | Hộp cơm xốp, ly mì xốp, khay xốp thịt | PS | Theo f16 | Không |
| match pet | Chai dầu ăn trong suốt | PET | Chưa có link nguồn ⚠️ | Có |
| match hdpe | Can nhựa 20 lít đựng nước | HDPE | Chỉ có nguồn nước ngoài 🟠 | Có |
| match pvc, ldpe | Ống nước, màng bọc và túi dẻo | PVC, LDPE | Theo `codes.js` | Không |
| match pp | Hộp đựng thức ăn có nắp gài | PP | Trùng ví dụ `sort`, nhưng loại nhựa rõ ràng | Không |
| match ps | Thùng xốp giữ lạnh | PS | Chưa có link nguồn ⚠️ | Có |
| match other | Gạch đồ chơi lắp ghép | Nhóm 7 | Theo báo cáo R4 | Không |

## Đã sửa trong codes.js (so với bản nháp)

Lỗi đã biết của bản phác thảo khách đều được tránh: mã 3 là PVC; LDPE là Low-density polyethylene; PET không dùng BPA làm nguyên liệu; PP là số 5; không khuyên dùng hộp xốp đựng đồ nóng.

| Mục | Thay đổi | Lý do |
|---|---|---|
| pet | Thêm ý không tái chế vô hạn lần và chất lượng có thể giảm; thay ví dụ hộp, khay trong bằng chai trà | Tránh hiểu tái chế là vô hạn; hộp trong không chắc là PET |
| hdpe | `object` đổi từ "Can sữa" sang "Can nước giặt"; bỏ can sữa, nắp chai, thùng nhựa khỏi sản phẩm | Can sữa không phổ biến ở Việt Nam |
| pvc | Bỏ áo mưa, màng bọc; nêu rõ cơ chế sinh axit khi gia nhiệt, dùng cách nói "có thể" | Tránh khẳng định tuyệt đối, thống nhất với f17 |
| ldpe | Bỏ túi bánh mì, thêm màng co và túi zip; phân biệt túi mềm với túi sột soạt | Sát thị trường Việt Nam |
| pp | Thêm lưu ý hũ sữa chua PS và kiểm tra nhãn lò vi sóng; `object` giữ như bản nháp để khớp ảnh | R4 từng đổi `object` và thêm "100–120°C"; cả hai đã được hoàn lại vì lệch ảnh và không có nguồn |
| ps | Đổi "khoảng 95%" thành "hơn 95%"; thêm hũ sữa chua nhựa giòn vào sản phẩm; viết lại câu về thu gom | R4 từng ghi 98% và "hầu như không được thu gom tại Việt Nam"; đã sửa vì thiếu nguồn |
| other | `name` đổi thành "Other plastics"; giữ ý BPA liên quan tới PC | Thống nhất tên với mã 1–6; R4 từng ghi "PC cũ", đã sửa vì PC được làm từ BPA, không riêng loại cũ |

## Đã sửa ở các file khác sau R4

| File | Thay đổi | Lý do |
|---|---|---|
| `quiz.js` | Viết lại Q2, Q3; Q2 đổi ảnh sang `item-detergent` | Tránh lộ đáp án; ảnh khớp câu hỏi |
| `journey.js` | Viết lại `intro`, `finale`; 4 cặp ghép chặng 4 chuyển thành mô tả | Theo R3; tránh lộ đáp án |
| `sort.js` | Thay ly trà sữa và ống hút | Hai vật hay đổi loại nhựa, trái R1 |
| `match.js` | Thay chai sữa tắm và rổ, chậu nhựa | Hai vật hay đổi loại nhựa, trái R1 |

Chi tiết các lỗi đã sửa ở vòng R4 xem trong 3 báo cáo cùng thư mục.

## Việc còn lại

- **Ảnh:** vẽ lại `code-hdpe` thành can nước giặt (prompt ở Nhóm R của `docs/agents/images/IMAGE-PROMPTS.md`). Còn thiếu 15 ảnh `item-*`, `scene-*`, `lab-*`.
- **Nguồn:** còn 11 link bị chặn truy cập tự động, cần người mở trên trình duyệt để xác nhận.
- **Hồ sơ:** không lưu bản gốc R1–R3, nên không đối chiếu được bảng nguồn ban đầu của từng mô hình.
- **Giao diện:** chưa kiểm tra chữ thật có tràn màn hình ở 360×740 không; việc này thuộc M4.
- **Nhập dữ liệu:** `src/data/codes.js`, `sort.js`, `match.js` đang lệch bản này; M4 sẽ ghi đè bằng bản đã duyệt.

---

## Đã áp dụng PM-DUYET (M4, 05/11/2026)

- Bắt buộc A1–A6 đã sửa trong `src/data/*`. A4: 4 mục chưa có ảnh (sort i3, i6, i8; match pet) → chỉ hiện chữ, bỏ emoji.
- A7: ảnh `code-hdpe` vẫn là can sữa → `codes.js` hdpe tạm dùng ảnh `item-detergent` cho tới khi có ảnh mới.
- A8: watermark góc dưới phải được `scripts/sticker.py` xoá khi tách nền; đã soát cả 37 ảnh.
- Nên sửa B1–B6 đã sửa. Việc trộn thứ tự phương án trong engine quiz (B1) chưa làm – ngoài phạm vi M4.
- Mục C (gửi khách xác nhận) vẫn mở.
