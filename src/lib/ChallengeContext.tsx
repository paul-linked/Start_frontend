"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import {
  CHALLENGE_PHASES,
  CHALLENGE_STARTING_VALUE,
  CHALLENGE_STARTING_ALLOCATION,
  SCORE_WEIGHTS,
} from "./challengeData";

// ─── Types ───
export type ChallengeScreen =
  | "join"
  | "phase_intro"
  | "phase_play"
  | "phase_result"
  | "final";

interface PortfolioAllocation {
  [productId: string]: number;
}

export interface ChallengeState {
  screen: ChallengeScreen;
  playerName: string;
  currentPhase: number; // 1-5
  portfolioValue: number;
  portfolioHistory: number[];
  allocation: PortfolioAllocation;
  allocationHistory: PortfolioAllocation[]; // for composure tracking
  notificationsRead: number; // count per phase
  scores: {
    composure: number;
    dueDiligence: number;
    discipline: number;
    diversification: number;
    returns: number;
  };
  lastDelta: number;
  lastQuality: "good" | "neutral" | "bad";
  lastFeedback: string;
}

const initialState: ChallengeState = {
  screen: "join",
  playerName: "",
  currentPhase: 0,
  portfolioValue: CHALLENGE_STARTING_VALUE,
  portfolioHistory: [CHALLENGE_STARTING_VALUE],
  allocation: { ...CHALLENGE_STARTING_ALLOCATION },
  allocationHistory: [],
  notificationsRead: 0,
  scores: {
    composure: 70,
    dueDiligence: 70,
    discipline: 70,
    diversification: 70,
    returns: 70,
  },
  lastDelta: 0,
  lastQuality: "neutral",
  lastFeedback: "",
};

// ─── Actions ───
type Action =
  | { type: "START_CHALLENGE"; name: string }
  | { type: "BEGIN_PHASE" }
  | { type: "READ_NOTIFICATION" }
  | { type: "SUBMIT_ALLOCATION"; allocation: PortfolioAllocation }
  | { type: "NEXT_PHASE" }
  | { type: "RESET" };

// ─── Helpers ───
function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, val));
}

function calculateComposureChange(prev: PortfolioAllocation, next: PortfolioAllocation): number {
  // How much did the allocation shift? Big shifts = low composure
  let totalShift = 0;
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const key of allKeys) {
    totalShift += Math.abs((next[key] || 0) - (prev[key] || 0));
  }
  // totalShift of 0 = held steady (+3), 10-20 = minor adjustment (0), 40+ = panic (-8)
  if (totalShift <= 5) return 4;
  if (totalShift <= 15) return 1;
  if (totalShift <= 30) return -3;
  if (totalShift <= 50) return -6;
  return -10;
}

function calculateDiversification(allocation: PortfolioAllocation): number {
  const values = Object.values(allocation).filter((v) => v > 0);
  const n = values.length;
  if (n <= 1) return -5;
  if (n === 2) return -2;
  // More products + more even = better
  const evenness = 1 - values.reduce((acc, v) => acc + Math.pow(v / 100 - 1 / n, 2), 0) * n;
  return Math.round(n * 2 + evenness * 4);
}

function evaluateAllocation(
  allocation: PortfolioAllocation,
  prevAllocation: PortfolioAllocation,
  marketReturns: Record<string, number>
): {
  returnRate: number;
  quality: "good" | "neutral" | "bad";
  feedback: string;
} {
  // Calculate weighted return
  let returnRate = 0;
  for (const [id, pct] of Object.entries(allocation)) {
    returnRate += (pct / 100) * ((marketReturns[id] ?? 0) / 100);
  }

  // Did they panic-sell into safety?
  const safeIds = ["savings", "bonds"];
  const riskIds = ["etf", "stocks"];
  const prevSafe = safeIds.reduce((s, id) => s + (prevAllocation[id] || 0), 0);
  const newSafe = safeIds.reduce((s, id) => s + (allocation[id] || 0), 0);
  const prevRisk = riskIds.reduce((s, id) => s + (prevAllocation[id] || 0), 0);
  const newRisk = riskIds.reduce((s, id) => s + (allocation[id] || 0), 0);

  let quality: "good" | "neutral" | "bad";
  let feedback: string;

  if (newSafe - prevSafe > 15) {
    quality = "bad";
    feedback = "You shifted heavily toward safety — the market read this as panic selling.";
  } else if (newRisk - prevRisk > 10) {
    quality = "good";
    feedback = "You leaned into the volatility. Bold move — the clues supported it.";
  } else if (Math.abs(newSafe - prevSafe) <= 10 && Math.abs(newRisk - prevRisk) <= 10) {
    quality = "good";
    feedback = "You held steady. In a crisis, doing nothing is often the hardest and smartest move.";
  } else {
    quality = "neutral";
    feedback = "Minor adjustments. You read the situation but hedged your bets.";
  }

  return { returnRate, quality, feedback };
}

