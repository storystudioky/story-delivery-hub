import * as React from "react";
import { Sparkles } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HubHeader } from "@/components/hub/HubHeader";
import { HubSidebar, type HubNavItem } from "@/components/hub/HubSidebar";

export interface HubAppShellProps {
  children: React.ReactNode;
  navItems: HubNavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  brandLabel?: string;
  /** Slot for a theme toggle control, rendered in the top header. */
  themeToggleSlot?: React.ReactNode;
  mainClassName?: string;
}

/**
 * Delivery Hub application shell.
 *
 * Desktop: fixed left sidebar + top header + main content.
 * Mobile: top header with a menu trigger that opens the nav in a Sheet.
 */
export function HubAppShell({
  children,
  navItems,
  currentPath,
  onNavigate,
  brandLabel = "Delivery Hub",
  themeToggleSlot,
  mainClassName,
}: HubAppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-background md:flex">
          <div className="flex h-16 items-center gap-2 px-6">
            <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate text-base font-semibold text-foreground">{brandLabel}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <HubSidebar navItems={navItems} currentPath={currentPath} onNavigate={handleNavigate} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <HubHeader
            brandLabel={brandLabel}
            onMobileMenuClick={() => setMobileNavOpen(true)}
            themeToggleSlot={themeToggleSlot}
          />

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="w-[280px] p-0 sm:w-[320px]">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle className="text-left">{brandLabel}</SheetTitle>
              </SheetHeader>
              <div className="px-3 py-4">
                <HubSidebar navItems={navItems} currentPath={currentPath} onNavigate={handleNavigate} />
              </div>
            </SheetContent>
          </Sheet>

          <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8", mainClassName)}>{children}</main>
        </div>
      </div>
    </div>
  );
}
