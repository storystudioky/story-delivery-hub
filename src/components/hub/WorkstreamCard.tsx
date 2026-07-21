import type { LucideIcon } from "lucide-react";

import { AttentionBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { AttentionLevel, TaskStatus } from "@/lib/status-variants";

export interface WorkstreamCardProps {
  title: string;
  summary?: string;
  owner: string;
  status: TaskStatus;
  attention: AttentionLevel;
  progressLabel?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/** Prop-driven workstream summary card for Delivery Hub boards. */
export function WorkstreamCard({
  title,
  summary,
  owner,
  status,
  attention,
  progressLabel,
  icon: Icon,
  onClick,
  className,
}: WorkstreamCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "hub-frosted-surface w-full rounded-[16px] border border-white/5 bg-background/40 p-4 text-left backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all hover:bg-background/60",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
            <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
          </div>
          {summary ? <p className="text-xs text-muted-foreground">{summary}</p> : null}
        </div>
        {progressLabel ? (
          <span className="shrink-0 text-xs font-medium text-primary">{progressLabel}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{owner}</span>
        <TaskStatusBadge status={status} />
        <AttentionBadge level={attention} />
      </div>
    </button>
  );
}
