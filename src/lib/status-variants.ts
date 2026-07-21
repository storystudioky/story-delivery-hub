import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Crown,
  Eye,
  FileEdit,
  Info,
  PlayCircle,
  ShieldAlert,
  UserCircle,
  UserCog,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { BadgeProps } from "@/components/ui/badge";

/**
 * Central Delivery Hub status/role vocabulary.
 *
 * Every page-level component should consume these types and lookup maps
 * instead of inventing page-local status strings or badge colors.
 */

export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type AttentionLevel = "info" | "warning" | "critical";
export type ContractStatus = "draft" | "active" | "completed" | "at_risk";
export type RoleBadge = "owner" | "manager" | "contributor" | "viewer";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

function assertNever(value: never): never {
  throw new Error(`Unhandled status variant: ${JSON.stringify(value)}`);
}

// ============================================
// Task status
// ============================================

export const TASK_STATUS_VALUES: TaskStatus[] = ["todo", "in_progress", "done", "cancelled"];

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To do";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    case "cancelled":
      return "Cancelled";
    default:
      return assertNever(status);
  }
}

export function getTaskStatusBadgeVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case "todo":
      return "taskTodo";
    case "in_progress":
      return "taskInProgress";
    case "done":
      return "taskDone";
    case "cancelled":
      return "taskCancelled";
    default:
      return assertNever(status);
  }
}

export function getTaskStatusIcon(status: TaskStatus): LucideIcon {
  switch (status) {
    case "todo":
      return Circle;
    case "in_progress":
      return PlayCircle;
    case "done":
      return CheckCircle2;
    case "cancelled":
      return XCircle;
    default:
      return assertNever(status);
  }
}

// ============================================
// Attention level
// ============================================

export const ATTENTION_LEVEL_VALUES: AttentionLevel[] = ["info", "warning", "critical"];

export function getAttentionLevelLabel(level: AttentionLevel): string {
  switch (level) {
    case "info":
      return "Info";
    case "warning":
      return "Attention";
    case "critical":
      return "Critical";
    default:
      return assertNever(level);
  }
}

export function getAttentionLevelBadgeVariant(level: AttentionLevel): BadgeVariant {
  switch (level) {
    case "info":
      return "attentionInfo";
    case "warning":
      return "attentionWarning";
    case "critical":
      return "attentionCritical";
    default:
      return assertNever(level);
  }
}

export function getAttentionLevelIcon(level: AttentionLevel): LucideIcon {
  switch (level) {
    case "info":
      return Info;
    case "warning":
      return AlertTriangle;
    case "critical":
      return AlertOctagon;
    default:
      return assertNever(level);
  }
}

// ============================================
// Contract status
// ============================================

export const CONTRACT_STATUS_VALUES: ContractStatus[] = ["draft", "active", "completed", "at_risk"];

export function getContractStatusLabel(status: ContractStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "at_risk":
      return "At risk";
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
    case "completed":
      return "contractCompleted";
    case "at_risk":
      return "contractAtRisk";
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
    case "completed":
      return CheckCircle2;
    case "at_risk":
      return ShieldAlert;
    default:
      return assertNever(status);
  }
}

// ============================================
// Role badge
// ============================================

export const ROLE_BADGE_VALUES: RoleBadge[] = ["owner", "manager", "contributor", "viewer"];

export function getRoleBadgeLabel(role: RoleBadge): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "manager":
      return "Manager";
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
    case "owner":
      return "roleOwner";
    case "manager":
      return "roleManager";
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
    case "owner":
      return Crown;
    case "manager":
      return UserCog;
    case "contributor":
      return UserCircle;
    case "viewer":
      return Eye;
    default:
      return assertNever(role);
  }
}
