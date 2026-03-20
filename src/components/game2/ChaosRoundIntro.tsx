"use client";

import { motion } from "framer-motion";
import { useExtendedGame, CHAOS_ROUNDS } from "@/lib/GameContext2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};

export default function ChaosRoundIntro() {
  const { state, dispatch } = useExtendedGame();
  const round = CHAOS_ROUNDS[state.currentRound - 1];
  if (!round) return null;

  const isLast = state.currentRound >= CHAOS_ROUNDS.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center">
      {/* Age badge */}
      <motion.div
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 14px", borderRadius: 20,
          background: "rgba(254,203,3,0.15)", border: "1px solid rgba(254,203,3,0.4)",
          marginBottom: 16,
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "#6B5010" }}>
          AGE {round.age}
        </span>
      </motion.div>

      {/* Kicker */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        {round.kicker}
      </motion.span>

      {/* Title */}
      <motion.h2
        className="mt-3"
        style={{
          fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400,
          fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2, maxWidth: 300,
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
      >
        {round.title}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="mt-3"
        style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: 300, lineHeight: 1.65 }}
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        {round.description}
      </motion.p>

      {/* Income info */}
      <motion.div
        className="mt-5 w-full max-w-xs"
        style={{
          padding: "12px 16px", borderRadius: "var(--radius-sm)",
          background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
      >
        <div className="flex justify-between items-center">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)" }}>
            Monthly income
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
            PPF {round.monthlyIncome.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)" }}>
            Risk profile
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
            padding: "2px 8px", borderRadius: 20,
            background: "rgba(15,74,88,0.07)", color: "#0f4a58",
          }}>
            {round.riskTarget.label}
          </span>
        </div>
      </motion.div>

      {/* Glide path tip */}
      <motion.p
        className="mt-3 max-w-xs"
        style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.6, fontStyle: "italic" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
      >
        {round.riskTarget.rationale}
      </motion.p>

      <motion.div
        className="mx-auto mt-6 mb-7"
        style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={6}
      />

      <motion.button
        className="w-full max-w-xs cursor-pointer"
        style={{
          background: "var(--ink)", color: "var(--bg)",
          border: "none", borderRadius: "var(--radius-sm)",
          padding: "13px 24px", fontSize: 14, fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={7}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "START_ROUND" })}
      >
        {isLast ? "Final Round" : "Let's go"}
      </motion.button>
    </div>
  );
}
