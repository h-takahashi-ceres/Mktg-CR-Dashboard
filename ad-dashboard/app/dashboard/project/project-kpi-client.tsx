"use client";

import { useMemo, useState } from "react";
import { Download, Search, Trophy } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { projects, getCampaigns, getAdSets, getAds, getProjectDailyMetrics } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { Ad, AdSet, Campaign } from "@/lib/types";

const PERIOD_OPTIONS = ["今日", "昨日", "今週", "先週", "今月", "先月", "任意期間"];

const SUMMARY_FIELDS: { key: string; label: string; format: (v: number) => string }[] = [
  { key: "cost", label: "Cost", format: formatCurrency },
  { key: "cpa", label: "CPA", format: formatCurrency },
  { key: "ctr", label: "CTR", format: (v) => formatPercent(v) },
  { key: "cpc", label: "CPC", format: formatCurrency },
  { key: "cpm", label: "CPM", format: formatCurrency },
  { key: "mcv", label: "MCV", format: formatNumber },
  { key: "mcvr", label: "MCVR", format: (v) => formatPercent(v) },
  { key: "mcpa", label: "MCPA", format: formatCurrency },
  { key: "cv", label: "CV", format: formatNumber },
  { key: "cvr", label: "CVR", format: (v) => formatPercent(v) },
];

