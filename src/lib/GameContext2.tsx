"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Scores } from "../types";
import type { ExtendedGameState, ResolvedChaosEvent, ChaosCard, RandomOutcome, PlayerOption } from "../types/index2";
import {
  CHAOS_ROUNDS,
  EXTENDED_ASSET_TIPS,
  calculateRetirementScore,
  resolveOutcome,
  drawCards,
  getRiskTarget,
  STARTING_MONTHLY_INCOME,
} from "./gameData2";

// ─── Screens ───
export type ExtendedScreen =
  | "round_intro"
  | "chaos_card"
  | "chaos_result"
  | "allocation"
  | "portfolio_update"
  | "retirement_score";

// ─── State ───
export interface ExtendedState extends ExtendedGameState {
  screen: ExtendedScreen;
  currentRound: number;
  // Transient per-card state
  activeCard: ChaosCard | null;
  activeOption: PlayerOption | null;
  activeOutcome: RandomOutcome | null;
  cardQueue: ChaosCard[];
  cardQueueIndex: number;
  // Allocation (reuse same shape as game 1)
  allocation: Record<string, number>;
}

const INITIAL_SCORES: Scores = {
  diversification: 50,
  riskAlignment: 50,
  patience: 50,
  learning: 50,
  wealth: 50,
};

const STARTING_PORTFOLIO = 0; // player carries over nothing — starts fresh in extended mode

function buildInitialState(): ExtendedState {
  return {
    screen: "round_intro",
    currentRound: 1,
    age: CHAOS_ROUNDS[0].age,
    portfolioValue: STARTING_PORTFOLIO,
    portfolioHistory: [STARTING_PORTFOLIO],
    monthlyIncome: STARTING_MONTHLY_INCOME,
    totalInvested: 0,
    totalWithdrawn: 0,
    allocation: {},
    scores: { ...INITIAL_SCORES },
    xp: 0,
    resolvedEvents: [],
    retirementScore: undefined,
    activeCard: null,
    activeOption: null,
    activeOutcome: null,
    cardQueue: [],
    cardQueueIndex: 0,
  };
}

// ─── Actions ───
export type ExtendedAction =
  | { type: "START_ROUND" }
  | { type: "DRAW_CARDS" }
  | { type: "SELECT_OPTION"; optionId: string; random?: number }
  | { type: "NEXT_CARD" }
  | { type: "CONFIRM_ALLOCATION"; allocation: Record<string, number> }
  | { type: "NEXT_ROUND" }
  | { type: "SHOW_RETIREMENT_SCORE" };

// ─── Helpers ───
function clamp(v: number) { return Math.max(0, Math.min(100, v)); }

function applyScores(scores: Scores, impact: Partial<Scores>): Scores {
  const out = { ...scores };
  for (const [k, v] of Object.entries(impact)) {
    if (v) out[k as keyof Scores] = clamp(out[k as keyof Scores] + (v as number));
  }
  return out;
}

