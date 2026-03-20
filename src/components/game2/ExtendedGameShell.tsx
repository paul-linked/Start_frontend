"use client";

import { ExtendedGameProvider, useExtendedGame } from "@/lib/GameContext2";
import ChaosRoundIntro from "./ChaosRoundIntro";
import ChaosCardScreen from "./ChaosCardScreen";
import ChaosResultScreen from "./ChaosResultScreen";
import ChaosAllocation from "./ChaosAllocation";
import ChaosPortfolioUpdate from "./ChaosPortfolioUpdate";
import RetirementScoreScreen from "./RetirementScoreScreen";

function ExtendedTopbar() {
  const { state } = useExtendedGame();
  const { portfolioValue, age, currentRound, scores } = state;

  return (
    <div style={{
      padding: "10px 16px",
      borderBottom: "1px solid var(--rule-light)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-4)" }}>
          Age {age} · Round {currentRound}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink)", marginTop: 1 }}>
          CHF {portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {(["riskAlignment", "diversification", "patience"] as const).map((key) => (
          <div key={key} style={{ textAlign: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--surface-dim)", border: "1px solid var(--rule-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "var(--ink)",
            }}>
              {Math.round(scores[key])}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-5)", marginTop: 2 }}>
              {key === "riskAlignment" ? "Risk" : key === "diversification" ? "Div" : "Pat"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtendedCurrentScreen() {
  const { state } = useExtendedGame();
  switch (state.screen) {
    case "round_intro": return <ChaosRoundIntro />;
    case "chaos_card": return <ChaosCardScreen />;
    case "chaos_result": return <ChaosResultScreen />;
    case "allocation": return <ChaosAllocation />;
    case "portfolio_update": return <ChaosPortfolioUpdate />;
    case "retirement_score": return <RetirementScoreScreen />;
    default: return null;
  }
}

function ExtendedRouter() {
  const { state } = useExtendedGame();
  const showTopbar = state.screen !== "retirement_score";

  return (
    <div style={{
      background: "#FFFBF0",
      borderRadius: 24,
      boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      position: "relative",
      minHeight: "calc(100dvh - 24px)",
      paddingBottom: 1,
    }}>
      {showTopbar && <ExtendedTopbar />}
      <ExtendedCurrentScreen />
    </div>
  );
}

export default function ExtendedGameShell({ initialPortfolio }: { initialPortfolio?: number }) {
  return (
    <ExtendedGameProvider initialPortfolio={initialPortfolio}>
      <ExtendedRouter />
    </ExtendedGameProvider>
  );
}
