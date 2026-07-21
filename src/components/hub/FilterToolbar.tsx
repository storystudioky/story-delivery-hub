import * as React from "react";
import { Filter } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterToolbarFilter {
  key: string;
  /** Placeholder shown when no option is selected. */
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface FilterToolbarProps {
  filters: FilterToolbarFilter[];
  /** Extra content rendered at the end of the rail, e.g. a clear-filters button. */
  trailing?: React.ReactNode;
  className?: string;
}

const pillTriggerClass = (isActive: boolean) =>
  cn(
    "inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full border-0 px-3 text-xs font-medium shadow-none ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isActive ? "bg-background text-foreground shadow-sm" : "bg-transparent text-muted-foreground",
  );

/** Presentational horizontal rail of filter chips/selects. */
export function FilterToolbar({ filters, trailing, className }: FilterToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar", className)}>
      <Filter className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="inline-flex h-10 items-center gap-0.5 rounded-md bg-muted p-1 text-muted-foreground">
        {filters.map((filter) => (
          <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className={pillTriggerClass(Boolean(filter.value))} aria-label={filter.placeholder}>
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      {trailing}
    </div>
  );
}
