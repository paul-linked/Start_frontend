"use client";

import { ChallengeProvider, useChallenge } from "@/lib/ChallengeContext";
import AlpineBackground from "@/components/AlpineBackground";
import ChallengeJoin from "@/components/challenge/ChallengeJoin";
import ChallengePhaseIntro from "@/components/challenge/ChallengePhaseIntro";
import ChallengePhasePlay from "@/components/challenge/ChallengePhasePlay";
import ChallengePhaseResult from "@/components/challenge/ChallengePhaseResult";
import ChallengeFinal from "@/components/challenge/ChallengeFinal";

function CurrentScreen() {
  const { state } = useChallenge();
  switch (state.screen) {
    case "join": return <ChallengeJoin />;
    case "phase_intro": return <ChallengePhaseIntro />;
    case "phase_play": return <ChallengePhasePlay />;
    case "phase_result": return <ChallengePhaseResult />;
    case "final": return <ChallengeFinal />;
    default: return null;
  }
}

function ChallengeRouter() {
  const { state } = useChallenge();
  const isJoin = state.screen === "join";

  return (
    <>
      <AlpineBackground />
      <div style={{
        maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 1,
        minHeight: "100dvh", padding: isJoin ? 0 : "12px 10px",
      }}>
        {isJoin ? (
          <div style={{ minHeight: "100dvh" }}>
            <CurrentScreen />
          </div>
        ) : (
          <div style={{
            background: "#FFFBF0", borderRadius: 24,
            boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
            position: "relative", paddingBottom: 1,
          }}>
            {/* Phase topbar */}
            {state.screen === "phase_play" && (
              <div style={{
                background: "rgba(255,251,240,0.92)", backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--rule)",
                padding: "10px 22px",
              }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)" }}>
                    PPF {state.portfolioValue.toFixed(2)}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)",
                  }}>Phase {state.currentPhase} / 5</span>
                </div>
                <div className="mt-1.5" style={{ height: 2, background: "var(--rule)", borderRadius: 1 }}>
                  <div style={{
                    height: "100%", width: `${(state.currentPhase / 5) * 100}%`,
                    background: "var(--ink-3)", borderRadius: 1, transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            )}
            <CurrentScreen />
          </div>
        )}
      </div>
    </>
  );
}

export default function ChallengeShell() {
  return (
    <ChallengeProvider>
      <ChallengeRouter />
    </ChallengeProvider>
  );
}