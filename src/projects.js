// ==================================================
// 作品集项目数据 —— 每一条 = 一个纸团
// 改这里就行：标题、分类、年份、简介、链接、封面图
//   image: 封面图路径（建议 1200×630，可留空，会自动画一个占位封面）
//   link:  项目详情页 / 外链（留空则按钮显示“即将上线”）
//   color: 占位封面的主色
//   brief: 项目背景（如 "D&AD Brief · 团队项目"，可省略）
//   gallery: 展开后滑动浏览的图片 [{ src, caption }]；description: { en: [段落], zh: [段落] }（"## 标题" 是小标题）
// ==================================================
window.PROJECTS = [
  {
    title: "Stay Wise, Stay True",
    en: "保持理智，保持真实",
    category: "社会议题活动",
    year: "",
    summary: "帮助年轻人识别社交媒体上的假新闻，包含 Instagram 账号与网站设计。",
    link: "",
    image: "assets/projects/stay-wise/cover.webp",
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
    category: "儿童教育套装",
    year: "",
    summary: "让孩子在玩耍中提高创造力、激发感官能力的教育套装，鼓励他们尊重和保护自然。",
    link: "",
    image: "assets/projects/sunnyup/cover.webp",
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
    category: "个人档案项目",
    year: "",
    summary: "把疫情封控期间的日常、情绪与想象记录在手提袋上，分发物资时赠予邻居。",
    link: "",
    image: "assets/projects/consolation-reticule/cover.webp",
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
    category: "参与式展览",
    year: "",
    summary: "与观众共同完成的项目：在药盒里写下让你不适的症状，和能治愈你的专属“药方”。",
    link: "",
    image: "assets/projects/real-symptom/cover.webp",
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
    category: "音乐节视觉",
    brief: "D&AD Brief · Team Project",
    year: "",
    summary: "为音乐节打造的视觉形象，把秋季元素与音乐的激情和能量融合在一起。",
    link: "",
    image: "assets/projects/autumn-rush/cover.webp",
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
  { title: "项目标题 06", en: "PROJECT SIX",    category: "前端开发",   year: 2024, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#0c7c8c" },
  { title: "项目标题 07", en: "PROJECT SEVEN",  category: "包装设计",   year: 2024, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#c2185b" },
  { title: "项目标题 08", en: "PROJECT EIGHT",  category: "数据可视化", year: 2024, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#3d5a80" },
  { title: "项目标题 09", en: "PROJECT NINE",   category: "3D / WebGL", year: 2023, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#5c6b2e" },
  { title: "项目标题 10", en: "PROJECT TEN",    category: "字体设计",   year: 2023, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#8d5524" },
  { title: "项目标题 11", en: "PROJECT ELEVEN", category: "展览视觉",   year: 2022, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#264653" },
  { title: "项目标题 12", en: "PROJECT TWELVE", category: "实验项目",   year: 2021, summary: "一句话介绍这个项目：做了什么、为谁做、结果如何。", link: "", image: "", color: "#b5179e" },
];
