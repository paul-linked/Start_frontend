import type { Scores } from "./index";

// ═══════════════════════════════════════════════════════════════
// EXTENDED GAME TYPES — Mode 2 (The Long Game)
// ═══════════════════════════════════════════════════════════════

// ─── A single probabilistic outcome within a player option ───
export interface RandomOutcome {
  id: string;
  probability: number;          // 0.0–1.0; all outcomes within an option must sum to 1.0
  label: string;                // Short result label shown after resolution
  financialDelta: number;       // Fixed CHF change (positive = gain, negative = loss)
  quality: "good" | "neutral" | "bad";
  feedback: string;             // What happened
  learning: string;             // The lesson
  scoreImpact: Partial<Scores>;
  incomeChange?: number;        // Permanent monthly income delta (+ or -)
}

// ─── A player-selectable option on a card ───
export interface PlayerOption {
  id: string;
  label: string;                // Short button label, e.g. "Listen to Marco's GF"
  description: string;          // One-liner shown under the label
  outcomes: RandomOutcome[];    // Probabilistic outcomes for this choice
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
  options: PlayerOption[];      // Player picks one; each option resolves probabilistically
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
  optionId: string;
  outcomeId: string;
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
