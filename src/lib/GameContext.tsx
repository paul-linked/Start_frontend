"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  GameState,
  GameScreen,
  Scores,
  PortfolioAllocation,
  InvestorProfile,
  ProfileQuadrant,
  Round,
  SnapDecisionQuest,
  BriefingRoomQuest,
  AllocationQuest,
} from "../types";
import {
  ROUNDS,
  STARTING_CASH,
  TOTAL_ROUNDS,
  SAVINGS_GHOST,
  PERFECT_GHOST,
  PROFILE_LABELS,
} from "./gameData";
import { generateFreePlayRound } from "./freePlay";

// ─── Round lookup: demo data for 1-6, generated for 7+ ───
function getRound(roundNum: number): Round | undefined {
  if (roundNum <= ROUNDS.length) return ROUNDS[roundNum - 1];
  return generateFreePlayRound(roundNum);
}

// ─── Initial state ───
const initialState: GameState = {
  screen: "landing",
  currentRound: 0,
  portfolioValue: STARTING_CASH,
  portfolioHistory: [STARTING_CASH],
  savingsHistory: SAVINGS_GHOST,
  perfectHistory: PERFECT_GHOST,
  totalDeposited: STARTING_CASH,
  allocation: {},
  scores: {
    diversification: 50,
    riskAlignment: 50,
    patience: 50,
    learning: 50,
    wealth: 50,
  },
  xp: 0,
  currentFeedback: null,
  portfolioDelta: 0,
  snapCardIndex: 0,
  decisions: [],
  freePlay: false,
};

// ─── Actions ───
type Action =
  | { type: "START_GAME" }
  | { type: "CONTINUE_TO_QUEST" }
  | { type: "SNAP_DECISION"; choiceId: string; quality: "good" | "neutral" | "bad"; feedback: string; learning: string; scoreImpact: Partial<Scores> }
  | { type: "NEXT_SNAP_CARD" }
  | { type: "BRIEFING_DECISION"; choice: "buy" | "hold" | "sell" }
  | { type: "ALLOCATION_CONFIRM"; allocation: PortfolioAllocation }
  | { type: "CONTINUE_TO_PORTFOLIO" }
  | { type: "CONTINUE_TO_INJECTION" }
  | { type: "CONTINUE_AFTER_INJECTION" }
  | { type: "NEXT_ROUND" }
  | { type: "SHOW_END_SCREEN" }
  | { type: "CONTINUE_FREE_PLAY" };

// ─── Helpers ───
function clampScore(val: number): number {
  return Math.max(0, Math.min(100, val));
}

function applyScoreImpact(
  scores: Scores,
  impact: Partial<Scores>,
  multiplier = 1
): Scores {
  const result = { ...scores };
  for (const [key, val] of Object.entries(impact)) {
    if (val) {
      result[key as keyof Scores] = clampScore(
        result[key as keyof Scores] + (val as number) * multiplier
      );
    }
  }
  return result;
}

function calculatePortfolioReturn(
  allocation: PortfolioAllocation,
  marketReturns: Record<string, number>
): number {
  let weightedReturn = 0;
  for (const [productId, pct] of Object.entries(allocation)) {
    const returnPct = marketReturns[productId] ?? 0;
    weightedReturn += (pct / 100) * (returnPct / 100);
  }
  return weightedReturn;
}

function xpForQuality(q: "good" | "neutral" | "bad"): number {
  return q === "good" ? 50 : q === "neutral" ? 25 : 10;
}

function extendSavingsHistory(current: number[], totalDeposited: number, newDeposited: number): number[] {
  const last = current[current.length - 1] ?? totalDeposited;
  const newVal = Math.round((last + (newDeposited - totalDeposited)) * 1.005 * 100) / 100;
  return [...current, newVal];
}

