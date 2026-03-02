const QUESTIONS_PER_STAGE = 10;
const TOTAL_QUESTIONS = 60;

// Mock Database of Available Scent Notes (Vietnamese)
const AVAILABLE_NOTES = [
  'Cam Bergamot', 'Chanh vàng', 'Quýt', 'Tiêu đen', 'Bạch đậu khấu',
  'Hoa nhài', 'Hoa hồng', 'Oải hương', 'Ngọc lan tây', 'Hoa diên vĩ',
  'Gỗ đàn hương', 'Tuyết tùng', 'Cỏ hương bài', 'Hoắc hương', 'Trầm hương',
  'Vani', 'Hổ phách', 'Xạ hương', 'Da thuộc', 'Thuốc lá', 'Muối biển'
];

// Mock Database of Existing Perfumes (Translated descriptions)
const MOCK_PERFUMES = [
  {
    id: 'p1',
        name: ' Cred Aventus',
    description: 'Sự pha trộn đầy quyền lực của trầm hương và gia vị dành cho người dẫn đầu táo bạo.',
    price: 450,
        imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7nypmyzapip33.webp',
        productUrl: 'https://s.shopee.vn/5fjgdjRDVq',
    notes: {
      top: ['Tiêu đen', 'Bạch đậu khấu'],
      heart: ['Hoa hồng', 'Da thuộc'],
      base: ['Trầm hương', 'Hổ phách', 'Xạ hương']
    }
  },
  {
    id: 'p2',
      name: 'C.K One',
    description: 'Sự thanh lịch, mềm mại của hương hoa dành cho những tâm hồn sâu sắc.',
    price: 90,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8hs31ncjjwn3d.webp',
      productUrl: 'https://s.shopee.vn/70F4EDd4N6',
    notes: {
      top: ['Cam Bergamot', 'Chanh vàng'],
      heart: ['Hoa nhài', 'Hoa diên vĩ'],
      base: ['Gỗ đàn hương', 'Vani']
    }
  },
  {
    id: 'p3',
      name: 'Club Ultold',
    description: 'Tươi mát và sảng khoái, lấy cảm hứng từ đại dương sâu thẳm.',
    price: 160,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134258-81ztc-ml3ptq5folxe8e',
      productUrl: 'https://s.shopee.vn/5L6qFAI3v3',
    notes: {
      top: ['Muối biển', 'Quýt'],
      heart: ['Oải hương', 'Ngọc lan tây'],
      base: ['Tuyết tùng', 'Cỏ hương bài']
    }
  },
  {
    id: 'p4',
      name: 'Delilah Blanc',
    description: 'Ấm áp, dễ chịu và đầy bí ẩn.',
    price: 125,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-meehbuzewikh31.webp',
      productUrl: 'https://s.shopee.vn/2g654HS14K',
    notes: {
      top: ['Bạch đậu khấu', 'Cam Bergamot'],
      heart: ['Thuốc lá', 'Hoa nhài'],
      base: ['Hổ phách', 'Vani', 'Hoắc hương']
    }
  },
  {
    id: 'p5',
      name: 'Mont Explore',
    description: 'Ngọt ngào và quyến rũ với hương trái cây chín mọng và vani ấm áp.',
    price: 220,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7xviqekljseaf.webp',
      productUrl: 'https://s.shopee.vn/2qPVGbHyKr',
    notes: {
      top: ['Quýt', 'Chanh dây'],
      heart: ['Hoa nhài', 'Vani'],
      base: ['Xạ hương', 'Gỗ đàn hương']
    }
  },
  {
    id: 'p6',
      name: 'Sur Le Nil',
    description: 'Một khu vườn bí mật ngập tràn hương hoa cỏ tươi mát sau cơn mưa.',
    price: 290,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8n1clfnkjnr03.webp',
      productUrl: 'https://s.shopee.vn/5AnQ2tnATg',
    notes: {
      top: ['Cỏ hương bài', 'Bạc hà'],
      heart: ['Hoa hồng', 'Hoa mẫu đơn'],
      base: ['Rêu sồi', 'Xạ hương']
    }
  },
  {
    id: 'p7',
      name: 'Alexandria The Blu Talassim',
    description: 'Mạnh mẽ, gai góc và đầy nam tính với sự kết hợp của da thuộc và khói thuốc.',
    price: 345,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mam5w9qn1uvgb6.webp',
      productUrl: 'https://s.shopee.vn/1LahTsIKyw',
    notes: {
      top: ['Tiêu đen', 'Cam Bergamot'],
      heart: ['Da thuộc', 'Thuốc lá'],
      base: ['Gỗ đàn hương', 'Hổ phách']
    }
  },
  {
    id: 'p8',
      name: 'Nar For Her EDT',
    description: 'Tinh khiết như làn nước suối mát lạnh chảy qua những tảng đá rêu phong.',
    price: 250,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7jmvmhvzth873.webp',
      productUrl: 'https://s.shopee.vn/20qOHDDWQW',
    notes: {
      top: ['Chanh vàng', 'Bưởi'],
      heart: ['Muối biển', 'Hoa sen'],
      base: ['Xạ hương', 'Tuyết tùng']
    }
  },
  {
    id: 'p9',
      name: 'Club De Nuit Intense Man Limited',
    description: 'Huyền bí phương Đông với sự bùng nổ ấm nóng của các loại gia vị thượng hạng.',
    price: 270,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7nxj8yefqnlb6.webp',
      productUrl: 'https://s.shopee.vn/3B2LfNqoLp',
    notes: {
      top: ['Quế', 'Gừng'],
      heart: ['Đinh hương', 'Hoa hồng'],
      base: ['Vani', 'Trầm hương']
    }
  },
  {
    id: 'p10',
      name: 'Odyssey Mandarin Sky',
    description: 'Mùi hương của thành thị hiện đại, lạnh lùng, sắc sảo nhưng đầy cuốn hút.',
    price: 145,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7koz5vd42x247.webp',
      productUrl: 'https://s.shopee.vn/1qWy4whfIv',
    notes: {
      top: ['Hương kim loại', 'Ozone'],
      heart: ['Hoa diên vĩ', 'Tiêu đen'],
      base: ['Tuyết tùng', 'Hổ phách']
    }
  },
  {
    id: 'p11',
      name: 'Jo English Pear & Freesia',
    description: 'Đám mây ngọt ngào bồng bềnh đưa bạn vào những giấc mơ êm đềm nhất.',
    price: 365,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8c72synlu10f6.webp',
      productUrl: 'https://s.shopee.vn/4qAZeTIZYu',
    notes: {
      top: ['Hạnh nhân', 'Sữa'],
      heart: ['Vani', 'Đường nâu'],
      base: ['Xạ hương', 'Đậu Tonka']
    }
  },
  {
    id: 'p12',
      name: 'Odyssey Go Mango',
    description: 'Hít thở bầu không khí trong lành, ẩm ướt của rừng già sau cơn mưa rào.',
    price: 130,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mi4nx0w84irmc3.webp',
      productUrl: 'https://s.shopee.vn/3fycGUr0IJ',
    notes: {
      top: ['Lá thông', 'Cam Bergamot'],
      heart: ['Đất ẩm', 'Gỗ bách'],
      base: ['Rêu sồi', 'Hoắc hương']
    }
  },
  {
    id: 'p13',
      name: 'Club De Nuit Maleka',
    description: 'Bông hồng đen bí ẩn và quyến rũ nở rộ trong đêm tối vô tận.',
    price: 150,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mbs8zcuxrfxm24.webp',
      productUrl: 'https://s.shopee.vn/4VXjG3jnBB',
    notes: {
      top: ['Lý chua đen', 'Tiêu hồng'],
      heart: ['Hoa hồng', 'Rượu vang'],
      base: ['Hoắc hương', 'Gỗ đàn hương']
    }
  },
  {
    id: 'p14',
      name: 'Mos Toy Boy',
    description: 'Nguồn năng lượng bùng nổ rực rỡ đánh thức mọi giác quan đang ngủ quên.',
    price: 170,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7nqp1djoi2reb.webp',
      productUrl: 'https://s.shopee.vn/6pve2S8N3h',
    notes: {
      top: ['Cam đỏ', 'Chanh dây'],
      heart: ['Hoa cam', 'Bạc hà'],
      base: ['Xạ hương', 'Gỗ nhẹ']
    }
  },
  {
    id: 'p15',
      name: 'Club Iconic',
    description: 'Sự yên bình của cánh đồng oải hương trong sương sớm.',
    price: 160,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7nxbbqtt1ae44.webp',
      productUrl: 'https://s.shopee.vn/8fNIDpeRHc',
    notes: {
      top: ['Oải hương', 'Cam Bergamot'],
      heart: ['Xạ hương', 'Hoa diên vĩ'],
      base: ['Vani', 'Gỗ đàn hương']
    }
  },
  {
    id: 'p16',
      name: 'Sailing Day',
    description: 'Hương trầm hương mạnh mẽ kết hợp với gia vị cay nồng.',
    price: 160,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mjxl2wus0xz835.webp',
      productUrl: 'https://s.shopee.vn/4LEJ3sSpM0',
    notes: {
      top: ['Tiêu đen', 'Nghệ tây'],
      heart: ['Trầm hương', 'Hoa hồng'],
      base: ['Da thuộc', 'Hổ phách']
    }
  },
  {
    id: 'p17',
      name: 'Butterfly Agarwood & Benzoin',
    description: 'Vẻ đẹp mong manh và tinh tế của hoa anh đào mùa xuân.',
    price: 100,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgbrxfg4s5qi04.webp',
      productUrl: 'https://s.shopee.vn/20qOHf20O3',
    notes: {
      top: ['Hoa anh đào', 'Quả lê'],
      heart: ['Hoa hồng', 'Hoa nhài'],
      base: ['Xạ hương', 'Gỗ nhẹ']
    }
  },
  {
    id: 'p18',
      name: 'Le Male Elixir',
    description: 'Cảm giác mát lạnh sảng khoái của không khí vùng cực.',
    price: 330,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgau94c6jpxk6b.webp',
      productUrl: 'https://s.shopee.vn/2B9oTyaqLS',
    notes: {
      top: ['Bạc hà', 'Ozone'],
      heart: ['Muối biển', 'Oải hương'],
      base: ['Tuyết tùng', 'Rêu sồi']
    }
  },
  {
    id: 'p19',
      name: 'Asad elixir',
    description: 'Hương gỗ đàn hương kem mịn, ấm áp và thiền định.',
    price: 180,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mjuzlz92lts215.webp',
      productUrl: 'https://s.shopee.vn/9pZFc7MOUU',
    notes: {
      top: ['Bạch đậu khấu', 'Gừng'],
      heart: ['Gỗ đàn hương', 'Hoa nhài'],
      base: ['Vani', 'Hổ phách']
    }
  },
  {
    id: 'p20',
      name: 'Blanche Bete',
    description: 'Dạo bước trong khu vườn cam chanh đầy nắng.',
    price: 650,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8329fypbqf612.webp',
      productUrl: 'https://s.shopee.vn/7AYURETOMu',
    notes: {
      top: ['Cam', 'Chanh vàng', 'Bưởi'],
      heart: ['Hoa cam', 'Húng quế'],
      base: ['Cỏ hương bài', 'Xạ hương']
    }
  },
  {
    id: 'p21',
      name: 'Kira Rice Milk',
    description: 'Hương hoa nhài nồng nàn quyến rũ dưới ánh trăng.',
    price: 280,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-maksn9f22kcs8d.webp',
      productUrl: 'https://s.shopee.vn/3LLlsCcyXq',
    notes: {
      top: ['Hoa nhài', 'Cam Bergamot'],
      heart: ['Ngọc lan tây', 'Hoa huệ'],
      base: ['Gỗ đàn hương', 'Benzoin']
    }
  },
  {
    id: 'p22',
      name: 'Club De Nuit Intense',
    description: 'Sự phong trần, bụi bặm của da thuộc và khói thuốc.',
    price: 140,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7nxhhhhbfk3ce.webp',
      productUrl: 'https://s.shopee.vn/8pgiQL3ksy',
    notes: {
      top: ['Rượu Whisky', 'Gia vị'],
      heart: ['Da thuộc', 'Thuốc lá'],
      base: ['Gỗ tuyết tùng', 'Hoắc hương']
    }
  },
  {
    id: 'p23',
      name: 'Poom Poom',
    description: 'Sự ngọt ngào, nữ tính của hoa mẫu đơn nở rộ.',
    price: 320,
      imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgau54uxlt6xac.webp',
      productUrl: 'https://s.shopee.vn/AUowPQAkv1',
    notes: {
      top: ['Táo đỏ', 'Hoa mẫu đơn'],
      heart: ['Hoa hồng', 'Hoa cẩm chướng'],
      base: ['Da lộn', 'Mật ong']
    }
  },
  
];

