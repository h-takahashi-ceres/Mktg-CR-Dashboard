"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CreativeCard } from "@/components/creatives/CreativeCard";
import { CreativeModal } from "@/components/creatives/CreativeModal";
import { creatives as allCreatives, projects, users } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Creative, MediaType } from "@/lib/types";

const MEDIA_OPTIONS: MediaType[] = [
  "Meta",
  "TikTok",
  "SmartNews",
  "Popin",
  "Taboola",
  "Outbrain",
];

const RANKINGS: { key: string; label: string; asc?: boolean; get: (c: Creative) => number; fmt: (v: number) => string }[] = [
  { key: "cpa", label: "CPAランキング", asc: true, get: (c) => c.cpa, fmt: formatCurrency },
  { key: "ctr", label: "CTRランキング", get: (c) => c.ctr, fmt: formatPercent },
  { key: "cvr", label: "CVRランキング", get: (c) => c.cvr, fmt: formatPercent },
  { key: "cost", label: "Costランキング", get: (c) => c.cost, fmt: formatCurrency },
];

export function CreativesClient() {
  const [projectId, setProjectId] = useState<string>("all");
  const [media, setMedia] = useState<string>("all");
  const [owner, setOwner] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Creative | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return allCreatives.filter((c) => {
      if (projectId !== "all" && c.projectId !== projectId) return false;
      if (media !== "all" && c.media !== media) return false;
      if (owner !== "all" && c.ownerName !== owner) return false;
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [projectId, media, owner, query]);

  const mediaComparison = useMemo(() => {
    return MEDIA_OPTIONS.map((m) => {
      const items = filtered.filter((c) => c.media === m);
      const cost = items.reduce((s, c) => s + c.cost, 0);
      const cv = items.reduce((s, c) => s + c.cv, 0);
      return {
        media: m,
        cost,
        cpa: cv ? Math.round(cost / cv) : 0,
      };
    }).filter((m) => m.cost > 0);
  }, [filtered]);

  const typeComparison = useMemo(() => {
    return (["image", "video"] as const).map((t) => {
      const items = filtered.filter((c) => c.type === t);
      const cost = items.reduce((s, c) => s + c.cost, 0);
      const cv = items.reduce((s, c) => s + c.cv, 0);
      const avgCtr = items.length
        ? items.reduce((s, c) => s + c.ctr, 0) / items.length
        : 0;
      return {
        type: t === "image" ? "静止画" : "動画",
        count: items.length,
        cost,
        cpa: cv ? Math.round(cost / cv) : 0,
        ctr: avgCtr,
      };
    });
  }, [filtered]);

  const sizeComparison = useMemo(() => {
    const map = new Map<string, Creative[]>();
    filtered.forEach((c) => {
      map.set(c.size, [...(map.get(c.size) ?? []), c]);
    });
    return Array.from(map.entries()).map(([size, items]) => {
      const cost = items.reduce((s, c) => s + c.cost, 0);
      const cv = items.reduce((s, c) => s + c.cv, 0);
      return {
        size,
        count: items.length,
        cost,
        cpa: cv ? Math.round(cost / cv) : 0,
        frequency: items.reduce((s, c) => s + c.frequency, 0) / (items.length || 1),
      };
    });
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* 検索条件 */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="案件" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての案件</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={media} onValueChange={setMedia}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="媒体" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての媒体</SelectItem>
              {MEDIA_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="担当者" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての担当者</SelectItem>
              {users
                .filter((u) => u.role === "operator")
                .map((u) => (
                  <SelectItem key={u.id} value={u.name}>
                    {u.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="クリエイティブ名で検索"
              className="w-60 pl-8"
            />
          </div>

          <p className="ml-auto text-xs text-muted-foreground">
            {filtered.length}件のクリエイティブ
          </p>
        </CardContent>
      </Card>

      {/* ランキング */}
      <Tabs defaultValue="cpa">
        <TabsList>
          {RANKINGS.map((r) => (
            <TabsTrigger key={String(r.key)} value={String(r.key)}>
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {RANKINGS.map((r) => {
          const sorted = [...filtered].sort((a, b) => {
            const av = r.get(a);
            const bv = r.get(b);
            return r.asc ? av - bv : bv - av;
          });
          return (
            <TabsContent key={String(r.key)} value={String(r.key)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>クリエイティブ</TableHead>
                    <TableHead>案件</TableHead>
                    <TableHead>媒体</TableHead>
                    <TableHead className="text-right">{r.label.replace("ランキング", "")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.slice(0, 10).map((c, i) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelected(c);
                        setModalOpen(true);
                      }}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.thumbnailUrl} alt={c.name} className="h-7 w-7 rounded object-cover" />
                        <span className="max-w-[200px] truncate">{c.name}</span>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-muted-foreground">
                        {c.projectName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.media}</TableCell>
                      <TableCell className="text-right font-medium">
                        {r.fmt(r.get(c))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* 比較セクション */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">媒体別比較（Cost）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mediaComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 91%)" vertical={false} />
                <XAxis dataKey="media" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="cost" fill="hsl(245 75% 59%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">静止画・動画比較</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {typeComparison.map((t) => (
              <div key={t.type} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t.type}</p>
                  <p className="text-xs text-muted-foreground">{t.count}件</p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-medium">{formatCurrency(t.cost)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPA</p>
                    <p className="font-medium">{formatCurrency(t.cpa)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTR</p>
                    <p className="font-medium">{formatPercent(t.ctr)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">サイズ別比較</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サイズ</TableHead>
                  <TableHead className="text-right">件数</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                  <TableHead className="text-right">Freq</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeComparison.map((s) => (
                  <TableRow key={s.size}>
                    <TableCell>{s.size}</TableCell>
                    <TableCell className="text-right">{s.count}</TableCell>
                    <TableCell className="text-right">{formatCurrency(s.cpa)}</TableCell>
                    <TableCell className="text-right">{s.frequency.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 画像一覧 */}
      <div>
        <p className="mb-3 text-sm font-semibold">画像一覧</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {filtered.map((c) => (
            <CreativeCard
              key={c.id}
              creative={c}
              onClick={() => {
                setSelected(c);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <CreativeModal creative={selected} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
