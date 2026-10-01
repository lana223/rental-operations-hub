import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md active:bg-primary/80 active:shadow-sm",
        hero: "bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-primary/88 hover:shadow-lg active:bg-primary/78 active:shadow-sm",
        warm: "bg-accent text-accent-foreground shadow-[var(--shadow-button)] hover:bg-accent/88 hover:shadow-lg active:bg-accent/76 active:shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:bg-destructive/80",
        outline:
          "border border-input bg-transparent text-foreground shadow-sm hover:border-primary hover:bg-secondary hover:text-foreground hover:shadow-md active:bg-secondary/70 active:shadow-none",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:bg-secondary/65",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/75",
        link: "h-auto rounded-sm p-0 text-primary shadow-none underline-offset-4 hover:underline active:text-primary/75",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xl: "h-12 rounded-md px-6 text-[0.875rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
