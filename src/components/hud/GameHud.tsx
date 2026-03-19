"use client";

import { useGameStore } from "@/stores/gameStore";
import { GameBadge } from "@/components/ui";
import { ProgressBar } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { motion } from "framer-motion";

interface HudProps {
  timeLeft?: number;
  maxTime?: number;
}

export function GameHud({ timeLeft, maxTime }: HudProps) {
  const { session, localPlayerId } = useGameStore();

  const localPlayer = session?.players.find((p) => p.id === localPlayerId);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-0 z-40 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="pointer-events-auto flex items-center justify-between rounded-lg border border-game-border/50 bg-game-surface/80 px-4 py-2.5 backdrop-blur-md">
        {/* Left — Player */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-game-primary/20 font-display text-sm font-bold text-game-primary">
            {localPlayer?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-game-text">
              {localPlayer?.username || "Player"}
            </p>
            <p className="font-mono text-xs text-game-text-dim">
              Score: {localPlayer?.score ?? 0}
            </p>
          </div>
        </div>

        {/* Center — Timer */}
        {timeLeft != null && maxTime != null && (
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-lg font-bold tabular-nums text-game-text">
              {formatTime(timeLeft)}
            </span>
            <ProgressBar
              value={timeLeft}
              max={maxTime}
              size="sm"
              variant="accent"
              className="w-32"
            />
          </div>
        )}

        {/* Right — Players online */}
        <div className="flex items-center gap-2">
          <GameBadge variant="primary" pulse>
            {session?.players.filter((p) => p.connected).length ?? 0} online
          </GameBadge>
        </div>
      </div>
    </motion.div>
  );
}
