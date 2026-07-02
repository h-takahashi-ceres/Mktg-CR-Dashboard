"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";

const ROLE_LABEL: Record<string, string> = {
  admin: "管理者",
  operator: "運用者",
  client: "クライアント",
};

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/70 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="案件・クリエイティブを検索" className="w-64 pl-8" />
        </div>

        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {currentUser.name.slice(0, 1)}
          </div>
          <div className="hidden text-left text-xs leading-tight sm:block">
            <p className="font-medium text-foreground">{currentUser.name}</p>
            <p className="text-muted-foreground">{ROLE_LABEL[currentUser.role]}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
