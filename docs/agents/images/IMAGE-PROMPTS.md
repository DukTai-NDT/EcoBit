# Prompt ảnh cho Gemini (Nano Banana) – đợt 2

**Cách làm cho MỌI ảnh:**
1. Đính kèm 1 ảnh tham chiếu phong cách: `step-5-products` hoặc `step-1-bottle` đã tạo ở đợt 1 (ảnh gốc trong Project `12_images_gen/`).
2. Dán **Khối phong cách** + đoạn mô tả của ảnh. Yêu cầu ảnh **vuông 1:1** trừ khi ghi khác.
3. Lưu PNG, **đặt đúng tên file** ở cột Tên (ví dụ `loc-lab.png`) rồi bỏ vào thư mục `raw/` của dự án. Claude Code (M4) sẽ tự tách nền, xoá dấu ✦ góc ảnh và thêm viền sticker.
4. Không chấp nhận ảnh có chữ, số, logo, ký hiệu tái chế, khuôn mặt người thật. Ảnh nào AI lỡ vẽ chữ → tạo lại.
5. Nền phải là màu kem trơn, chủ thể có nét viền khép kín – nếu nền bị loang/vân giấy đậm, tạo lại (script tách nền dựa vào điều này).

## Khối phong cách (dán đầu mỗi prompt)
> Cozy hand-drawn children's picture-book illustration, same style as the reference image: soft gouache and colored-pencil texture, clean dark green-brown outlines of even weight, muted leafy greens, terracotta red, soft sky blue, warm sand and cream, gentle flat shading, slight top-down three-quarter view. One subject group centered with generous margin, plain flat warm cream background (#FEF8E4), no ground shadow, no text, no letters, no numbers, no logos, no recycling symbols, no people.

## Nhóm L – 6 "địa điểm" cho bản đồ ECO HOME (ưu tiên 1)
| Tên | Mô tả (dán sau khối phong cách) |
|---|---|
| `loc-discover` | A tiny round museum kiosk with a striped green awning and a big magnifying glass leaning against it, a few plastic bottles and containers on display shelves. |
| `loc-journey` | A small winding dirt path with stepping stones leading to a wooden signpost with three blank arrow boards, little bushes and flowers along the path. |
| `loc-lab` | A small glass greenhouse laboratory with a round window, bubbling flasks and test tubes on a wooden table in front of it. |
| `loc-play` | A cheerful wooden game booth with a red-and-cream striped roof, little hanging pennants and a pile of colorful game cards on the counter. |
| `loc-passport` | A tiny post-office booth with a green roof, a stamp pad and a stack of small blank booklets and ribbons on the counter. |
| `loc-connect` | A small outdoor stage with string lights and blank bunting flags, a megaphone and a few potted plants on the edge of the stage. |

## Nhóm I – đồ vật cho trò ECO SORT / MATCH (ưu tiên 1)
Chờ ChatGPT/Gemini chốt danh sách đồ vật (R1). Dự kiến:
| Tên | Mô tả |
|---|---|
| `item-shampoo` | A plain opaque white shampoo bottle with a green flip cap, blank label area. |
| `item-detergent` | A chunky opaque pale-blue laundry detergent bottle with a handle and a screw cap, blank label. |
| `item-lunchbox` | A translucent microwave-safe plastic lunch box with a snap-on pale green lid. |
| `item-foam-cup` | Two stacked white foam drinking cups with a light dotted foam texture. |
| `item-foam-tray` | A white foam meat tray, empty, with a light dotted foam texture. |
| `item-soda-bottle` | A clear plastic soft-drink bottle with a red cap and a blank red label band. |
| `item-clear-box` | A clear plastic clamshell box holding a few small cakes. |
| `item-straws` | A small bundle of colorful plastic drinking straws in a paper cup holder. |

## Nhóm J – 5 cảnh ECO JOURNEY (ưu tiên 2, tỉ lệ 4:3)
Thay "One subject group centered" trong khối phong cách bằng "A small vignette scene, isolated as one compact island on the cream background".
| Tên | Mô tả |
|---|---|
| `scene-1` | A school bench under a small tree with an empty clear plastic water bottle standing on it, a backpack beside it, a few fallen leaves. |
| `scene-2` | Three colorful sorting bins side by side (green, blue, terracotta) with blank lids, a few bottles and cans waiting in front of them. |
| `scene-3` | A cute, friendly small recycling factory interior: a short conveyor belt carrying clear plastic bottles into a round washing tank with bubbles, then into a chunky shredder machine with a funnel; soft rounded machine shapes, nothing scary. |
| `scene-4` | A rounded friendly machine pouring small translucent plastic pellets into a hopper, with soft white and mint yarn spooling out of the other side onto two big spools. |
| `scene-5` | A small wooden clothing rack with leaf-green t-shirts, a backpack and a teddy bear on a shelf below, a rolled rug and a potted plant beside them. |

## Nhóm M – máy cho ECO LAB (ưu tiên 2)
| Tên | Mô tả |
|---|---|
| `lab-wash` | A round wooden-and-metal washing tub full of soapy water and bubbles with a few clear plastic flakes floating, a little scrub brush beside it. |
| `lab-shredder` | A chunky friendly shredder machine with a wide funnel on top and a small tray of clear plastic flakes coming out at the bottom, rounded pastel green body. |
| `lab-extruder` | A small rounded machine with a hopper of plastic pellets on top and a soft white strand of fiber coming out of a nozzle, winding onto a spool. |

## Nhóm E – tư thế Ebi bổ sung (TUỲ CHỌN – cần khách đồng ý cho dùng AI trên mascot)
Đính kèm PNG Ebi gốc của khách làm ảnh tham chiếu, prompt: *"Redraw this exact character with identical proportions, colors, outlines and scarf, only changing the pose to: …"*. Đặt tên `ebi-cheer` (two arms raised, very happy, eyes closed smiling), `ebi-sad` (slightly droopy, small sad frown, one hand on cap), `ebi-think` (one hand on chin, eyes looking up, curious). Nếu khách không đồng ý → web tiếp tục dùng Ebi SVG có sẵn.
