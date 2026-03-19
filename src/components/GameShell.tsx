"use client";

import { AnimatePresence, motion } from "framer-motion";
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

const pageVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeOut",
};

function GameRouter() {
  const { state } = useGame();

  const showTopbar = state.screen !== "landing" && state.screen !== "end_screen";

  return (
    <div className="relative min-h-dvh" style={{ maxWidth: 440, margin: "0 auto" }}>
      <AlpineBackground />

      {showTopbar && <Topbar />}

      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen + "-" + state.currentRound + "-" + state.snapCardIndex}
          className="relative z-10"
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
        >
          {state.screen === "landing" && <LandingPage />}
          {state.screen === "round_intro" && <RoundIntro />}
          {state.screen === "snap_decision" && <SnapDecision />}
          {state.screen === "briefing_room" && <BriefingRoom />}
          {state.screen === "allocation" && <Allocation />}
          {state.screen === "feedback" && <Feedback />}
          {state.screen === "portfolio_update" && <PortfolioUpdate />}
          {state.screen === "cash_injection" && <CashInjection />}
          {state.screen === "end_screen" && <EndScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function GameShell() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}