// ─── Reducer ───
function challengeReducer(state: ChallengeState, action: Action): ChallengeState {
  switch (action.type) {
    case "START_CHALLENGE":
      return {
        ...initialState,
        screen: "phase_intro",
        playerName: action.name,
        currentPhase: 1,
      };

    case "BEGIN_PHASE":
      return {
        ...state,
        screen: "phase_play",
        notificationsRead: 0,
      };

    case "READ_NOTIFICATION":
      return {
        ...state,
        notificationsRead: state.notificationsRead + 1,
      };

    case "SUBMIT_ALLOCATION": {
      const phase = CHALLENGE_PHASES[state.currentPhase - 1];
      if (!phase) return state;

      const { returnRate, quality, feedback } = evaluateAllocation(
        action.allocation,
        state.allocation,
        phase.marketReturns
      );

      const delta = state.portfolioValue * returnRate;
      const newValue = Math.round((state.portfolioValue + delta) * 100) / 100;

      // Score updates — harsher than solo mode
      const composureChange = calculateComposureChange(state.allocation, action.allocation);
      const divScore = calculateDiversification(action.allocation);
      const totalNotifs = phase.notifications.length;
      const readPct = totalNotifs > 0 ? state.notificationsRead / totalNotifs : 0;
      const ddChange = readPct >= 0.75 ? 3 : readPct >= 0.5 ? 0 : -4;

      const newScores = {
        composure: clamp(state.scores.composure + composureChange),
        dueDiligence: clamp(state.scores.dueDiligence + ddChange),
        discipline: clamp(state.scores.discipline + (quality === "good" ? 3 : quality === "bad" ? -5 : 0)),
        diversification: clamp(state.scores.diversification + divScore),
        returns: clamp(state.scores.returns + (delta > 0 ? 4 : delta > -10 ? -2 : -6)),
      };

      return {
        ...state,
        screen: "phase_result",
        allocation: action.allocation,
        allocationHistory: [...state.allocationHistory, action.allocation],
        portfolioValue: newValue,
        portfolioHistory: [...state.portfolioHistory, newValue],
        scores: newScores,
        lastDelta: Math.round(delta * 100) / 100,
        lastQuality: quality,
        lastFeedback: feedback,
      };
    }

    case "NEXT_PHASE": {
      if (state.currentPhase >= 5) {
        return { ...state, screen: "final" };
      }
      return {
        ...state,
        screen: "phase_intro",
        currentPhase: state.currentPhase + 1,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ─── Investor score calculation ───
export function calculateInvestorScore(scores: ChallengeState["scores"]): number {
  return Math.round(
    scores.returns * SCORE_WEIGHTS.returns +
    scores.composure * SCORE_WEIGHTS.composure +
    scores.dueDiligence * SCORE_WEIGHTS.dueDiligence +
    scores.diversification * SCORE_WEIGHTS.diversification +
    scores.discipline * SCORE_WEIGHTS.discipline
  );
}

// ─── Context ───
interface ChallengeContextType {
  state: ChallengeState;
  dispatch: Dispatch<Action>;
}

const ChallengeContext = createContext<ChallengeContextType | null>(null);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(challengeReducer, initialState);
  return (
    <ChallengeContext.Provider value={{ state, dispatch }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error("useChallenge must be inside ChallengeProvider");
  return ctx;
}