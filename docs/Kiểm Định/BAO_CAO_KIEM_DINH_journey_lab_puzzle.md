# KIỂM ĐỊNH KHOA HỌC & SƯ PHẠM — ECObit HUB

Ngày rà soát: 04/11/2026. Phạm vi: `journey.js`, `lab.js`, `puzzle.js` trong tài liệu người dùng cung cấp; không áp dụng cho `facts.js`, `quiz.js`, `detective.js` của bộ khác.

## Các phát hiện cần sửa

| File | Mục | Vấn đề | Mức | Đề xuất sửa | Nguồn |
| --- | --- | --- | --- | --- | --- |
| journey.js | stage 1 lines | Chai xả bừa bãi không chắc đều ra biển hoặc có cùng thời gian phân rã | Nghiêm trọng | Dùng khả năng 'có thể theo nước mưa đến sông, hồ, biển'; bỏ mốc cố định | UNEP [1] |
| journey.js | stage 1 quiz | 'Bóp dẹp' bị coi là điều kiện bắt buộc khi phân loại | Nhỏ | Thực hiện theo hướng dẫn nơi thu gom | EPA [2] |
| journey.js | stage 1 learn | Số liệu 'hàng triệu tấn' thiếu phạm vi | Nhỏ | Ghi rõ số UNEP 19–23 triệu tấn/năm vào hệ sinh thái nước, gồm sông, hồ, biển | UNEP [1] |
| journey.js | stage 2 bins | Dùng nhãn 'rác hữu cơ' thay vì 'chất thải thực phẩm' trong 3 nhóm chính | Nhỏ | Nhãn 'rác thực phẩm', giữ ID | Bộ TNMT/Cổng TT Chính phủ [3] |
| journey.js | stage 2 item6 | Hộp nhựa trong không bảo đảm là PET hoặc được tái chế ở địa phương | Nghiêm trọng | Ghi PET số 1, nêu quy định điểm thu gom giả định | EPA [2], PETRA [4] |
| journey.js | stage 2 item4 | Hộp xốp dầu mỡ: cách tiếp nhận không đồng nhất | Nhỏ | Ràng buộc rõ vào tình huống giả định | EPA [2] |
| journey.js | stage 3 o3/learn | Diễn đạt như thả nguyên chai, nắp vào bể và dễ nhầm khối lượng với khối lượng riêng | Nghiêm trọng | Nêu mảnh PET chìm, mảnh PP/HDPE nổi do khối lượng riêng | Nghiên cứu [5] |
| journey.js | stage 3 order | Trình bày một chuỗi thao tác như trật tự phổ quát | Nhỏ | Xác nhận 'quy trình minh họa' | RSC [6] |
| journey.js | stage 4 m3 | Hạt thành phẩm không phải 'hạt nhựa nóng chảy đùn ra' | Nghiêm trọng | Sau đùn, nhựa được làm nguội/cắt thành hạt rắn | RSC [6] |
| journey.js, lab.js, puzzle.js | chuỗi hạt -> sợi | Tạo hạt không bắt buộc trong mọi tuyến kéo sợi từ PET | Nghiêm trọng | Nêu 'một trong các quy trình'; có thể kéo trực tiếp từ mảnh | Nghiên cứu [7] |
| journey.js, lab.js | Nhiệt độ | Nêu 260–280°C như thông số chung của mọi nhà máy | Nhỏ | Loại khỏi lời thoại hoặc trình bày như khoảng tham khảo tùy thiết bị | RSC [6] |
| journey.js | stage 5 quiz 2 | Số 9–12 chai/áo trở thành đáp án phổ quát; Neutral nêu 12 chai cho dòng sản phẩm của họ | Nghiêm trọng | Hỏi rằng số chai thay đổi theo trọng lượng chai và áo | Neutral [8] |
| journey.js | stage 5 learn | 'Tiết kiệm khoảng 50% năng lượng' không đủ điều kiện so sánh hoặc tính phổ quát | Nghiêm trọng | Bỏ tỷ lệ và nói lợi ích có điều kiện | RSC [9] |
| lab.js | choose c1–c6 | Phân loại chỉ qua danh tính hoặc độ trong của đồ vật; không đúng mọi sản phẩm ở Việt Nam | Nghiêm trọng | Ghi mã PET1/HDPE2/PS6/PP5 trực tiếp trong nhãn | EPA [2], PETRA [4] |
| lab.js | c3 | Hộp trái cây trong suốt không mặc nhiên PET | Nghiêm trọng | Đổi thành 'hộp có mã PET 1' | EPA [2] |
| lab.js | c6 | Gắn hộp cơm PP với khả năng dùng lò vi sóng mà thiếu nhãn cho phép | Nghiêm trọng | Nói mã vật liệu không thay cho hướng dẫn hâm nóng | Hướng dẫn sử dụng từng sản phẩm |
| lab.js | wash | 'Nắp nổi thân chai chìm' thiếu điều kiện ở dạng mảnh | Nhỏ | Nêu mảnh PP/HDPE nổi, PET chìm | Nghiên cứu [5] |
| lab.js | products.shirt | Định mức 9–12 chai/áo không phổ quát | Nghiêm trọng | Loại số cố định | Neutral [8] |
| lab.js | products.interior | Vải polyester tái chế không đồng nhất 'bền màu, ít bám bẩn' | Nhỏ | Nêu khả năng làm thảm/vải bọc; tính năng tùy cấu trúc | EPA [10] |
| puzzle.js | s4–s5 | Thiếu sấy khô; chuỗi bắt buộc hạt -> sợi sai với một số dây chuyền | Nghiêm trọng | Bổ sung sấy khô, coi đây là tuyến minh họa | RSC [6], nghiên cứu [7] |
| 3 file | Bảng nguồn gốc | Blog doanh nghiệp, trang tải bài sinh viên và bài khoa học đều gắn 'Cao' | Nghiêm trọng | Phân hạng nguồn; dùng nguồn gốc có thẩm quyền cho khẳng định định lượng | Đối chiếu nguồn [1]–[10] |

