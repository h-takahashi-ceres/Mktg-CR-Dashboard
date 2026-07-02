import type {
  Ad,
  AdSet,
  Campaign,
  Creative,
  CreativeRequest,
  DailyMetric,
  MediaType,
  Project,
  ProjectKpi,
  TeamKpiSummary,
  User,
} from "./types";

const MEDIA: MediaType[] = [
  "Meta",
  "TikTok",
  "SmartNews",
  "Popin",
  "Taboola",
  "Outbrain",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function genDailyMetrics(days: number, seed: number, baseCost = 40000): DailyMetric[] {
  const rand = seededRandom(seed);
  const out: DailyMetric[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const cost = Math.round(baseCost * (0.7 + rand() * 0.6));
    const imp = Math.round(cost * (30 + rand() * 20));
    const click = Math.round(imp * (0.008 + rand() * 0.01));
    const cv = Math.max(1, Math.round(click * (0.02 + rand() * 0.04)));
    const mcv = Math.max(cv, Math.round(cv * (1.2 + rand() * 0.5)));
    out.push({
      date: d.toISOString().slice(0, 10),
      cost,
      cv,
      cpa: Math.round(cost / cv),
      imp,
      click,
      ctr: Number(((click / imp) * 100).toFixed(2)),
      cpc: Number((cost / click).toFixed(1)),
      cpm: Number(((cost / imp) * 1000).toFixed(1)),
      mcv,
      mcvr: Number(((mcv / click) * 100).toFixed(2)),
      mcpa: Math.round(cost / mcv),
      cvr: Number(((cv / click) * 100).toFixed(2)),
      frequency: Number((1.2 + rand() * 2).toFixed(2)),
    });
  }
  return out;
}

function aggregate(metrics: DailyMetric[]): DailyMetric {
  const cost = metrics.reduce((s, m) => s + m.cost, 0);
  const cv = metrics.reduce((s, m) => s + m.cv, 0);
  const imp = metrics.reduce((s, m) => s + m.imp, 0);
  const click = metrics.reduce((s, m) => s + m.click, 0);
  const mcv = metrics.reduce((s, m) => s + m.mcv, 0);
  return {
    date: "aggregate",
    cost,
    cv,
    cpa: cv ? Math.round(cost / cv) : 0,
    imp,
    click,
    ctr: imp ? Number(((click / imp) * 100).toFixed(2)) : 0,
    cpc: click ? Number((cost / click).toFixed(1)) : 0,
    cpm: imp ? Number(((cost / imp) * 1000).toFixed(1)) : 0,
    mcv,
    mcvr: click ? Number(((mcv / click) * 100).toFixed(2)) : 0,
    mcpa: mcv ? Math.round(cost / mcv) : 0,
    cvr: click ? Number(((cv / click) * 100).toFixed(2)) : 0,
    frequency: Number(
      (metrics.reduce((s, m) => s + m.frequency, 0) / (metrics.length || 1)).toFixed(2)
    ),
  };
}

export const currentUser: User = {
  id: "u1",
  name: "田中 optimzer",
  email: "tanaka@agency.co.jp",
  role: "admin",
};

export const users: User[] = [
  { id: "u1", name: "田中 太郎", email: "tanaka@agency.co.jp", role: "admin" },
  { id: "u2", name: "佐藤 花子", email: "sato@agency.co.jp", role: "operator" },
  { id: "u3", name: "鈴木 一郎", email: "suzuki@agency.co.jp", role: "operator" },
  { id: "u4", name: "山田 次郎", email: "yamada@agency.co.jp", role: "operator" },
  { id: "u5", name: "クライアント様", email: "client@brand.co.jp", role: "client" },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "ABCコスメ 新規獲得キャンペーン",
    ownerId: "u2",
    ownerName: "佐藤 花子",
    mediaAccounts: ["Meta", "TikTok"],
    adtr: "ADTR-00231",
    targetCpa: 4500,
    monthlyTargetCost: 3000000,
    monthlyTargetCv: 650,
    status: "active",
  },
  {
    id: "p2",
    name: "フィットネスアプリ DL訴求",
    ownerId: "u3",
    ownerName: "鈴木 一郎",
    mediaAccounts: ["Meta", "SmartNews", "Taboola"],
    adtr: "ADTR-00198",
    targetCpa: 2800,
    monthlyTargetCost: 1800000,
    monthlyTargetCv: 640,
    status: "active",
  },
  {
    id: "p3",
    name: "オンライン英会話 無料体験",
    ownerId: "u4",
    ownerName: "山田 次郎",
    mediaAccounts: ["TikTok", "Popin", "Outbrain"],
    adtr: "ADTR-00265",
    targetCpa: 6000,
    monthlyTargetCost: 2200000,
    monthlyTargetCv: 366,
    status: "active",
  },
  {
    id: "p4",
    name: "不動産投資セミナー集客",
    ownerId: "u2",
    ownerName: "佐藤 花子",
    mediaAccounts: ["Meta", "Taboola"],
    adtr: "ADTR-00301",
    targetCpa: 9000,
    monthlyTargetCost: 1500000,
    monthlyTargetCv: 166,
    status: "active",
  },
  {
    id: "p5",
    name: "転職エージェント 登録訴求",
    ownerId: "u3",
    ownerName: "鈴木 一郎",
    mediaAccounts: ["Meta", "TikTok", "SmartNews"],
    adtr: "ADTR-00312",
    targetCpa: 5500,
    monthlyTargetCost: 2600000,
    monthlyTargetCv: 472,
    status: "active",
  },
  {
    id: "p6",
    name: "サプリ定期購入 LTV訴求",
    ownerId: "u4",
    ownerName: "山田 次郎",
    mediaAccounts: ["Meta", "Outbrain"],
    adtr: "ADTR-00287",
    targetCpa: 3800,
    monthlyTargetCost: 980000,
    monthlyTargetCv: 258,
    status: "paused",
  },
];

