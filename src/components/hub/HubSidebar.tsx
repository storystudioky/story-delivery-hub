import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface HubNavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface HubSidebarProps {
  navItems: HubNavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

function isNavItemActive(href: string, currentPath?: string): boolean {
  if (!currentPath) return false;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

/** Presentational vertical navigation link list. */
export function HubSidebar({ navItems, currentPath, onNavigate, className }: HubSidebarProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navItems.map((item) => {
        const isActive = isNavItemActive(item.href, currentPath);
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            type="button"
            onClick={() => onNavigate?.(item.href)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
