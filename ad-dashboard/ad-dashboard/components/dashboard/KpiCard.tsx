import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  tone?: "default" | "danger" | "success";
  trend?: { value: string; positive: boolean };
}

export function KpiCard({ label, value, sub, icon: Icon, tone = "default", trend }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                tone === "danger" && "bg-destructive/10 text-destructive",
                tone === "success" && "bg-success/10 text-success",
                tone === "default" && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <p
          className={cn(
            "mt-2 text-2xl font-semibold tracking-tight",
            tone === "danger" && "text-destructive"
          )}
        >
          {value}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
