import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full rounded-[32px] border border-border/40 bg-muted shadow-[inset_0px_1px_4px_rgba(0,0,0,0.08)]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("absolute left-0 top-0 h-full rounded-[32px] bg-primary shadow-[inset_0px_1px_4px_rgba(0,0,0,0.08)] transition-all", indicatorClassName)}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
