import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LockedReportBannerProps {
  label: string;
  description?: string;
  className?: string;
}

/**
 * Amber/indigo attention banner used to flag that a report is locked
 * (e.g. pending approval, awaiting a prior milestone, read-only period).
 */
export function LockedReportBanner({ label, description, className }: LockedReportBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[16px] border border-amber-500/25 bg-gradient-to-r from-primary/10 via-amber-500/10 to-amber-500/5 px-4 py-3",
        className,
      )}
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
