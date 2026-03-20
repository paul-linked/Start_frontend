"use client";

import { useChallenge } from "@/lib/ChallengeContext";

const QUALITY_CONFIG: Record<string, { bg: string; border: string; icon: string; color: string; label: string }> = {
  good: { bg: "var(--green-wash)", border: "var(--green-soft)", icon: "✓", color: "var(--green)", label: "Strong move" },
  neutral: { bg: "var(--gold-wash)", border: "#F0E4A8", icon: "—", color: "var(--gold)", label: "Cautious" },
  bad: { bg: "var(--coral-wash)", border: "var(--coral-soft)", icon: "✗", color: "var(--coral)", label: "Panic detected" },
};

export default function ChallengePhaseResult() {
  const { state, dispatch } = useChallenge();
  const isPositive = state.lastDelta >= 0;
  const config = QUALITY_CONFIG[state.lastQuality] || QUALITY_CONFIG.neutral;

  return (
    <div className="px-5 pb-8 pt-6">
      {/* Phase indicator */}
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-4)",
      }}>
        Phase {state.currentPhase} result
      </span>

      {/* Delta */}
      <div className="mt-3 text-center py-5" style={{
        borderTop: "2px solid var(--ink)", borderBottom: "1px solid var(--rule)",
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400,
          color: isPositive ? "#0f4a58" : "var(--coral)",
        }}>
          {isPositive ? "+" : "−"}CHF {Math.abs(state.lastDelta).toFixed(2)}
        </div>
        <p className="mt-1.5" style={{ fontSize: 13, color: "var(--ink-3)" }}>
          {isPositive ? "Your portfolio grew" : "Markets pulled you down"}
        </p>
        <p className="mt-1" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>
          Balance: CHF {state.portfolioValue.toFixed(2)}
        </p>
      </div>

      {/* Verdict */}
      <div className="mt-4 flex items-start gap-3" style={{
        background: config.bg, border: `1px solid ${config.border}`,
        borderRadius: "var(--radius)", padding: "14px 16px",
      }}>
        <span className="shrink-0 flex items-center justify-center" style={{
          width: 24, height: 24, borderRadius: "50%",
          background: config.bg, color: config.color,
          fontSize: 13, fontWeight: 600,
        }}>
          {config.icon}
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: config.color, marginBottom: 4 }}>
            {config.label}
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {state.lastFeedback}
          </p>
        </div>
      </div>

      {/* Score snapshot */}
      <div className="mt-5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)" }}>
          Current scores
        </span>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(state.scores).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2.5">
              <span style={{
                width: 80, fontFamily: "var(--font-mono)", fontSize: 9,
                textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-4)",
              }}>
                {key}
              </span>
              <div className="flex-1" style={{ height: 3, background: "var(--rule-light)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${val}%`,
                  background: val >= 60 ? "#0f4a58" : val >= 40 ? "var(--gold)" : "var(--coral)",
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{
                width: 24, textAlign: "right", fontFamily: "var(--font-mono)",
                fontSize: 10, color: "var(--ink-3)",
              }}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio journey mini */}
      {state.portfolioHistory.length > 1 && (
        <div className="mt-5 px-2 py-3" style={{
          background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
          borderRadius: "var(--radius-sm)",
        }}>
          <svg width="100%" height="40" viewBox="0 0 300 40">
            {(() => {
              const data = state.portfolioHistory;
              const min = Math.min(...data) * 0.95;
              const max = Math.max(...data) * 1.05;
              const range = max - min || 1;
              const points = data.map((v, i) => {
                const x = (i / Math.max(data.length - 1, 1)) * 300;
                const y = 36 - ((v - min) / range) * 32;
                return `${x},${y}`;
              }).join(" ");
              return (
                <>
                  <polyline points={points} fill="none" stroke="#0f4a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {data.map((v, i) => {
                    const x = (i / Math.max(data.length - 1, 1)) * 300;
                    const y = 36 - ((v - min) / range) * 32;
                    return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3.5 : 2}
                      fill={i === data.length - 1 ? "#0f4a58" : "#FFF9E5"} stroke="#0f4a58" strokeWidth={1.5} />;
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      {/* Continue */}
      <button
        className="mt-6 w-full cursor-pointer active:scale-[0.97] transition-transform"
        style={{
          background: "var(--ink)", color: "var(--bg)", border: "none",
          borderRadius: "var(--radius-sm)", padding: "14px 24px",
          fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)",
        }}
        onClick={() => dispatch({ type: "NEXT_PHASE" })}
      >
        {state.currentPhase >= 5 ? "See Final Results" : `Continue to Phase ${state.currentPhase + 1}`}
      </button>
    </div>
  );
}