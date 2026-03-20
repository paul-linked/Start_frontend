"use client";

import { motion } from "framer-motion";
import { useExtendedGame } from "@/lib/GameContext2";
import { calculateRetirementScore } from "@/lib/gameData2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const GRADE_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  S: { color: "#3A6B2A", bg: "rgba(92,138,78,0.1)", border: "rgba(92,138,78,0.35)", label: "Exceptional" },
  A: { color: "#0f4a58", bg: "rgba(15,74,88,0.08)", border: "rgba(15,74,88,0.25)", label: "Great" },
  B: { color: "#6B5010", bg: "rgba(254,203,3,0.1)", border: "rgba(254,203,3,0.4)", label: "Good" },
  C: { color: "#8B5A1A", bg: "rgba(212,145,90,0.1)", border: "rgba(212,145,90,0.3)", label: "Okay" },
  D: { color: "#8B3A2A", bg: "rgba(184,112,96,0.1)", border: "rgba(184,112,96,0.3)", label: "Needs Work" },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>
          {value}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "var(--rule-light)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: `${value}%`,
          background: value >= 70 ? "#5C8A4E" : value >= 40 ? "#D4915A" : "#B87060",
          transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
}

export default function RetirementScoreScreen() {
  const { state } = useExtendedGame();
  const score = state.retirementScore ?? calculateRetirementScore(state);
  const cfg = GRADE_CONFIG[score.overallGrade];

  return (
    <div className="px-5 pb-10 pt-8">
      {/* Kicker */}
      <motion.div className="text-center" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)" }}>
          Retirement Report
        </span>
      </motion.div>

      {/* Grade */}
      <motion.div
        className="flex justify-center mt-5"
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: cfg.bg, border: `2px solid ${cfg.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 400, color: cfg.color, lineHeight: 1 }}>
            {score.overallGrade}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: cfg.color, marginTop: 2 }}>
            {cfg.label}
          </span>
        </div>
      </motion.div>

      {/* Narrative */}
      <motion.p
        className="text-center mt-5 mx-auto"
        style={{ fontSize: 14, fontWeight: 300, color: "var(--ink-3)", maxWidth: 300, lineHeight: 1.7 }}
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
      >
        {score.narrative}
      </motion.p>

      {/* Divider */}
      <motion.div className="mx-auto my-5" style={{ width: 24, height: 1, background: "var(--rule-heavy)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={3} />

      {/* Final portfolio */}
      <motion.div className="text-center" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--ink)" }}>
          PPF {score.finalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-1" style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: score.totalReturnPct >= 0 ? "#0f4a58" : "var(--coral)",
        }}>
          {score.totalReturnPct >= 0 ? "+" : ""}{score.totalReturnPct.toFixed(1)}% total return on PPF {score.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} invested
        </div>
      </motion.div>

      {/* Score breakdown */}
      <motion.div
        className="mt-6"
        style={{
          padding: "16px", borderRadius: "var(--radius-sm)",
          background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 12 }}>
          Score breakdown
        </div>
        <ScoreBar label="Risk Alignment" value={score.riskAlignmentScore} />
        <ScoreBar label="Diversification" value={score.diversificationScore} />
        <ScoreBar label="Decision Quality" value={score.behaviorScore} />
      </motion.div>

      {/* Actions */}
      <motion.div className="mt-8" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
        <button
          className="w-full cursor-pointer active:scale-[0.97] transition-transform"
          style={{
            background: "#fecb03", color: "var(--ink)",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "14px 24px", fontSize: 14, fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
        >
          Open PostFinance Account
        </button>

        <div className="text-center mt-3">
          <button
            className="cursor-pointer"
            style={{
              background: "none", border: "none", color: "var(--ink-3)",
              fontSize: 13, fontFamily: "var(--font-body)",
              textDecoration: "underline", textUnderlineOffset: 3,
              textDecorationColor: "var(--rule)", cursor: "pointer",
            }}
            onClick={() => window.location.reload()}
          >
            Start Over
          </button>
        </div>
      </motion.div>

      <motion.div
        className="text-center mt-8"
        style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-5)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={7}
      >
        Wealth Manager Arena · PostFinance × START Hackathon 2026
      </motion.div>
    </div>
  );
}
