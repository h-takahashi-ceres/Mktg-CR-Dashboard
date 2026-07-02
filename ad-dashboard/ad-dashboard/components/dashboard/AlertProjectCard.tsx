import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { ProjectKpi } from "@/lib/types";

export function AlertProjectCard({ project }: { project: ProjectKpi }) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{project.projectName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">担当: {project.ownerName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {project.isOverCpa && (
              <Badge variant="destructive">
                CPA超過 {formatCurrency(project.cpa)} / 許容{formatCurrency(project.targetCpa)}
              </Badge>
            )}
            {project.consumptionRate > 95 && (
              <Badge variant="warning">消化率 {project.consumptionRate}%</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
