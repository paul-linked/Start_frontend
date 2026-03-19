# Requirements Document

## Introduction

A Duolingo-style vertical level map for a Next.js PWA, themed around Switzerland and PostFinance branding. The map displays a single linear sequence of financial topic nodes. Player progress, XP, and node unlock state are either mocked locally or fetched from the game backend. The feature lives entirely within `src/app/map/`.

## Glossary

- **Level_Map**: The full-page scrollable component rendered at `/map`
- **MapNode**: A single tappable node on the map representing one game level, identified by `node_id`
- **Node_Status**: The current state of a MapNode — `locked`, `available`, or `completed`
- **XP_Bar**: A sticky progress bar at the top of the map showing the player's current level and XP (e.g. "Level 2 — 150/300 XP")
- **Zone**: A vertical section of the map background with a distinct alpine theme (Meadow → Forest → Highlands → Peak)
- **PostFinance_Theme**: Yellow (`#FFCC00`) and black (`#1A1A1A`) branding palette from PostFinance
- **Swiss_Theme**: Visual motifs including cows, mountains, alpine flowers, and Swiss flags
- **Backend_Adapter**: The interface layer connecting the Level_Map to the game API
- **useMapData**: The React hook responsible for fetching and exposing map state
- **Player_ID**: A UUID identifying the current player, persisted in `localStorage` under the key `player_id`
- **API_Base_URL**: The base URL for all backend requests, read from the environment variable `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)
- **Zigzag_Layout**: A CSS-only alternating horizontal offset where odd-indexed nodes are at `margin-left: ~30%` and even-indexed nodes are at `margin-left: ~55%`

---

## Requirements

### Requirement 1: Linear Map Layout

**User Story:** As a player, I want to see all game nodes arranged in a single vertical path, so that I can understand my progression through financial topics.

#### Acceptance Criteria

1. THE Level_Map SHALL display all MapNodes from the `nodes` array in a single linear vertical sequence with no branches.
2. THE Level_Map SHALL apply a Zigzag_Layout using CSS only — odd-indexed nodes at `margin-left: ~30%`, even-indexed nodes at `margin-left: ~55%` — with no graph library.
3. THE Level_Map SHALL render a vertical SVG path with gentle curves connecting the centres of consecutive MapNodes.
4. THE Level_Map SHALL be fully contained within `src/app/map/` and SHALL NOT modify files outside that directory.
5. THE Level_Map SHALL be mobile-first and SHALL render correctly on viewport widths from 320px upward (PWA target).

---

### Requirement 2: Node Appearance and States

**User Story:** As a player, I want each node to visually communicate its state, so that I know which node I can play, which I have completed, and which are still locked.

#### Acceptance Criteria

1. WHEN a MapNode has `status` of `completed`, THE MapNode SHALL render with a green ring, a score badge displaying the `score` value (0–100), and a continuous subtle float animation (translateY ±4px, 3s cycle).
2. WHEN a MapNode has `status` of `available`, THE MapNode SHALL render with a glowing/highlighted appearance using PostFinance yellow (`#FFCC00`) and SHALL be tappable.
3. WHEN a MapNode has `status` of `locked`, THE MapNode SHALL render greyed out at reduced opacity and SHALL be non-interactive.
4. THE MapNode SHALL display its `label`, `subtitle`, and `icon` prominently.
5. THE MapNode SHALL have a minimum touch target size of 64×64px to meet mobile/PWA usability standards.
6. WHEN a MapNode with `status` of `available` is hovered, THE MapNode SHALL apply a scale transform of 1.08 and a drop shadow using PostFinance yellow (`#FFCC00`).

---

### Requirement 3: Single Available Node Rule

**User Story:** As a player, I want only one node to be available at a time, so that my progression path is always clear.

#### Acceptance Criteria

