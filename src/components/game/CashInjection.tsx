"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/GameContext";
import { ROUNDS } from "@/lib/gameData";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

export default function CashInjection() {
  const { state, dispatch } = useGame();
  const round = ROUNDS[state.currentRound - 1];
  if (!round?.injection) return null;

  const { amount, reason } = round.injection;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65dvh] px-6 text-center">
      {/* Kicker */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--ink-4)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Incoming Funds
      </motion.span>

      {/* Amount */}
      <motion.div
        className="mt-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          color: "var(--green)",
          fontWeight: 400,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        +CHF {amount}
      </motion.div>

      {/* Reason */}
      <motion.p
        className="mt-3"
        style={{
          fontSize: 15,
          color: "var(--ink-3)",
          maxWidth: 280,
          lineHeight: 1.6,
          fontStyle: "italic",
          fontWeight: 300,
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        {reason}
      </motion.p>

      {/* New total */}
      <motion.p
        className="mt-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-4)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        New portfolio: CHF {(state.portfolioValue + amount).toFixed(2)}
      </motion.p>

      {/* Decorative rule */}
      <motion.div
        className="mx-auto mt-6 mb-7"
        style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
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
        custom={5}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "CONTINUE_AFTER_INJECTION" })}
      >
        Continue
      </motion.button>
    </div>
  );
}