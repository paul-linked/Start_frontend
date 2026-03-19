// ─── Node & Map ───
export interface MapNode {
  node_id: string;
  label: string;
  subtitle: string;
  difficulty: number;
  asset_class: string;
  status: "locked" | "available" | "completed";
  score?: number;
  icon: string;
}

export interface MapData {
  nodes: MapNode[];
  player_progress: PlayerProgress;
}

export interface PlayerProgress {
  completed_nodes: string[];
  current_xp: number;
  level: number;
}

// ─── Scenarios ───
export type ScenarioPhase = "reigns" | "allocation" | "event" | "results";

export interface NodeScenarios {
  reigns: ReignsScenario;
  allocation: AllocationScenario;
  event: EventScenario;
}

// Reigns (swipe cards)
export interface ReignsScenario {
  scenario_id: string;
  cards: ReignsCard[];
}

export interface ReignsCard {
  prompt: string;
  left: ReignsOption;
  right: ReignsOption;
  tap: ReignsOption;
  lesson: string;
}

export interface ReignsOption {
  label: string;
  impact: {
    xp: number;
    [key: string]: number;
  };
}

// Allocation (bucket sliders)
export interface AllocationScenario {
  scenario_id: string;
  starting_balance: number;
  accounts: AllocationAccount[];
  goal: string;
  optimal: Record<string, number>;
}

export interface AllocationAccount {
  id: string;
  label: string;
  description: string;
  interest: number;
  color: string;
}

// Event popup
export interface EventScenario {
  scenario_id: string;
  prompt: string;
  description: string;
  options: EventOption[];
  time_limit_seconds?: number;
}

export interface EventOption {
  label: string;
  xp: number;
  correct: boolean;
  feedback: string;
}

// ─── Results ───
export interface NodeResult {
  node_id: string;
  xp_earned: number;
  total_xp: number;
  level: number;
  score: number;
  lessons: string[];
  achievements: string[];
  next_node_unlocked: string | null;
}

// ─── Game Session State ───
export type GamePhase = "map" | "playing" | "results";

export interface DecisionRecord {
  scenario_id: string;
  phase: ScenarioPhase;
  decision: string;
  xp_earned: number;
}