1. THE Level_Map SHALL treat exactly one MapNode as `available` at any given time — the first node in the `nodes` array whose `status` is `available`.
2. WHEN all MapNodes have `status` of `completed`, THE Level_Map SHALL display a completion state and SHALL NOT mark any node as `available`.
3. THE Level_Map SHALL derive node availability exclusively from the `status` field returned in the `MapData` payload.

---

### Requirement 4: Node Navigation

**User Story:** As a player, I want to tap the available node and be taken to that node's game page, so that I can start playing.

#### Acceptance Criteria

1. WHEN a player taps a MapNode with `status` of `available`, THE Level_Map SHALL navigate to `/game/[node_id]` using Next.js `router.push`.
2. WHEN a player taps a MapNode with `status` of `locked`, THE Level_Map SHALL NOT navigate and SHALL NOT produce any interaction feedback.
3. WHEN a player taps a MapNode with `status` of `completed`, THE Level_Map SHALL navigate to `/game/[node_id]` to allow replay.

---

### Requirement 5: Sticky XP Bar

**User Story:** As a player, I want to see my current level and XP at the top of the map at all times, so that I can track my overall progress while scrolling.

#### Acceptance Criteria

1. THE Level_Map SHALL render an XP_Bar that remains sticky at the top of the viewport during scroll.
2. THE XP_Bar SHALL display the player's current level and XP in the format "Level N — X/Y XP" where Y is the XP threshold for the next level.
3. THE XP_Bar SHALL use the following level thresholds: L1 = 0 XP, L2 = 150 XP, L3 = 400 XP, L4 = 800 XP, L5 = 1500 XP.
4. THE XP_Bar SHALL render a progress bar filled proportionally between the current level's threshold and the next level's threshold using PostFinance yellow (`#FFCC00`).
5. THE XP_Bar SHALL derive its values from `player_progress.current_xp` and `player_progress.level` in the `MapData` payload.

---

### Requirement 6: Auto-Scroll to Current Node

**User Story:** As a player, I want the map to scroll to my current available node on load, so that I don't have to manually find where I am.

#### Acceptance Criteria

1. WHEN the Level_Map finishes loading map data, THE Level_Map SHALL automatically scroll to the first MapNode with `status` of `available` using smooth scrolling behaviour.
2. IF no MapNode has `status` of `available`, THE Level_Map SHALL remain at the top of the page.

---

### Requirement 7: Progressive Alpine Background

**User Story:** As a player, I want the background to change as I scroll down the map, so that the journey feels immersive and visually interesting.

#### Acceptance Criteria

1. THE Level_Map SHALL divide the vertical scroll area into 4 distinct Zones in order from top to bottom: Alpine Meadow (green, flowers 🌸), Pine Forest (dark green, trees), Rocky Highlands (grey, boulders 🏔️), Mountain Peak (white/blue, snow ❄️).
2. WHEN the player scrolls, THE Level_Map SHALL smoothly transition background colours and decorative elements between Zones using CSS transitions of at most 800ms.
3. THE Level_Map SHALL render Zone-appropriate decorative background elements (🐄 🌸 🏔️ ❄️) as non-interactive overlays.
4. THE Level_Map SHALL use a fixed or sticky background layer so that the transition effect is visible during scroll.

---

### Requirement 8: PostFinance and Swiss Branding

**User Story:** As a player, I want the map to feel distinctly Swiss and PostFinance-branded, so that the product identity is clear.

#### Acceptance Criteria

1. THE Level_Map SHALL use PostFinance yellow (`#FFCC00`) as the primary accent colour for available nodes, the XP_Bar fill, and the SVG connector path.
2. THE Level_Map SHALL use PostFinance black (`#1A1A1A`) as the primary text and icon colour.
3. THE Level_Map SHALL display a PostFinance-branded header at the top of the map with the text "PostFinance Challenge" and a Swiss flag emoji (🇨🇭).
4. THE Level_Map SHALL include Swiss-themed decorative elements (🐄 🏔️ 🌸 ❄️) distributed across the map background zones.

---

### Requirement 9: Data Fetching — useMapData Hook

