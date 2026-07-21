import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0 h-6 gap-1.5 text-xs font-medium leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:!mr-0 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border bg-background text-foreground hover:bg-muted/60",
        manualGraphic: "border-primary/40 bg-background text-primary hover:bg-primary/5",
        success: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        available: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        current: "border-border bg-muted text-foreground hover:bg-muted",
        locked: "border-border bg-muted/70 text-muted-foreground hover:bg-muted/80",
        pro: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        inProgress: "border-transparent bg-purple-500 text-white hover:bg-purple-500/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
