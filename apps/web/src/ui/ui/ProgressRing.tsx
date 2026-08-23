import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface ProgressRingProps {
  progress?: number; // 0 to 100
  value?: number; // alias for progress
  size?: number; // width & height in px (default 120)
  strokeWidth?: number; // stroke width in px (default 8)
  color?: string; // CSS color or hex (default "var(--primary)")
  trackColor?: string; // background track color
  className?: string;
  children?: ReactNode;
  showValue?: boolean;
}

export function ProgressRing({
  progress,
  value,
  size = 120,
  strokeWidth = 8,
  color = "var(--primary)",
  trackColor,
  className = "",
  children,
  showValue = false,
}: ProgressRingProps) {
  const rawProgress = progress ?? value ?? 0;
  const clampedProgress = Math.min(100, Math.max(0, rawProgress));
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor ?? "currentColor"}
          strokeWidth={strokeWidth}
          fill="transparent"
          className={trackColor ? "" : "text-muted/20"}
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Center content or percentage text */}
      {(children || showValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children ?? (
            <span className="font-display text-lg font-bold text-foreground">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressRing;
