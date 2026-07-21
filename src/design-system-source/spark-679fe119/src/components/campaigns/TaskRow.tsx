import { useState, useRef, useEffect } from 'react';
import { Check, X, Circle, Link, Trash2, AlertTriangle, Minus, GripVertical, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CAMPAIGN_TASK_STATUS_LABEL,
  TASK_STATUS_ICON_CONFIG,
  DELIVERABLE_TYPE_LABEL,
  DELIVERABLE_TYPE_COLOR,
  type CampaignTaskStatus,
  type DeliverableType,
} from '@/lib/constants';
import type { CampaignTask } from '@/hooks/useCampaignTasks';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskRowProps {
  task: CampaignTask;
  selected: boolean;
  assetCount?: number;
  onSelect: (id: string, checked: boolean) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: CampaignTask) => void;
  onTitleChange?: (id: string, title: string) => void;
  onDateChange?: (id: string, date: string | null) => void;
  isBlocked?: boolean;
  blockingTaskNames?: string[];
  dragHandleProps?: {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
  };
  isDragOver?: boolean;
}

function StatusIcon({ status }: { status: CampaignTaskStatus }) {
  const config = TASK_STATUS_ICON_CONFIG[status] || TASK_STATUS_ICON_CONFIG.not_started;
  const iconClass = cn('h-4 w-4', config.color);

  switch (status) {
    case 'completed':
      return (
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.bgColor)}>
          <Check className={iconClass} />
        </div>
      );
    case 'canceled':
      return (
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.bgColor)}>
          <X className={iconClass} />
        </div>
      );
    case 'in_progress':
      return (
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.bgColor)}>
          <Circle className={cn(iconClass, 'fill-current')} strokeWidth={0} />
        </div>
      );
    case 'blocked':
      return (
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.bgColor)}>
          <AlertTriangle className={iconClass} />
        </div>
      );
    default:
      return (
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.bgColor)}>
          <Minus className={iconClass} />
        </div>
      );
  }
}

export function TaskRow({
  task,
  selected,
  assetCount = 0,
  onSelect,
  onStatusChange,
  onDelete,
  onClick,
  onTitleChange,
  onDateChange,
  isBlocked,
  blockingTaskNames,
  dragHandleProps,
  isDragOver,
}: TaskRowProps) {
  const status = task.status as CampaignTaskStatus;
  const deliverableType = (task as any).deliverable_type as DeliverableType | null;
  const isDone = status === 'completed';
  const isCanceled = status === 'canceled';

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const commitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== task.title && onTitleChange) {
      onTitleChange(task.id, trimmed);
    } else {
      setTitleDraft(task.title);
    }
  };

  return (
    <div
      draggable={!!dragHandleProps}
      onDragStart={dragHandleProps?.onDragStart}
      onDragEnd={dragHandleProps?.onDragEnd}
      onDragOver={dragHandleProps?.onDragOver}
      data-task-id={task.id}
      className={cn(
        'group flex flex-col sm:flex-row sm:items-center gap-3 rounded-[16px] border border-white/5 bg-background/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-background/60 sm:hover:scale-[1.01] hover:border-white/10 relative px-4 py-3 cursor-pointer',
        selected && 'ring-1 ring-primary/30 bg-primary/5',
        isDragOver && 'border-primary border-dashed bg-primary/5'
      )}
    >
      {/* Top row: drag, select, status, title, delete (mobile) */}
      <div className="flex items-start gap-3 w-full min-w-0">
      {/* Drag handle */}
      {dragHandleProps && (
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground -ml-1">
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {/* Selection checkbox */}
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(task.id, !!checked)}
          className="rounded-full h-5 w-5"
        />
      </div>

      {/* Status icon */}
      <StatusIcon status={status} />

      {/* Title + badges area */}
      <div className="flex-1 min-w-0" onClick={() => !isEditingTitle && onClick(task)}>
        <div className="flex items-center gap-2 flex-wrap">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') {
                  setTitleDraft(task.title);
                  setIsEditingTitle(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium bg-transparent border-b border-primary/50 outline-none text-foreground w-full max-w-md py-0.5"
            />
          ) : (
            <span
              className={cn(
                'text-sm font-medium text-foreground truncate cursor-text hover:border-b hover:border-muted-foreground/30',
                (isDone || isCanceled) && 'line-through text-muted-foreground'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTitleDraft(task.title);
                setIsEditingTitle(true);
              }}
            >
              {task.title}
            </span>
          )}
          {deliverableType && (
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full px-2 h-6 py-0 text-[10px] font-medium',
                DELIVERABLE_TYPE_COLOR[deliverableType] || 'bg-muted text-muted-foreground'
              )}
            >
              {DELIVERABLE_TYPE_LABEL[deliverableType] || deliverableType}
            </span>
          )}
          {assetCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {assetCount} asset{assetCount === 1 ? '' : 's'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {task.estimated_hours && (
            <span className="text-xs text-muted-foreground">{task.estimated_hours}h est.</span>
          )}
          {(task as any).assignee_email && (
            <span className="text-xs text-muted-foreground">{(task as any).assignee_email}</span>
          )}
          {task.is_floating && task.offset_days != null && (
            <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
              {task.offset_days === 0
                ? 'Launch day'
                : task.offset_days < 0
                  ? `${Math.abs(task.offset_days)}d before`
                  : `${task.offset_days}d after`}
            </span>
          )}
        </div>
      </div>

      {/* Dependency indicator */}
      {isBlocked && (
        <div className="flex items-center shrink-0" title={`Blocked by: ${blockingTaskNames?.join(', ')}`}>
          <Link className="h-4 w-4 text-destructive" />
        </div>
      )}

      {/* Delete — visible on mobile, hover on desktop */}
      <div onClick={(e) => e.stopPropagation()} className="ml-auto sm:ml-0 sm:order-last shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      </div>

      {/* Bottom row on mobile: date + status */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:contents pl-11 sm:pl-0">
      {/* Inline date input */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'h-8 w-auto min-w-[110px] justify-start text-left font-normal text-xs px-2 rounded-md hover:bg-accent hover:text-foreground transition-colors !shadow-none border border-transparent',
                task.due_date ? 'text-muted-foreground' : 'text-muted-foreground/50'
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5 mr-1 opacity-50 shrink-0" />
              <span className="truncate">{task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'Set date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <Calendar
              mode="single"
              selected={task.due_date ? new Date(task.due_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T12:00:00Z`;
                  onDateChange?.(task.id, iso);
                } else {
                  onDateChange?.(task.id, null);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div onClick={(e) => e.stopPropagation()} className="w-full sm:w-[120px]">
        <Select value={status} onValueChange={(val) => onStatusChange(task.id, val)}>
          <SelectTrigger className="h-9 sm:h-8 text-xs border-transparent bg-transparent hover:bg-accent transition-colors !shadow-none w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CAMPAIGN_TASK_STATUS_LABEL).map(([v, l]) => (
              <SelectItem key={v} value={v} className="text-xs">
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>
    </div>
  );
}
