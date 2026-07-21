import {
  Archive,
  Ban,
  CheckCircle2,
  Circle,
  CirclePause,
  Clock3,
  Crown,
  Eye,
  FileEdit,
  Hourglass,
  PlayCircle,
  Shield,
  TriangleAlert,
  UserCircle,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import type { BadgeProps } from "@/components/ui/badge";

/**
 * Central Delivery Hub status/role vocabulary (authoritative PRD alignment).
 *
 * Page-level components must consume these types and lookup maps
 * instead of inventing page-local status strings or badge colors.
 *
 * Do not introduce separate risk or issue status vocabularies.
 */

export type TaskStatus = "not_started" | "in_progress" | "waiting" | "complete" | "on_hold";
export type AttentionLevel = "on_track" | "needs_attention" | "late_off_track";
export type ContractStatus =
  | "draft"
  | "active"
  | "expiring"
  | "extended"
  | "completed"
  | "terminated"
  | "archived";
export type RoleBadge =
  | "platform_owner"
  | "tenant_admin"
  | "manager_editor"
  | "contributor"
  | "viewer";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

function assertNever(value: never): never {
  throw new Error(`Unhandled status variant: ${JSON.stringify(value)}`);
}

// ============================================
// Task status
// ============================================

export const TASK_STATUS_VALUES: TaskStatus[] = [
  "not_started",
  "in_progress",
  "waiting",
  "complete",
  "on_hold",
];

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "waiting":
      return "Waiting";
    case "complete":
      return "Complete";
    case "on_hold":
      return "On hold";
    default:
      return assertNever(status);
  }
}

export function getTaskStatusBadgeVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case "not_started":
      return "taskNotStarted";
    case "in_progress":
      return "taskInProgress";
    case "waiting":
      return "taskWaiting";
    case "complete":
      return "taskComplete";
    case "on_hold":
      return "taskOnHold";
    default:
      return assertNever(status);
  }
}

export function getTaskStatusIcon(status: TaskStatus): LucideIcon {
  switch (status) {
    case "not_started":
      return Circle;
    case "in_progress":
      return PlayCircle;
    case "waiting":
      return Hourglass;
    case "complete":
      return CheckCircle2;
    case "on_hold":
      return CirclePause;
    default:
      return assertNever(status);
  }
}

/** Visual “resolved” treatment applies only to complete — not waiting or on hold. */
export function isTaskStatusResolved(status: TaskStatus): boolean {
  return status === "complete";
}

// ============================================
// Attention level
// ============================================

export const ATTENTION_LEVEL_VALUES: AttentionLevel[] = [
  "on_track",
  "needs_attention",
  "late_off_track",
];

export function getAttentionLevelLabel(level: AttentionLevel): string {
  switch (level) {
    case "on_track":
      return "On track";
    case "needs_attention":
      return "Needs attention";
    case "late_off_track":
      return "Late/off track";
    default:
      return assertNever(level);
  }
}

export function getAttentionLevelBadgeVariant(level: AttentionLevel): BadgeVariant {
  switch (level) {
    case "on_track":
      return "attentionOnTrack";
    case "needs_attention":
      return "attentionNeedsAttention";
    case "late_off_track":
      return "attentionLateOffTrack";
    default:
      return assertNever(level);
  }
}

export function getAttentionLevelIcon(level: AttentionLevel): LucideIcon {
  switch (level) {
    case "on_track":
      return CheckCircle2;
    case "needs_attention":
      return TriangleAlert;
    case "late_off_track":
      return Ban;
    default:
      return assertNever(level);
  }
}

export function attentionRequiresNote(level: AttentionLevel): boolean {
  return level === "needs_attention" || level === "late_off_track";
}

// ============================================
// Contract status
// ============================================

export const CONTRACT_STATUS_VALUES: ContractStatus[] = [
  "draft",
  "active",
  "expiring",
  "extended",
  "completed",
  "terminated",
  "archived",
];

export function getContractStatusLabel(status: ContractStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "active":
      return "Active";
    case "expiring":
      return "Expiring";
    case "extended":
      return "Extended";
    case "completed":
      return "Completed";
    case "terminated":
      return "Terminated";
    case "archived":
      return "Archived";
    default:
      return assertNever(status);
  }
}

export function getContractStatusBadgeVariant(status: ContractStatus): BadgeVariant {
  switch (status) {
    case "draft":
      return "contractDraft";
    case "active":
      return "contractActive";
    case "expiring":
      return "contractExpiring";
    case "extended":
      return "contractExtended";
    case "completed":
      return "contractCompleted";
    case "terminated":
      return "contractTerminated";
    case "archived":
      return "contractArchived";
    default:
      return assertNever(status);
  }
}

export function getContractStatusIcon(status: ContractStatus): LucideIcon {
  switch (status) {
    case "draft":
      return FileEdit;
    case "active":
      return PlayCircle;
    case "expiring":
      return Clock3;
    case "extended":
      return Hourglass;
    case "completed":
      return CheckCircle2;
    case "terminated":
      return Ban;
    case "archived":
      return Archive;
    default:
      return assertNever(status);
  }
}

// ============================================
// Role badge
// ============================================

export const ROLE_BADGE_VALUES: RoleBadge[] = [
  "platform_owner",
  "tenant_admin",
  "manager_editor",
  "contributor",
  "viewer",
];

export function getRoleBadgeLabel(role: RoleBadge): string {
  switch (role) {
    case "platform_owner":
      return "Platform owner";
    case "tenant_admin":
      return "Tenant administrator";
    case "manager_editor":
      return "Manager/editor";
    case "contributor":
      return "Contributor";
    case "viewer":
      return "Viewer";
    default:
      return assertNever(role);
  }
}

export function getRoleBadgeVariant(role: RoleBadge): BadgeVariant {
  switch (role) {
    case "platform_owner":
      return "rolePlatformOwner";
    case "tenant_admin":
      return "roleTenantAdmin";
    case "manager_editor":
      return "roleManagerEditor";
    case "contributor":
      return "roleContributor";
    case "viewer":
      return "roleViewer";
    default:
      return assertNever(role);
  }
}

export function getRoleBadgeIcon(role: RoleBadge): LucideIcon {
  switch (role) {
    case "platform_owner":
      return Crown;
    case "tenant_admin":
      return Shield;
    case "manager_editor":
      return UserCog;
    case "contributor":
      return UserCircle;
    case "viewer":
      return Eye;
    default:
      return assertNever(role);
  }
}
