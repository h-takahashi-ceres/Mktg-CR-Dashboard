"use client";

import { CalendarDays, User, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { CreativeRequest } from "@/lib/types";

export function KanbanCard({
  request,
  onClick,
  onDragStart,
}: {
  request: CreativeRequest;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-tight">{request.projectName}</p>
          <Badge variant="outline" className="shrink-0">
            {request.media}
          </Badge>
        </div>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {request.campaignName}
        </p>

        <div className="mt-3 flex flex-col gap-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            {request.ownerName}
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" />
            希望入稿日 {request.desiredSubmitDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3 w-3" />
            日予算 {formatCurrency(request.dailyBudget)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
