"use client";

import { motion } from "framer-motion";
import { useExtendedGame } from "@/lib/GameContext2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

const QUALITY_CONFIG = {
  good: { bg: "rgba(92,138,78,0.08)", border: "rgba(92,138,78,0.3)", color: "#3A6B2A", icon: "✓" },
  neutral: { bg: "rgba(212,145,90,0.08)", border: "rgba(212,145,90,0.3)", color: "#8B5A1A", icon: "~" },
  bad: { bg: "rgba(184,112,96,0.08)", border: "rgba(184,112,96,0.3)", color: "#8B3A2A", icon: "✗" },
};

export default function ChaosResultScreen() {
  const { state, dispatch } = useExtendedGame();
  const { activeCard, activeOption, activeOutcome, portfolioValue, cardQueueIndex, cardQueue } = state;

  if (!activeCard || !activeOutcome) return null;

  const cfg = QUALITY_CONFIG[activeOutcome.quality];
  const isLastCard = cardQueueIndex >= cardQueue.length - 1;
  const deltaAbs = Math.abs(activeOutcome.financialDelta);
  const deltaSign = activeOutcome.financialDelta >= 0 ? "+" : "−";
  const showDelta = activeOutcome.financialDelta !== 0;

  return (
    <div className="px-5 pb-8 pt-4">
      {/* Chosen option */}
      {activeOption && (
        <motion.div
          className="mb-4"
          style={{
            padding: "8px 14px", borderRadius: "var(--radius-sm)",
            background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
            fontSize: 12, color: "var(--ink-4)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={-1}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>You chose: </span>
          <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>{activeOption.label}</span>
        </motion.div>
      )}

      {/* Outcome quality banner */}
      <motion.div
        style={{
          padding: "14px 16px", borderRadius: "var(--radius-sm)",
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        <span style={{
          width: 28, height: 28, borderRadius: "50%",
          background: cfg.border, color: cfg.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>
          {cfg.icon}
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: cfg.color, marginBottom: 4 }}>
            {activeOutcome.label}
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65 }}>
            {activeOutcome.feedback}
          </p>
        </div>
      </motion.div>

      {/* Financial impact */}
      {showDelta && (
        <motion.div
          className="mt-4 flex items-center justify-between"
          style={{
            padding: "12px 16px", borderRadius: "var(--radius-sm)",
            background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)" }}>
            Financial impact
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600,
            color: activeOutcome.financialDelta >= 0 ? "#3A6B2A" : "#8B3A2A",
          }}>
            {deltaSign} PPF {deltaAbs.toLocaleString()}
          </span>
        </motion.div>
      )}

      {/* Income change */}
      {activeOutcome.incomeChange && (
        <motion.div
          className="mt-2 flex items-center justify-between"
          style={{
            padding: "10px 16px", borderRadius: "var(--radius-sm)",
            background: "rgba(254,203,3,0.08)", border: "1px solid rgba(254,203,3,0.3)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B5010" }}>
            Monthly income change
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: activeOutcome.incomeChange > 0 ? "#3A6B2A" : "#8B3A2A" }}>
            {activeOutcome.incomeChange > 0 ? "+" : ""}PPF {activeOutcome.incomeChange.toLocaleString()}/mo
          </span>
        </motion.div>
      )}

      {/* Portfolio value */}
      <motion.div
        className="mt-4 text-center"
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 4 }}>
          Portfolio value
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--ink)" }}>
          PPF {portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </motion.div>

      {/* Learning */}
      <motion.div
        className="mt-5"
        style={{
          padding: "14px 16px", borderRadius: "var(--radius-sm)",
          background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 6 }}>
          The lesson
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7 }}>
          {activeOutcome.learning}
        </p>
      </motion.div>

      {/* Next */}
      <motion.button
        className="mt-7 w-full cursor-pointer"
        style={{
          background: "var(--ink)", color: "var(--bg)",
          border: "none", borderRadius: "var(--radius-sm)",
          padding: "14px 24px", fontSize: 14, fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: "NEXT_CARD" })}
      >
        {isLastCard ? "Allocate portfolio" : "Next event"}
      </motion.button>
    </div>
  );
}
