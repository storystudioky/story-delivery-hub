import * as React from "react";
import { Menu, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HubHeaderProps {
  brandLabel?: string;
  /** Hides the brand label — useful when a parent shell already renders it in a sidebar. */
  showBrand?: boolean;
  onMobileMenuClick?: () => void;
  /** Prop-driven tenant switcher control. */
  tenantSwitcherSlot?: React.ReactNode;
  /** Prop-driven account / profile controls. */
  accountControlsSlot?: React.ReactNode;
  /** Prop-driven theme toggle control. */
  themeToggleSlot?: React.ReactNode;
  className?: string;
}

/** Presentational top bar with tenant, account, and theme slots. */
export function HubHeader({
  brandLabel = "Delivery Hub",
  showBrand = true,
  onMobileMenuClick,
  tenantSwitcherSlot,
  accountControlsSlot,
  themeToggleSlot,
  className,
}: HubHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6",
        className,
      )}
    >
      {onMobileMenuClick ? (
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={onMobileMenuClick}>
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Open navigation</span>
        </Button>
      ) : null}

      {showBrand ? (
        <div className="flex min-w-0 items-center gap-2 md:hidden">
          <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate text-base font-semibold text-foreground">{brandLabel}</span>
        </div>
      ) : null}

      <div className="ml-auto flex min-w-0 items-center gap-2">
        {tenantSwitcherSlot}
        {themeToggleSlot}
        {accountControlsSlot}
      </div>
    </header>
  );
}