**User Story:** As a developer, I want a single hook that fetches and exposes all map state, so that the map component stays decoupled from the API layer.

#### Acceptance Criteria

1. THE Level_Map SHALL consume all map state exclusively through a `useMapData` hook defined in `src/app/map/hooks/useMapData.ts`.
2. THE `useMapData` hook SHALL return an object conforming to the following interfaces:
   ```typescript
   interface MapData {
     nodes: MapNode[]
     player_progress: {
       completed_nodes: string[]
       current_xp: number
       level: number
     }
   }

   interface MapNode {
     node_id: string       // e.g. "node_01"
     label: string         // e.g. "Your First Deposit"
     subtitle: string      // e.g. "Learn about savings"
     difficulty: number    // 1–5
     asset_class: string   // "savings" | "bonds" | "stocks" | "etf" | "mixed"
     status: "locked" | "available" | "completed"
     score?: number        // 0–100 if completed
     icon: string          // emoji or icon key
   }
   ```
3. WHEN the `useMapData` hook is called without a backend connection, THE hook SHALL return the following mock data exactly:
   - node_01: label "Your first deposit", asset_class "savings", status "completed", score 85
   - node_02: label "Inflation trap", asset_class "savings", status "available"
   - node_03: label "Bonds intro", asset_class "bonds", status "locked"
   - node_04: label "Your first stock", asset_class "stocks", status "locked"
   - node_05: label "Market crash!", asset_class "stocks", status "locked"
   - node_06: label "Diversification", asset_class "mixed", status "locked"
   - node_07: label "ETFs explained", asset_class "etf", status "locked"
   - node_08: label "The long game", asset_class "mixed", status "locked"
4. THE `useMapData` hook SHALL be switchable from mock data to live API by changing a single import or flag — no other code changes SHALL be required.
5. WHEN using the live API, THE `useMapData` hook SHALL fetch data from `GET /game/map` using the `API_Base_URL` and include the `Player_ID` from `localStorage` as a query parameter or request header.
6. THE `useMapData` hook SHALL expose a `loading` boolean and an `error` value alongside the map data.

---

### Requirement 10: Backend Integration Documentation

**User Story:** As a developer, I want a clearly documented integration reference, so that I can wire up all backend endpoints without reverse-engineering the component.

#### Acceptance Criteria

1. THE Level_Map SHALL include a file `src/app/map/BACKEND_INTEGRATION.md` documenting the following endpoints:
   - `POST /game/start` — creates a new player session and returns a `player_id` to store in `localStorage`
   - `GET /game/map` — fetches the full `MapData` structure for the current player
   - `POST /game/node/{node_id}/complete` — marks a node as done and returns `xp_earned`, `total_xp`, `level`, `score`, `lessons`, and `next_node_unlocked`
2. THE `BACKEND_INTEGRATION.md` file SHALL document that the API base URL is read from the environment variable `NEXT_PUBLIC_API_URL` with a default of `http://localhost:8000`.
3. THE `BACKEND_INTEGRATION.md` file SHALL include example request and response shapes for each endpoint.
4. THE `BACKEND_INTEGRATION.md` file SHALL document that switching from mock data to live API requires changing a single import or flag in `useMapData.ts`.

---

### Requirement 11: Animations and Polish

**User Story:** As a player, I want smooth animations on the map, so that the experience feels polished and engaging.

#### Acceptance Criteria

1. WHEN the Level_Map first renders, THE Level_Map SHALL animate MapNodes into view sequentially with a staggered slide-up animation using `framer-motion` (50ms delay between each node).
2. WHEN a MapNode with `status` of `completed` is rendered, THE MapNode SHALL apply a continuous subtle float animation (translateY ±4px, 3s cycle).
3. THE Level_Map SHALL use `framer-motion` for all entry and hover animations.
4. WHEN a player completes a node and returns to the map, THE Level_Map SHALL re-fetch map data and update node states without a full page reload.
