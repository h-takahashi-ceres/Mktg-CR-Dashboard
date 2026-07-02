"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { Creative } from "@/lib/types";

export function CreativeModal({
  creative,
  open,
  onOpenChange,
}: {
  creative: Creative | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!creative) return null;

  const stats: { label: string; value: string }[] = [
    { label: "Cost", value: formatCurrency(creative.cost) },
    { label: "CTR", value: formatPercent(creative.ctr) },
    { label: "CVR", value: formatPercent(creative.cvr) },
    { label: "CPA", value: formatCurrency(creative.cpa) },
    { label: "Frequency", value: creative.frequency.toFixed(2) },
    { label: "CV", value: formatNumber(creative.cv) },
    { label: "IMP", value: formatNumber(creative.imp) },
    { label: "CLICK", value: formatNumber(creative.click) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{creative.name}</DialogTitle>
            <Badge variant="outline">{creative.media}</Badge>
          </div>
          <DialogDescription>
            {creative.projectName} ／ 配信期間 {creative.deliveryStart} 〜{" "}
            {creative.deliveryEnd ?? "配信中"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={creative.thumbnailUrl}
              alt={creative.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-border p-3">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <LineChartCard
            title="日別推移"
            data={creative.dailyMetrics}
            metrics={[
              { key: "cost", label: "Cost" },
              { key: "cpa", label: "CPA" },
              { key: "ctr", label: "CTR" },
              { key: "cvr", label: "CVR" },
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
