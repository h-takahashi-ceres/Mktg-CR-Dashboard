"use client";

import { useState } from "react";
import { KanbanCard } from "./KanbanCard";
import { RequestDetailDialog } from "./RequestDetailDialog";
import { creativeRequests as initialRequests } from "@/lib/mock-data";
import type { CreativeRequest, RequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLUMNS: { status: RequestStatus; color: string }[] = [
  { status: "未着手", color: "bg-muted-foreground/60" },
  { status: "制作中", color: "bg-primary" },
  { status: "レビュー中", color: "bg-warning" },
  { status: "入稿待ち", color: "bg-[hsl(200,80%,50%)]" },
  { status: "完了", color: "bg-success" },
];

export function KanbanBoard() {
  const [requests, setRequests] = useState<CreativeRequest[]>(initialRequests);
  const [selected, setSelected] = useState<CreativeRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragOverCol, setDragOverCol] = useState<RequestStatus | null>(null);

  const moveRequest = (id: string, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <>
      <div className="grid flex-1 grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNS.map((col) => {
          const items = requests.filter((r) => r.status === col.status);
          return (
            <div
              key={col.status}
              className={cn(
                "kanban-column flex min-w-[220px] flex-col rounded-xl border border-border bg-muted/30 p-3 transition-colors",
                dragOverCol === col.status && "border-primary bg-primary/5"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.status);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) moveRequest(id, col.status);
                setDragOverCol(null);
              }}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("h-2 w-2 rounded-full", col.color)} />
                <p className="text-sm font-semibold">{col.status}</p>
                <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto">
                {items.map((r) => (
                  <KanbanCard
                    key={r.id}
                    request={r}
                    onClick={() => {
                      setSelected(r);
                      setDialogOpen(true);
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", r.id);
                    }}
                  />
                ))}
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
                    依頼はありません
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RequestDetailDialog request={selected} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
