"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import {
  CHALLENGE_PHASES,
  CHALLENGE_STARTING_VALUE,
  CHALLENGE_STARTING_ALLOCATION,
  SCORE_WEIGHTS,
} from "./challengeData";
import {
  apiStartChallenge,
  apiSubmitPhase,
  apiCompleteChallenge,
  apiGetLeaderboard,
  type LeaderboardEntry,
} from "./challengeApi";

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
  playerId: string | null;
  currentPhase: number;
  portfolioValue: number;
  portfolioHistory: number[];
  allocation: PortfolioAllocation;
  allocationHistory: PortfolioAllocation[];
  notificationsRead: number;
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
  leaderboard: LeaderboardEntry[];
  rank: number | null;
  totalPlayers: number;
  percentile: number | null;
}

const initialState: ChallengeState = {
  screen: "join",
  playerName: "",
  playerId: null,
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
  leaderboard: [],
  rank: null,
  totalPlayers: 0,
  percentile: null,
};

// ─── Actions (synchronous reducer) ───
type Action =
  | { type: "START_CHALLENGE"; name: string; playerId: string | null }
  | { type: "BEGIN_PHASE" }
  | { type: "READ_NOTIFICATION" }
  | {
      type: "SUBMIT_RESULT";
      allocation: PortfolioAllocation;
      portfolioValue: number;
      delta: number;
      scores: ChallengeState["scores"];
      quality: "good" | "neutral" | "bad";
      feedback: string;
    }
  | { type: "NEXT_PHASE" }
  | {
      type: "SET_FINAL";
      leaderboard: LeaderboardEntry[];
      rank: number | null;
      totalPlayers: number;
      percentile: number | null;
    }
  | { type: "RESET" };

// ─── Client-side scoring helpers (fallback) ───
function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, val));
}

function calcComposureChange(prev: PortfolioAllocation, next: PortfolioAllocation): number {
  let shift = 0;
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const k of keys) shift += Math.abs((next[k] || 0) - (prev[k] || 0));
  if (shift <= 5) return 4;
  if (shift <= 15) return 1;
  if (shift <= 30) return -3;
  if (shift <= 50) return -6;
  return -10;
}

function calcDiversification(alloc: PortfolioAllocation): number {
  const vals = Object.values(alloc).filter((v) => v > 0);
  const n = vals.length;
  if (n <= 1) return -5;
  if (n === 2) return -2;
  const evenness = 1 - vals.reduce((a, v) => a + Math.pow(v / 100 - 1 / n, 2), 0) * n;
  return Math.round(n * 2 + evenness * 4);
}

function clientSideEvaluate(
  allocation: PortfolioAllocation,
  prevAllocation: PortfolioAllocation,
  marketReturns: Record<string, number>,
  currentScores: ChallengeState["scores"],
  portfolioValue: number,
  notificationsRead: number,
  totalNotifs: number
) {
  // Return rate
  let returnRate = 0;
  for (const [id, pct] of Object.entries(allocation)) {
    returnRate += (pct / 100) * ((marketReturns[id] ?? 0) / 100);
  }
  const delta = Math.round(portfolioValue * returnRate * 100) / 100;
  const newValue = Math.round((portfolioValue + delta) * 100) / 100;

  // Evaluate quality
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
    feedback = "Heavy shift to safety — the market read this as panic.";
  } else if (newRisk - prevRisk > 10) {
    quality = "good";
    feedback = "You leaned into volatility. Bold — the clues supported it.";
  } else if (Math.abs(newSafe - prevSafe) <= 10 && Math.abs(newRisk - prevRisk) <= 10) {
    quality = "good";
    feedback = "Held steady. In a crisis, doing nothing is often the smartest move.";
  } else {
    quality = "neutral";
    feedback = "Minor adjustments. You hedged your bets.";
  }

  // Score updates
  const composureChange = calcComposureChange(prevAllocation, allocation);
  const divScore = calcDiversification(allocation);
  const readPct = totalNotifs > 0 ? notificationsRead / totalNotifs : 0;
  const ddChange = readPct >= 0.75 ? 3 : readPct >= 0.5 ? 0 : -4;

  const newScores = {
    composure: clamp(currentScores.composure + composureChange),
    dueDiligence: clamp(currentScores.dueDiligence + ddChange),
    discipline: clamp(currentScores.discipline + (quality === "good" ? 3 : quality === "bad" ? -5 : 0)),
    diversification: clamp(currentScores.diversification + divScore),
    returns: clamp(currentScores.returns + (delta > 0 ? 4 : delta > -10 ? -2 : -6)),
  };

  return { newValue, delta, newScores, quality, feedback };
}

