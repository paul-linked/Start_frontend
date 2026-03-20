import type { Scores } from "./index";

// ═══════════════════════════════════════════════════════════════
// EXTENDED GAME TYPES — Mode 2 (The Long Game)
// ═══════════════════════════════════════════════════════════════

// ─── Probabilistic outcome on a chaos/life card ───
export interface RandomOutcome {
  id: string;
  probability: number;          // 0.0–1.0; all outcomes in a card must sum to 1.0
  label: string;                // Short result label shown after resolution
  financialDelta: number;       // Fixed CHF change (positive = gain, negative = loss)
                                // Use this OR financialMultiplier, not both
  financialMultiplier?: number; // Multiplier on staked amount (1.0=no change, 0=total loss)
  quality: "good" | "neutral" | "bad";
  feedback: string;
  learning: string;
  scoreImpact: Partial<Scores>;
  // For life events: can force a mandatory expense or income change
  forcedExpense?: number;       // One-time CHF deduction from liquid cash
  incomeChange?: number;        // Permanent monthly income delta (+ or -)
}

// ─── Card categories ───
export type ChaosCategory =
  | "memecoin"    // crypto chaos
  | "social"      // influencer / viral / FOMO
  | "scam"        // fraud, phishing, too-good-to-be-true
  | "lifestyle"   // spending temptations
  | "macro"       // real-world economic events
  | "workplace"   // salary, bonus, job events
  | "lucky"       // random windfalls
  | "brainrot"    // pure internet chaos energy
  | "life"        // serious life events: mortgage, relocation, family, health
  | "retirement"  // glide-path and retirement planning events
  | "classic";    // timeless investing lessons

// ─── A single event card ───
export interface ChaosCard {
  id: string;
  category: ChaosCategory;
  headline: string;
  description: string;
  emoji: string;
  stakeMode: "fixed" | "percentage" | "choice" | "none";
  fixedAmount?: number;         // CHF amount at stake when stakeMode === "fixed"
  defaultPct?: number;          // % of portfolio when stakeMode === "percentage"
  outcomes: RandomOutcome[];
  tip?: string;
  // Life-stage gating: only show this card in certain age ranges
  minAge?: number;
  maxAge?: number;
}

// ─── A round in the extended game ───
export interface ChaosRound {
  id: number;
  age: number;                  // Player's age this round (starts at ~30)
  kicker: string;
  title: string;
  description: string;
  cardCount: number;
  forcedCardIds?: string[];
  marketReturns: Record<string, number>;
  // Monthly income available this round for investing
  monthlyIncome: number;
  // Fraction of monthly income the player can choose to invest (0–1)
  investableIncomePct: number;
  injection?: {
    amount: number;
    reason: string;
  };
  // Glide-path target: recommended max % in high-risk assets at this age
  riskTarget: RiskTarget;
}

// ─── Risk glide path ───
export interface RiskTarget {
  maxHighRiskPct: number;       // % of portfolio that should be in high-risk assets
  maxMediumRiskPct: number;
  label: string;                // e.g. "Aggressive", "Balanced", "Conservative"
  rationale: string;            // Shown as a tip to the player
}

// ─── Extended game state (managed by GameContext2) ───
export interface ExtendedGameState {
  currentRound: number;
  age: number;
  portfolioValue: number;
  portfolioHistory: number[];
  monthlyIncome: number;
  totalInvested: number;        // cumulative CHF put into portfolio
  totalWithdrawn: number;       // CHF taken out (mortgage down payments, emergencies)
  allocation: Record<string, number>;
  scores: Scores;
  xp: number;
  resolvedEvents: ResolvedChaosEvent[];
  retirementScore?: RetirementScore;
}

// ─── Runtime resolved event ───
export interface ResolvedChaosEvent {
  cardId: string;
  outcomeId: string;
  stakeAmount: number;
  financialDelta: number;
  quality: "good" | "neutral" | "bad";
  age: number;
}

// ─── Retirement scoring ───
export interface RetirementScore {
  finalPortfolioValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPct: number;
  riskAlignmentScore: number;   // How well the player followed the glide path
  diversificationScore: number;
  behaviorScore: number;        // Based on decisions made throughout
  overallGrade: RetirementGrade;
  narrative: string;
}

export type RetirementGrade =
  | "S"   // Exceptional — well above target
  | "A"   // Great — comfortably above target
  | "B"   // Good — on track
  | "C"   // Okay — below target but manageable
  | "D";  // Needs work — significantly below target
