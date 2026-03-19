"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/GameContext";
import { ROUNDS } from "@/lib/gameData";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};

export default function RoundIntro() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center">
      {/* Kicker */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--ink-4)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        {round.kicker}
      </motion.span>

      {/* Title */}
      <motion.h2
        className="mt-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--ink)",
          lineHeight: 1.2,
          maxWidth: 300,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {round.title}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="mt-3"
        style={{
          fontSize: 14,
          color: "var(--ink-3)",
          maxWidth: 300,
          lineHeight: 1.65,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        {round.description}
      </motion.p>

      {/* Decorative rule */}
      <motion.div
        className="mx-auto mt-6 mb-7"
        style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      />

      {/* Continue */}
      <motion.button
        className="w-full max-w-xs cursor-pointer"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "1px solid var(--ink)",
          borderRadius: "var(--radius-sm)",
          padding: "13px 24px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "CONTINUE_TO_QUEST" })}
      >
        Continue
      </motion.button>
    </div>
  );
}