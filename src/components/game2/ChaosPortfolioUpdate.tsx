"use client";

import { motion } from "framer-motion";
import { useExtendedGame, CHAOS_ROUNDS } from "@/lib/GameContext2";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

export default function ChaosPortfolioUpdate() {
  const { state, dispatch } = useExtendedGame();
  const round = CHAOS_ROUNDS[state.currentRound - 1];
  const isLastRound = state.currentRound >= CHAOS_ROUNDS.length;
  const nextRound = CHAOS_ROUNDS[state.currentRound];
  const yearsInRound = nextRound ? nextRound.age - (round?.age ?? 0) : 2;

  const history = state.portfolioHistory;
  const current = history[history.length - 1] ?? 0;
  const previous = history[history.length - 2] ?? 0;
  const delta = current - previous;
  const deltaPct = previous > 0 ? (delta / previous) * 100 : 0;

  // Mini sparkline
  const sparkData = history.slice(-10);
  const sparkMin = Math.min(...sparkData) * 0.95;
  const sparkMax = Math.max(...sparkData) * 1.05;
  const sparkRange = sparkMax - sparkMin || 1;
  const W = 280, H = 60, PAD = 4;

  function toPoint(val: number, i: number): string {
    const x = PAD + (i / Math.max(sparkData.length - 1, 1)) * (W - PAD * 2);
    const y = PAD + (1 - (val - sparkMin) / sparkRange) * (H - PAD * 2);
    return `${x},${y}`;
  }

  const points = sparkData.map((v, i) => toPoint(v, i)).join(" ");

  return (
    <div className="px-5 pb-8 pt-4 flex flex-col items-center text-center">
      <motion.span
        style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
      >
        Age {state.age} · {yearsInRound}-Year Portfolio Update
      </motion.span>

      <motion.div
        className="mt-5"
        style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--ink)" }}
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
      >
        CHF {current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </motion.div>

      <motion.div
        className="mt-1"
        style={{
          fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500,
          color: delta >= 0 ? "#3A6B2A" : "#8B3A2A",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
      >
        {delta >= 0 ? "+" : ""}CHF {delta.toFixed(2)} ({deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}% over {yearsInRound} years)
      </motion.div>

      {/* Sparkline */}
      <motion.div
        className="mt-6 w-full"
        style={{
          border: "1px solid var(--rule-light)", borderRadius: "var(--radius-sm)",
          padding: "14px 12px 8px", background: "var(--surface-dim)",
        }}
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 8, textAlign: "left" }}>
          Portfolio history
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
          <polygon
            points={`${PAD},${H - PAD} ${points} ${PAD + ((sparkData.length - 1) / Math.max(sparkData.length - 1, 1)) * (W - PAD * 2)},${H - PAD}`}
            fill="#0f4a58" opacity="0.05"
          />
          <polyline points={points} fill="none" stroke="#0f4a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {sparkData.map((v, i) => {
            const [x, y] = toPoint(v, i).split(",").map(Number);
            return <circle key={i} cx={x} cy={y} r={i === sparkData.length - 1 ? 3.5 : 2}
              fill={i === sparkData.length - 1 ? "#0f4a58" : "#FFF9E5"} stroke="#0f4a58" strokeWidth={1.5} />;
          })}
        </svg>
      </motion.div>

      {/* Market returns summary */}
      {round && (
        <motion.div
          className="mt-4 w-full"
          style={{
            padding: "12px 16px", borderRadius: "var(--radius-sm)",
            background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
          }}
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", marginBottom: 8, textAlign: "left" }}>
            Market returns this round
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {Object.entries(round.marketReturns).map(([id, ret]) => (
              <div key={id} className="flex items-center gap-1.5">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-4)", textTransform: "uppercase" }}>{id}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
                  color: ret >= 0 ? "#3A6B2A" : "#8B3A2A",
                }}>
                  {ret >= 0 ? "+" : ""}{(ret * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
        onClick={() => isLastRound
          ? dispatch({ type: "SHOW_RETIREMENT_SCORE" })
          : dispatch({ type: "NEXT_ROUND" })
        }
      >
        {isLastRound ? "See retirement score" : "Next chapter"}
      </motion.button>
    </div>
  );
}
