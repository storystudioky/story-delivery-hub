import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold leading-6 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.04),0px_2px_4px_-2px_rgba(0,0,0,0.08)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:size-5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&_svg]:size-5",
        outline: "border border-primary/80 bg-transparent text-primary hover:bg-primary/10 [&_svg]:size-5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 [&_svg]:size-5",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none [&_svg]:size-5",
        link: "text-primary underline-offset-4 hover:underline shadow-none [&_svg]:size-5",
        /** Solid primary: add/create/connect CTAs — white label + icons, strong rounding */
        cta: "border-0 bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:text-primary-foreground shadow-sm",
      },
      size: {
        default: "h-12 px-4 py-2 [&_svg]:size-5",
        sm: "h-10 px-3 text-sm [&_svg]:size-4",
        /** Popover/dialog micro actions (e.g. combobox “Add”) */
        dense: "h-7 px-2 text-xs gap-1.5 [&_svg]:size-3.5",
        lg: "h-14 px-8 [&_svg]:size-5",
        icon: "h-12 w-12 [&_svg]:size-5",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        sm: "rounded-md",
        none: "rounded-none",
      },
    },
    compoundVariants: [
      {
        variant: "cta",
        size: "default",
        class:
          "h-12 min-h-12 rounded-2xl px-4 text-base font-semibold [&_svg]:size-5",
      },
      {
        variant: "cta",
        size: "sm",
        class:
          "h-8 min-h-8 rounded-2xl px-3 text-sm font-semibold gap-1.5 [&_svg]:!size-4",
      },
      {
        variant: "cta",
        size: "dense",
        class:
          "h-7 min-h-7 rounded-xl px-2 text-xs font-semibold gap-1.5 [&_svg]:!size-3.5",
      },
      {
        variant: "cta",
        size: "icon",
        class: "h-8 w-8 min-h-8 rounded-2xl p-0 [&_svg]:!size-4",
      },
      {
        variant: "cta",
        size: "lg",
        class: "rounded-2xl [&_svg]:size-5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
