import { create } from "zustand";
import type {
  ScenarioPhase,
  PlayerProgress,
  DecisionRecord,
  NodeScenarios,
} from "@/types";

interface GameStore {
  // Player
  playerId: string | null;
  progress: PlayerProgress;

  // Current node session
  currentNodeId: string | null;
  scenarios: NodeScenarios | null;
  phase: ScenarioPhase;
  cardIndex: number; // for reigns cards

  // Session tracking
  sessionXp: number;
  decisions: DecisionRecord[];

  // Actions
  startNode: (nodeId: string, scenarios: NodeScenarios) => void;
  setPhase: (phase: ScenarioPhase) => void;
  nextCard: () => void;
  recordDecision: (record: DecisionRecord) => void;
  addXp: (xp: number) => void;
  completeNode: (xp: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  playerId: null,
  progress: { completed_nodes: [], current_xp: 0, level: 1 },

  currentNodeId: null,
  scenarios: null,
  phase: "reigns",
  cardIndex: 0,

  sessionXp: 0,
  decisions: [],

  startNode: (nodeId, scenarios) =>
    set({
      currentNodeId: nodeId,
      scenarios,
      phase: "reigns",
      cardIndex: 0,
      sessionXp: 0,
      decisions: [],
    }),

  setPhase: (phase) => set({ phase }),

  nextCard: () => set((s) => ({ cardIndex: s.cardIndex + 1 })),

  recordDecision: (record) =>
    set((s) => ({
      decisions: [...s.decisions, record],
      sessionXp: s.sessionXp + record.xp_earned,
    })),

  addXp: (xp) =>
    set((s) => ({
      sessionXp: s.sessionXp + xp,
    })),

  completeNode: (bonusXp) =>
    set((s) => {
      const totalEarned = s.sessionXp + bonusXp;
      const newTotalXp = s.progress.current_xp + totalEarned;
      const newLevel =
        newTotalXp >= 1500 ? 5 :
        newTotalXp >= 800 ? 4 :
        newTotalXp >= 400 ? 3 :
        newTotalXp >= 150 ? 2 : 1;

      return {
        sessionXp: s.sessionXp + bonusXp,
        progress: {
          ...s.progress,
          current_xp: newTotalXp,
          level: newLevel,
          completed_nodes: s.currentNodeId
            ? [...s.progress.completed_nodes, s.currentNodeId]
            : s.progress.completed_nodes,
        },
      };
    }),

  reset: () =>
    set({
      currentNodeId: null,
      scenarios: null,
      phase: "reigns",
      cardIndex: 0,
      sessionXp: 0,
      decisions: [],
    }),
}));