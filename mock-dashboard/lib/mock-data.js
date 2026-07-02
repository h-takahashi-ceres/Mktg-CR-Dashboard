// シンプルな静的モックデータ（ロジックなし）

export const teamSummary = {
  totalCost: 12500000,
  totalCv: 2650,
  avgCpa: 4717,
  overCpaCount: 2,
  activeProjectCount: 6,
  yesterdayCost: 410000,
  yesterdayCv: 88,
  yesterdayCpa: 4659,
};

export const projects = [
  {
    id: "p1",
    name: "ABCコスメ 新規獲得キャンペーン",
    owner: "佐藤 花子",
    media: "Meta / TikTok",
    targetCost: 3000000,
    actualCost: 2100000,
    consumptionRate: 70.0,
    forecast: 3150000,
    cv: 480,
    cpa: 4375,
    targetCpa: 4500,
    isOver: false,
  },
  {
    id: "p2",
    name: "フィットネスアプリ DL訴求",
    owner: "鈴木 一郎",
    media: "Meta / SmartNews / Taboola",
    targetCost: 1800000,
    actualCost: 1750000,
    consumptionRate: 97.2,
    forecast: 1820000,
    cv: 380,
    cpa: 4605,
    targetCpa: 2800,
    isOver: true,
  },
  {
    id: "p3",
    name: "オンライン英会話 無料体験",
    owner: "山田 次郎",
    media: "TikTok / Popin / Outbrain",
    targetCost: 2200000,
    actualCost: 1400000,
    consumptionRate: 63.6,
    forecast: 2250000,
    cv: 210,
    cpa: 6666,
    targetCpa: 6000,
    isOver: true,
  },
  {
    id: "p4",
    name: "不動産投資セミナー集客",
    owner: "佐藤 花子",
    media: "Meta / Taboola",
    targetCost: 1500000,
    actualCost: 980000,
    consumptionRate: 65.3,
    forecast: 1520000,
    cv: 95,
    cpa: 8888,
    targetCpa: 9000,
    isOver: false,
  },
];

export const alertProjects = projects.filter(
  (p) => p.isOver || p.consumptionRate > 95
);

export const dailyCost = [
  { date: "6/26", cost: 380000 },
  { date: "6/27", cost: 410000 },
  { date: "6/28", cost: 395000 },
  { date: "6/29", cost: 420000 },
  { date: "6/30", cost: 405000 },
  { date: "7/1", cost: 430000 },
  { date: "7/2", cost: 410000 },
];

export const campaigns = [
  { id: "c1", name: "【Meta】ABCコスメ 通常配信 #1", media: "Meta", cost: 520000, cpa: 4200, ctr: 1.8, cvr: 3.2, cv: 124 },
  { id: "c2", name: "【TikTok】ABCコスメ 通常配信 #1", media: "TikTok", cost: 380000, cpa: 4600, ctr: 2.1, cvr: 2.8, cv: 82 },
  { id: "c3", name: "【Meta】ABCコスメ リターゲ #1", media: "Meta", cost: 210000, cpa: 3900, ctr: 2.4, cvr: 4.1, cv: 53 },
];

export const creatives = [
  { id: "cr1", name: "creative_001", project: "ABCコスメ", media: "Meta", type: "画像", size: "1080x1080", cost: 320000, ctr: 2.1, cvr: 3.4, cpa: 3900, thumbnail: "https://picsum.photos/seed/cr1/300/300" },
  { id: "cr2", name: "creative_002", project: "フィットネスアプリ", media: "TikTok", type: "動画", size: "1080x1920", cost: 280000, ctr: 3.2, cvr: 2.1, cpa: 5200, thumbnail: "https://picsum.photos/seed/cr2/300/300" },
  { id: "cr3", name: "creative_003", project: "オンライン英会話", media: "Popin", type: "画像", size: "1200x628", cost: 150000, ctr: 1.4, cvr: 1.8, cpa: 7200, thumbnail: "https://picsum.photos/seed/cr3/300/300" },
  { id: "cr4", name: "creative_004", project: "不動産投資セミナー", media: "Meta", type: "動画", size: "1080x1080", cost: 410000, ctr: 2.8, cvr: 4.2, cpa: 3600, thumbnail: "https://picsum.photos/seed/cr4/300/300" },
  { id: "cr5", name: "creative_005", project: "ABCコスメ", media: "TikTok", type: "画像", size: "1080x1920", cost: 190000, ctr: 1.9, cvr: 2.6, cpa: 4800, thumbnail: "https://picsum.photos/seed/cr5/300/300" },
  { id: "cr6", name: "creative_006", project: "フィットネスアプリ", media: "Taboola", type: "画像", size: "1200x628", cost: 95000, ctr: 1.1, cvr: 1.5, cpa: 8100, thumbnail: "https://picsum.photos/seed/cr6/300/300" },
];

export const creativeRequestColumns = [
  {
    status: "未着手",
    items: [
      { id: "r1", project: "ABCコスメ", media: "Meta", owner: "佐藤 花子", desiredDate: "7/8" },
      { id: "r2", project: "フィットネスアプリ", media: "SmartNews", owner: "鈴木 一郎", desiredDate: "7/10" },
    ],
  },
  {
    status: "制作中",
    items: [
      { id: "r3", project: "オンライン英会話", media: "TikTok", owner: "山田 次郎", desiredDate: "7/6" },
    ],
  },
  {
    status: "レビュー中",
    items: [
      { id: "r4", project: "不動産投資セミナー", media: "Meta", owner: "佐藤 花子", desiredDate: "7/5" },
    ],
  },
  {
    status: "入稿待ち",
    items: [
      { id: "r5", project: "ABCコスメ", media: "TikTok", owner: "佐藤 花子", desiredDate: "7/4" },
      { id: "r6", project: "フィットネスアプリ", media: "Meta", owner: "鈴木 一郎", desiredDate: "7/4" },
    ],
  },
  {
    status: "完了",
    items: [
      { id: "r7", project: "オンライン英会話", media: "Popin", owner: "山田 次郎", desiredDate: "7/1" },
    ],
  },
];

export const users = [
  { id: "u1", name: "田中 太郎", email: "tanaka@agency.co.jp", role: "管理者" },
  { id: "u2", name: "佐藤 花子", email: "sato@agency.co.jp", role: "運用者" },
  { id: "u3", name: "鈴木 一郎", email: "suzuki@agency.co.jp", role: "運用者" },
  { id: "u4", name: "山田 次郎", email: "yamada@agency.co.jp", role: "運用者" },
  { id: "u5", name: "クライアント様", email: "client@brand.co.jp", role: "クライアント" },
];

export const mediaList = ["Meta", "TikTok", "SmartNews", "Popin", "Taboola", "Outbrain"];