// ─── Reducer ───
function extendedReducer(state: ExtendedState, action: ExtendedAction): ExtendedState {
  switch (action.type) {

    case "START_ROUND": {
      const round = CHAOS_ROUNDS[state.currentRound - 1];
      if (!round) return state;
      const cards = drawCards(round);
      return {
        ...state,
        screen: "chaos_card",
        cardQueue: cards,
        cardQueueIndex: 0,
        activeCard: cards[0] ?? null,
        activeOption: null,
        activeOutcome: null,
      };
    }

    case "SELECT_OPTION": {
      const { activeCard } = state;
      if (!activeCard) return state;

      const option = activeCard.options.find((o) => o.id === action.optionId);
      if (!option) return state;

      const rand = action.random ?? Math.random();
      const outcome = resolveOutcome(option, rand);

      const delta = outcome.financialDelta;
      const newPortfolio = Math.max(0, state.portfolioValue + delta);
      const newScores = applyScores(state.scores, outcome.scoreImpact);
      const newIncome = outcome.incomeChange
        ? state.monthlyIncome + outcome.incomeChange
        : state.monthlyIncome;

      const resolvedEvent: ResolvedChaosEvent = {
        cardId: activeCard.id,
        optionId: option.id,
        outcomeId: outcome.id,
        financialDelta: delta,
        quality: outcome.quality,
        age: state.age,
      };

      return {
        ...state,
        screen: "chaos_result",
        portfolioValue: newPortfolio,
        portfolioHistory: [...state.portfolioHistory, newPortfolio],
        scores: newScores,
        xp: state.xp + (outcome.quality === "good" ? 50 : outcome.quality === "neutral" ? 25 : 10),
        monthlyIncome: newIncome,
        resolvedEvents: [...state.resolvedEvents, resolvedEvent],
        activeOption: option,
        activeOutcome: outcome,
      };
    }

    case "NEXT_CARD": {
      const nextIdx = state.cardQueueIndex + 1;
      if (nextIdx >= state.cardQueue.length) {
        return { ...state, screen: "allocation", activeCard: null, activeOption: null, activeOutcome: null };
      }
      return {
        ...state,
        screen: "chaos_card",
        cardQueueIndex: nextIdx,
        activeCard: state.cardQueue[nextIdx],
        activeOption: null,
        activeOutcome: null,
      };
    }

    case "CONFIRM_ALLOCATION": {
      const round = CHAOS_ROUNDS[state.currentRound - 1];
      if (!round) return state;

      // Apply market returns to portfolio
      const alloc = action.allocation;
      let weightedReturn = 0;
      for (const [assetId, pct] of Object.entries(alloc)) {
        const ret = round.marketReturns[assetId] ?? 0;
        weightedReturn += (pct / 100) * ret;
      }

      // Add investable income for this round
      const investableIncome = round.monthlyIncome * 12 * round.investableIncomePct;
      const marketGain = state.portfolioValue * weightedReturn;
      const newPortfolio = Math.round((state.portfolioValue + investableIncome + marketGain) * 100) / 100;

      // Diversification score
      const vals = Object.values(alloc).filter((v) => v > 0);
      const n = vals.length;
      const totalAlloc = vals.reduce((a, b) => a + b, 0) || 1;
      const hhi = vals.reduce((s, v) => s + (v / totalAlloc) ** 2, 0);
      const divBonus = Math.round((1 - hhi) * 8);

      // Risk alignment: compare to glide path target
      const riskTarget = getRiskTarget(state.age);
      const highRiskIds = ["stocks", "crypto", "emerging", "private_equity"];
      const highRiskPct = highRiskIds.reduce((s, id) => s + (alloc[id] ?? 0), 0);
      const riskBonus = highRiskPct <= riskTarget.maxHighRiskPct ? 3 : -3;

      const newScores = applyScores(state.scores, {
        diversification: divBonus,
        riskAlignment: riskBonus,
        wealth: marketGain > 0 ? 2 : -1,
      });

      return {
        ...state,
        allocation: alloc,
        portfolioValue: newPortfolio,
        portfolioHistory: [...state.portfolioHistory, newPortfolio],
        totalInvested: state.totalInvested + investableIncome,
        scores: newScores,
        screen: "portfolio_update",
      };
    }

    case "NEXT_ROUND": {
      const nextRoundIdx = state.currentRound; // 0-indexed
      if (nextRoundIdx >= CHAOS_ROUNDS.length) {
        return { ...state, screen: "retirement_score" };
      }
      const nextRound = CHAOS_ROUNDS[nextRoundIdx];
      return {
        ...state,
        screen: "round_intro",
        currentRound: state.currentRound + 1,
        age: nextRound.age,
        monthlyIncome: nextRound.monthlyIncome,
      };
    }

    case "SHOW_RETIREMENT_SCORE": {
      const retirementScore = calculateRetirementScore(state);
      return { ...state, screen: "retirement_score", retirementScore };
    }

    default:
      return state;
  }
}

// ─── Context ───
interface ExtendedContextType {
  state: ExtendedState;
  dispatch: Dispatch<ExtendedAction>;
}

const ExtendedContext = createContext<ExtendedContextType | null>(null);

export function ExtendedGameProvider({
  children,
  initialPortfolio = 0,
}: {
  children: ReactNode;
  initialPortfolio?: number;
}) {
  const base = buildInitialState();
  base.portfolioValue = initialPortfolio;
  base.portfolioHistory = [initialPortfolio];

  const [state, dispatch] = useReducer(extendedReducer, base);
  return (
    <ExtendedContext.Provider value={{ state, dispatch }}>
      {children}
    </ExtendedContext.Provider>
  );
}

export function useExtendedGame() {
  const ctx = useContext(ExtendedContext);
  if (!ctx) throw new Error("useExtendedGame must be inside ExtendedGameProvider");
  return ctx;
}

export { EXTENDED_ASSET_TIPS, CHAOS_ROUNDS };
