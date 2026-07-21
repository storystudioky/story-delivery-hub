import * as React from "react";

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
import { TASK_STATUS_VALUES, getTaskStatusLabel, type TaskStatus } from "@/lib/status-variants";

export interface TaskQuickEditValues {
  title: string;
  status: TaskStatus;
  notes: string;
}

export interface TaskQuickEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TaskQuickEditValues;
  onSave: (values: TaskQuickEditValues) => void;
  onCancel?: () => void;
}

/**
 * Quick-edit drawer for a task's title, status, and notes.
 * Local state only — the caller decides how to persist `onSave` results.
 */
export function TaskQuickEditDrawer({
  open,
  onOpenChange,
  initialValues,
  onSave,
  onCancel,
}: TaskQuickEditDrawerProps) {
  const [title, setTitle] = React.useState(initialValues.title);
  const [status, setStatus] = React.useState<TaskStatus>(initialValues.status);
  const [notes, setNotes] = React.useState(initialValues.notes);

  React.useEffect(() => {
    if (open) {
      setTitle(initialValues.title);
      setStatus(initialValues.status);
      setNotes(initialValues.notes);
    }
  }, [open, initialValues]);

  const handleSave = () => {
    onSave({ title, status, notes });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit task</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-quick-edit-title">Title</Label>
            <Input
              id="task-quick-edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
            />
          </div>

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
            <Label htmlFor="task-quick-edit-notes">Notes</Label>
            <Textarea
              id="task-quick-edit-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add notes for this task..."
              rows={4}
            />
          </div>
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
