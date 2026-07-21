import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
}

/**
 * Frosted-glass KPI summary card.
 *
 * Uses the `hub-frosted-surface` utility class when it is defined by the
 * Delivery Hub token stylesheet, falling back to the raw SPARK-derived
 * frosted-surface classes otherwise.
 */
export function KpiCard({ label, value, icon: Icon, hint, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "hub-frosted-surface group rounded-[16px] border border-white/5 bg-background/40 p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:bg-background/60",
        className,
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden="true" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