// 案件別の日別実績（30日分）をシードして生成
const projectMetricsMap: Record<string, DailyMetric[]> = {};
projects.forEach((p, i) => {
  projectMetricsMap[p.id] = genDailyMetrics(30, i + 1, 45000 + i * 8000);
});

export function getProjectDailyMetrics(projectId: string, days = 30): DailyMetric[] {
  const all = projectMetricsMap[projectId] ?? [];
  return all.slice(Math.max(0, all.length - days));
}

export function getTeamKpiSummary(): TeamKpiSummary {
  const yesterdayAgg = aggregate(
    projects
      .filter((p) => p.status === "active")
      .map((p) => getProjectDailyMetrics(p.id, 1)[0])
      .filter(Boolean) as DailyMetric[]
  );
  const monthAgg = aggregate(
    projects
      .filter((p) => p.status === "active")
      .flatMap((p) => getProjectDailyMetrics(p.id, 30))
  );
  const overCpaCount = projects.filter((p) => {
    const agg = aggregate(getProjectDailyMetrics(p.id, 30));
    return agg.cpa > p.targetCpa;
  }).length;

  return {
    totalCost: monthAgg.cost,
    totalCv: monthAgg.cv,
    avgCpa: monthAgg.cpa,
    overCpaCount,
    activeProjectCount: projects.filter((p) => p.status === "active").length,
    yesterdayCost: yesterdayAgg.cost,
    yesterdayCv: yesterdayAgg.cv,
    yesterdayCpa: yesterdayAgg.cpa,
  };
}

export function getProjectKpiList(): ProjectKpi[] {
  return projects.map((p) => {
    const agg = aggregate(getProjectDailyMetrics(p.id, 30));
    const consumptionRate = Number(((agg.cost / p.monthlyTargetCost) * 100).toFixed(1));
    const forecastCost = Math.round(agg.cost * (30 / 30) * 1.02); // 簡易着地予測
    return {
      projectId: p.id,
      projectName: p.name,
      ownerName: p.ownerName,
      targetCost: p.monthlyTargetCost,
      actualCost: agg.cost,
      consumptionRate,
      forecastCost,
      cv: agg.cv,
      cpa: agg.cpa,
      targetCpa: p.targetCpa,
      isOverCpa: agg.cpa > p.targetCpa,
    };
  });
}

export function getAlertProjects(): ProjectKpi[] {
  return getProjectKpiList().filter((k) => k.isOverCpa || k.consumptionRate > 95);
}

// キャンペーン / 広告セット / 広告 のモック生成
export function getCampaigns(projectId: string): Campaign[] {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return [];
  return project.mediaAccounts.flatMap((media, i) =>
    Array.from({ length: 2 }).map((_, j) => {
      const seed = projectId.charCodeAt(1) * 10 + i * 3 + j;
      const metrics = aggregate(genDailyMetrics(30, seed, 20000 + seed * 500));
      return {
        id: `${projectId}-camp-${media}-${j}`,
        projectId,
        media,
        name: `【${media}】${project.name} #${j + 1}`,
        metrics,
      };
    })
  );
}

