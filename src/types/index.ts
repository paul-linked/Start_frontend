// ─── Screen flow ───
export type GameScreen =
  | "landing"
  | "round_intro"
  | "snap_decision"
  | "briefing_room"
  | "allocation"
  | "feedback"
  | "portfolio_update"
  | "cash_injection"
  | "end_screen";

export type QuestType = "snap_decision" | "briefing_room" | "allocation";

// ─── Snap Decision ───
export interface SnapOption {
  id: string;
  label: string;
  description: string;
  quality: "good" | "neutral" | "bad";
  feedback: string;
  learning: string;
  scoreImpact: Partial<Scores>;
}

export interface SnapCard {
  id: string;
  headline: string;
  description: string;
  options: SnapOption[];
}

export interface SnapDecisionQuest {
  type: "snap_decision";
  cards: SnapCard[];
}

// ─── Briefing Room ───
export interface BriefingArticle {
  source: string;
  sourceType: string;
  headline: string;
  standfirst: string;
  paragraphs: string[]; // HTML strings — clues wrapped in <mark>
}

export interface BriefingOutcome {
  quality: "good" | "neutral" | "bad";
  feedback: string;
  learning: string;
  scoreImpact: Partial<Scores>;
}

export interface BriefingRoomQuest {
  type: "briefing_room";
  articles: BriefingArticle[]; // 1 for easy rounds, 2 for Round 5
  chartData: number[];
  chartLabel: string;
  chartDelta: string;
  outcomes: {
    buy: BriefingOutcome;
    hold: BriefingOutcome;
    sell: BriefingOutcome;
  };
}

// ─── Allocation ───
export interface Product {
  id: string;
  name: string;
  description: string;
  returnPct: number; // actual return this round
  returnDisplay?: string; // override display, e.g. "-15% to +25%"
  risk: "low" | "medium" | "high";
  unlockRound: number;
}

export interface AllocationQuest {
  type: "allocation";
  products: Product[];
  marketContext: string;
}

// ─── Round ───
export type Quest = SnapDecisionQuest | BriefingRoomQuest | AllocationQuest;

export interface CashInjection {
  amount: number;
  reason: string;
}

export interface Round {
  id: number;
  year: number;
  kicker: string; // e.g. "Year One"
  title: string;
  description: string;
  quest: Quest;
  // Market returns applied to existing portfolio this round
  marketReturns: Record<string, number>;
  // Cash injection after this round (if any)
  injection?: CashInjection;
}

// ─── Scores ───
export interface Scores {
  diversification: number;
  riskAlignment: number;
  patience: number;
  learning: number;
  wealth: number;
}

// ─── Portfolio ───
export interface PortfolioAllocation {
  [productId: string]: number; // percentage 0-100
}

// ─── Game State ───
export interface GameState {
  screen: GameScreen;
  currentRound: number;
  portfolioValue: number;
  portfolioHistory: number[]; // value after each round
  savingsHistory: number[]; // ghost line: savings-only path
  perfectHistory: number[]; // ghost line: perfect decisions
  totalDeposited: number;
  allocation: PortfolioAllocation;
  scores: Scores;
  xp: number;

  // Current round transient state
  currentFeedback: {
    quality: "good" | "neutral" | "bad";
    feedback: string;
    learning: string;
    scoreDeltas: Partial<Scores>;
  } | null;
  portfolioDelta: number;
  snapCardIndex: number; // for multi-card snap decisions

  // Decisions history (for end screen narrative)
  decisions: Array<{
    round: number;
    choice: string;
    quality: "good" | "neutral" | "bad";
  }>;

  // Free play mode (continues beyond demo rounds)
  freePlay: boolean;
}

// ─── Investor Profile (end screen) ───
export type ProfileQuadrant =
  | "steady_hand"      // rational + conservative
  | "calculated_risk"  // rational + aggressive
  | "cautious_observer" // reactive + conservative
  | "thrill_seeker";   // reactive + aggressive

export interface InvestorProfile {
  quadrant: ProfileQuadrant;
  title: string;
  subtitle: string;
  rationalScore: number;  // -1 to 1 (x-axis)
  aggressiveScore: number; // -1 to 1 (y-axis)
  totalReturn: number;
  totalReturnPct: number;
}