// ─── API ───
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

// ─── Auth ───
export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ─── Game ───
export type GameState = "idle" | "waiting" | "playing" | "paused" | "finished";

export interface GameSession {
  id: string;
  state: GameState;
  players: Player[];
  created_at: string;
  settings: GameSettings;
}

export interface Player {
  id: string;
  username: string;
  avatar_url?: string;
  score: number;
  is_ready: boolean;
  is_host: boolean;
  connected: boolean;
}

export interface GameSettings {
  max_players: number;
  time_limit_seconds: number;
  [key: string]: unknown; // extend per game
}

// ─── Lobby ───
export interface LobbyRoom {
  id: string;
  name: string;
  host: Player;
  player_count: number;
  max_players: number;
  state: GameState;
}

// ─── WebSocket ───
export type WSMessageType =
  | "game:state"
  | "game:action"
  | "game:chat"
  | "player:join"
  | "player:leave"
  | "player:ready"
  | "error";

export interface WSMessage<T = unknown> {
  type: WSMessageType;
  payload: T;
  timestamp: number;
}
