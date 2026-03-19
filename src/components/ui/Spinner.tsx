"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-game-primary/20 border-t-game-primary",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullScreenLoader({ text }: { text?: string }) {
  return (
    <div className="game-viewport flex flex-col items-center justify-center gap-4 bg-gradient-game">
      <Spinner size="lg" />
      {text && (
        <p className="font-display text-sm uppercase tracking-widest text-game-text-dim">
          {text}
        </p>
      )}
    </div>
  );
}
