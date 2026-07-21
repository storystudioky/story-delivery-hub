import { describe, expect, it } from "vitest";

import {
  ATTENTION_LEVEL_VALUES,
  CONTRACT_STATUS_VALUES,
  ROLE_BADGE_VALUES,
  TASK_STATUS_VALUES,
  attentionRequiresNote,
  getAttentionLevelBadgeVariant,
  getAttentionLevelLabel,
  getContractStatusBadgeVariant,
  getContractStatusLabel,
  getRoleBadgeLabel,
  getRoleBadgeVariant,
  getTaskStatusBadgeVariant,
  getTaskStatusLabel,
  isTaskStatusResolved,
  type AttentionLevel,
  type ContractStatus,
  type RoleBadge,
  type TaskStatus,
} from "@/lib/status-variants";

describe("status-variants", () => {
  it("maps every authoritative task status label", () => {
    const expected: Record<TaskStatus, string> = {
      not_started: "Not started",
      in_progress: "In progress",
      waiting: "Waiting",
      complete: "Complete",
      on_hold: "On hold",
    };

    expect(TASK_STATUS_VALUES).toEqual([
      "not_started",
      "in_progress",
      "waiting",
      "complete",
      "on_hold",
    ]);

    for (const status of TASK_STATUS_VALUES) {
      expect(getTaskStatusLabel(status)).toBe(expected[status]);
      expect(getTaskStatusBadgeVariant(status)).toBeTruthy();
    }

    expect(isTaskStatusResolved("complete")).toBe(true);
    expect(isTaskStatusResolved("waiting")).toBe(false);
    expect(isTaskStatusResolved("on_hold")).toBe(false);
  });

  it("maps attention levels to indigo / amber / destructive treatments", () => {
    const expectedLabels: Record<AttentionLevel, string> = {
      on_track: "On track",
      needs_attention: "Needs attention",
      late_off_track: "Late/off track",
    };
    const expectedVariants: Record<AttentionLevel, string> = {
      on_track: "attentionOnTrack",
      needs_attention: "attentionNeedsAttention",
      late_off_track: "attentionLateOffTrack",
    };

    for (const level of ATTENTION_LEVEL_VALUES) {
      expect(getAttentionLevelLabel(level)).toBe(expectedLabels[level]);
      expect(getAttentionLevelBadgeVariant(level)).toBe(expectedVariants[level]);
    }

    expect(attentionRequiresNote("on_track")).toBe(false);
    expect(attentionRequiresNote("needs_attention")).toBe(true);
    expect(attentionRequiresNote("late_off_track")).toBe(true);
  });

  it("maps contract and role badges with authoritative labels", () => {
    expect(getContractStatusLabel("expiring" as ContractStatus)).toBe("Expiring");
    expect(CONTRACT_STATUS_VALUES).toContain("expiring");
    expect(CONTRACT_STATUS_VALUES).not.toContain("at_risk");

    for (const status of CONTRACT_STATUS_VALUES) {
      expect(getContractStatusLabel(status).length).toBeGreaterThan(0);
      expect(getContractStatusBadgeVariant(status)).toBeTruthy();
    }

    expect(getRoleBadgeLabel("tenant_admin" as RoleBadge)).toBe("Tenant administrator");
    expect(ROLE_BADGE_VALUES).toEqual([
      "platform_owner",
      "tenant_admin",
      "manager_editor",
      "contributor",
      "viewer",
    ]);

    for (const role of ROLE_BADGE_VALUES) {
      expect(getRoleBadgeLabel(role).length).toBeGreaterThan(0);
      expect(getRoleBadgeVariant(role)).toBeTruthy();
    }
  });
});
