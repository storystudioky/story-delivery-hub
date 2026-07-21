import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0 h-6 gap-1.5 text-xs font-medium leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:!mr-0 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border bg-background text-foreground hover:bg-muted/60",
        success: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        available: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        current: "border-border bg-muted text-foreground hover:bg-muted",
        locked: "border-border bg-muted/70 text-muted-foreground hover:bg-muted/80",
        inProgress: "border-transparent bg-purple-500 text-white hover:bg-purple-500/90",

        // Task status — central vocabulary, see src/lib/status-variants.ts
        taskTodo: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        taskInProgress: "border-transparent bg-primary/15 text-primary hover:bg-primary/20",
        taskDone: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        taskCancelled: "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15",

        // Attention level — indigo / amber / destructive red only
        attentionInfo: "border-transparent bg-primary/10 text-primary hover:bg-primary/15",
        attentionWarning:
          "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400",
        attentionCritical: "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20",

        // Contract status
        contractDraft: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        contractActive: "border-transparent bg-primary/15 text-primary hover:bg-primary/20",
        contractCompleted: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        contractAtRisk: "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20",

        // Role badge
        roleOwner: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        roleManager: "border-transparent bg-primary/15 text-primary hover:bg-primary/20",
        roleContributor: "border-border bg-background text-foreground hover:bg-muted/60",
        roleViewer: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
