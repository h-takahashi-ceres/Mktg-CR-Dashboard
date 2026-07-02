import { Wallet, Target, TrendingUp, AlertTriangle, Layers, CalendarClock } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { AlertProjectCard } from "@/components/dashboard/AlertProjectCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  getTeamKpiSummary,
  getProjectKpiList,
  getAlertProjects,
  getProjectDailyMetrics,
  projects,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export default function TeamKpiPage() {
  const summary = getTeamKpiSummary();
  const projectKpis = getProjectKpiList();
  const alerts = getAlertProjects();

  // チーム全体の日別Cost推移（アクティブ案件の合算）
  const days = 30;
  const activeProjects = projects.filter((p) => p.status === "active");
  const teamDaily = Array.from({ length: days }).map((_, i) => {
    const rows = activeProjects.map((p) => getProjectDailyMetrics(p.id, days)[i]);
    const cost = rows.reduce((s, m) => s + (m?.cost ?? 0), 0);
    return { date: rows[0]?.date ?? "", cost };
  });

  return (
    <>
      <Topbar title="チーム全体KPI進捗" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        {/* KPIカード */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          <KpiCard label="総Cost（当月）" value={formatCurrency(summary.totalCost)} icon={Wallet} />
          <KpiCard label="総CV（当月）" value={formatNumber(summary.totalCv)} icon={Target} />
          <KpiCard label="平均CPA" value={formatCurrency(summary.avgCpa)} icon={TrendingUp} />
          <KpiCard
            label="CPA超過案件数"
            value={`${summary.overCpaCount}件`}
            icon={AlertTriangle}
            tone={summary.overCpaCount > 0 ? "danger" : "default"}
          />
          <KpiCard label="進行案件数" value={`${summary.activeProjectCount}件`} icon={Layers} />
          <KpiCard label="昨日Cost" value={formatCurrency(summary.yesterdayCost)} icon={CalendarClock} />
          <KpiCard label="昨日CV" value={formatNumber(summary.yesterdayCv)} icon={CalendarClock} />
          <KpiCard label="昨日CPA" value={formatCurrency(summary.yesterdayCpa)} icon={CalendarClock} />
        </div>

        {/* 折れ線グラフ */}
        <LineChartCard
          title="日別Cost推移（チーム全体）"
          data={teamDaily as never}
          metrics={[{ key: "cost", label: "Cost" }]}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* 案件一覧 */}
          <div className="xl:col-span-2">
            <p className="mb-3 text-sm font-semibold">案件一覧</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>案件名</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead className="text-right">目標Cost</TableHead>
                  <TableHead className="text-right">実Cost</TableHead>
                  <TableHead className="text-right">消化率</TableHead>
                  <TableHead className="text-right">着地予測</TableHead>
                  <TableHead className="text-right">CV</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                  <TableHead className="text-right">許容CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectKpis.map((p) => (
                  <TableRow key={p.projectId}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      {p.projectName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.ownerName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.targetCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.actualCost)}</TableCell>
                    <TableCell className="text-right">{formatPercent(p.consumptionRate, 1)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.forecastCost)}</TableCell>
                    <TableCell className="text-right">{formatNumber(p.cv)}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${p.isOverCpa ? "text-destructive" : ""}`}
                    >
                      {formatCurrency(p.cpa)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(p.targetCpa)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 改善が必要な案件 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-sm font-semibold">改善が必要な案件</p>
              <Badge variant="destructive">{alerts.length}件</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  現在、CPA超過・消化率超過の案件はありません。
                </p>
              )}
              {alerts.map((a) => (
                <AlertProjectCard key={a.projectId} project={a} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
