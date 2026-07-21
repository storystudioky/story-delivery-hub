import { Building2, ChevronDown, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface TenantSwitcherProps {
  tenantName: string;
  onClick?: () => void;
}

/** Presentational tenant switcher control for the Hub shell. */
export function TenantSwitcher({ tenantName, onClick }: TenantSwitcherProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      rounded="full"
      className="max-w-[180px] gap-1.5"
      onClick={onClick}
      aria-label={`Current tenant ${tenantName}`}
    >
      <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{tenantName}</span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </Button>
  );
}

export interface AccountControlsProps {
  displayName: string;
  roleLabel?: string;
  onClick?: () => void;
}

/** Presentational account controls for the Hub shell. */
export function AccountControls({ displayName, roleLabel, onClick }: AccountControlsProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="max-w-[200px] gap-2 px-2"
      onClick={onClick}
      aria-label={`Account menu for ${displayName}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="hidden min-w-0 text-left sm:block">
        <span className="block truncate text-sm font-medium leading-tight">{displayName}</span>
        {roleLabel ? (
          <span className="block truncate text-[11px] text-muted-foreground">{roleLabel}</span>
        ) : null}
      </span>
    </Button>
  );
}
