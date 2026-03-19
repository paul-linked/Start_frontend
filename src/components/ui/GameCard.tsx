"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GameCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-game-surface border border-game-border",
  elevated: "bg-game-surface border border-game-border shadow-game-lg",
  bordered: "bg-transparent border-2 border-game-primary/30",
  glass: "bg-game-surface/60 border border-game-border/50 backdrop-blur-md",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (
    { children, variant = "default", padding = "md", className, ...props },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GameCard.displayName = "GameCard";
