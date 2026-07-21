import * as React from "react";

import { cn } from "@/lib/utils";

export interface HubPageHeaderStat {
  label: string;
  value: string;
}

export interface HubPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  stats?: HubPageHeaderStat[];
  className?: string;
}

/** Presentational page header — title, description, actions, and an optional rainbow-border stats panel. */
export function HubPageHeader({ title, description, actions, stats, className }: HubPageHeaderProps) {
  const hasStats = Boolean(stats && stats.length > 0);
  const hasActions = Boolean(actions);
  const showPanel = hasStats || hasActions;

  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <h1 className="min-w-0 text-xl font-semibold leading-tight text-foreground sm:text-2xl">{title}</h1>
      </div>

      {description && <p className="mb-4 mt-1 text-sm text-muted-foreground sm:mb-6 sm:text-base">{description}</p>}

      {showPanel && (
        <div className="rainbow-border rounded-[20px] p-[3px]">
          <div className="w-full rounded-[17px] bg-card">
            <div
              className={cn(
                "flex flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
                hasStats && hasActions && "sm:flex-row sm:items-center sm:justify-between",
              )}
            >
              {hasStats && (
                <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-x-10">
                  {stats!.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                        {stat.label}
                      </span>
                      <span className="truncate text-lg font-semibold tracking-tight text-foreground/90 sm:text-2xl">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {hasActions && (
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