// ─── Reducer ───
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        screen: "round_intro",
        currentRound: 1,
      };

    case "CONTINUE_TO_QUEST": {
      const round = getRound(state.currentRound);
      if (!round) return state;
      const screenMap: Record<string, GameScreen> = {
        snap_decision: "snap_decision",
        briefing_room: "briefing_room",
        allocation: "allocation",
      };
      return {
        ...state,
        screen: screenMap[round.quest.type],
        snapCardIndex: 0,
      };
    }

    case "SNAP_DECISION": {
      const newScores = applyScoreImpact(state.scores, action.scoreImpact);
      const newXp = state.xp + xpForQuality(action.quality);
      return {
        ...state,
        scores: newScores,
        xp: newXp,
        currentFeedback: {
          quality: action.quality,
          feedback: action.feedback,
          learning: action.learning,
          scoreDeltas: action.scoreImpact,
        },
        screen: "feedback",
        decisions: [
          ...state.decisions,
          {
            round: state.currentRound,
            choice: action.choiceId,
            quality: action.quality,
          },
        ],
      };
    }

    case "NEXT_SNAP_CARD": {
      const round = getRound(state.currentRound);
      if (!round || round.quest.type !== "snap_decision") return state;
      const quest = round.quest as SnapDecisionQuest;
      const nextIdx = state.snapCardIndex + 1;
      if (nextIdx >= quest.cards.length) {
        const returnRate = calculatePortfolioReturn(
          state.allocation,
          round.marketReturns
        );
        const delta =
          Object.keys(state.allocation).length === 0
            ? state.portfolioValue * 0.02
            : state.portfolioValue * returnRate;
        const newValue =
          Math.round((state.portfolioValue + delta) * 100) / 100;
        return {
          ...state,
          screen: "portfolio_update",
          portfolioDelta: Math.round(delta * 100) / 100,
          portfolioValue: newValue,
          portfolioHistory: [...state.portfolioHistory, newValue],
        };
      }
      return {
        ...state,
        screen: "snap_decision",
        snapCardIndex: nextIdx,
      };
    }

    case "BRIEFING_DECISION": {
      const round = getRound(state.currentRound);
      if (!round || round.quest.type !== "briefing_room") return state;
      const quest = round.quest as BriefingRoomQuest;
      const outcome = quest.outcomes[action.choice];
      const newScores = applyScoreImpact(state.scores, outcome.scoreImpact);
      const newXp = state.xp + xpForQuality(outcome.quality);
      return {
        ...state,
        scores: newScores,
        xp: newXp,
        currentFeedback: {
          quality: outcome.quality,
          feedback: outcome.feedback,
          learning: outcome.learning,
          scoreDeltas: outcome.scoreImpact,
        },
        screen: "feedback",
        decisions: [
          ...state.decisions,
          {
            round: state.currentRound,
            choice: action.choice,
            quality: outcome.quality,
          },
        ],
      };
    }

    case "ALLOCATION_CONFIRM": {
      const round = getRound(state.currentRound);
      if (!round) return state;

      const values = Object.values(action.allocation).filter((v) => v > 0);
      const n = values.length;
      const evenness =
        n > 1
          ? 1 -
            values.reduce((acc, v) => acc + Math.pow(v / 100 - 1 / n, 2), 0) *
              n
          : 0;
      const divBonus = Math.round(n * 3 + evenness * 5);

      const returnRate = calculatePortfolioReturn(
        action.allocation,
        round.marketReturns
      );
      const delta = state.portfolioValue * returnRate;
      const newValue =
        Math.round((state.portfolioValue + delta) * 100) / 100;

      const newScores = applyScoreImpact(state.scores, {
        diversification: divBonus,
        wealth: delta > 0 ? 2 : -1,
        riskAlignment: n >= 3 ? 2 : -1,
      });

      return {
        ...state,
        allocation: action.allocation,
        scores: newScores,
        xp: state.xp + 40,
        portfolioDelta: Math.round(delta * 100) / 100,
        portfolioValue: newValue,
        portfolioHistory: [...state.portfolioHistory, newValue],
        screen: "portfolio_update",
        decisions: [
          ...state.decisions,
          {
            round: state.currentRound,
            choice: `alloc:${JSON.stringify(action.allocation)}`,
            quality: n >= 3 ? "good" : n >= 2 ? "neutral" : "bad",
          },
        ],
      };
    }

    case "CONTINUE_TO_PORTFOLIO": {
      const round = getRound(state.currentRound);
      if (!round) return state;
      const returnRate = calculatePortfolioReturn(
        state.allocation,
        round.marketReturns
      );
      const delta =
        Object.keys(state.allocation).length === 0
          ? state.portfolioValue * 0.02
          : state.portfolioValue * returnRate;
      const newValue =
        Math.round((state.portfolioValue + delta) * 100) / 100;
      return {
        ...state,
        screen: "portfolio_update",
        portfolioDelta: Math.round(delta * 100) / 100,
        portfolioValue: newValue,
        portfolioHistory: [...state.portfolioHistory, newValue],
      };
    }

    case "CONTINUE_TO_INJECTION": {
      return { ...state, screen: "cash_injection" };
    }

    case "CONTINUE_AFTER_INJECTION": {
      const round = getRound(state.currentRound);
      if (!round?.injection) return state;
      const newValue =
        Math.round(
          (state.portfolioValue + round.injection.amount) * 100
        ) / 100;
      const newDeposited = state.totalDeposited + round.injection.amount;
      return {
        ...state,
        portfolioValue: newValue,
        totalDeposited: newDeposited,
        portfolioHistory: [
          ...state.portfolioHistory.slice(0, -1),
          newValue,
        ],
        savingsHistory: extendSavingsHistory(state.savingsHistory, state.totalDeposited, newDeposited),
        screen: "round_intro",
        currentRound: state.currentRound + 1,
      };
    }

    case "NEXT_ROUND": {
      const round = getRound(state.currentRound);
      if (round?.injection) {
        return { ...state, screen: "cash_injection" };
      }
      if (!state.freePlay && state.currentRound >= TOTAL_ROUNDS) {
        return { ...state, screen: "end_screen" };
      }
      return {
        ...state,
        screen: "round_intro",
        currentRound: state.currentRound + 1,
      };
    }

    case "SHOW_END_SCREEN":
      return { ...state, screen: "end_screen" };

    case "CONTINUE_FREE_PLAY":
      return {
        ...state,
        freePlay: true,
        screen: "round_intro",
        currentRound: state.currentRound + 1,
      };

    default:
      return state;
  }
}

