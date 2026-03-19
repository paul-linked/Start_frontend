"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface GameButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  glow?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-game-primary/10 border-game-primary text-game-primary hover:bg-game-primary/20",
  secondary:
    "bg-game-secondary/10 border-game-secondary text-game-secondary hover:bg-game-secondary/20",
  danger:
    "bg-game-danger/10 border-game-danger text-game-danger hover:bg-game-danger/20",
  ghost:
    "bg-transparent border-game-border text-game-text-dim hover:border-game-text hover:text-game-text",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg tracking-wide",
};

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      glow = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative font-display font-semibold uppercase",
          "rounded-md border backdrop-blur-sm",
          "transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-40",
          variantStyles[variant],
          sizeStyles[size],
          glow && "animate-glow",
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

GameButton.displayName = "GameButton";
