"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWebSocket, useGameLoop } from "@/hooks";
import { useGameStore } from "@/stores/gameStore";
import { GameHud } from "@/components/hud/GameHud";
import { FullScreenLoader } from "@/components/ui";
import { ToastContainer, toast } from "@/components/ui";

function GameContent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");
  const { session, state } = useGameStore();
  const { sendAction, connected } = useWebSocket(gameId);

  // Example game loop — runs every frame when playing
  useGameLoop(
    (delta) => {
      // Your game tick logic here
      // delta is time in seconds since last frame
    },
    state === "playing"
  );

  // Notify on connection
  useEffect(() => {
    if (connected) {
      toast.success("Connected to game server");
    }
  }, [connected]);

  if (!gameId) {
    return <FullScreenLoader text="No game ID provided" />;
  }

  if (!session) {
    return <FullScreenLoader text="Connecting..." />;
  }

  return (
    <div className="game-viewport bg-gradient-game">
      <ToastContainer />
      <GameHud timeLeft={60} maxTime={120} />

      {/* ─── Game Canvas / Board Area ─── */}
      <div className="flex h-full items-center justify-center pt-16">
        <div className="text-center">
          <p className="font-display text-2xl text-game-primary">
            Game Area
          </p>
          <p className="mt-2 font-body text-game-text-dim">
            State: <span className="font-mono text-game-accent">{state}</span>
          </p>
          <p className="mt-1 font-body text-sm text-game-text-dim">
            Players: {session.players.length}/{session.settings.max_players}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<FullScreenLoader text="Loading..." />}>
      <GameContent />
    </Suspense>
  );
}