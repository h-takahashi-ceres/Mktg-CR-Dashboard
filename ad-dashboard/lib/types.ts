// ドメイン型定義
// DB設計 (docs/DB_DESIGN.md) のテーブル構造とほぼ1:1対応させている

export type Role = "admin" | "operator" | "client";

export type MediaType =
  | "Meta"
  | "TikTok"
  | "SmartNews"
  | "Popin"
  | "Taboola"
  | "Outbrain";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  mediaAccounts: MediaType[];
  adtr: string;
  targetCpa: number;
  monthlyTargetCost: number;
  monthlyTargetCv: number;
  status: "active" | "paused" | "completed";
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  cost: number;
  cv: number;
  cpa: number;
  imp: number;
  click: number;
  ctr: number;
  cpc: number;
  cpm: number;
  mcv: number;
  mcvr: number;
  mcpa: number;
  cvr: number;
  frequency: number;
}

export interface ProjectKpi {
  projectId: string;
  projectName: string;
  ownerName: string;
  targetCost: number;
  actualCost: number;
  consumptionRate: number; // 消化率 %
  forecastCost: number; // 単純着地予測
  cv: number;
  cpa: number;
  targetCpa: number;
  isOverCpa: boolean;
}

export interface TeamKpiSummary {
  totalCost: number;
  totalCv: number;
  avgCpa: number;
  overCpaCount: number;
  activeProjectCount: number;
  yesterdayCost: number;
  yesterdayCv: number;
  yesterdayCpa: number;
}

export interface Campaign {
  id: string;
  projectId: string;
  media: MediaType;
  name: string;
  metrics: DailyMetric; // 期間集計値
}

export interface AdSet {
  id: string;
  campaignId: string;
  media: MediaType;
  name: string;
  metrics: DailyMetric;
}

export interface Ad {
  id: string;
  adSetId: string;
  media: MediaType;
  name: string;
  thumbnailUrl: string;
  metrics: DailyMetric;
}

export interface Creative {
  id: string;
  projectId: string;
  projectName: string;
  media: MediaType;
  name: string;
  type: "image" | "video";
  size: string; // e.g. "1080x1080"
  thumbnailUrl: string;
  ownerName: string;
  deliveryStart: string;
  deliveryEnd: string | null;
  cost: number;
  imp: number;
  click: number;
  ctr: number;
  cvr: number;
  cpa: number;
  cv: number;
  frequency: number;
  dailyMetrics: DailyMetric[];
}

export type RequestStatus =
  | "未着手"
  | "制作中"
  | "レビュー中"
  | "入稿待ち"
  | "完了";

export interface CreativeAsset {
  id: string;
  fileName: string;
  fileType: "image" | "video";
  title: string;
  mainText: string;
  description: string;
  cta: string;
  destinationUrl: string;
  parameters: string;
  size: string;
  media: MediaType;
  note: string;
}

export interface CreativeRequest {
  id: string;
  projectId: string;
  projectName: string;
  media: MediaType;
  campaignName: string;
  adSetName: string;
  ownerName: string;
  requestedAt: string;
  desiredSubmitDate: string;
  actualSubmitDate: string | null;
  dailyBudget: number;
  purpose: string;
  note: string;
  status: RequestStatus;
  assets: CreativeAsset[];
}
