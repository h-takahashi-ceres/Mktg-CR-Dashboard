"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  Image as ImageIcon,
  Trello,
  Settings,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/team", label: "チーム全体KPI進捗", icon: LayoutGrid },
  { href: "/dashboard/project", label: "案件KPI進捗", icon: FolderKanban },
  { href: "/dashboard/creatives", label: "クリエイティブ分析", icon: ImageIcon },
  { href: "/dashboard/creative-requests", label: "クリエイティブ入稿依頼", icon: Trello },
  { href: "/dashboard/settings", label: "権限・設定", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Megaphone className="h-[18px] w-[18px]" />
        </div>
        <span className="text-base font-semibold tracking-tight">AdOps Hub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">連携媒体</p>
        <p className="mt-1 leading-relaxed">
          Meta / TikTok / SmartNews / Popin / Taboola / Outbrain
        </p>
      </div>
    </aside>
  );
}