## Nguồn gốc đã kiểm tra

1. UNEP, *Plastic Pollution and Marine Litter*: https://www.unep.org/en/what-we-do/ocean-seas-and-coasts/ecosystem-degradation-pollution/plastic-pollution-and-marine
2. US EPA, *How Do I Recycle Common Recyclables*: https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables
3. Cổng TT Chính phủ, *Hướng dẫn kỹ thuật về phân loại chất thải rắn sinh hoạt*: https://xaydungchinhsach.chinhphu.vn/huong-dan-ky-thuat-ve-phan-loai-chat-thai-ran-sinh-hoat-119231107185909363.htm
4. PETRA, *FAQs*: https://petresin.org/faqs/
5. *Small-Scale Mechanical Recycling of Solid Thermoplastic Wastes*, 2023: https://www.mdpi.com/1996-1073/16/3/1406
6. *State-of-the-art of industrial PET mechanical recycling*, RSC Sustainability 2025: https://pubs.rsc.org/en/content/articlehtml/2025/su/d4su00571f
7. *Open-loop recycling: A LCA case study of PET bottle-to-fibre recycling*, 2010: https://www.sciencedirect.com/science/article/abs/pii/S0921344910001618
8. Neutral, *How many plastic bottles ... one polyester T-shirt?*, 2026 (12 chai cho áo của hãng): https://neutral.com/blogs/okaynews/how-many-plastic-bottles-produces-a-recycled-performance-t-shirt
9. *Molecular and material property variations during the ideal degradation and mechanical recycling of PET*, RSC 2024: https://pubs.rsc.org/en/content/articlehtml/2024/su/d4su00485j
10. US EPA, *Comprehensive Procurement Guidelines for Construction Products* (recycled PET carpet): https://www.epa.gov/smm/comprehensive-procurement-guidelines-construction-products
11. Cục An toàn thực phẩm, hộp xốp PS và thực phẩm nóng: https://vfa.gov.vn/tin-tuc/huong-dan-bao-dam-attp-trong-su-dung-hop-xop-chua-dung-bao-quan-thuc-pham.html
12. BfR, PET và BPA: https://www.bfr.bund.de/en/service/frequently-asked-questions/topic/selected-questions-and-answers-on-pet-bottles/
13. *Effects of Repeated Thermo-Mechanical Processing on Bottle-Grade PET*, 2026: https://pmc.ncbi.nlm.nih.gov/articles/PMC12899093/

## Đánh giá nguồn mà AI trước đó sử dụng

- Neutral: tồn tại; bài viết đề cập **12 chai PET cho một chiếc áo thuộc dòng sản phẩm của hãng**, không cung cấp định mức chung 9–12 chai cho mọi áo.
- Studocu: tài liệu về quy trình PET có truy cập được nhưng do người dùng đăng lên; không phải tiêu chuẩn/quy chuẩn chuyên môn và không chứng minh 50% năng lượng.
- Retech Machine: đường dẫn gốc không xác minh được bằng công cụ truy cập lần này; không kết luận là nguồn giả.
- HobiCorp, EthicalTees: bị chặn hoặc hạn chế khi truy cập; không thể xác minh nội dung tại thời điểm rà soát.
- Elant, Kitech, Viet Tien Plastic, EPP Vietnam, CBRHK: có trang nội dung trực tuyến, nhưng là nguồn thương mại; ưu tiên cơ quan công và nghiên cứu khi đưa vào giáo dục.
- CBRHK nguồn về an toàn PET không tự động xác nhận tất cả công dụng dệt may được gán trong bảng nguồn gốc.

## Tóm tắt kỹ thuật

- Mỗi file JS độc lập bắt đầu bằng `export default` và đã vượt qua `node --check`.
- Đối chiếu đệ quy cấu trúc dữ liệu: giữ nguyên tên trường và kiểu dữ liệu, số chặng, mã ID, số câu hỏi, số lựa chọn, khóa `answer`, `isPet`, `bin`.
- Ba câu trắc nghiệm: chỉ số đáp án 0-based `1,0,1` và mỗi câu chỉ có một phương án đúng sau khi diễn đạt lại.
- Sáu lựa chọn lab: `isPet` = `true,true,true,false,false,false` tương ứng mã nhựa ghi rõ trong nhãn.
- Giới hạn: `q` <= 140, `options` <= 90, `lines`/`ebi`/`explain` <= 160, `learn`/`fact` <= 200; kiểm tra theo số ký tự Unicode bằng JS (code points).
- Ebi chỉ dẫn chuyện/quan sát; **không bao giờ** được băm, nghiền, nấu chảy hoặc đưa vào dây chuyền.
- Không thể xác minh file asset `img`/`scene` hoặc trải nghiệm kéo-thả thực tế vì người dùng chưa cung cấp mã frontend, hình ảnh. Cần đảm bảo hoạt ảnh không đưa Ebi vào máy và trộn ngẫu nhiên thứ tự hiển thị, trong khi vẫn chấm theo thứ tự dữ liệu chuẩn.
- PET và BPA, PVC mã 3, LDPE (Low-density polyethylene) số 4, PP số 5, PS số 6: kiểm chứng là đúng trong phạm vi vật liệu; các mục không xuất hiện trong ba file gốc không được tự ý bổ sung trò chơi mới.
