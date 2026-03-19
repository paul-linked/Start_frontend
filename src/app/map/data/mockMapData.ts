import { MapData } from "../types";

export const mockMapData: MapData = {
  nodes: [
    { node_id: "node_01", label: "Your first deposit",  subtitle: "Learn about savings",            difficulty: 1, asset_class: "savings", status: "completed", score: 85, icon: "💰" },
    { node_id: "node_02", label: "Inflation trap",       subtitle: "Why cash loses value",           difficulty: 2, asset_class: "savings", status: "available",            icon: "📉" },
    { node_id: "node_03", label: "Bonds intro",          subtitle: "Safe lending basics",            difficulty: 2, asset_class: "bonds",   status: "locked",               icon: "📜" },
    { node_id: "node_04", label: "Your first stock",     subtitle: "Owning a piece of a company",    difficulty: 3, asset_class: "stocks",  status: "locked",               icon: "📈" },
    { node_id: "node_05", label: "Market crash!",        subtitle: "Riding the volatility",          difficulty: 4, asset_class: "stocks",  status: "locked",               icon: "💥" },
    { node_id: "node_06", label: "Diversification",      subtitle: "Don't put eggs in one basket",   difficulty: 3, asset_class: "mixed",   status: "locked",               icon: "🧺" },
    { node_id: "node_07", label: "ETFs explained",       subtitle: "Passive investing made easy",    difficulty: 3, asset_class: "etf",     status: "locked",               icon: "🗂️" },
    { node_id: "node_08", label: "The long game",        subtitle: "Compound interest wins",         difficulty: 5, asset_class: "mixed",   status: "locked",               icon: "⏳" },
  ],
  player_progress: {
    completed_nodes: ["node_01"],
    current_xp: 85,
    level: 1,
  },
};
