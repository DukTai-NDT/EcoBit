# Kiểm định nội dung ECObit HUB — 04/11/2026

Đã kiểm định 18 facts, 10 quiz, 6 detective trong ba khối JavaScript được trích từ `Pasted text.txt`.

Quy ước: "Nghiêm trọng" = có thể gây sai kiến thức, mơ hồ đáp án, hoặc nội dung pháp luật sai phạm vi; "Nhỏ" = cường điệu hóa, ví dụ/giọng văn hoặc vấn đề chuẩn bị triển khai.

| File | Mục | Vấn đề | Mức | Đề xuất sửa đã áp dụng | Nguồn |
|---|---|---|---|---|---|
| Toàn bộ | Bản dán đầu vào | Mô tả báo cáo bị nối vào `JavaScriptexport default`, không thể dùng nguyên văn làm module JS | Nghiêm trọng | Tách 3 module, mỗi module bắt đầu bằng `export default`; kiểm tra cú pháp | Kiểm tra nội bộ |
| facts.js; detective.js | f1; vòng 1 | “PET hoàn toàn không chứa BPA” là khẳng định tuyệt đối: BPA không dùng sản xuất PET, nhưng có thể có vết nhiễm bẩn | Nghiêm trọng | Sửa thành BPA không phải nguyên liệu PET, nêu khả năng nhiễm vết | [BfR](https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/selected-questions-and-answers-on-pet-bottles/) |
| facts.js | f2 | HDPE “an toàn”, “dễ tái chế nhất” thiếu điều kiện nguồn đựng, phân loại địa phương | Nhỏ | Nêu vật liệu thường dùng và việc thu gom tùy điều kiện | [ASTM D7611](https://store.astm.org/d7611_d7611m-21.html) |
| facts.js; quiz.js | f3; Q7 | Mã PP số 5 không tự bảo đảm dùng được lò vi sóng; “không thôi nhiễm chất độc” là cam kết quá mức | Nghiêm trọng | Chỉ chọn hộp có nhãn cho phép hâm lò vi sóng | [FDA](https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens) |
| facts.js; quiz.js | f4; Q3 | Khẳng định về hũ sữa chua quá rộng; tại VN có cả PS và PP | Nghiêm trọng | Dùng “một số”, yêu cầu kiểm tra nhãn; đáp án Q3 chỉ chọn đồ xốp thường PS | [UEH Green Campus](https://gogreen.ueh.edu.vn/green-monday-series/green-monday-series-5-lam-sao-de-phan-loai-nhua-ban-chat-cua-chung-la-gi), [PETRA](https://petresin.org/consumers-guide-to-recycling-codes/) |
| facts.js; quiz.js | f5; Q6 | Thiếu điều kiện mảnh đã băm, dễ hiểu như nắp vẫn gắn trên chai cũng nổi tách ra | Nhỏ | Nêu mảnh PET chìm, mảnh PP/HDPE nổi | [IOM3](https://www.iom3.org/resource/pst-guides-separating-plastics.html) |
| facts.js; quiz.js | f6; Q9 | 9–12 chai cho một áo không có tiêu chuẩn chung; phụ thuộc khối lượng chai/áo và pha trộn | Nghiêm trọng | Bỏ con số, hỏi về sợi polyester | [PETRA](https://petresin.org/consumers-guide-to-recycling-codes/) |
| facts.js; quiz.js; detective.js | f7; Q8; vòng 4 | Không phải mọi lần tái chế đều “cắt ngắn mạch”; giới hạn “vài lần” không áp dụng cho mọi loại/công nghệ | Nghiêm trọng | Dùng “có thể suy giảm”; bỏ số chu kỳ cứng | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) |
| facts.js | f8 | So sánh 2.000 xe rác/ngày không định nghĩa tải xe; 19–23 triệu tấn là hệ sinh thái nước, không riêng đại dương | Nhỏ | Giữ dải UNEP, gọi đúng phạm vi sông hồ và biển | [UNEP](https://www.unep.org/en/what-we-do/ocean-seas-and-coasts/ecosystem-degradation-pollution/plastic-pollution-and-marine) |
| facts.js | f9 | Số “8 triệu tấn ra biển” là ước tính khác kỳ/phạm vi, nhận định “do thị lực rùa” không có nguồn tương ứng | Nhỏ | Thay bằng kiến thức chắc chắn hơn về mã LDPE số 4 | [NIH](https://orf.od.nih.gov/EnvironmentalProtection/WasteDisposal/Pages/PlasticResinCodes.aspx) |
| facts.js | f10 | “Trên đỉnh Everest” vượt quá mô tả mẫu có thực; không cần độ cao tuyệt đối | Nhỏ | Chỉ nói vùng núi cao và biển sâu | [UNEP](https://www.unep.org/ru/node/40969) |
| facts.js | f11 | “Mỗi tuần nuốt 5 g vi nhựa” dựa trên ước tính bị phê bình có lỗi tính toán; không thể giảng như số liệu chắc chắn | Nghiêm trọng | Bỏ con số; dùng phát hiện vi nhựa và thừa nhận chưa rõ tác động dài hạn | [Journal of Hazardous Materials Letters (2022)](https://www.sciencedirect.com/science/article/pii/S2666911022000247), [WHO](https://www.who.int/publications/i/item/9789241516198) |
| facts.js | f12 | 3,7 triệu tấn/năm cần gắn mốc 2018; 62% là tỷ lệ theo số món rác nhựa khảo sát, không phải cơ cấu cả nước | Nghiêm trọng | Chỉ giữ thống kê 62% với mẫu khảo sát và năm công bố | [World Bank](https://www.worldbank.org/en/country/vietnam/publication/towards-a-national-single-use-plastics-roadmap-in-vietnam-strategies-and-options-for-reducing-priority-single-use-plasti) |
| facts.js | f13 | Khẳng định rPET chuẩn thực phẩm cần giới hạn theo cơ sở/quy trình đạt chuẩn, không phải mọi hạt tái chế | Nhỏ | Nêu điều kiện “đạt yêu cầu an toàn” | [RMIT/Duy Tân](https://www.rmit.edu.vn/about-us/who-we-are/our-commitments/vietnam-country-commitment/strategic-innovation-challenge/sustainability-hub-for-educators/case-studies/duytan-recycling) |
| facts.js | f14 | Thiếu ngoại lệ của Điều 64 Nghị định 08/2022/NĐ-CP | Nghiêm trọng | Thêm phạm vi “một số” và ví dụ ngoại lệ xuất khẩu | [Báo Chính phủ](https://baochinhphu.vn/khi-nao-dung-su-dung-cac-san-pham-nhua-dung-mot-lan-102240504084044436.htm) |
| facts.js; quiz.js | f15; Q5 | “Cứ bóp dẹp chai trước khi đưa đi” không phù hợp mọi hệ thống thu gom; cặn bẩn không tất yếu làm hỏng cả lô | Nhỏ | Làm sạch/để ráo; làm dẹp theo hướng dẫn nơi thu gom | [US EPA](https://www.epa.gov/plastics/advanced-recycling-plastics) |
| facts.js; detective.js | f16; vòng 3 | Nhiệt 70 °C bị diễn giải thành ngưỡng bắt đầu thôi nhiễm độc hại cố định, kết luận y tế quá tuyệt đối | Nghiêm trọng | Trích khuyến nghị cụ thể của Cục An toàn thực phẩm, không phán định ngưỡng gây hại | [Cục An toàn thực phẩm](https://vfa.gov.vn/tin-tuc/huong-dan-bao-dam-attp-trong-su-dung-hop-xop-chua-dung-bao-quan-thuc-pham.html) |
| facts.js | f17 | “Chỉ một lượng nhỏ PVC làm hỏng cả lô” khẳng định hậu quả tất yếu | Nhỏ | Đổi thành “có thể làm giảm chất lượng” | [Schyns & Shaver 2021](https://onlinelibrary.wiley.com/doi/10.1002/marc.202000415) |
| facts.js; quiz.js | f18; Q10 | Không phải mọi ống hút nhựa đều là PP; cũng không phải mọi ống hút đều ra bãi rác | Nhỏ | Dùng “có thể là PP hoặc nhựa khác”, tập trung vào kích thước và tình trạng bẩn | [PETRA](https://petresin.org/consumers-guide-to-recycling-codes/) |
| quiz.js | Q2 | Có chai dầu gội/bao bì gia dụng bằng PET, nên cách hỏi theo công dụng không nhận dạng HDPE duy nhất | Nghiêm trọng | Hỏi trực tiếp ý nghĩa ký hiệu “HDPE 2” trên can | [NIH](https://orf.od.nih.gov/EnvironmentalProtection/WasteDisposal/Pages/PlasticResinCodes.aspx) |
| quiz.js | Q4 | Tạo hạt không phải công đoạn bắt buộc của mọi tuyến PET thành sợi | Nhỏ | Hỏi “một trình tự đúng”, thay vì quy trình duy nhất | [US EPA](https://www.epa.gov/plastics/advanced-recycling-plastics) |
| detective.js | Vòng 2 | “Phần lớn cơ sở hiện nay ưu tiên số 1,2” không có phạm vi địa lý/khảo sát rõ | Nghiêm trọng | Thay bằng “khả năng tái chế còn tùy nơi thu gom” | [ASTM D7611](https://store.astm.org/d7611_d7611m-21.html) |
| detective.js | Vòng 5 | “Hàng trăm năm” là thời lượng phân rã phụ thuộc môi trường; vật liệu vỡ nhỏ khác với phân hủy hoàn toàn | Nhỏ | Không nêu thời hạn tuyệt đối, nói túi có thể vỡ thành mảnh nhỏ | [UNEP](https://www.unep.org/ru/node/40969) |

## Kiểm tra kỹ thuật sau sửa

- `facts.js`: 18 mục `f1`–`f18`, `export default` dạng mảng, giữ thứ tự và các khóa từng mục.
- `quiz.js`: `timer` = 20, 10 câu, mỗi câu 4 phương án, phân bố `answer` = `[0,1,2,3,0,1,2,3,1,2]`.
- `detective.js`: 6 vòng, mỗi vòng 3 phương án; kiểm tra nội dung cho đúng 1 câu sai, `answer` = `[1,0,2,1,0,2]`.
- Các khối được kiểm tra cú pháp qua `node --check`; không có câu hỏi quá 140 ký tự, phương án quá 90, lời giải thích quá 160, thẻ sự thật quá 200.
- Ebi không bị băm hay nghiền; các hành động này chỉ nói về “những chiếc chai”.
