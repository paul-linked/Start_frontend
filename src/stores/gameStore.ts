import { create } from "zustand";
import type { GameState, GameSession, Player } from "@/types";

interface GameStore {
  // State
  session: GameSession | null;
  localPlayerId: string | null;
  state: GameState;

  // Actions
  setSession: (session: GameSession | null) => void;
  setLocalPlayer: (id: string) => void;
  setState: (state: GameState) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  session: null,
  localPlayerId: null,
  state: "idle",

  setSession: (session) =>
    set({ session, state: session?.state ?? "idle" }),

  setLocalPlayer: (id) => set({ localPlayerId: id }),

  setState: (state) =>
    set((s) => ({
      state,
      session: s.session ? { ...s.session, state } : null,
    })),

  updatePlayer: (id, updates) =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: {
          ...s.session,
          players: s.session.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        },
      };
    }),

  addPlayer: (player) =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: {
          ...s.session,
          players: [...s.session.players, player],
        },
      };
    }),

  removePlayer: (id) =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: {
          ...s.session,
          players: s.session.players.filter((p) => p.id !== id),
        },
      };
    }),

  reset: () => set({ session: null, localPlayerId: null, state: "idle" }),
}));
