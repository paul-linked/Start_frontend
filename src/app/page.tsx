"use client";

import { motion } from "framer-motion";
import { GameButton } from "@/components/ui/GameButton";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="game-viewport flex flex-col items-center justify-center bg-gradient-game">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-game-primary/5 blur-[120px]" />
      </div>

      {/* Title */}
      <motion.h1
        className="font-display text-5xl font-bold tracking-wider text-game-primary text-glow md:text-7xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {process.env.NEXT_PUBLIC_GAME_TITLE || "GAME TITLE"}
      </motion.h1>

      <motion.p
        className="mb-12 mt-4 font-body text-lg text-game-text-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Subtitle or tagline goes here
      </motion.p>

      {/* Menu Buttons */}
      <motion.div
        className="flex w-64 flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, staggerChildren: 0.1 }}
      >
        <GameButton onClick={() => router.push("/game")} variant="primary" size="lg">
          Play
        </GameButton>
        <GameButton onClick={() => router.push("/lobby")} variant="secondary" size="lg">
          Lobby
        </GameButton>
        <GameButton onClick={() => router.push("/menu")} variant="ghost" size="lg">
          Settings
        </GameButton>
      </motion.div>

      {/* Version */}
      <motion.span
        className="absolute bottom-4 font-mono text-xs text-game-text-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
      >
        v0.1.0
      </motion.span>
    </div>
  );
}
