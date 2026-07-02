import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import {
  teamSummary,
  projects,
  alertProjects,
  dailyCost,
} from "@/lib/mock-data";

function yen(n) {
  return "¥" + n.toLocaleString("ja-JP");
}

const KPI_ITEMS = [
  { label: "総Cost（当月）", value: yen(teamSummary.totalCost) },
  { label: "総CV（当月）", value: teamSummary.totalCv + "件" },
  { label: "平均CPA", value: yen(teamSummary.avgCpa) },
  { label: "CPA超過案件数", value: teamSummary.overCpaCount + "件", danger: true },
  { label: "進行案件数", value: teamSummary.activeProjectCount + "件" },
  { label: "昨日Cost", value: yen(teamSummary.yesterdayCost) },
  { label: "昨日CV", value: teamSummary.yesterdayCv + "件" },
  { label: "昨日CPA", value: yen(teamSummary.yesterdayCpa) },
];

export default function TeamKpiPage() {
  const maxCost = Math.max(...dailyCost.map((d) => d.cost));

  return (
    <>
      <Topbar title="チーム全体KPI進捗" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        {/* KPIカード */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {KPI_ITEMS.map((item) => (
            <Card key={item.label}>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p
                className={
                  "mt-2 text-2xl font-semibold " +
                  (item.danger ? "text-rose-600" : "text-slate-900")
                }
              >
                {item.value}
              </p>
            </Card>
          ))}
        </div>

        {/* 日別Cost推移（シンプルな棒グラフ表現） */}
        <Card>
          <p className="mb-4 text-sm font-semibold">日別Cost推移</p>
          <div className="flex h-40 items-end gap-3">
            {dailyCost.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-primary"
                  style={{ height: (d.cost / maxCost) * 100 + "%" }}
                />
                <span className="text-[11px] text-slate-400">{d.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* 案件一覧 */}
          <div className="xl:col-span-2">
            <p className="mb-3 text-sm font-semibold">案件一覧</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">案件名</th>
                    <th className="px-3 py-2 text-left">担当者</th>
                    <th className="px-3 py-2 text-right">目標Cost</th>
                    <th className="px-3 py-2 text-right">実Cost</th>
                    <th className="px-3 py-2 text-right">消化率</th>
                    <th className="px-3 py-2 text-right">CV</th>
                    <th className="px-3 py-2 text-right">CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-t border-slate-100">
                      <td className="max-w-[200px] truncate px-3 py-2.5 font-medium">
                        {p.name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{p.owner}</td>
                      <td className="px-3 py-2.5 text-right">{yen(p.targetCost)}</td>
                      <td className="px-3 py-2.5 text-right">{yen(p.actualCost)}</td>
                      <td className="px-3 py-2.5 text-right">{p.consumptionRate}%</td>
                      <td className="px-3 py-2.5 text-right">{p.cv}</td>
                      <td
                        className={
                          "px-3 py-2.5 text-right font-medium " +
                          (p.isOver ? "text-rose-600" : "")
                        }
                      >
                        {yen(p.cpa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 改善が必要な案件 */}
          <div>
            <p className="mb-3 text-sm font-semibold">改善が必要な案件</p>
            <div className="flex flex-col gap-3">
              {alertProjects.map((p) => (
                <Card key={p.id} className="border-rose-200">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">担当: {p.owner}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.isOver && <Badge tone="danger">CPA超過</Badge>}
                    {p.consumptionRate > 95 && (
                      <Badge tone="warning">消化率 {p.consumptionRate}%</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
