/**
 * Layout shells re-exported for convenience.
 *
 * The Delivery Hub layout primitives live under `src/components/hub` (they
 * are Delivery Hub-owned, presentational patterns). This module simply
 * re-exports the shell-level pieces so page code can import layout
 * components from `@/components/layout` without reaching into `hub/`.
 */
export { HubAppShell, type HubAppShellProps } from "@/components/hub/HubAppShell";
export { HubHeader, type HubHeaderProps } from "@/components/hub/HubHeader";
export { HubSidebar, type HubSidebarProps, type HubNavItem } from "@/components/hub/HubSidebar";