// ─── Reducer ───
function challengeReducer(state: ChallengeState, action: Action): ChallengeState {
  switch (action.type) {
    case "START_CHALLENGE":
      return {
        ...initialState,
        screen: "phase_intro",
        playerName: action.name,
        playerId: action.playerId,
        currentPhase: 1,
      };

    case "BEGIN_PHASE":
      return { ...state, screen: "phase_play", notificationsRead: 0 };

    case "READ_NOTIFICATION":
      return { ...state, notificationsRead: state.notificationsRead + 1 };

    case "SUBMIT_RESULT":
      return {
        ...state,
        screen: "phase_result",
        allocation: action.allocation,
        allocationHistory: [...state.allocationHistory, action.allocation],
        portfolioValue: action.portfolioValue,
        portfolioHistory: [...state.portfolioHistory, action.portfolioValue],
        scores: action.scores,
        lastDelta: action.delta,
        lastQuality: action.quality,
        lastFeedback: action.feedback,
      };

    case "NEXT_PHASE":
      if (state.currentPhase >= 5) {
        return { ...state, screen: "final" };
      }
      return { ...state, screen: "phase_intro", currentPhase: state.currentPhase + 1 };

    case "SET_FINAL":
      return {
        ...state,
        leaderboard: action.leaderboard,
        rank: action.rank,
        totalPlayers: action.totalPlayers,
        percentile: action.percentile,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ─── Investor score ───
export function calculateInvestorScore(scores: ChallengeState["scores"]): number {
  return Math.round(
    scores.returns * SCORE_WEIGHTS.returns +
    scores.composure * SCORE_WEIGHTS.composure +
    scores.dueDiligence * SCORE_WEIGHTS.dueDiligence +
    scores.diversification * SCORE_WEIGHTS.diversification +
    scores.discipline * SCORE_WEIGHTS.discipline
  );
}

// ─── Context with async action wrappers ───
interface ChallengeContextType {
  state: ChallengeState;
  actions: {
    startChallenge: (name: string) => Promise<void>;
    beginPhase: () => void;
    readNotification: () => void;
    submitAllocation: (allocation: PortfolioAllocation) => Promise<void>;
    nextPhase: () => void;
    fetchLeaderboard: () => Promise<void>;
    reset: () => void;
  };
}

const ChallengeContext = createContext<ChallengeContextType | null>(null);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(challengeReducer, initialState);

  const startChallenge = useCallback(async (name: string) => {
    const res = await apiStartChallenge(name);
    dispatch({
      type: "START_CHALLENGE",
      name,
      playerId: res?.playerId ?? null,
    });
  }, []);

  const beginPhase = useCallback(() => {
    dispatch({ type: "BEGIN_PHASE" });
  }, []);

  const readNotification = useCallback(() => {
    dispatch({ type: "READ_NOTIFICATION" });
  }, []);

  const submitAllocation = useCallback(
    async (allocation: PortfolioAllocation) => {
      const phase = CHALLENGE_PHASES[state.currentPhase - 1];
      if (!phase) return;

      // Try server first
      if (state.playerId) {
        const res = await apiSubmitPhase(
          state.playerId,
          state.currentPhase,
          allocation,
          state.notificationsRead
        );
        if (res) {
          dispatch({
            type: "SUBMIT_RESULT",
            allocation,
            portfolioValue: res.portfolioValue,
            delta: res.delta,
            scores: res.scores,
            quality: res.phaseResult.quality,
            feedback: res.phaseResult.feedback,
          });
          return;
        }
      }

      // Fallback: client-side evaluation
      const result = clientSideEvaluate(
        allocation,
        state.allocation,
        phase.marketReturns,
        state.scores,
        state.portfolioValue,
        state.notificationsRead,
        phase.notifications.length
      );

      dispatch({
        type: "SUBMIT_RESULT",
        allocation,
        portfolioValue: result.newValue,
        delta: result.delta,
        scores: result.newScores,
        quality: result.quality,
        feedback: result.feedback,
      });
    },
    [state.currentPhase, state.playerId, state.allocation, state.scores, state.portfolioValue, state.notificationsRead]
  );

  const fetchLeaderboard = useCallback(async () => {
    const investorScore = calculateInvestorScore(state.scores);
    const totalReturn = state.portfolioValue - CHALLENGE_STARTING_VALUE;
    const totalReturnPct = (totalReturn / CHALLENGE_STARTING_VALUE) * 100;

    let rank: number | null = null;
    let totalPlayers = 0;
    let percentile: number | null = null;

    // Only submit if we haven't already (avoid 409 on double-call)
    if (state.playerId && state.rank === null) {
      const completeRes = await apiCompleteChallenge(
        state.playerId,
        state.playerName,
        state.portfolioValue,
        totalReturnPct,
        state.scores,
        investorScore
      );
      if (completeRes) {
        rank = completeRes.rank;
        totalPlayers = completeRes.totalPlayers;
        percentile = completeRes.percentile;
      }
    }

    // Fetch leaderboard
    const lbRes = await apiGetLeaderboard();
    const entries = lbRes?.entries ?? [];
    totalPlayers = lbRes?.totalPlayers ?? totalPlayers;

    dispatch({
      type: "SET_FINAL",
      leaderboard: entries,
      rank,
      totalPlayers,
      percentile,
    });
  }, [state.playerId, state.playerName, state.portfolioValue, state.scores]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const actions = {
    startChallenge,
    beginPhase,
    readNotification,
    submitAllocation,
    nextPhase: useCallback(() => dispatch({ type: "NEXT_PHASE" }), []),
    fetchLeaderboard,
    reset,
  };

  return (
    <ChallengeContext.Provider value={{ state, actions }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error("useChallenge must be inside ChallengeProvider");
  return ctx;
}