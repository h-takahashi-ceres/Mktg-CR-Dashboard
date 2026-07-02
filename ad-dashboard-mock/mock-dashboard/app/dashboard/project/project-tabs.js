"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { campaigns, projects } from "@/lib/mock-data";

function yen(n) {
  return "¥" + n.toLocaleString("ja-JP");
}

const TABS = ["キャンペーン", "広告セット", "広告"];
const SUMMARY_FIELDS = ["Cost", "CPA", "CTR", "CPC", "CPM", "MCV", "MCVR", "MCPA", "CV", "CVR"];

export default function ProjectTabs() {
  const [tab, setTab] = useState(TABS[0]);
  const project = projects[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          {projects.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option>今月</option>
          <option>先月</option>
          <option>今週</option>
          <option>任意期間</option>
        </select>
        <p className="text-xs text-slate-400">
          許容CPA: {yen(project.targetCpa)} ／ 月間目標Cost: {yen(project.targetCost)}
        </p>
      </div>

      <div className="inline-flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors " +
              (tab === t ? "bg-white shadow-sm" : "text-slate-500")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {SUMMARY_FIELDS.map((label, i) => (
          <Card key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold">
              {label.includes("R") || label === "CTR"
                ? (1.5 + i * 0.3).toFixed(1) + "%"
                : label === "Cost" || label.includes("CPA") || label === "CPC" || label === "CPM"
                ? yen(3000 + i * 400)
                : 50 + i * 8}
            </p>
          </Card>
        ))}
      </div>

      {/* 折れ線グラフの代わりにシンプルな棒グラフ */}
      <Card>
        <p className="mb-4 text-sm font-semibold">{tab}推移（Cost）</p>
        <div className="flex h-32 items-end gap-3">
          {[62, 78, 55, 90, 70, 85, 60].map((v, i) => (
            <div key={i} className="flex-1 rounded-t bg-primary" style={{ height: v + "%" }} />
          ))}
        </div>
      </Card>

      {/* 一覧テーブル */}
      <div>
        <p className="mb-3 text-sm font-semibold">{tab}一覧</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">名前</th>
                <th className="px-3 py-2 text-left">媒体</th>
                <th className="px-3 py-2 text-right">Cost</th>
                <th className="px-3 py-2 text-right">CPA</th>
                <th className="px-3 py-2 text-right">CTR</th>
                <th className="px-3 py-2 text-right">CVR</th>
                <th className="px-3 py-2 text-right">CV</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="max-w-[220px] truncate px-3 py-2.5 font-medium">{c.name}</td>
                  <td className="px-3 py-2.5 text-slate-500">{c.media}</td>
                  <td className="px-3 py-2.5 text-right">{yen(c.cost)}</td>
                  <td className="px-3 py-2.5 text-right">{yen(c.cpa)}</td>
                  <td className="px-3 py-2.5 text-right">{c.ctr}%</td>
                  <td className="px-3 py-2.5 text-right">{c.cvr}%</td>
                  <td className="px-3 py-2.5 text-right">{c.cv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
