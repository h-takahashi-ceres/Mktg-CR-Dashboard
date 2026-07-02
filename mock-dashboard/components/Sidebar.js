"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard/team", label: "チーム全体KPI進捗" },
  { href: "/dashboard/project", label: "案件KPI進捗" },
  { href: "/dashboard/creatives", label: "クリエイティブ分析" },
  { href: "/dashboard/creative-requests", label: "クリエイティブ入稿依頼" },
  { href: "/dashboard/settings", label: "権限・設定" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
          A
        </div>
        <span className="text-base font-semibold">AdOps Hub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname && pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                (active
                  ? "bg-primarylight text-primary"
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 text-xs text-slate-400">
        連携媒体: Meta / TikTok / SmartNews / Popin / Taboola / Outbrain
      </div>
    </aside>
  );
}
