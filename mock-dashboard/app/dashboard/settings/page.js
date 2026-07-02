import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { projects, users, mediaList } from "@/lib/mock-data";

function yen(n) {
  return "¥" + n.toLocaleString("ja-JP");
}

export default function SettingsPage() {
  return (
    <>
      <Topbar title="権限・設定" />
      <main className="flex flex-1 flex-col gap-8 p-6">
        {/* 案件登録フォーム（見た目のみ） */}
        <div>
          <p className="mb-3 text-sm font-semibold">新規案件登録</p>
          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="mb-1 text-xs text-slate-500">案件名</p>
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="例）ABCコスメ 新規獲得キャンペーン" readOnly />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">担当者</p>
                <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {users.filter((u) => u.role !== "クライアント").map((u) => (
                    <option key={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">ADTR</p>
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="ADTR-00000" readOnly />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">許容CPA</p>
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="4500" readOnly />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">月間目標Cost</p>
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="3000000" readOnly />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">月間目標CV</p>
                <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="650" readOnly />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="mb-1 text-xs text-slate-500">広告アカウント（連携媒体）</p>
                <div className="flex flex-wrap gap-2">
                  {mediaList.map((m) => (
                    <span key={m} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
              案件を登録する
            </button>
          </Card>
        </div>

        {/* 登録済み案件一覧 */}
        <div>
          <p className="mb-3 text-sm font-semibold">登録済み案件一覧</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">案件名</th>
                  <th className="px-3 py-2 text-left">担当者</th>
                  <th className="px-3 py-2 text-left">媒体</th>
                  <th className="px-3 py-2 text-right">許容CPA</th>
                  <th className="px-3 py-2 text-right">月間目標Cost</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="max-w-[200px] truncate px-3 py-2.5 font-medium">{p.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.owner}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.media}</td>
                    <td className="px-3 py-2.5 text-right">{yen(p.targetCpa)}</td>
                    <td className="px-3 py-2.5 text-right">{yen(p.targetCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 権限管理 */}
        <div>
          <p className="mb-3 text-sm font-semibold">権限管理</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">名前</th>
                  <th className="px-3 py-2 text-left">メールアドレス</th>
                  <th className="px-3 py-2 text-left">権限</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-medium">{u.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{u.email}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={u.role === "管理者" ? "default" : "success"}>{u.role}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
