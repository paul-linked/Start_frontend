"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface GameInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GameInput = forwardRef<HTMLInputElement, GameInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-display text-xs uppercase tracking-widest text-game-text-dim"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-md border border-game-border bg-game-bg px-4 py-2.5",
            "font-body text-game-text placeholder:text-game-text-dim/50",
            "outline-none transition-colors duration-200",
            "focus:border-game-primary focus:ring-1 focus:ring-game-primary/30",
            error && "border-game-danger focus:border-game-danger focus:ring-game-danger/30",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-game-danger">{error}</span>
        )}
      </div>
    );
  }
);

GameInput.displayName = "GameInput";
