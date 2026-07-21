import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getAttentionLevelBadgeVariant,
  getAttentionLevelIcon,
  getAttentionLevelLabel,
  getContractStatusBadgeVariant,
  getContractStatusIcon,
  getContractStatusLabel,
  getRoleBadgeIcon,
  getRoleBadgeLabel,
  getRoleBadgeVariant,
  getTaskStatusBadgeVariant,
  getTaskStatusIcon,
  getTaskStatusLabel,
  type AttentionLevel,
  type ContractStatus,
  type RoleBadge,
  type TaskStatus,
} from "@/lib/status-variants";

interface StatusBadgeBaseProps extends Omit<BadgeProps, "variant"> {
  /** Shows the semantic icon before the text label. Defaults to true. */
  showIcon?: boolean;
}

export interface TaskStatusBadgeProps extends StatusBadgeBaseProps {
  status: TaskStatus;
}

/** Badge with visible text label for a Delivery Hub task status. */
export function TaskStatusBadge({ status, showIcon = true, className, ...props }: TaskStatusBadgeProps) {
  const Icon = getTaskStatusIcon(status);
  return (
    <Badge variant={getTaskStatusBadgeVariant(status)} className={cn(className)} {...props}>
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {getTaskStatusLabel(status)}
    </Badge>
  );
}

export interface AttentionBadgeProps extends StatusBadgeBaseProps {
  level: AttentionLevel;
}

/** Badge with visible text label for a Delivery Hub attention level. */
export function AttentionBadge({ level, showIcon = true, className, ...props }: AttentionBadgeProps) {
  const Icon = getAttentionLevelIcon(level);
  return (
    <Badge variant={getAttentionLevelBadgeVariant(level)} className={cn(className)} {...props}>
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {getAttentionLevelLabel(level)}
    </Badge>
  );
}

export interface ContractStatusBadgeProps extends StatusBadgeBaseProps {
  status: ContractStatus;
}

/** Badge with visible text label for a Delivery Hub contract status. */
export function ContractStatusBadge({ status, showIcon = true, className, ...props }: ContractStatusBadgeProps) {
  const Icon = getContractStatusIcon(status);
  return (
    <Badge variant={getContractStatusBadgeVariant(status)} className={cn(className)} {...props}>
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {getContractStatusLabel(status)}
    </Badge>
  );
}

export interface RoleStatusBadgeProps extends StatusBadgeBaseProps {
  role: RoleBadge;
}

/** Badge with visible text label for a Delivery Hub member role. */
export function RoleStatusBadge({ role, showIcon = true, className, ...props }: RoleStatusBadgeProps) {
  const Icon = getRoleBadgeIcon(role);
  return (
    <Badge variant={getRoleBadgeVariant(role)} className={cn(className)} {...props}>
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {getRoleBadgeLabel(role)}
    </Badge>
  );
}
