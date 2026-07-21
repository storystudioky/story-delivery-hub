import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface EntityCardProps {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/** Generic entity card for vendors, contracts, tools, and similar Hub entities. */
export function EntityCard({
  title,
  subtitle,
  meta,
  badgeLabel,
  icon: Icon,
  onClick,
  className,
}: EntityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "hub-frosted-surface flex w-full items-start gap-3 rounded-[16px] border border-white/5 bg-background/40 p-4 text-left backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all hover:bg-background/60",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      {Icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
          {badgeLabel ? <Badge variant="outline">{badgeLabel}</Badge> : null}
        </div>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        {meta ? <p className="text-xs text-muted-foreground/80">{meta}</p> : null}
      </div>
    </button>
  );
}
