"use client";

import { useChallenge } from "@/lib/ChallengeContext";
import { CHALLENGE_PHASES } from "@/lib/challengeData";

export default function ChallengePhaseIntro() {
  const { state, dispatch } = useChallenge();
  const phase = CHALLENGE_PHASES[state.currentPhase - 1];
  if (!phase) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center">
      {/* Phase counter */}
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-4)",
      }}>
        Phase {phase.phaseNum} of 5
      </span>

      {/* Phase dots */}
      <div className="flex gap-2 mt-3 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            width: i < state.currentPhase ? 20 : 8,
            height: 4,
            borderRadius: 2,
            background: i < state.currentPhase ? "#0f4a58" : "var(--rule)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400,
        fontStyle: "italic", color: "var(--ink)", lineHeight: 1.2,
      }}>
        {phase.title}
      </h2>

      {/* Subtitle */}
      <p className="mt-2" style={{
        fontSize: 14, color: "var(--ink-3)", maxWidth: 300, lineHeight: 1.6,
      }}>
        {phase.subtitle}
      </p>

      {/* Portfolio snapshot */}
      <div className="mt-6 px-4 py-3" style={{
        background: "var(--surface-dim)",
        border: "1px solid var(--rule-light)",
        borderRadius: "var(--radius-sm)",
        minWidth: 200,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)",
          marginBottom: 4,
        }}>
          Current portfolio
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}>
          CHF {state.portfolioValue.toFixed(2)}
        </div>
      </div>

      <div className="mx-auto my-5" style={{ width: 24, height: 1, background: "var(--rule-heavy)" }} />

      {/* Begin button */}
      <button
        className="w-full max-w-xs cursor-pointer active:scale-[0.97] transition-transform"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "14px 24px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}
        onClick={() => dispatch({ type: "BEGIN_PHASE" })}
      >
        Read the news
      </button>
    </div>
  );
}