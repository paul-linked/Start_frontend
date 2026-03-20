"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRound, useGame } from "@/lib/GameContext";
import { ROUND_INSIGHTS, TOTAL_ROUNDS, ROUNDS } from "@/lib/gameData";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

function JourneyChart({
  playerData,
  savingsData,
  perfectData,
}: {
  playerData: number[];
  savingsData: number[];
  perfectData: number[];
}) {
  const allVals = [...playerData, ...savingsData.slice(0, playerData.length), ...perfectData.slice(0, playerData.length)];
  const min = Math.min(...allVals) * 0.9;
  const max = Math.max(...allVals) * 1.05;
  const range = max - min || 1;

  const w = 320;
  const h = 120;
  const pad = 4;

  function toPoints(data: number[]): string {
    return data
      .map((val, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
        const y = pad + (1 - (val - min) / range) * (h - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }

  const playerPoints = toPoints(playerData);
  const savingsPoints = toPoints(savingsData.slice(0, playerData.length));
  const perfectPoints = toPoints(perfectData.slice(0, playerData.length));

  // Player area fill
  const playerAreaPoints = `${pad},${h - pad} ${playerPoints} ${pad + ((playerData.length - 1) / Math.max(playerData.length - 1, 1)) * (w - pad * 2)},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block" }}>
      {/* Player area fill */}
      <polygon points={playerAreaPoints} fill="var(--green)" opacity="0.06" />

      {/* Perfect ghost line */}
      <polyline
        points={perfectPoints}
        fill="none"
        stroke="var(--ink-5)"
        strokeWidth="1"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* Savings ghost line */}
      <polyline
        points={savingsPoints}
        fill="none"
        stroke="var(--ink-5)"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Player line */}
      <polyline
        points={playerPoints}
        fill="none"
        stroke="var(--green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Player dots */}
      {playerData.map((val, i) => {
        const x = pad + (i / Math.max(playerData.length - 1, 1)) * (w - pad * 2);
        const y = pad + (1 - (val - min) / range) * (h - pad * 2);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === playerData.length - 1 ? 3.5 : 2}
            fill={i === playerData.length - 1 ? "var(--green)" : "var(--bg)"}
            stroke="var(--green)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Year labels */}
      {playerData.map((_, i) => {
        const x = pad + (i / Math.max(playerData.length - 1, 1)) * (w - pad * 2);
        return (
          <text
            key={i}
            x={x}
            y={h - pad + 12}
            textAnchor="middle"
            style={{
              fontSize: 8,
              fontFamily: "var(--font-mono)",
              fill: "var(--ink-5)",
            }}
          >
            {i === 0 ? "Start" : `Y${i}`}
          </text>
        );
      })}
    </svg>
  );
}

// Animated counter
function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const isNeg = target < 0;

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplay(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target]);

  return (
    <span>
      {prefix}
      {isNeg ? "−" : "+"}CHF {Math.abs(display).toFixed(2)}
      {suffix}
    </span>
  );
}

export default function PortfolioUpdate() {
  const { state, dispatch } = useGame();
  const delta = state.portfolioDelta;
  const isPositive = delta >= 0;
  const round = getRound(state.currentRound);
  const insight = ROUND_INSIGHTS[state.currentRound] || "";
  const savingsValue = state.savingsHistory[state.currentRound] ?? 0;

  function handleContinue() {
    if (state.currentRound >= TOTAL_ROUNDS) {
      dispatch({ type: "SHOW_END_SCREEN" });
    } else {
      dispatch({ type: "NEXT_ROUND" });
    }
  }

  return (
    <div className="px-5 pb-8 pt-6">
      {/* Kicker */}
      <motion.span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--ink-4)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Quarter Closed
      </motion.span>

      {/* Big delta */}
      <motion.div
        className="mt-3 text-center py-6"
        style={{
          borderTop: "2px solid var(--ink)",
          borderBottom: "1px solid var(--rule)",
        }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 400,
            color: isPositive ? "var(--green)" : "var(--coral)",
            lineHeight: 1,
          }}
        >
          <AnimatedNumber target={delta} />
        </div>
        <p
          className="mt-2"
          style={{ fontSize: 13, color: "var(--ink-3)" }}
        >
          {isPositive
            ? "Your portfolio grew this year"
            : "Markets pulled your portfolio down"}
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-4)",
          }}
        >
          Balance: CHF {state.portfolioValue.toFixed(2)}
        </p>
      </motion.div>

      {/* Journey chart */}
      {state.portfolioHistory.length > 1 && (
        <motion.div
          className="mt-5"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--ink-4)",
              }}
            >
              Your Journey
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1" style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-5)" }}>
                <span style={{ width: 10, height: 2, background: "var(--green)", display: "inline-block", borderRadius: 1 }} /> You
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-5)" }}>
                <span style={{ width: 10, height: 1, background: "var(--ink-5)", display: "inline-block", borderRadius: 1, opacity: 0.6 }} /> Savings
              </span>
            </div>
          </div>
          <div
            style={{
              border: "1px solid var(--rule-light)",
              borderRadius: "var(--radius-sm)",
              padding: "16px 12px 20px",
              background: "var(--surface-dim)",
            }}
          >
            <JourneyChart
              playerData={state.portfolioHistory}
              savingsData={state.savingsHistory}
              perfectData={state.perfectHistory}
            />
          </div>

          {/* Comparison */}
          <div
            className="flex justify-between mt-3 px-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-4)",
            }}
          >
            <span>
              You: <span style={{ color: "var(--green)", fontWeight: 500 }}>CHF {state.portfolioValue.toFixed(0)}</span>
            </span>
            <span>
              Savings only: <span style={{ color: "var(--ink-4)" }}>CHF {savingsValue.toFixed(0)}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Insight */}
      {insight && (
        <motion.p
          className="mt-5"
          style={{
            fontSize: 13,
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--ink-3)",
            lineHeight: 1.65,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          {insight}
        </motion.p>
      )}

      {/* Continue */}
      <motion.button
        className="mt-7 w-full cursor-pointer"
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
        onClick={handleContinue}
      >
        {state.currentRound >= TOTAL_ROUNDS ? "See Your Profile" : "Continue"}
      </motion.button>
    </div>
  );
}