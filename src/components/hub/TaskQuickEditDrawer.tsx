import * as React from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ATTENTION_LEVEL_VALUES,
  TASK_STATUS_VALUES,
  attentionRequiresNote,
  getAttentionLevelLabel,
  getTaskStatusLabel,
  type AttentionLevel,
  type TaskStatus,
} from "@/lib/status-variants";

export interface TaskOwnerOption {
  value: string;
  label: string;
}

export interface TaskQuickEditValues {
  status: TaskStatus;
  attention: AttentionLevel;
  ownerId: string;
  dueDate: string;
  latestUpdate: string;
  attentionNote: string;
  waitingOn: string;
  waitingExplanation: string;
}

export interface TaskQuickEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Displayed as read-only context — not a default editable field. */
  taskTitle: string;
  initialValues: TaskQuickEditValues;
  ownerOptions: TaskOwnerOption[];
  primarySourceUrl?: string;
  onSave: (values: TaskQuickEditValues) => void;
  onCancel?: () => void;
}

/**
 * Quick-edit drawer for Delivery Hub task operational fields.
 * Local state only — persistence is delegated through `onSave`.
 */
export function TaskQuickEditDrawer({
  open,
  onOpenChange,
  taskTitle,
  initialValues,
  ownerOptions,
  primarySourceUrl,
  onSave,
  onCancel,
}: TaskQuickEditDrawerProps) {
  const [status, setStatus] = React.useState<TaskStatus>(initialValues.status);
  const [attention, setAttention] = React.useState<AttentionLevel>(initialValues.attention);
  const [ownerId, setOwnerId] = React.useState(initialValues.ownerId);
  const [dueDate, setDueDate] = React.useState(initialValues.dueDate);
  const [latestUpdate, setLatestUpdate] = React.useState(initialValues.latestUpdate);
  const [attentionNote, setAttentionNote] = React.useState(initialValues.attentionNote);
  const [waitingOn, setWaitingOn] = React.useState(initialValues.waitingOn);
  const [waitingExplanation, setWaitingExplanation] = React.useState(initialValues.waitingExplanation);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setStatus(initialValues.status);
      setAttention(initialValues.attention);
      setOwnerId(initialValues.ownerId);
      setDueDate(initialValues.dueDate);
      setLatestUpdate(initialValues.latestUpdate);
      setAttentionNote(initialValues.attentionNote);
      setWaitingOn(initialValues.waitingOn);
      setWaitingExplanation(initialValues.waitingExplanation);
      setValidationError(null);
    }
  }, [open, initialValues]);

  const noteRequired = attentionRequiresNote(attention);
  const showWaitingFields = status === "waiting";

  const handleSave = () => {
    if (noteRequired && attentionNote.trim().length === 0) {
      setValidationError("An attention note is required when attention is Needs attention or Late/off track.");
      return;
    }

    onSave({
      status,
      attention,
      ownerId,
      dueDate,
      latestUpdate,
      attentionNote,
      waitingOn,
      waitingExplanation,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Quick edit</DrawerTitle>
          <p className="text-sm text-muted-foreground">{taskTitle}</p>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
              <SelectTrigger id="task-quick-edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUS_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {getTaskStatusLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-attention">Attention</Label>
            <Select value={attention} onValueChange={(value) => setAttention(value as AttentionLevel)}>
              <SelectTrigger id="task-quick-edit-attention">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ATTENTION_LEVEL_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {getAttentionLevelLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {noteRequired ? (
            <div className="space-y-1.5">
              <Label htmlFor="task-quick-edit-attention-note">Attention note</Label>
              <Textarea
                id="task-quick-edit-attention-note"
                value={attentionNote}
                onChange={(event) => setAttentionNote(event.target.value)}
                placeholder="Explain what needs attention…"
                rows={3}
                required
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-owner">Owner</Label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger id="task-quick-edit-owner">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {ownerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-due-date">Current due date</Label>
            <Input
              id="task-quick-edit-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-latest-update">Latest update</Label>
            <Textarea
              id="task-quick-edit-latest-update"
              value={latestUpdate}
              onChange={(event) => setLatestUpdate(event.target.value)}
              placeholder="What changed most recently?"
              rows={3}
            />
          </div>

          {showWaitingFields ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="task-quick-edit-waiting-on">Waiting on</Label>
                <Input
                  id="task-quick-edit-waiting-on"
                  value={waitingOn}
                  onChange={(event) => setWaitingOn(event.target.value)}
                  placeholder="Person, vendor, or dependency"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-quick-edit-waiting-explanation">Waiting explanation</Label>
                <Textarea
                  id="task-quick-edit-waiting-explanation"
                  value={waitingExplanation}
                  onChange={(event) => setWaitingExplanation(event.target.value)}
                  placeholder="Optional context for the wait"
                  rows={2}
                />
              </div>
            </>
          ) : null}

          {primarySourceUrl ? (
            <Button asChild variant="cta" className="w-full">
              <a href={primarySourceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View source
              </a>
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">No primary source link for this task.</p>
          )}

          {validationError ? <p className="text-sm text-destructive">{validationError}</p> : null}
        </div>

        <DrawerFooter>
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
