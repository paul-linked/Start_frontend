"use client";

import { useState } from "react";
import { GameProvider, useGame } from "@/lib/GameContext";
import AlpineBackground from "@/components/AlpineBackground";
import Topbar from "@/components/game/Topbar";
import LandingPage from "@/components/LandingPage";
import RoundIntro from "@/components/game/RoundIntro";
import SnapDecision from "@/components/game/SnapDecision";
import BriefingRoom from "@/components/game/BriefingRoom";
import Allocation from "@/components/game/Allocation";
import Feedback from "@/components/game/Feedback";
import PortfolioUpdate from "@/components/game/PortfolioUpdate";
import CashInjection from "@/components/game/CashInjection";
import EndScreen from "@/components/game/EndScreen";
import ExtendedGameShell from "@/components/game2/ExtendedGameShell";

function CurrentScreen() {
  const { state } = useGame();
  switch (state.screen) {
    case "landing": return <LandingPage />;
    case "round_intro": return <RoundIntro />;
    case "snap_decision": return <SnapDecision />;
    case "briefing_room": return <BriefingRoom />;
    case "allocation": return <Allocation />;
    case "feedback": return <Feedback />;
    case "portfolio_update": return <PortfolioUpdate />;
    case "cash_injection": return <CashInjection />;
    case "end_screen": return <EndScreen />;
    default: return <div>Unknown screen: {state.screen}</div>;
  }
}

function GameRouter({ onContinueToExtended }: { onContinueToExtended: (portfolio: number) => void }) {
  const { state } = useGame();
  const isLanding = state.screen === "landing";
  const showTopbar = !isLanding && state.screen !== "end_screen";

  // Register the callback so EndScreen can call it without prop drilling
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__extendedGameContinue = onContinueToExtended;
  }

  return (
    <>
      <AlpineBackground />
      <div style={{
        maxWidth: 440, margin: "0 auto",
        position: "relative", zIndex: 1,
        minHeight: "100dvh",
        padding: isLanding ? 0 : "12px 10px",
      }}>
        {isLanding ? (
          <div style={{ minHeight: "100dvh" }}>
            <LandingPage />
          </div>
        ) : (
          <div style={{
            background: "#FFFBF0", borderRadius: 24,
            boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
            position: "relative", minHeight: "calc(100dvh - 24px)", paddingBottom: 1,
          }}>
            {showTopbar && <Topbar />}
            <CurrentScreen />
          </div>
        )}
      </div>
    </>
  );
}

export default function GameShell() {
  const [extendedMode, setExtendedMode] = useState(false);
  const [initialPortfolio, setInitialPortfolio] = useState(0);

  function handleContinueToExtended(portfolio: number) {
    setInitialPortfolio(portfolio);
    setExtendedMode(true);
  }

  if (extendedMode) {
    return (
      <>
        <AlpineBackground />
        <div style={{
          maxWidth: 440, margin: "0 auto",
          position: "relative", zIndex: 1,
          minHeight: "100dvh", padding: "12px 10px",
        }}>
          <ExtendedGameShell initialPortfolio={initialPortfolio} />
        </div>
      </>
    );
  }

  return (
    <GameProvider>
      <GameRouter onContinueToExtended={handleContinueToExtended} />
    </GameProvider>
  );
}