// ─── Profile calculation ───
export function calculateProfile(state: GameState): InvestorProfile {
  const { scores, portfolioValue, totalDeposited } = state;

  const rational = ((scores.patience + scores.learning) / 2 - 50) / 50;
  const aggressive =
    ((100 - scores.riskAlignment + (100 - scores.diversification)) / 2 - 50) /
    50;

  let quadrant: ProfileQuadrant;
  if (rational >= 0 && aggressive >= 0) quadrant = "calculated_risk";
  else if (rational >= 0 && aggressive < 0) quadrant = "steady_hand";
  else if (rational < 0 && aggressive >= 0) quadrant = "thrill_seeker";
  else quadrant = "cautious_observer";

  const totalReturn = portfolioValue - totalDeposited;
  const totalReturnPct = (totalReturn / totalDeposited) * 100;

  return {
    quadrant,
    title: PROFILE_LABELS[quadrant].title,
    subtitle: PROFILE_LABELS[quadrant].subtitle,
    rationalScore: Math.max(-1, Math.min(1, rational)),
    aggressiveScore: Math.max(-1, Math.min(1, aggressive)),
    totalReturn: Math.round(totalReturn * 100) / 100,
    totalReturnPct: Math.round(totalReturnPct * 10) / 10,
  };
}

// ─── Exported round getter (for use in components) ───
export { getRound };

// ─── Context ───
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}