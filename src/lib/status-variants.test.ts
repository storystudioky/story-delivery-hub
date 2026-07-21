import { describe, expect, it } from "vitest";

import {
  ATTENTION_LEVEL_VALUES,
  CONTRACT_STATUS_VALUES,
  ROLE_BADGE_VALUES,
  TASK_STATUS_VALUES,
  getAttentionLevelBadgeVariant,
  getAttentionLevelLabel,
  getContractStatusBadgeVariant,
  getContractStatusLabel,
  getRoleBadgeLabel,
  getRoleBadgeVariant,
  getTaskStatusBadgeVariant,
  getTaskStatusLabel,
  type AttentionLevel,
  type ContractStatus,
  type RoleBadge,
  type TaskStatus,
} from "@/lib/status-variants";

describe("status-variants", () => {
  it("maps every task status to a labelled badge variant", () => {
    const expected: Record<TaskStatus, string> = {
      todo: "To do",
      in_progress: "In progress",
      done: "Done",
      cancelled: "Cancelled",
    };

    for (const status of TASK_STATUS_VALUES) {
      expect(getTaskStatusLabel(status)).toBe(expected[status]);
      expect(getTaskStatusBadgeVariant(status)).toBeTruthy();
    }
  });

  it("maps attention levels to indigo / amber / destructive treatments", () => {
    const expected: Record<AttentionLevel, string> = {
      info: "attentionInfo",
      warning: "attentionWarning",
      critical: "attentionCritical",
    };

    for (const level of ATTENTION_LEVEL_VALUES) {
      expect(getAttentionLevelLabel(level).length).toBeGreaterThan(0);
      expect(getAttentionLevelBadgeVariant(level)).toBe(expected[level]);
    }
  });

  it("maps contract and role badges with visible labels", () => {
    for (const status of CONTRACT_STATUS_VALUES) {
      expect(getContractStatusLabel(status as ContractStatus).length).toBeGreaterThan(0);
      expect(getContractStatusBadgeVariant(status)).toBeTruthy();
    }

    for (const role of ROLE_BADGE_VALUES) {
      expect(getRoleBadgeLabel(role as RoleBadge).length).toBeGreaterThan(0);
      expect(getRoleBadgeVariant(role)).toBeTruthy();
    }
  });
});
