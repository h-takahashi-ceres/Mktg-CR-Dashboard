import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import { creativeRequestColumns } from "@/lib/mock-data";

export default function CreativeRequestsPage() {
  return (
    <>
      <Topbar title="クリエイティブ入稿依頼" />
      <main className="flex flex-1 flex-col gap-4 overflow-x-auto p-6">
        <div className="grid grid-cols-5 gap-4" style={{ minWidth: 1000 }}>
          {creativeRequestColumns.map((col) => (
            <div key={col.status} className="flex flex-col rounded-xl bg-slate-100/70 p-3">
              <div className="mb-3 flex items-center gap-2 px-1">
                <p className="text-sm font-semibold">{col.status}</p>
                <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500">
                  {col.items.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <Card key={item.id} className="p-3.5">
                    <p className="text-xs font-semibold">{item.project}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{item.media}</p>
                    <div className="mt-3 flex flex-col gap-1 text-[11px] text-slate-500">
                      <p>担当: {item.owner}</p>
                      <p>希望入稿日: {item.desiredDate}</p>
                    </div>
                  </Card>
                ))}
                {col.items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[11px] text-slate-400">
                    依頼はありません
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
