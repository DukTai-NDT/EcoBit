// ECO JOURNEY – 5 chặng. task.engine: 'sort' | 'quiz' | 'order' | 'match'; task.config theo schema engine.
// pieceImg: ảnh của mảnh ghép chặng đó. cycle: 5 khung của bức tranh vòng đời cuối hành trình.
// (Agent D viết lời thoại & nhiệm vụ; Agent E dựng màn)
export default {
  intro: 'Chào bạn, mình là Ebi, chai nhựa nắp xanh! Cùng đi 5 chặng theo những chiếc chai PET để nhận đủ 5 mảnh ghép nhé!',
  finale: 'Bạn đã ghép xong bức tranh vòng đời mới rồi! Mình và bạn vừa thấy những chiếc chai đã dùng có thể trở thành vật liệu mới.',
  cycle: [
    { img: 'step-1-bottle', label: 'Chai PET' },
    { img: 'step-2-flakes', label: 'Mảnh PET sạch' },
    { img: 'step-3-pellets', label: 'Hạt rPET' },
    { img: 'step-4-yarn', label: 'Sợi polyester' },
    { img: 'step-5-products', label: 'Sản phẩm mới' }
  ],
  stages: [
    {
      id: 1,
      title: 'Chuyện gì xảy ra sau khi sử dụng?',
      scene: 'scene-1',
      piece: 'Chai đã dùng',
      pieceImg: 'step-1-bottle',
      lines: [
        'Chào bạn, mình là Ebi, chai nhựa nắp xanh đây!',
        'Sau giờ ra chơi, đôi khi có những chiếc chai rỗng bị bỏ lại trên ghế đá.',
        'Nếu bị xả bừa bãi, một số chai có thể theo nước mưa ra sông, hồ hoặc biển.',
        'Còn khi được thu gom đúng cách, chúng có cơ hội bước vào hành trình tái chế!'
      ],
      task: {
        engine: 'quiz',
        config: {
          questions: [
            {
              q: 'Uống hết nước trong chai PET, bạn nên làm gì nếu trường có điểm thu gom loại chai này?',
              options: [
                'Để chai lại trên ghế đá',
                'Đổ cạn rồi đưa đến điểm thu gom',
                'Bỏ chai còn nước vào thùng rác thực phẩm',
                'Tự đốt chai trong sân trường'
              ],
              answer: 1,
              explain: 'Chính xác! Hãy đổ cạn nước, tráng sơ nếu chai bẩn và làm theo hướng dẫn của nơi thu gom. Không phải nơi nào cũng yêu cầu bóp dẹp chai.'
            }
          ]
        }
      },
      learn: 'Theo UNEP, mỗi năm có khoảng 19–23 triệu tấn rác nhựa đi vào hệ sinh thái nước trên thế giới, gồm sông, hồ và biển. Thu gom đúng cách giúp hạn chế rác thất thoát.'
    },
    {
      id: 2,
      title: 'Đi tìm đúng nơi',
      scene: 'scene-2',
      piece: 'Phân loại đúng',
      pieceImg: 'scene-2',
      lines: [
        'Chúng mình đến khu phân loại rác của một ngôi trường giả định rồi!',
        'Trong trò chơi này, điểm thu gom nhận chai PET, chai HDPE và hộp PET sạch.',
        'Bạn hãy nhìn nhãn từng món đồ và đưa vào đúng nhóm nhé!'
      ],
      task: {
        engine: 'sort',
        config: {
          prompt: 'Phân loại theo quy định của điểm thu gom giả định trong trò chơi nhé!',
          bins: [
            { id: 'bin-recycle', label: 'Rác có thể tái chế' },
            { id: 'bin-organic', label: 'Rác thực phẩm' },
            { id: 'bin-other', label: 'Rác còn lại' }
          ],
          items: [
            { id: 'item1', label: 'Chai nước ngọt PET số 1, sạch', img: 'item-soda-bottle', bin: 'bin-recycle' },
            { id: 'item2', label: 'Chai dầu gội HDPE số 2, sạch', img: 'item-shampoo', bin: 'bin-recycle' },
            { id: 'item3', label: 'Vỏ chuối', emoji: '🍌', bin: 'bin-organic' },
            { id: 'item4', label: 'Hộp xốp dính nhiều thức ăn', img: 'item-foam-tray', bin: 'bin-other' },
            { id: 'item5', label: 'Lõi táo', emoji: '🍎', bin: 'bin-organic' },
            { id: 'item6', label: 'Hộp nhựa PET số 1, sạch', img: 'item-clear-box', bin: 'bin-recycle' }
          ]
        }
      },
      learn: 'Ở Việt Nam, rác sinh hoạt được chia thành ba nhóm chính: có thể tái sử dụng, tái chế; thực phẩm; và rác còn lại. Cách tiếp nhận từng món có thể khác nhau tùy địa phương.'
    },
    {
      id: 3,
      title: 'Bí mật bên trong nhà máy',
      scene: 'scene-3',
      piece: 'Mảnh nhựa sạch',
      pieceImg: 'step-2-flakes',
      lines: [
        'Mình sẽ đứng ngoài khu máy để cùng bạn quan sát nhé!',
        'Ở một dây chuyền tái chế PET, những chiếc chai được phân loại và xử lý thành mảnh nhựa sạch.',
        'Bạn hãy xếp các bước của quy trình minh họa này theo thứ tự!'
      ],
      task: {
        engine: 'order',
        config: {
          prompt: 'Xếp đúng thứ tự bốn công đoạn trong dây chuyền PET minh họa:',
          items: [
            { id: 'o1', label: 'Kiểm tra, loại tạp chất và tách nhãn', img: 'step-1-bottle' },
            { id: 'o2', label: 'Băm những chiếc chai thành mảnh', img: 'step-2-flakes' },
            { id: 'o3', label: 'Rửa và tách mảnh nhựa bằng bể nước', img: 'step-2-flakes' },
            { id: 'o4', label: 'Tách nước, sấy khô mảnh PET', img: 'step-2-flakes' }
          ]
        }
      },
      learn: 'Trong bể nước, mảnh PET thường chìm, còn mảnh PP hoặc HDPE từ nắp chai thường nổi. Sự khác biệt về khối lượng riêng giúp tách các loại nhựa.'
    },
    {
      id: 4,
      title: 'Cuộc biến đổi kỳ diệu',
      scene: 'scene-4',
      piece: 'Sợi tái sinh',
      pieceImg: 'step-4-yarn',
      lines: [
        'Những mảnh PET sạch có thể được dùng để tạo nguyên liệu mới.',
        'Trong quy trình minh họa này, nhà máy tạo hạt nhựa rPET rồi kéo thành sợi polyester.',
        'Bạn hãy nối mỗi mô tả với đúng dạng vật liệu nhé!'
      ],
      task: {
        engine: 'match',
        config: {
          prompt: 'Nối mỗi mô tả với dạng vật liệu tương ứng:',
          pairs: [
            { id: 'm1', left: { label: 'Vừa được thu gom, còn nguyên hình dáng' }, right: { label: 'Chai đầu vào', img: 'step-1-bottle' } },
            { id: 'm2', left: { label: 'Đã băm nhỏ và rửa sạch' }, right: { label: 'Mảnh PET sạch', img: 'step-2-flakes' } },
            { id: 'm3', left: { label: 'Nấu chảy, lọc, làm nguội rồi cắt nhỏ' }, right: { label: 'Hạt rPET', img: 'step-3-pellets' } },
            { id: 'm4', left: { label: 'Nấu chảy rồi đùn qua lỗ khuôn nhỏ' }, right: { label: 'Sợi polyester', img: 'step-4-yarn' } }
          ]
        }
      },
      learn: 'PET được làm nóng chảy, lọc rồi có thể tạo thành hạt rPET. Hạt này có thể được nấu chảy để kéo sợi; một số dây chuyền kéo sợi trực tiếp từ mảnh PET sạch.'
    },
    {
      id: 5,
      title: 'Một vòng đời mới',
      scene: 'scene-5',
      piece: 'Sản phẩm mới',
      pieceImg: 'step-5-products',
      lines: [
        'Chúng mình đến nơi trưng bày sản phẩm từ nhựa tái chế rồi!',
        'Sợi polyester tái chế có thể được dùng để làm vải hoặc bông nhồi.',
        'Bạn cùng mình giải hai câu đố cuối nhé!'
      ],
      task: {
        engine: 'quiz',
        config: {
          questions: [
            {
              q: 'Nhóm sản phẩm nào có thể làm từ sợi polyester tái chế?',
              options: [
                'Áo thể thao, vải ba lô và bông nhồi gấu bông',
                'Bát sứ, cốc thủy tinh và chảo sắt',
                'Gạch đất nung, đá tự nhiên và cát',
                'Bàn gỗ tự nhiên, đũa tre và giấy viết'
              ],
              answer: 0,
              explain: 'Đúng rồi! Sợi polyester tái chế có thể làm vải may mặc, vải ba lô hoặc xơ bông dùng để nhồi thú bông.'
            },
            {
              q: 'Điều nào đúng về số chai PET cần để làm một chiếc áo polyester tái chế?',
              options: [
                'Mọi chiếc áo đều cần đúng 12 chai PET',
                'Tùy kích thước chai và chiếc áo',
                'Chỉ cần đúng một chai cho mọi loại áo',
                'Không thể dùng chai PET để làm sợi dệt'
              ],
              answer: 1,
              explain: 'Chuẩn luôn! Một hãng có thể công bố số chai cho mẫu áo cụ thể, nhưng không có số chai cố định áp dụng cho mọi chiếc áo.'
            }
          ]
        }
      },
      learn: 'Tái chế chai PET có thể giảm nhu cầu dùng nguyên liệu mới. Tuy vậy, nhựa không thể tái chế cơ học mãi mà vẫn giữ nguyên chất lượng.'
    }
  ]
};
