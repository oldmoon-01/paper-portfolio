// ==================================================
// 作品集项目数据 —— 每一条 = 一个纸团
// 改这里就行：标题、分类、年份、简介、链接、封面图
//   image: 封面图路径（有 gallery 时自动用图集第一张，等比完整显示；都没有则画占位封面）
//   link:  项目详情页 / 外链（留空则按钮显示“即将上线”）
//   color: 占位封面的主色
//   site: 线上网站地址（介绍页会出现“访问网站”按钮，可省略）
//   brief: 项目背景（如 "D&AD Brief · 团队项目"，可省略）
//   gallery: 展开后滑动浏览的图片 [{ src, caption }]；description: { en: [段落], zh: [段落] }（"## 标题" 是小标题）
// ==================================================
window.PROJECTS = [
  {
    title: "Stay Wise, Stay True",
    en: "保持理智，保持真实",
    category: "Social Campaign",
    year: "",
    summary: "帮助年轻人识别社交媒体上的假新闻，包含 Instagram 账号与网站设计。",
    link: "",
    color: "#111214",
    deliverables: ["Instagram 账号", "网站设计", "字体与视觉系统"],
    // 展开后滑动浏览的图片（按顺序）
    gallery: [
      { src: "assets/projects/stay-wise/01.webp", caption: "活动总览 · Campaign overview" },
      { src: "assets/projects/stay-wise/02.webp", caption: "调研过程 · Research process" },
      { src: "assets/projects/stay-wise/03.webp", caption: "选举假新闻、Instagram 分镜与字体草图 · Storyboard & type sketch" },
      { src: "assets/projects/stay-wise/04.webp", caption: "网站设计 · Website design" },
      { src: "assets/projects/stay-wise/05.webp", caption: "Instagram 内容与标识 · Social & identity" },
    ],
    description: {
      en: [
        "The aim of 'Stay Wise Stay True' campaign is to help young people identify fake news on social media. Although cyber security officers are also trying to curb the spread of fake news, the amount of fake news increases rapidly during national elections. Political groups use social media to influence voters' judgments. According to the documentary After Truth, \u201cFake news is now a tool of war, just like chemical weapons\u201d (Rossi, 2020). Which raises a question: Is everything we see and hear necessarily the truth?",
        "For the most part, young people spend their time getting election news from the Internet and social media rather than from television, but because of the amount of information on the Internet, we may not be able to judge the authenticity of the content, so online news coverage can be confusing and one-sided. By setting up the campaign, including the Instagram account and website design. Using social media to spread information to young people about the type of fake news, what is relevant and how to identify it.",
      ],
      zh: [
        "\u201c保持理智，保持真实\u201d活动的目的是帮助年轻人识别社交媒体上的假新闻。尽管网络安全员也在努力遏制假新闻的传播，但假新闻的数量在国家大选期间迅速增加。政治团体利用社交媒体来影响选民的判断。根据纪录片《真相之后》，\u201c假新闻现在是一种战争工具，就像化学武器一样\u201d（Rossi, 2020）。由此引发了一个问题：我们看到和听到的一切都一定是事实吗？",
        "在大多数情况下，年轻人花费时间从互联网和社交媒体而不是电视上获取选举新闻，但由于互联网上的信息量之大，我们可能无法判断其内容的真实性，因此网络新闻报道具有迷惑性和片面性。通过建立一个活动，包括 Instagram 账号和网站设计，利用社交媒体向年轻人传播关于假新闻的类型、相关的内容以及如何识别它。",
      ],
    },
  },
  {
    title: "Sunnyup",
    en: "种太阳",
    category: "Packaging Design",
    year: "",
    summary: "让孩子在玩耍中提高创造力、激发感官能力的教育套装，鼓励他们尊重和保护自然。",
    link: "",
    color: "#9bd31c",
    deliverables: ["包装设计", "手册与活动卡", "插画与字体"],
    gallery: [
      { src: "assets/projects/sunnyup/01.webp", caption: "套装包装盒 · Sunnyup box" },
      { src: "assets/projects/sunnyup/02.webp", caption: "实验与调研 · Part of experiment work" },
      { src: "assets/projects/sunnyup/03.webp", caption: "手册、说明与活动卡 · Booklet, instruction & activity sheet" },
      { src: "assets/projects/sunnyup/04.webp", caption: "套装与户外使用 · The pack in use" },
    ],
    description: {
      en: [
        "\u201cSunnyup\u201d is an educational pack that helps children improve their creativity as well as stimulate their sensory abilities during play. Most preschools these days indulge children in cute craft projects that stifle creativity but win praise from misguided parents (Meyers, 2021). However, children are naturally active and curious about things around them, and they need to get out of the classroom and learn through movement and interaction rather than sitting quietly in the classroom studying textbooks.",
        "This educational pack is designed to encourage children to respect and protect nature and the world around them, while stimulating children's sensory abilities. How can visual designers help kids be creative? Through my research on Montessori education methods, I applied the characteristics of interactive learning to help children to spread their thinking and liberate them from the traditional education mode.",
      ],
      zh: [
        "\u201c种太阳\u201d是一款教育套装，旨在帮助儿童在玩耍中提高创造力并激发他们的感官能力。如今大多数幼儿园都让孩子们做些可爱的工艺项目，这会抑制他们的创造力，却能赢得那些被误导的家长的称赞（Meyers，2021）。然而，孩子们天生活泼好动，对周围的事物充满好奇，他们需要走出教室，通过运动和互动来学习，而不是安静地坐在教室里学习课本知识。",
        "这款教育套装旨在鼓励孩子们尊重和保护自然以及周围的世界，同时激发孩子们的感官能力。视觉设计师如何帮助孩子们发挥创造力？通过我对蒙台梭利教育方法的研究，我将互动学习的特点应用其中，帮助孩子们拓展思维，摆脱传统教育模式的束缚。",
      ],
    },
  },
  {
    title: "CONSOLATION RETICULE",
    en: "安慰手提袋",
    category: "Editorial / Archive",
    year: "",
    summary: "把疫情封控期间的日常、情绪与想象记录在手提袋上，分发物资时赠予邻居。",
    link: "",
    color: "#3b5bd6",
    deliverables: ["手提袋设计", "书籍设计", "插画与图形语言"],
    gallery: [
      { src: "assets/projects/consolation-reticule/01.webp", caption: "手提袋与物资 · The reticule" },
      { src: "assets/projects/consolation-reticule/02.webp", caption: "过程记录 · Process" },
      { src: "assets/projects/consolation-reticule/03.webp", caption: "书籍设计 · Book design" },
      { src: "assets/projects/consolation-reticule/04.webp", caption: "内页插画 · Inside pages" },
    ],
    description: {
      en: [
        "The COVID-19 pandemic disrupted everyday life and brought feelings of isolation, anxiety, and uncertainty. During lockdown, I reconnected with the community through volunteer work and documented my personal experiences during this extraordinary period.",
        "CONSOLATION RETICULE is a personal archive project that transforms pandemic experiences into a portable object. By collecting observations, emotions, and imaginative fragments from daily life during lockdown, I translated these memories into visual elements through words, symbols, and graphic language, embedding them onto a reticule as a container of personal stories. During the distribution of supplies, I shared these reticules with my neighbors, hoping that they could become a small gesture of comfort, connection, and encouragement while preserving the collective memories of this extraordinary period.",
      ],
      zh: [
        "新冠疫情改变了人们的生活节奏，也带来了孤独、焦虑与不确定感。在封闭的居家环境中，我通过参与社区志愿服务重新建立与社会的连接，并记录下这段特殊时期的个人体验。",
        "CONSOLATION RETICULE 是一本以手提袋为载体的疫情生活记录项目。我通过收集居家期间的日常观察、情绪变化和想象片段，将文字、符号与图形语言转化为一系列视觉记录，并将这些内容融入手提袋设计中，使其成为一个可以携带的个人记忆档案。在物资分发过程中，我将这些手提袋赠予社区邻居，希望它不仅能够记录这段特殊时期的共同记忆，也能够成为人与人之间传递温暖与安慰的小型媒介。",
      ],
    },
  },
  {
    title: "REAL SYMPTOM, FAKE PRESCRIPTION",
    en: "真病症，伪药方",
    category: "Exhibition Design",
    year: "",
    summary: "与观众共同完成的项目：在药盒里写下让你不适的症状，和能治愈你的专属“药方”。",
    link: "",
    color: "#ff6fcf",
    deliverables: ["展览设计", "药盒包装", "手册设计"],
    gallery: [
      { src: "assets/projects/real-symptom/01.webp", caption: "治愈空间 · Healing space" },
      { src: "assets/projects/real-symptom/02.webp", caption: "实验：药盒、页面与标签 · Experiment" },
      { src: "assets/projects/real-symptom/03.webp", caption: "手册与包装设计 · Booklet & package design" },
      { src: "assets/projects/real-symptom/04.webp", caption: "展览现场 · Exhibition" },
    ],
    description: {
      en: [
        "## Project Introduction",
        "There is a famous saying that the right remedy can cure the disease. We are always moved by strange situations or things in life, and feel a little comfort and happiness at the lowest times. Maybe all of us have physical ailments, but some of them have no medical name yet, so they can't name the exact condition or find people in the same group. But these conditions are real. Therefore, the idea is to give people some time to think and write down a prescription to heal themselves, so that these people can get attention.",
        "## Activity Description",
        "This is a joint project with the audience. In these pillboxes, you can write down the symptoms that make you feel sick, and how you are relieving or healing in the moment, and write down the things that heal you. It can be an object in your life, or it can be a moment in time. Anything that can cure you can be a \u201cprescription\u201d. Please make good use of this time that belongs to you and write down your own \u201cprescription\u201d as you understand it.",
      ],
      zh: [
        "## 项目说明",
        "有句名言叫做对症下药方可治愈疾病。在生活中我们总会被一些稀奇古怪的情况或事物所感动，在低谷的时候感到一丝安慰和快乐。也许我们每个人都有身体感到不适的情况，但有些不适因医学上目前还没有命名，导致他们无法说出准确病症或无法找到同类人群。但这些病症是真实存在的。因此，想通过这个项目可以给人们一些时间来思考并用写下药方的形式治愈自己，使这类人群能够得到关注。",
        "## 活动介绍",
        "这是一个与观众们共同完成的项目。在这些药盒中，你可以写下那些让你感到不适的症状，以及当下你是如何缓解或者治愈的，写下能够治愈你的事物。它可以是生活中的一件物品，或者也可以是某一个瞬间，任何能够治愈你的东西都可以成为\u201c药方\u201d。请利用好这段属于你自己的时间，写下你所理解的专属\u201c药方\u201d。",
      ],
    },
  },
  {
    title: "AUTUMN RUSH",
    en: "秋潮",
    category: "Music Festival Identity",
    brief: "D&AD Brief · Team Project",
    year: "",
    summary: "为音乐节打造的视觉形象，把秋季元素与音乐的激情和能量融合在一起。",
    link: "",
    color: "#ff4fa3",
    deliverables: ["主视觉", "海报与邀请邮件", "门票与周边"],
    gallery: [
      { src: "assets/projects/autumn-rush/01.webp", caption: "舞台主视觉 · Stage" },
      { src: "assets/projects/autumn-rush/02.webp", caption: "海报设计 · Poster design" },
      { src: "assets/projects/autumn-rush/03.webp", caption: "邀请邮件 · Invitation email" },
      { src: "assets/projects/autumn-rush/04.webp", caption: "门票、T 恤与帆布包 · Tickets, T-shirt & tote bag" },
      { src: "assets/projects/autumn-rush/05.webp", caption: "手环设计 · Wristband design" },
    ],
    description: {
      en: [
        "\u201cAutumn Rush\u201d encapsulates the essence of freedom and excitement, offering attendees an escape from their daily routines to immerse themselves in a vibrant musical experience. The name reflects the festival's promise of providing a temporary respite from life's pressures, allowing participants to embrace the passion and energy of music. Through visual design and the harmonious blend of autumnal elements with cultural experiences, the event aims to create lasting memories and a sense of rejuvenation for all who attend.",
      ],
      zh: [
        "\u201c秋潮\u201d浓缩了自由和兴奋的本质，让与会者从日常生活中解脱出来，沉浸在充满活力的音乐体验中。这个名字反映了音乐节的承诺，即提供一个暂时缓解生活压力的机会，让参与者拥抱音乐的激情和能量。通过视觉设计和秋季元素与文化体验的和谐融合，该活动旨在为所有参与者创造持久的记忆和复兴感。",
      ],
    },
  },
  {
    title: "SEAFRONT",
    en: "临海露营",
    category: "Brand Identity",
    year: "",
    summary: "把豪华露营与艺术活动结合，为城市年轻人重新定义露营品牌。",
    link: "",
    color: "#2f5bea",
    deliverables: ["品牌识别", "社交媒体", "活动手册", "周边与礼盒"],
    gallery: [
      { src: "assets/projects/seafront/01.webp", caption: "社交媒体 · Social media" },
      { src: "assets/projects/seafront/02.webp", caption: "活动手册设计 · Workshop brochures" },
      { src: "assets/projects/seafront/03.webp", caption: "衍生品与触点 · Touchpoints" },
      { src: "assets/projects/seafront/04.webp", caption: "露营礼盒设计 · Camping gift box" },
    ],
    description: {
      en: [
        "In the context of the global pandemic caused by the Coronavirus, the Chinese camping industry experienced a notable decline in market demand. However, with the return of interest in healthy lifestyles and outdoor experiences after the pandemic, the traditional camping model is no longer able to meet the needs of modern young people. These individuals, especially urban white-collar workers under \u201curban pressure,\u201d seek more meaningful experiences that provide aesthetic and emotional resonance.",
        "In response, SEAFRONT redefines the camping brand in an innovative way that combines glamping and artistic activities. Through art workshops and outdoor installations, this project aims to create a space where nature and creativity converge, offering young people a way to relax and find fulfilment amidst natural beauty.",
      ],
      zh: [
        "在新冠肺炎疫情全球大流行的背景下，中国露营行业市场需求明显下降。然而，随着疫情后人们对健康生活方式和户外体验的兴趣回归，传统的露营模式已经无法满足现代年轻人的需求。这些人，尤其是在\u201c城市压力\u201d下的城市白领，寻求更有意义的体验，提供审美和情感上的共鸣。",
        "作为回应，临海露营以一种创新的方式重新定义了露营品牌，将豪华露营与艺术活动相结合。通过艺术工作坊和户外装置，该项目旨在创造一个自然和创造力融合的空间，为年轻人提供一种放松和在自然美景中找到满足的方式。",
      ],
    },
  },
  {
    title: "Abaka AI",
    en: "品牌视觉系统拓展",
    category: "Brand Communications",
    year: "",
    summary: "主导 Abaka AI 品牌视觉系统的拓展，覆盖社交媒体、国际展会与品牌周边。",
    link: "",
    links: [
      { label: "查看 LinkedIn 帖子", url: "https://tinyurl.com/4cdnjt23" },
    ],
    color: "#ff5a1f",
    deliverables: ["社交媒体视觉", "海报、折页与易拉宝", "展位设计", "品牌周边"],
    gallery: [
      { src: "assets/projects/abaka-ai/01.webp", caption: "商业作品集合：折页、易拉宝与海报 · Commercial works collection" },
      { src: "assets/projects/abaka-ai/02.webp", caption: "品牌周边：T 恤、名片与贴纸 · Merchandise" },
      { src: "assets/projects/abaka-ai/03.webp", caption: "活动现场物料 · Event materials" },
      { src: "assets/projects/abaka-ai/04.webp", caption: "CVPR 2026 展位设计 · Exhibition booth" },
    ],
    description: {
      en: [
        "Led the multi-dimensional expansion of Abaka AI's visual identity system, developing a cohesive range of digital and physical brand assets. Created social media visuals for LinkedIn, Facebook, and X, alongside promotional materials, exhibition graphics, and branded merchandise for international events. Established a consistent yet adaptable visual language to strengthen brand recognition and maintain a unified presence across global touchpoints.",
      ],
      zh: [
        "主导 Abaka AI 品牌视觉识别系统的多维度拓展与应用，围绕品牌一致性与国际化传播需求，构建覆盖线上与线下的视觉物料体系。为 LinkedIn、Facebook、X 等社交媒体平台设计系列宣传素材，并延伸至国际展会、行业活动及品牌周边，包括宣传海报、折页、易拉宝、展位视觉及创意物料等。通过统一的视觉语言与灵活的场景化设计，强化品牌在全球不同传播渠道中的识别度与专业形象。",
      ],
    },
  },
  {
    title: "2077AI",
    en: "品牌视觉系统拓展",
    category: "Visual Identity",
    year: "",
    summary: "以电光蓝、未来主义排版和等轴测图形，拓展 2077AI 及 2077 Ventures 的品牌视觉。",
    link: "",
    color: "#2a2cff",
    deliverables: ["社交媒体与成果海报", "宣传折页与易拉宝", "活动物料", "2077 Ventures 子品牌"],
    gallery: [
      { src: "assets/projects/2077ai/01.webp", caption: "易拉宝、宣传折页与成果海报 · Roll-up, flyers & achievement posters" },
      { src: "assets/projects/2077ai/02.webp", caption: "2077 Ventures 发布活动 · Launch event" },
    ],
    description: {
      en: [
        "Expanded 2077AI's visual identity across digital and physical touchpoints, using its signature electric blue, futuristic typography, geometric forms, and isometric graphics to establish a distinctive technology-driven aesthetic. Designed social media campaigns, research achievement visuals, promotional materials, and international event assets, while extending the visual language to the 2077 Ventures sub-brand. Translated complex AI research into clear, engaging visual communications through structured information hierarchy and a cohesive design system, strengthening brand recognition across the global AI ecosystem.",
      ],
      zh: [
        "负责 2077AI 品牌视觉系统的拓展与多场景应用，以标志性的电光蓝为视觉核心，结合未来主义排版、几何图形与等轴测设计语言，构建兼具科技感与辨识度的品牌形象。设计涵盖社交媒体宣传、技术研究成果展示、品牌推广物料及国际线下活动，并延伸至 2077 Ventures 子品牌的视觉应用。通过系统化的信息层级与统一的视觉语言，将复杂的 AI 技术内容转化为清晰、专业且具有视觉冲击力的传播内容，强化品牌在全球 AI 生态中的识别度与影响力。",
      ],
    },
  },
  {
    title: "REX",
    en: "REX Dollars",
    category: "Creative Brand Collateral",
    year: "",
    summary: "以美元纸币为灵感的 REX 创意推广物料，用于 CES 2026 线下推广。",
    link: "",
    links: [
      { label: "查看 LinkedIn 帖子", url: "https://tinyurl.com/ans72vsy" },
    ],
    color: "#4d6b4f",
    deliverables: ["创意推广物料", "纸币视觉设计", "互动二维码"],
    gallery: [
      { src: "assets/projects/rex/01.webp", caption: "REX Dollars · CES 2026" },
    ],
    description: {
      en: [
        "Designed REX Dollars, a currency-inspired promotional concept for REX (RemoExperts), translating the brand's core values of opportunity, reward, and growth into a distinctive physical experience. Reinterpreted traditional banknote graphics by integrating brand messaging, incentive-driven visuals, and interactive QR codes to create a memorable and engaging promotional asset. The design was featured at CES 2026, strengthening brand visibility, recognition, and audience engagement through a playful, unconventional approach.",
      ],
      zh: [
        "围绕 REX（RemoExperts）品牌\u201c价值、回报与机遇\u201d的核心理念，设计以美元纸币为灵感的创意推广物料 REX Dollars。通过对传统货币视觉符号的重新解构，将品牌信息、激励机制与互动二维码融入纸币设计，打造兼具趣味性、辨识度与传播价值的品牌载体。该物料最终应用于 CES 2026 国际科技展会的线下推广，以具有视觉冲击力的创意形式吸引观众关注，提升品牌记忆度与现场互动体验。",
      ],
    },
  },
  {
    title: "整数智能",
    en: "MolarData Intelligence",
    category: "Brand Visual Design",
    year: "",
    summary: "整数智能品牌视觉在行业展会、品牌推广、校园招聘与企业宣传中的拓展应用。",
    link: "",
    links: [
      { label: "查看校招动态", url: "https://tinyurl.com/mr2cdp4c" },
      { label: "查看春泥计划", url: "https://mp.weixin.qq.com/s/t2EJsDPgYWxGUzkZ77NoRw" },
    ],
    color: "#1e1a4a",
    deliverables: ["展会主视觉", "宣讲会物料", "宣传折页", "企业宣传"],
    gallery: [
      { src: "assets/projects/molardata/01.webp", caption: "校园招聘与商务活动物料 · Business event materials" },
      { src: "assets/projects/molardata/02.webp", caption: "全球数字贸易博览会主视觉 · GDTE backdrop" },
      { src: "assets/projects/molardata/03.webp", caption: "春泥计划 H5 体验设计 · Spring Soil Initiative" },
    ],
    description: {
      en: [
        "Developed and extended MolarData Intelligence's brand visuals across diverse commercial applications, including industry exhibitions, marketing campaigns, campus recruitment, and corporate communications. Combined technology-inspired aesthetics, dynamic gradient graphics, and structured information hierarchies to translate complex AI data services and model evaluation capabilities into clear, engaging visual narratives. Ensured a cohesive brand presence across digital and physical touchpoints, reinforcing the company's identity as a professional and innovative AI technology provider.",
      ],
      zh: [
        "负责整数智能品牌视觉在多元商业场景中的拓展与应用，围绕企业在 AI 数据服务与模型评测领域的专业定位，设计涵盖行业展会、品牌推广、校园招聘及企业宣传的系列视觉物料。以科技感视觉语言、动态渐变图形与清晰的信息层级，将复杂的技术服务与品牌价值转化为直观且具有吸引力的视觉表达。通过线上线下多渠道的视觉整合，强化品牌识别度与传播一致性，塑造专业、创新的 AI 科技企业形象。",
      ],
    },
  },
  {
    title: "ZODA",
    en: "品牌视觉与社区官网",
    category: "Brand / Web Experience",
    year: "",
    summary: "为 ZODA 构建品牌视觉识别指南与社区官网体验，统一品牌表达与数字化触点。",
    link: "",
    site: "https://zoda.zone",
    color: "#2a2550",
    deliverables: ["品牌视觉规范", "标志与图标系统", "色彩与字体系统", "官网体验设计"],
    gallery: [
      { src: "assets/projects/zoda/01.webp", caption: "ZODA 社区官网 · Community website" },
      { src: "assets/projects/zoda/02.webp", caption: "品牌视觉识别指南 · Brand identity guidelines" },
      { src: "assets/projects/zoda/03.webp", caption: "品牌规范细节：字体、图标与应用 · Typography, iconography & applications" },
    ],
    description: {
      en: [
        "Led the development of ZODA's brand identity guidelines and community website experience, translating its values of openness, rigor, and collaboration into a cohesive visual system. Established standards for logo usage, colour, typography, layouts, iconography, and digital applications, then extended them into a clear, immersive website experience through structured information architecture, modular content layouts, and motion-led interactions. The work ensures brand consistency and recognition across global touchpoints.",
      ],
      zh: [
        "负责制定 ZODA 品牌视觉识别指南与社区官网体验，将开放、严谨与共创的品牌价值转化为完整且可延展的视觉系统。围绕标志使用、色彩、字体、版式、图标与数字化应用建立规范，并将其延伸至官网的信息架构、模块化内容布局与动态交互体验，打造清晰、沉浸且易于探索的数字触点，确保品牌在全球传播场景中的一致性与识别度。",
      ],
    },
  },
  {
    title: "Corporate Promotional Video",
    en: "企业品牌宣传视频",
    category: "Motion Design",
    year: "",
    summary: "为 Abaka AI 与 REX 制作四支企业品牌宣传视频，将复杂 AI 技术转化为清晰、生动的动态叙事。",
    link: "",
    color: "#111214",
    deliverables: ["Motion Typography", "Animated Graphics", "Information Visualization", "Video Production"],
    videoLinks: [
      { brand: "Abaka AI", label: "Off-the-Shelf Datasets", url: "https://youtu.be/V0Y0XJ23_2A" },
      { brand: "Abaka AI", label: "Company Introduction", url: "https://youtu.be/2_zFPDgmGG4" },
      { brand: "Abaka AI", label: "Model Evaluation", url: "https://youtu.be/hT-rTQYG-z4" },
      { brand: "REX", label: "Platform Introduction", url: "https://youtu.be/sRZ5TdPKp0g" },
    ],
    gallery: [
      { src: "assets/projects/corporate-promotional-videos/01.webp", caption: "Abaka AI & REX 企业品牌宣传视频 · Corporate promotional videos" },
    ],
    description: {
      en: [
        "Led the visual design and production of four promotional videos for Abaka AI and REX, covering corporate introductions, off-the-shelf datasets, model evaluation, and platform capabilities. Combined motion typography, animated graphics, information visualization, and cohesive brand elements to translate complex AI technologies into clear and engaging visual narratives. Extended both brands' visual identities into motion, enhancing the accessibility of technical content and strengthening brand consistency across digital communications.",
      ],
      zh: [
        "负责 Abaka AI 与 REX 品牌系列宣传视频的视觉设计与制作，围绕企业品牌定位、核心业务及产品服务，将复杂的 AI 技术信息转化为清晰、生动的动态视觉叙事。通过动态排版、图形动画、信息可视化与品牌视觉语言的结合，制作涵盖企业介绍、现成数据集、模型评测及平台介绍的四支宣传视频。确保品牌形象在动态媒介中的一致性，并提升技术内容的可理解性与传播吸引力。",
      ],
    },
  },
];
