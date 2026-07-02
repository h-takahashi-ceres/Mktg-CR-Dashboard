import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import { creatives } from "@/lib/mock-data";

function yen(n) {
  return "¥" + n.toLocaleString("ja-JP");
}

export default function CreativesPage() {
  const ranked = [...creatives].sort((a, b) => a.cpa - b.cpa);

  return (
    <>
      <Topbar title="クリエイティブ分析" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        {/* 検索条件（見た目のみ） */}
        <Card className="flex flex-wrap items-center gap-3">
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>すべての案件</option>
          </select>
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>すべての媒体</option>
          </select>
          <input
            className="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="クリエイティブ名で検索"
            readOnly
          />
          <p className="ml-auto text-xs text-slate-400">{creatives.length}件</p>
        </Card>

        {/* CPAランキング */}
        <div>
          <p className="mb-3 text-sm font-semibold">CPAランキング</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">クリエイティブ</th>
                  <th className="px-3 py-2 text-left">案件</th>
                  <th className="px-3 py-2 text-left">媒体</th>
                  <th className="px-3 py-2 text-right">CPA</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c, i) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium">{c.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{c.project}</td>
                    <td className="px-3 py-2.5 text-slate-500">{c.media}</td>
                    <td className="px-3 py-2.5 text-right font-medium">{yen(c.cpa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 画像一覧 */}
        <div>
          <p className="mb-3 text-sm font-semibold">画像一覧</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {creatives.map((c) => (
              <Card key={c.id} className="overflow-hidden p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.thumbnail}
                  alt={c.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3">
                  <p className="truncate text-xs font-medium">{c.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{c.project}</p>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-[11px]">
                    <div>
                      <p className="text-slate-400">CPA</p>
                      <p className="font-medium">{yen(c.cpa)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">CTR</p>
                      <p className="font-medium">{c.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">CVR</p>
                      <p className="font-medium">{c.cvr}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
