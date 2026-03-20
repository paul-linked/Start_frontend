"use client";

import { useGame } from "@/lib/GameContext";
import { TOTAL_ROUNDS } from "@/lib/gameData";

// ─── Mini Sparkline ───
function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const w = 64;
  const h = 24;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - 2 - ((val - min) / range) * (h - 4);
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = ((data.length - 1) / Math.max(data.length - 1, 1)) * w;
  const lastY = h - 2 - ((data[data.length - 1] - min) / range) * (h - 4);
  const isUp = data[data.length - 1] >= data[0];

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? "#0f4a58" : "var(--coral)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={isUp ? "#0f4a58" : "var(--coral)"} />
    </svg>
  );
}

// ─── Score Ring (mini donut showing average score) ───
function ScoreRing({ score }: { score: number }) {
  const size = 28;
  const r = 10;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex items-center gap-1.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rule)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0f4a58" strokeWidth="3"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      </svg>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "var(--ink-2)",
      }}>
        {score}
      </span>
    </div>
  );
}

export default function Topbar() {
  const { state } = useGame();
  const isPositive = state.portfolioValue >= state.totalDeposited;
  const returnPct =
    ((state.portfolioValue - state.totalDeposited) / state.totalDeposited) * 100;

  // Average score across all 5 metrics
  const avgScore = Math.round(
    Object.values(state.scores).reduce((s, v) => s + v, 0) / Object.values(state.scores).length
  );

  // In free play, show actual round number
  const roundDisplay = state.freePlay
    ? `Year ${state.currentRound}`
    : `${state.currentRound} / ${TOTAL_ROUNDS}`;

  const progress = state.freePlay
    ? 100
    : (state.currentRound / TOTAL_ROUNDS) * 100;

  return (
    <div className="sticky top-0 z-20" style={{
      background: "rgba(245, 240, 232, 0.92)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--rule)",
      padding: "10px 20px",
    }}>
      {/* Main row */}
      <div className="flex items-center justify-between">
        {/* Left: Portfolio value + return */}
        <div>
          <div className="flex items-baseline gap-2">
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)",
            }}>
              PFF {state.portfolioValue.toFixed(2)}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
              color: isPositive ? "#0f4a58" : "var(--coral)",
            }}>
              {isPositive ? "+" : ""}{returnPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right: Sparkline + Score */}
        <div className="flex items-center gap-3">
          <Sparkline data={state.portfolioHistory} />
          <ScoreRing score={avgScore} />
        </div>
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-3 mt-2">
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "var(--ink-4)", whiteSpace: "nowrap",
        }}>
          {roundDisplay}
        </span>

        <div className="flex-1" style={{
          height: 2, background: "var(--rule)", borderRadius: 1, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", background: "var(--ink-3)", borderRadius: 1,
            width: `${progress}%`, transition: "width 0.4s ease",
          }} />
        </div>
      </div>
    </div>
  );
}