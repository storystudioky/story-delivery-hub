import { CalendarIcon, ExternalLink } from "lucide-react";

import { AttentionBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  isTaskStatusResolved,
  type AttentionLevel,
  type TaskStatus,
} from "@/lib/status-variants";

export interface TaskRowProps {
  title: string;
  status: TaskStatus;
  attention: AttentionLevel;
  owner: string;
  dueDate?: string;
  primarySourceUrl?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Compact operational task row for Delivery Hub boards. */
export function TaskRow({
  title,
  status,
  attention,
  owner,
  dueDate,
  primarySourceUrl,
  selected = false,
  onClick,
  className,
}: TaskRowProps) {
  const isResolved = isTaskStatusResolved(status);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-white/5 bg-background/40 px-4 py-3 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-background/60 hover:border-white/10 sm:flex-row sm:items-center",
        onClick && "cursor-pointer",
        selected && "ring-1 ring-primary/30 bg-primary/5",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p
          className={cn(
            "truncate text-sm font-medium text-foreground",
            isResolved && "text-muted-foreground line-through",
          )}
        >
          {title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{owner}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {dueDate ? (
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            {dueDate}
          </span>
        ) : null}

        <TaskStatusBadge status={status} className="shrink-0" />
        <AttentionBadge level={attention} className="shrink-0" />

        {primarySourceUrl ? (
          <Button asChild variant="outline" size="sm" rounded="full" className="h-8">
            <a
              href={primarySourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View source
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
