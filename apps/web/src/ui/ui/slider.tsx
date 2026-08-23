import React, { useId } from "react";
import { cn } from "@/logic/formatters";

export interface SliderProps {
  className?: string;
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  "aria-label": ariaLabel = "Slider",
}: SliderProps) {
  const id = useId();
  
  const currentVal = Array.isArray(value) && value.length > 0
    ? value[0]
    : Array.isArray(defaultValue) && defaultValue.length > 0
      ? defaultValue[0]
      : min;

  const safeVal = typeof currentVal === "number" && !isNaN(currentVal) ? currentVal : min;
  const clampedVal = Math.min(max, Math.max(min, safeVal));
  const percentage = max > min ? ((clampedVal - min) / (max - min)) * 100 : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onValueChange?.([num]);
  };

  return (
    <div
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center py-3",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Background Track */}
      <div className="relative h-3 w-full grow overflow-hidden rounded-full bg-secondary/80">
        {/* Filled Track Range */}
        <div
          data-slot="slider-range"
          className="h-full bg-primary transition-all duration-75 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb Circle Visual */}
      <div
        data-slot="slider-thumb"
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-6 shrink-0 rounded-full border-2 border-primary bg-card shadow-md ring-ring/50 transition-all select-none hover:scale-115 hover:shadow-lg active:scale-110 active:shadow-xl pointer-events-none"
        style={{ left: `${percentage}%` }}
      />

      {/* Invisible Native Input for Interaction & Accessibility */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clampedVal}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-valuenow={clampedVal}
        aria-valuemin={min}
        aria-valuemax={max}
        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      />
    </div>
  );
}

export { Slider };
