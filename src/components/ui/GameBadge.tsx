"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "danger" | "accent";

interface GameBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-game-border text-game-text-dim",
  primary: "bg-game-primary/15 text-game-primary border border-game-primary/30",
  success: "bg-game-success/15 text-game-success border border-game-success/30",
  danger: "bg-game-danger/15 text-game-danger border border-game-danger/30",
  accent: "bg-game-accent/15 text-game-accent border border-game-accent/30",
};

export function GameBadge({
  children,
  variant = "default",
  pulse = false,
  className,
}: GameBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "font-mono text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
