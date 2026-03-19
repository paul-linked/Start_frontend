"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NodeScenarios, ScenarioPhase } from "@/types";
import { ReignsView } from "./ReignsView";
import { AllocationView } from "./AllocationView";
import { EventView } from "./EventView";
import { ResultsScreen } from "./ResultsScreen";

interface GameArenaProps {
  nodeId: string;
  nodeLabel: string;
  scenarios: NodeScenarios;
  onComplete: () => void;
}

const PHASE_ORDER: ScenarioPhase[] = ["reigns", "allocation", "event", "results"];

const PHASE_LABELS: Record<ScenarioPhase, { label: string; emoji: string }> = {
  reigns: { label: "Decision cards", emoji: "🃏" },
  allocation: { label: "Allocate your money", emoji: "💰" },
  event: { label: "Market event", emoji: "⚡" },
  results: { label: "Summary", emoji: "🏆" },
};

const NODE_LESSONS = [
  "Saving money gives you options — it's the foundation of wealth",
  "A savings account earns interest with zero effort",
  "Emergency funds protect you from unexpected expenses",
];

const NODE_ACHIEVEMENTS = ["First saver!", "Financial discipline"];

export function GameArena({ nodeId, nodeLabel, scenarios, onComplete }: GameArenaProps) {
  const [phase, setPhase] = useState<ScenarioPhase>("reigns");
  const [totalXp, setTotalXp] = useState(0);
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  const advancePhase = useCallback(
    (xpFromPhase: number) => {
      setTotalXp((prev) => prev + xpFromPhase);
      const nextIndex = phaseIndex + 1;
      if (nextIndex < PHASE_ORDER.length) {
        setPhase(PHASE_ORDER[nextIndex]);
      }
    },
    [phaseIndex]
  );

  return (
    <div className="game-viewport relative flex flex-col">
      {/* Mountain background */}
      <div className="mountain-bg">
        <svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 220 L60 140 L120 170 L200 80 L280 130 L360 50 L440 110 L520 30 L600 90 L680 60 L760 120 L800 70 L800 220Z" fill="#3B5A3A" />
          <path d="M0 220 L100 160 L180 190 L260 130 L340 170 L420 100 L500 150 L580 120 L660 160 L740 130 L800 160 L800 220Z" fill="#4A7040" opacity="0.5" />
        </svg>
      </div>

      {/* Top bar */}
      {phase !== "results" && (
        <div className="game-topbar">
          <div className="mx-auto flex max-w-[440px] items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dim">{nodeLabel}</p>
              <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--game-secondary)" }}>
                <span>{PHASE_LABELS[phase].emoji}</span>
                {PHASE_LABELS[phase].label}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-xp">+{totalXp}</span>
              {/* Phase dots */}
              <div className="phase-dots">
                {PHASE_ORDER.slice(0, 3).map((p, i) => (
                  <div
                    key={p}
                    className={`phase-dot ${
                      i < phaseIndex ? "done" : i === phaseIndex ? "active" : "upcoming"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase content */}
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {phase === "reigns" && (
              <ReignsView scenario={scenarios.reigns} onComplete={advancePhase} />
            )}
            {phase === "allocation" && (
              <AllocationView scenario={scenarios.allocation} onComplete={advancePhase} />
            )}
            {phase === "event" && (
              <EventView scenario={scenarios.event} onComplete={advancePhase} />
            )}
            {phase === "results" && (
              <ResultsScreen
                nodeLabel={nodeLabel}
                xpEarned={totalXp + 50}
                lessons={NODE_LESSONS}
                achievements={NODE_ACHIEVEMENTS}
                onContinue={onComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}