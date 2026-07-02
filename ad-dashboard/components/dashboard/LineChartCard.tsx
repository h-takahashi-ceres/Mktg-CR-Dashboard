"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyMetric } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const METRIC_OPTIONS: { key: keyof DailyMetric; label: string }[] = [
  { key: "cost", label: "Cost" },
  { key: "cpa", label: "CPA" },
  { key: "imp", label: "IMP" },
  { key: "click", label: "CLICK" },
  { key: "ctr", label: "CTR" },
  { key: "cpc", label: "CPC" },
  { key: "cpm", label: "CPM" },
  { key: "mcvr", label: "MCVR" },
  { key: "mcpa", label: "MCPA" },
  { key: "cvr", label: "CVR" },
  { key: "frequency", label: "Frequency" },
];

export function LineChartCard({
  title,
  data,
  metrics = METRIC_OPTIONS,
}: {
  title: string;
  data: DailyMetric[];
  metrics?: { key: keyof DailyMetric; label: string }[];
}) {
  const [metric, setMetric] = useState<keyof DailyMetric>(metrics[0].key);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
        <div className="flex flex-wrap justify-end gap-1">
          {metrics.map((m) => (
            <button
              key={String(m.key)}
              onClick={() => setMetric(m.key)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                metric === m.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 91%)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              labelFormatter={(v) => formatDate(String(v))}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(220 14% 91%)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="hsl(245 75% 59%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
