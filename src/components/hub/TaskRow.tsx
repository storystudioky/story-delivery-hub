import { CalendarIcon } from "lucide-react";

import { TaskStatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/status-variants";

export interface TaskRowProps {
  title: string;
  status: TaskStatus;
  dueDate?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Presentational task row — title, status badge, due date, selectable. */
export function TaskRow({ title, status, dueDate, selected = false, onClick, className }: TaskRowProps) {
  const isResolved = status === "done" || status === "cancelled";

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
        "flex items-center gap-3 rounded-[16px] border border-white/5 bg-background/40 px-4 py-3 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-background/60 hover:border-white/10",
        onClick && "cursor-pointer",
        selected && "ring-1 ring-primary/30 bg-primary/5",
        className,
      )}
    >
      <span
        className={cn("min-w-0 flex-1 truncate text-sm font-medium text-foreground", isResolved && "text-muted-foreground line-through")}
      >
        {title}
      </span>

      {dueDate && (
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          {dueDate}
        </span>
      )}

      <TaskStatusBadge status={status} className="shrink-0" />
    </div>
  );
}
