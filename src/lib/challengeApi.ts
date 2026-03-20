// ═══════════════════════════════════════════
// Challenge Mode API Client
// Connects to FastAPI backend
// Falls back to local-only if server is down
// ═══════════════════════════════════════════

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

interface StartResponse {
  playerId: string;
  scenarioId: string;
  startingPortfolio: {
    value: number;
    allocation: Record<string, number>;
  };
}

interface PhaseSubmitResponse {
  portfolioValue: number;
  delta: number;
  scores: {
    composure: number;
    dueDiligence: number;
    discipline: number;
    diversification: number;
    returns: number;
  };
  composureChange: number;
  phaseResult: {
    quality: "good" | "neutral" | "bad";
    feedback: string;
    marketOutcome: string;
  };
}

interface CompleteResponse {
  rank: number;
  totalPlayers: number;
  percentile: number;
  topScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  investorScore: number;
  portfolioValue: number;
  profile: string;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalPlayers: number;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      console.warn(`API ${path} returned ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API ${path} failed:`, err);
    return null;
  }
}

// ─── Endpoints ───

export async function apiStartChallenge(name: string): Promise<StartResponse | null> {
  return apiFetch<StartResponse>("/challenge/start", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function apiSubmitPhase(
  playerId: string,
  phaseNum: number,
  allocation: Record<string, number>,
  notificationsRead: number
): Promise<PhaseSubmitResponse | null> {
  return apiFetch<PhaseSubmitResponse>(`/challenge/phase/${phaseNum}/submit`, {
    method: "POST",
    body: JSON.stringify({ playerId, allocation, notificationsRead }),
  });
}

export async function apiCompleteChallenge(
  playerId: string,
  name: string,
  finalPortfolioValue: number,
  totalReturnPct: number,
  scores: Record<string, number>,
  investorScore: number
): Promise<CompleteResponse | null> {
  return apiFetch<CompleteResponse>("/challenge/complete", {
    method: "POST",
    body: JSON.stringify({
      playerId,
      name,
      finalPortfolioValue,
      totalReturnPct,
      scores,
      investorScore,
    }),
  });
}

export async function apiGetLeaderboard(): Promise<LeaderboardResponse | null> {
  return apiFetch<LeaderboardResponse>("/challenge/leaderboard");
}