import { PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Creative } from "@/lib/types";

export function CreativeCard({
  creative,
  onClick,
}: {
  creative: Creative;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="relative aspect-square w-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={creative.thumbnailUrl}
          alt={creative.name}
          className="h-full w-full object-cover"
        />
        {creative.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <PlayCircle className="h-8 w-8 text-white" />
          </div>
        )}
        <Badge className="absolute left-2 top-2 bg-white/90 text-foreground" variant="outline">
          {creative.media}
        </Badge>
      </div>
      <CardContent className="p-3">
        <p className="truncate text-xs font-medium">{creative.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {creative.projectName}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1 text-[11px]">
          <div>
            <p className="text-muted-foreground">CPA</p>
            <p className="font-medium">{formatCurrency(creative.cpa)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CTR</p>
            <p className="font-medium">{formatPercent(creative.ctr)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CVR</p>
            <p className="font-medium">{formatPercent(creative.cvr)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
