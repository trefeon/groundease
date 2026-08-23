/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/logic/formatters";
import { tapSpring } from "@/logic/motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-serene-sm hover:bg-primary/90 hover:shadow-serene-md",
        filled:
          "bg-primary text-primary-foreground shadow-serene-sm hover:bg-primary/90 hover:shadow-serene-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tonal:
          "bg-primary-surface text-primary-container border border-primary-light/30 hover:bg-primary-soft/80",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted/80 hover:text-foreground hover:border-primary-light/40",
        outlined:
          "border border-border bg-card text-foreground hover:bg-muted/80 hover:text-foreground hover:border-primary-light/40",
        ghost: "text-foreground hover:bg-muted/80 hover:text-foreground",
        text: "text-primary hover:bg-primary-surface",
        destructive:
          "bg-destructive text-destructive-foreground shadow-serene-sm hover:bg-destructive/90 hover:shadow-serene-md",
        earth:
          "bg-destructive text-destructive-foreground shadow-serene-sm hover:bg-destructive/90 hover:shadow-serene-md",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-10 min-w-10 px-3.5 text-xs font-semibold",
        md: "min-h-12 min-w-12 px-4 text-sm font-semibold",
        lg: "min-h-12 min-w-12 px-6 text-base font-semibold",
        icon: "size-12 min-h-12 min-w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    pulse?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pulse = false, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          pulse && "animate-pulse-soft",
          className,
        )}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.96 }}
        transition={tapSpring}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
