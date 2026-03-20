"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/GameContext";
import { TOTAL_ROUNDS } from "@/lib/gameData";

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const w = 72;
  const h = 20;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke="var(--green-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current point dot */}
      {data.length > 0 && (
        <circle
          cx={(((data.length - 1) / Math.max(data.length - 1, 1)) * w)}
          cy={h - ((data[data.length - 1] - min) / range) * h}
          r="2.5"
          fill="var(--green)"
        />
      )}
    </svg>
  );
}

export default function Topbar() {
  const { state } = useGame();
  const progress = (state.currentRound / TOTAL_ROUNDS) * 100;
  const isPositive = state.portfolioValue >= state.totalDeposited;
  const returnPct =
    ((state.portfolioValue - state.totalDeposited) / state.totalDeposited) *
    100;

  return (
    <div
      className="sticky top-0 z-20"
      style={{
        background: "rgba(253, 250, 242, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--rule)",
        padding: "12px 22px",
      }}
    >
      {/* Wealth row */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={state.portfolioValue}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                color: "var(--ink)",
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              PFF {state.portfolioValue.toFixed(2)}
            </motion.span>
          </AnimatePresence>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              color: isPositive ? "var(--green)" : "var(--coral)",
            }}
          >
            {isPositive ? "+" : ""}
            {returnPct.toFixed(1)}%
          </span>
        </div>

        <MiniSparkline data={state.portfolioHistory} />
      </div>

      {/* Meta row */}
      <div
        className="flex items-center justify-between mt-2 pt-2"
        style={{ borderTop: "1px solid var(--rule-light)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--ink-4)",
          }}
        >
          Round {state.currentRound} of {TOTAL_ROUNDS}
        </span>

        {/* Progress */}
        <div
          className="flex-1 mx-4"
          style={{
            height: 2,
            background: "var(--rule)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "var(--ink-3)",
              borderRadius: 1,
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--ink-4)",
          }}
        >
          {state.xp} xp
        </span>
      </div>
    </div>
  );
}