import { motion } from "framer-motion";
import { cn } from "@/logic/formatters";
import { tapSpring } from "@/logic/motion";

type ChipVariant = "default" | "tonal";

interface ChipProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: ChipVariant;
  className?: string;
}

export default function Chip({
  label,
  icon,
  selected = false,
  onClick,
  variant = "default",
  className,
}: ChipProps) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-md font-medium transition-colors duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35";

  const styles: Record<ChipVariant, string> = {
    default: selected
      ? "bg-primary text-primary-foreground shadow-sm"
      : "bg-card text-muted-foreground hover:bg-surface-container-low border border-border",
    tonal: selected
      ? "bg-primary-soft text-primary-container border border-primary-light/40"
      : "bg-surface-container-lowest text-muted-foreground hover:bg-primary-surface border border-surface-container-high",
  };

  return (
    <motion.button
      type="button"
      className={cn(base, styles[variant], className)}
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={tapSpring}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {label}
    </motion.button>
  );
}