const RAW_QUESTIONS_DATA = [
  // 1-20 (Existing)
  {
    text: "Bạn thường bắt đầu buổi sáng với đồ uống gì?",
    options: [
      "Cà phê đen đậm đà (Woody/Spicy)",
      "Nước ép cam/chanh (Citrus)",
      "Trà xanh/thảo mộc (Green/Herbal)",
      "Sô-cô-la nóng hoặc sữa (Gourmand)"
    ]
  },
  {
    text: "Âm thanh bạn muốn nghe khi thức dậy?",
    options: [
      "Tiếng chim hót (Fresh/Floral)",
      "Nhạc Jazz nhẹ nhàng (Woody/Musky)",
      "Tiếng sóng biển (Aquatic)",
      "Sự im lặng tuyệt đối (Clean/Ozone)"
    ]
  },
  {
    text: "Mô tả năng lượng buổi sáng của bạn:",
    options: [
      "Bùng nổ, sẵn sàng làm việc (Citrus)",
      "Chậm rãi, thư thái (Sandlewood/Amber)",
      "Cần thời gian để thích nghi (Floral)",
      "Tập trung và kỷ luật (Spicy)"
    ]
  },
  {
    text: "Không gian làm việc lý tưởng của bạn?",
    options: [
      "Quán cà phê nhộn nhịp (Gourmand/Woody)",
      "Thư viện yên tĩnh (Paper/Leather)",
      "Văn phòng hiện đại, tối giản (Clean/White Musk)",
      "Sân vườn ngoài trời (Green/Floral)"
    ]
  },
  {
    text: "Bạn chọn trang phục gì cho một ngày quan trọng?",
    options: [
      "Suit/Váy công sở sắc sảo (Spicy/Woody)",
      "Trang phục lụa mềm mại (Floral/Powdery)",
      "Quần jean, áo thun năng động (Citrus/Aquatic)",
      "Đồ thiết kế độc bản (Niche/Incense)"
    ]
  },
  {
    text: "Loại vải nào khiến bạn thấy thoải mái nhất?",
    options: [
      "Lụa/Voan (Floral)",
      "Cotton/Lanh (Clean/Fresh)",
      "Len/Cashmere (Warm/Powdery)",
      "Da thuộc/Denim (Leather/Smoky)"
    ]
  },
  {
    text: "Màu sắc yêu thích của bạn là gì?",
    options: [
      "Đỏ/Cam (Spicy/Citrus)",
      "Xanh lá/Trắng (Green/Floral)",
      "Xanh dương/Bạc (Aquatic/Metallic)",
      "Đen/Nâu đất (Woody/Earth)"
    ]
  },
  {
    text: "Bạn thích trang trí nhà bằng gì?",
    options: [
      "Hoa tươi (Floral)",
      "Nến thơm gỗ (Woody)",
      "Cây xanh (Green)",
      "Đồ đá, kim loại (Mineral/Cool)"
    ]
  },
  {
    text: "Cuốn sách bạn yêu thích thuộc thể loại nào?",
    options: [
      "Trinh thám/Kinh dị (Smoky/Spicy)",
      "Lãng mạn/Thơ ca (Rose/Soft Floral)",
      "Kinh doanh/Phát triển bản thân (Citrus/Sharp)",
      "Viễn tưởng/Triết học (Amber/Oud)"
    ]
  },
  {
    text: "Tác phẩm nghệ thuật nào thu hút bạn?",
    options: [
      "Tranh trừu tượng nhiều màu (Fruit/Sweet)",
      "Ảnh phong cảnh đen trắng (Woody/Cold)",
      "Điêu khắc cổ điển (Powdery/Musk)",
      "Nghệ thuật sắp đặt hiện đại (Metallic/Ozone)"
    ]
  },
  {
    text: "Kỳ nghỉ mơ ước của bạn ở đâu?",
    options: [
      "Biển Địa Trung Hải (Citrus/Aquatic)",
      "Rừng thông Đà Lạt (Pine/Woody)",
      "Cánh đồng hoa Pháp (Floral)",
      "Sa mạc huyền bí (Spice/Amber)"
    ]
  },
  {
    text: "Mùi hương thiên nhiên nào khiến bạn nhớ nhất?",
    options: [
      "Đất sau cơn mưa (Geosmin/Earth)",
      "Gió biển mặn (Sea Salt)",
      "Cỏ mới cắt (Cut Grass/Green)",
      "Gỗ cháy (Smoky)"
    ]
  },
  {
    text: "Bạn thích hoạt động ngoài trời nào?",
    options: [
      "Đi bộ đường dài trong rừng (Woody)",
      "Bơi lội (Aquatic)",
      "Picnic trong công viên (Fruity)",
      "Ngắm hoàng hôn (Warm Amber)"
    ]
  },
  {
    text: "Nếu là một loài hoa, bạn sẽ là:",
    options: [
      "Hoa Hồng (Classic Floral)",
      "Hoa Nhài (Sensual Floral)",
      "Hoa Oải hương (Herbal/Relaxing)",
      "Hoa Hướng dương (Bright Citrus)"
    ]
  },
  {
    text: "Thời tiết yêu thích của bạn?",
    options: [
      "Nắng rực rỡ (Citrus)",
      "Mưa phùn se lạnh (Woody/Musk)",
      "Gió mùa thu (Dry Wood)",
      "Sương mù (Cool/Ozone)"
    ]
  },
  {
    text: "Vị giác yêu thích của bạn là gì?",
    options: [
      "Ngọt ngào như kẹo (Vanilla/Caramel)",
      "Chua thanh (Lemon/Bergamot)",
      "Cay nồng (Pepper/Ginger)",
      "Đắng thanh tao (Tea/Oakmoss)"
    ]
  },
  {
    text: "Món tráng miệng bạn chọn?",
    options: [
      "Bánh kem vani (Gourmand)",
      "Sorbet trái cây (Fruity)",
      "Socola đen (Dark Woody)",
      "Bánh quy quế (Spicy)"
    ]
  },
  {
    text: "Gia vị nào không thể thiếu trong bếp của bạn?",
    options: [
      "Quế/Hồi (Warm Spicy)",
      "Húng tây/Bạc hà (Fresh Spicy/Green)",
      "Vỏ chanh (Citrus)",
      "Hạt tiêu (Sharp Spicy)"
    ]
  },
  {
    text: "Bạn thích uống rượu gì (nếu có)?",
    options: [
      "Vang đỏ (Deep/Woody)",
      "Cocktail trái cây (Sweet/Fruity)",
      "Gin Tonic (Cool/Crisp)",
      "Whisky khói (Smoky/Oak)"
    ]
  },
  {
    text: "Mùi hương trong bếp khiến bạn hạnh phúc?",
    options: [
      "Bánh mì mới nướng (Warm/Gourmand)",
      "Hành tỏi phi (Spicy - không dùng trong nước hoa nhưng gợi ý nhóm Spicy)",
      "Trái cây tươi (Fruity)",
      "Thảo mộc tươi (Green)"
    ]
  },
  // 21-60 (New Questions)
  {
    text: "Bạn muốn mùi hương của mình mang lại cảm giác gì?",
    options: ["Quyến rũ (Amber/Musk)", "Sạch sẽ (Soap/Aldehydes)", "Mạnh mẽ (Woody/Leather)", "Tươi mới (Citrus/Aquatic)"]
  },
  {
    text: "Kỷ niệm đẹp nhất của bạn thường liên quan đến:",
    options: ["Gia đình (Warm/Vanilla)", "Những chuyến đi (Ozone/Earth)", "Thành công cá nhân (Sharp/Spicy)", "Tình yêu (Rose/Floral)"]
  },
  {
    text: "Bạn muốn người khác nhớ gì về mình?",
    options: ["Sự sang trọng (Chypre)", "Sự nồng nhiệt (Spicy)", "Sự tinh tế (White Floral)", "Sự khác biệt (Oud/Tobacco)"]
  },
  {
    text: "Mức độ tỏa hương bạn mong muốn?",
    options: ["Xa, gây ấn tượng mạnh (Oriental)", "Vừa phải, đủ để người đứng gần thấy (Floral)", "Nhẹ nhàng, như mùi da thịt (Skin Musk)", "Thay đổi theo thời gian (Complex Niche)"]
  },
  {
    text: "Bạn thích nước hoa lưu hương bao lâu?",
    options: ["Cả ngày dài (Base heavy - Woody/Amber)", "Vài giờ cho một sự kiện (Top heavy - Citrus)", "Chỉ cần lúc mới xịt (Cologne)", "Rất lâu, bám trên quần áo (Oud/Resin)"]
  },
  {
    text: "Chọn một loại đá quý:",
    options: ["Kim cương (Clean)", "Ruby (Spicy)", "Emerald (Green)", "Sapphire (Aquatic)"]
  },
  {
    text: "Chọn một nhạc cụ:",
    options: ["Piano (Classic Floral)", "Guitar điện (Smoky)", "Saxophone (Woody)", "Sáo (Fresh)"]
  },
  {
    text: "Chọn một thành phố:",
    options: ["New York (Metropolitan)", "Paris (Classic Floral)", "Tokyo (Minimalist)", "Bali (Tropical)"]
  },
  {
    text: "Chọn một kiến trúc:",
    options: ["Lâu đài cổ (Incense)", "Căn hộ kính (Metallic)", "Nhà gỗ (Cedar)", "Biệt thự vườn (Floral)"]
  },
  {
    text: "Chọn một con vật:",
    options: ["Mèo (Sleek Musk)", "Chó (Energetic Citrus)", "Chim ưng (Sharp Woody)", "Cá heo (Aquatic)"]
  },
  {
    text: "Chọn một loại vải lót:",
    options: ["Nhung (Deep Floral)", "Lụa (Light Floral)", "Cotton (Clean)", "Da (Leathery)"]
  },
  {
    text: "Chọn một giấc mơ:",
    options: ["Bay trên mây (Ozone)", "Lặn dưới biển (Seaweed/Salt)", "Chạy trên đồng cỏ (Green)", "Tìm thấy kho báu (Gold/Amber)"]
  },
  {
    text: "Chọn một thời điểm trong ngày:",
    options: ["Bình minh (Fresh)", "Trưa nắng (Citrus)", "Hoàng hôn (Warm)", "Nửa đêm (Deep)"]
  },
  {
    text: "Chọn một nguyên tố:",
    options: ["Lửa (Spicy)", "Nước (Aquatic)", "Đất (Woody)", "Khí (Aromatic)"]
  },
  {
    text: "Chọn một phong cách trang điểm:",
    options: ["Tự nhiên (Nude/Musk)", "Quyến rũ (Red lip/Spicy)", "Cá tính (Graphic/Cold)", "Thanh lịch (Soft Floral)"]
  },
  {
    text: "Mùi hương nào gợi nhớ về tuổi thơ của bạn?",
    options: ["Mùi sách mới/giấy (Woody/Dusty)", "Mùi bánh nướng/vani (Gourmand)", "Mùi xà phòng/phấn rôm (Powdery/Clean)", "Mùi cỏ cây/hoa vườn (Green/Floral)"]
  },
  {
    text: "Bạn nhớ nhất điều gì về ngôi nhà cũ?",
    options: ["Màn gỗ/Nội thất cũ (Cedar/Sandlewood)", "Vườn hoa trước sân (Jasmine/Rose)", "Căn bếp luôn đỏ lửa (Spicy/Amber)", "Sự thông thoáng, lộng gió (Ozone/Fresh)"]
  },
  {
    text: "Loại trái cây nào bạn thường ăn vào mùa hè?",
    options: ["Dưa hấu/Vải (Watery/Sweet)", "Xoài/Dứa (Tropical/Acidic)", "Táo/Lê (Crisp/Fruity)", "Các loại quả mọng (Tart/Berry)"]
  },
  {
    text: "Khi đi dạo trong rừng, bạn thích ngửi thấy gì nhất?",
    options: ["Nhựa cây (Resinous)", "Đất ẩm/Rêu (Oakmoss/Earth)", "Hoa dại (Wild Floral)", "Không khí lạnh (Menthol/Cool)"]
  },
  {
    text: "Vật kỷ niệm bạn giữ lâu nhất là gì?",
    options: ["Một bức thư cũ (Paper/Ink)", "Một chiếc áo len (Wool/Soft Musk)", "Một món trang sức kim loại (Metallic/Cold)", "Một hộp gỗ (Oud/Cedar)"]
  },
  {
    text: "Bạn thường sử dụng nước hoa khi nào?",
    options: ["Hàng ngày trước khi ra khỏi nhà (Light/Versatile)", "Chỉ khi có tiệc tối (Heavy/Intense)", "Sau khi tập thể dục (Citrus/Sporty)", "Trước khi đi ngủ (Lavender/Relaxing)"]
  },
  {
    text: "Bạn thích được khen ngợi điều gì nhất?",
    options: ["Sự thông minh/Sắc sảo (Sharp/Spicy)", "Sự tử tế/Ấm áp (Amber/Vanilla)", "Sự sang trọng/Đẳng cấp (Leather/Chypre)", "Sự tự nhiên/Gần gũi (Tea/Musk)"]
  },
  {
    text: "Cách bạn thường chào hỏi người mới gặp?",
    options: ["Bắt tay chặt, tự tin (Woody/Strong)", "Một nụ cười nhẹ, giữ khoảng cách (Clean/White Floral)", "Ôm thân thiện (Warm/Sweet)", "Gật đầu lịch sự (Minimalist/Green)"]
  },
  {
    text: "Bạn thích làm việc một mình hay theo nhóm?",
    options: ["Một mình trong không gian riêng (Niche/Complex)", "Trưởng nhóm điều phối (Bold/Commanding)", "Thành viên hỗ trợ tích cực (Fresh/Friendly)", "Làm việc từ xa/Linh hoạt (Ozone/Aquatic)"]
  },
  {
    text: "Phản ứng của bạn khi nhận được một món quà bất ngờ?",
    options: ["Phấn khích và mở ngay (Bright/Zesty)", "Cảm động và trân trọng (Floral/Powdery)", "Tò mò về ý nghĩa món quà (Mysterious/Spicy)", "Bình thản đón nhận (Zen/Tea)"]
  },
  {
    text: "Nhiệt độ phòng lý tưởng của bạn?",
    options: ["Rất lạnh (Cool/Mineral)", "Ấm áp, hơi ngột (Amber/Resin)", "Mát mẻ tự nhiên (Green/Mint)", "Nhiệt độ phòng tiêu chuẩn (Musk/Soft)"]
  },
  {
    text: "Loại ánh sáng bạn yêu thích?",
    options: ["Ánh nắng mặt trời rực rỡ (Citrus/Yellow Floral)", "Ánh đèn vàng mờ ảo (Tobacco/Incense)", "Ánh sáng neon hiện đại (Metallic/Synthetic)", "Ánh nến lung linh (Waxy/Warm)"]
  },
  {
    text: "Bạn thích sàn nhà bằng chất liệu gì?",
    options: ["Gỗ tự nhiên (Woody)", "Đá cẩm thạch (Cold/Mineral)", "Thảm lông mềm (Soft Musk/Powdery)", "Xi măng trần (Industrial/Earth)"]
  },
  {
    text: "Nếu sống ở nước ngoài, bạn chọn nơi nào?",
    options: ["Bắc Âu lạnh giá (Coniferous/Ozone)", "Vùng nhiệt đới (Coconut/Frangipani)", "Các kinh đô thời trang (Classic Floral/Aldehydes)", "Vùng nông thôn yên bình (Hay/Herbal)"]
  },
  {
    text: "Thành phố nào mô tả đúng tính cách của bạn?",
    options: ["Tokyo: Kỷ luật và tối giản (Hinoki/Tea)", "New York: Hối hả và tham vọng (Metallic/Leather)", "Paris: Lãng mạn và nghệ thuật (Rose/Powdery)", "London: Cổ điển và lịch lãm (Bergamot/Oakmoss)"]
  },
  {
    text: "Bạn sợ điều gì nhất?",
    options: ["Sự lãng quên (Bold/Memorable notes)", "Sự gò bó (Airy/Ozonic)", "Sự hỗn loạn (Clean/Structured)", "Sự cô đơn (Warm/Comforting)"]
  },
  {
    text: "Khi mệt mỏi, bạn tìm đến đâu để cân bằng?",
    options: ["Giấc ngủ sâu (Lavender/Sandalwood)", "Một bữa ăn ngon (Gourmand)", "Đi dạo ngoài trời (Fresh Air/Green)", "Nghe nhạc mạnh (Spicy/Vibrant)"]
  },
  {
    text: "Động lực lớn nhất của bạn là gì?",
    options: ["Quyền lực/Địa vị (Oud/Leather)", "Tình yêu/Gia đình (Floral/Warm)", "Sự sáng tạo/Tự do (Niche/Unique)", "Sự bình yên/Tự tại (Tea/White Musk)"]
  },
  {
    text: "Bạn thích xem thể loại phim nào?",
    options: ["Hành động (Sharp/Spicy)", "Tình cảm (Soft Floral)", "Tài liệu (Earth/Woody)", "Kỳ ảo (Incense/Amber)"]
  },
  {
    text: "Từ nào khiến bạn thấy khó chịu?",
    options: ["\"Tầm thường\" (Ưu tiên nốt hương lạ)", "\"Ồn ào\" (Ưu tiên nốt hương nhẹ)", "\"Lạnh lùng\" (Ưu tiên nốt hương ấm)", "\"Yếu đuối\" (Ưu tiên nốt hương mạnh)"]
  },
  {
    text: "Bạn thích mùi hương trên cơ thể người khác như thế nào?",
    options: ["Nồng nàn, dễ nhận biết (Sillage cao)", "Thoang thoảng, chỉ khi lại gần (Skin scent)", "Sạch sẽ như vừa tắm xong (Soapy)", "Không mùi (Unscented/Neutral)"]
  },
  {
    text: "Mùi của loại gia vị khô nào bạn thích nhất?",
    options: ["Vỏ quế (Warm Spicy)", "Hạt tiêu đen (Fresh Spicy)", "Nghệ tây (Leathery/Floral)", "Thảo quả (Sweet Spicy)"]
  },
  {
    text: "Bạn thích cảm giác nào trên da?",
    options: ["Mát lạnh của đá (Menthol)", "Ấm áp của nắng (Amber)", "Mềm mại của vải vóc (Musk)", "Sự khô ráo (Powdery)"]
  },
  {
    text: "Loại đồ uống có cồn nào bạn thấy quyến rũ?",
    options: ["Rượu vang lâu năm (Oak/Grape)", "Champagne sủi bọt (Aldehydes/Fruity)", "Cocktail Mojito (Mint/Lime)", "Gin & Tonic (Juniper/Herbal)"]
  },
  {
    text: "Mùi khói nào bạn thấy dễ chịu?",
    options: ["Khói gỗ củi (Smoky/Birch Tar)", "Khói trầm hương (Incense)", "Khói thuốc lá đắt tiền (Tobacco)", "Không thích bất kỳ loại khói nào (Loại bỏ Smoky notes)"]
  }
];

// Generate Mock Questions with Random Weights
const MOCK_QUESTIONS = RAW_QUESTIONS_DATA.map((q, i) => ({
  id: i + 1,
  text: q.text,
  weight: Number((Math.random() * 0.4 + 0.3).toFixed(1)), // Random weight between 0.3 and 0.7
  options: q.options
}));

export { QUESTIONS_PER_STAGE, TOTAL_QUESTIONS, AVAILABLE_NOTES, MOCK_PERFUMES, MOCK_QUESTIONS };