export function getAdSets(campaignId: string): AdSet[] {
  const media = (campaignId.split("-")[2] as MediaType) ?? "Meta";
  return Array.from({ length: 3 }).map((_, i) => {
    const seed = campaignId.length + i;
    const metrics = aggregate(genDailyMetrics(30, seed, 8000 + seed * 300));
    return {
      id: `${campaignId}-adset-${i}`,
      campaignId,
      media,
      name: `広告セット ${i + 1} - 興味関心配信`,
      metrics,
    };
  });
}

export function getAds(adSetId: string): Ad[] {
  const media = (adSetId.split("-")[2] as MediaType) ?? "Meta";
  return Array.from({ length: 4 }).map((_, i) => {
    const seed = adSetId.length + i * 2;
    const metrics = aggregate(genDailyMetrics(30, seed, 3000 + seed * 150));
    return {
      id: `${adSetId}-ad-${i}`,
      adSetId,
      media,
      name: `クリエイティブ_${String.fromCharCode(65 + i)}_${i + 1}訴求`,
      thumbnailUrl: `https://picsum.photos/seed/${adSetId}${i}/200/200`,
      metrics,
    };
  });
}

// クリエイティブ分析
export const creatives: Creative[] = Array.from({ length: 24 }).map((_, i) => {
  const project = projects[i % projects.length];
  const media = project.mediaAccounts[i % project.mediaAccounts.length];
  const daily = genDailyMetrics(30, i + 100, 4000 + i * 200);
  const agg = aggregate(daily);
  const isVideo = i % 3 === 0;
  const sizes = ["1080x1080", "1080x1920", "1200x628", "1920x1080"];
  return {
    id: `cr-${i}`,
    projectId: project.id,
    projectName: project.name,
    media,
    name: `${project.name.slice(0, 6)}_creative_${String(i + 1).padStart(3, "0")}`,
    type: isVideo ? "video" : "image",
    size: sizes[i % sizes.length],
    thumbnailUrl: `https://picsum.photos/seed/creative${i}/400/400`,
    ownerName: users[(i % 3) + 1].name,
    deliveryStart: daily[0].date,
    deliveryEnd: i % 5 === 0 ? daily[daily.length - 1].date : null,
    cost: agg.cost,
    imp: agg.imp,
    click: agg.click,
    ctr: agg.ctr,
    cvr: agg.cvr,
    cpa: agg.cpa,
    cv: agg.cv,
    frequency: agg.frequency,
    dailyMetrics: daily,
  };
});

// クリエイティブ入稿依頼（カンバン）
const statuses: CreativeRequest["status"][] = [
  "未着手",
  "制作中",
  "レビュー中",
  "入稿待ち",
  "完了",
];

export const creativeRequests: CreativeRequest[] = Array.from({ length: 16 }).map(
  (_, i) => {
    const project = projects[i % projects.length];
    const media = project.mediaAccounts[i % project.mediaAccounts.length];
    const owner = users[(i % 3) + 1];
    const requested = new Date();
    requested.setDate(requested.getDate() - (i % 10));
    const desired = new Date(requested);
    desired.setDate(desired.getDate() + 5);
    return {
      id: `req-${i}`,
      projectId: project.id,
      projectName: project.name,
      media,
      campaignName: `${media}_通常配信キャンペーン`,
      adSetName: `広告セット_${(i % 3) + 1}`,
      ownerName: owner.name,
      requestedAt: requested.toISOString().slice(0, 10),
      desiredSubmitDate: desired.toISOString().slice(0, 10),
      actualSubmitDate: i % 5 === 0 ? desired.toISOString().slice(0, 10) : null,
      dailyBudget: 10000 + (i % 5) * 5000,
      purpose: i % 2 === 0 ? "新規獲得訴求の強化" : "既存クリエイティブの疲弊対策",
      note: "訴求軸は季節性キャンペーンに合わせて調整してください。",
      status: statuses[i % statuses.length],
      assets:
        i % 4 === 0
          ? [
              {
                id: `asset-${i}-1`,
                fileName: "creative_main.jpg",
                fileType: "image",
                title: "今だけ限定オファー",
                mainText: "初回限定で特別価格でお試しいただけます。",
                description: "満足度98%のユーザー実績。今すぐチェック。",
                cta: "今すぐ申し込む",
                destinationUrl: "https://example.com/lp",
                parameters: "utm_source=meta&utm_campaign=spring",
                size: "1080x1080",
                media,
                note: "ロゴは右下固定でお願いします",
              },
            ]
          : [],
    };
  }
);