function SummaryCards({ metrics }: { metrics: Record<string, number> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {SUMMARY_FIELDS.map((f) => (
        <Card key={f.key}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{f.label}</p>
            <p className="mt-1 text-lg font-semibold">{f.format(metrics[f.key] ?? 0)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function exportCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => r[h]).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function EntityTable({
  rows,
  onExport,
}: {
  rows: (Campaign | AdSet)[];
  onExport: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"cost" | "cpa" | "cv">("cost");

  const filtered = useMemo(
    () =>
      rows
        .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.metrics[sortKey] - a.metrics[sortKey]),
    [rows, query, sortKey]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名前で検索"
            className="w-56 pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as typeof sortKey)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">Cost順</SelectItem>
              <SelectItem value="cpa">CPA順</SelectItem>
              <SelectItem value="cv">CV順</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-3.5 w-3.5" />
            CSV出力
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>媒体</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">CPA</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">CVR</TableHead>
            <TableHead className="text-right">CV</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="max-w-[240px] truncate font-medium">{r.name}</TableCell>
              <TableCell className="text-muted-foreground">{r.media}</TableCell>
              <TableCell className="text-right">{formatCurrency(r.metrics.cost)}</TableCell>
              <TableCell className="text-right">{formatCurrency(r.metrics.cpa)}</TableCell>
              <TableCell className="text-right">{formatPercent(r.metrics.ctr)}</TableCell>
              <TableCell className="text-right">{formatPercent(r.metrics.cvr)}</TableCell>
              <TableCell className="text-right">{formatNumber(r.metrics.cv)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProjectKpiClient() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const [period, setPeriod] = useState("今月");

  const project = projects.find((p) => p.id === projectId)!;
  const campaigns = useMemo(() => getCampaigns(projectId), [projectId]);
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id);
  const activeCampaignId = campaigns.find((c) => c.id === campaignId) ? campaignId : campaigns[0]?.id;

  const adSets = useMemo(() => getAdSets(activeCampaignId ?? ""), [activeCampaignId]);
  const [adSetId, setAdSetId] = useState(adSets[0]?.id);
  const activeAdSetId = adSets.find((a) => a.id === adSetId) ? adSetId : adSets[0]?.id;

  const ads = useMemo(() => getAds(activeAdSetId ?? ""), [activeAdSetId]);

  const projectDaily = useMemo(() => getProjectDailyMetrics(projectId, 30), [projectId]);

  const campaignAgg = useMemo(() => {
    const total = campaigns.reduce(
      (acc, c) => {
        acc.cost += c.metrics.cost;
        acc.cv += c.metrics.cv;
        acc.click += c.metrics.click;
        acc.imp += c.metrics.imp;
        acc.mcv += c.metrics.mcv;
        return acc;
      },
      { cost: 0, cv: 0, click: 0, imp: 0, mcv: 0 }
    );
    return {
      cost: total.cost,
      cpa: total.cv ? Math.round(total.cost / total.cv) : 0,
      ctr: total.imp ? Number(((total.click / total.imp) * 100).toFixed(2)) : 0,
      cpc: total.click ? Number((total.cost / total.click).toFixed(1)) : 0,
      cpm: total.imp ? Number(((total.cost / total.imp) * 1000).toFixed(1)) : 0,
      mcv: total.mcv,
      mcvr: total.click ? Number(((total.mcv / total.click) * 100).toFixed(2)) : 0,
      mcpa: total.mcv ? Math.round(total.cost / total.mcv) : 0,
      cv: total.cv,
      cvr: total.click ? Number(((total.cv / total.click) * 100).toFixed(2)) : 0,
    };
  }, [campaigns]);

  const adSetAgg = useMemo(() => {
    const total = adSets.reduce(
      (acc, c) => {
        acc.cost += c.metrics.cost;
        acc.cv += c.metrics.cv;
        acc.click += c.metrics.click;
        acc.imp += c.metrics.imp;
        acc.mcv += c.metrics.mcv;
        return acc;
      },
      { cost: 0, cv: 0, click: 0, imp: 0, mcv: 0 }
    );
    return {
      cost: total.cost,
      cpa: total.cv ? Math.round(total.cost / total.cv) : 0,
      ctr: total.imp ? Number(((total.click / total.imp) * 100).toFixed(2)) : 0,
      cpc: total.click ? Number((total.cost / total.click).toFixed(1)) : 0,
      cpm: total.imp ? Number(((total.cost / total.imp) * 1000).toFixed(1)) : 0,
      mcv: total.mcv,
      mcvr: total.click ? Number(((total.mcv / total.click) * 100).toFixed(2)) : 0,
      mcpa: total.mcv ? Math.round(total.cost / total.mcv) : 0,
      cv: total.cv,
      cvr: total.click ? Number(((total.cv / total.click) * 100).toFixed(2)) : 0,
    };
  }, [adSets]);

  const topAds = useMemo(
    () => [...ads].sort((a, b) => a.metrics.cpa - b.metrics.cpa).slice(0, 5),
    [ads]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 案件・期間選択 */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          許容CPA: {formatCurrency(project.targetCpa)} ／ 月間目標Cost:{" "}
          {formatCurrency(project.monthlyTargetCost)} ／ 月間目標CV:{" "}
          {formatNumber(project.monthlyTargetCv)}
        </p>
      </div>

      <Tabs defaultValue="campaign">
        <TabsList>
          <TabsTrigger value="campaign">キャンペーン</TabsTrigger>
          <TabsTrigger value="adset">広告セット</TabsTrigger>
          <TabsTrigger value="ad">広告</TabsTrigger>
        </TabsList>

        {/* キャンペーンタブ */}
        <TabsContent value="campaign" className="flex flex-col gap-5">
          <SummaryCards metrics={campaignAgg} />
          <LineChartCard title="キャンペーン推移" data={projectDaily} />
          <EntityTable
            rows={campaigns}
            onExport={() =>
              exportCsv(
                "campaigns.csv",
                campaigns.map((c) => ({
                  name: c.name,
                  media: c.media,
                  cost: c.metrics.cost,
                  cpa: c.metrics.cpa,
                  ctr: c.metrics.ctr,
                  cvr: c.metrics.cvr,
                  cv: c.metrics.cv,
                }))
              )
            }
          />
        </TabsContent>

        {/* 広告セットタブ */}
        <TabsContent value="adset" className="flex flex-col gap-5">
          <Select value={activeCampaignId} onValueChange={setCampaignId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="キャンペーンを選択" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SummaryCards metrics={adSetAgg} />
          <LineChartCard title="広告セット推移" data={projectDaily} />
          <EntityTable
            rows={adSets}
            onExport={() =>
              exportCsv(
                "adsets.csv",
                adSets.map((a) => ({
                  name: a.name,
                  media: a.media,
                  cost: a.metrics.cost,
                  cpa: a.metrics.cpa,
                  ctr: a.metrics.ctr,
                  cvr: a.metrics.cvr,
                  cv: a.metrics.cv,
                }))
              )
            }
          />
        </TabsContent>

        {/* 広告タブ */}
        <TabsContent value="ad" className="flex flex-col gap-5">
          <Select value={activeAdSetId} onValueChange={setAdSetId}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="広告セットを選択" />
            </SelectTrigger>
            <SelectContent>
              {adSets.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <p className="text-sm font-semibold">CPAランキング TOP5</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {topAds.map((ad: Ad, i) => (
                <Card key={ad.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ad.thumbnailUrl}
                        alt={ad.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{ad.name}</p>
                        <p className="text-[11px] text-muted-foreground">{ad.media}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="text-right">{formatCurrency(ad.metrics.cost)}</span>
                      <span className="text-muted-foreground">CTR</span>
                      <span className="text-right">{formatPercent(ad.metrics.ctr)}</span>
                      <span className="text-muted-foreground">MCVR</span>
                      <span className="text-right">{formatPercent(ad.metrics.mcvr)}</span>
                      <span className="text-muted-foreground">MCPA</span>
                      <span className="text-right">{formatCurrency(ad.metrics.mcpa)}</span>
                      <span className="text-muted-foreground">CVR</span>
                      <span className="text-right">{formatPercent(ad.metrics.cvr)}</span>
                      <span className="font-medium text-foreground">CPA</span>
                      <span className="text-right font-semibold text-primary">
                        {formatCurrency(ad.metrics.cpa)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <SummaryCards
            metrics={
              ads.length
                ? {
                    cost: ads.reduce((s, a) => s + a.metrics.cost, 0),
                    cpa:
                      ads.reduce((s, a) => s + a.metrics.cv, 0) > 0
                        ? Math.round(
                            ads.reduce((s, a) => s + a.metrics.cost, 0) /
                              ads.reduce((s, a) => s + a.metrics.cv, 0)
                          )
                        : 0,
                    ctr: ads.reduce((s, a) => s + a.metrics.ctr, 0) / ads.length,
                    cpc: ads.reduce((s, a) => s + a.metrics.cpc, 0) / ads.length,
                    cpm: ads.reduce((s, a) => s + a.metrics.cpm, 0) / ads.length,
                    mcv: ads.reduce((s, a) => s + a.metrics.mcv, 0),
                    mcvr: ads.reduce((s, a) => s + a.metrics.mcvr, 0) / ads.length,
                    mcpa: ads.reduce((s, a) => s + a.metrics.mcpa, 0) / ads.length,
                    cv: ads.reduce((s, a) => s + a.metrics.cv, 0),
                    cvr: ads.reduce((s, a) => s + a.metrics.cvr, 0) / ads.length,
                  }
                : {}
            }
          />
          <LineChartCard title="広告推移" data={projectDaily} />
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">広告一覧</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サムネイル</TableHead>
                  <TableHead>広告名</TableHead>
                  <TableHead>媒体</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">CVR</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ad.thumbnailUrl} alt={ad.name} className="h-8 w-8 rounded-md object-cover" />
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate font-medium">{ad.name}</TableCell>
                    <TableCell className="text-muted-foreground">{ad.media}</TableCell>
                    <TableCell className="text-right">{formatCurrency(ad.metrics.cost)}</TableCell>
                    <TableCell className="text-right">{formatPercent(ad.metrics.ctr)}</TableCell>
                    <TableCell className="text-right">{formatPercent(ad.metrics.cvr)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(ad.metrics.cpa)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
