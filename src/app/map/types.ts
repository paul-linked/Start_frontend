export type NodeStatus = "locked" | "available" | "completed";

export type AssetClass = "savings" | "bonds" | "stocks" | "etf" | "mixed";

export interface MapNode {
  node_id: string;
  label: string;
  subtitle: string;
  difficulty: number;
  asset_class: AssetClass;
  status: NodeStatus;
  score?: number;
  icon: string;
}

export interface PlayerProgress {
  completed_nodes: string[];
  current_xp: number;
  level: number;
}

export interface MapData {
  nodes: MapNode[];
  player_progress: PlayerProgress;
}

export interface UseMapDataResult {
  data: MapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface Zone {
  name: string;
  bg: string;
  emoji: string[];
}
