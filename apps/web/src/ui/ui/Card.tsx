import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/logic/formatters";
import { springSmooth } from "@/logic/motion";

type CardProps = React.ComponentProps<"div"> &
  HTMLMotionProps<"div"> & {
    interactive?: boolean;
  };

function Card({ className, interactive = false, ...props }: CardProps) {
  const isInteractive = interactive || Boolean(props.onClick);

  if (isInteractive) {
    return (
      <motion.div
        data-slot="card"
        className={cn(
          "rounded-2xl border border-border/80 bg-card/95 text-card-foreground shadow-serene-sm cursor-pointer transition-colors hover:border-primary-light/50",
          className,
        )}
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        transition={springSmooth}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border/80 bg-card/95 text-card-foreground shadow-serene-sm transition-all duration-300 hover:border-primary-light/40 hover:shadow-serene-md",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-title-lg text-card-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-5 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
