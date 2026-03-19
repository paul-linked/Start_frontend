"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: "primary" | "success" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  label?: string;
  className?: string;
}

const variantColors = {
  primary: "bg-game-primary",
  success: "bg-game-success",
  danger: "bg-game-danger",
  accent: "bg-game-accent",
};

const sizeStyles = { sm: "h-1.5", md: "h-3", lg: "h-5" };

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  animated = true,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  // Auto-switch to danger color when low
  const effectiveVariant = pct < 20 && variant !== "danger" ? "danger" : variant;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1 flex justify-between font-mono text-xs text-game-text-dim">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-full bg-game-border/50",
          sizeStyles[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", variantColors[effectiveVariant])}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        />
      </div>
    </div>
  );
}
