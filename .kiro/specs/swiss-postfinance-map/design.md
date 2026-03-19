# Design Document — swiss-postfinance-map

## Overview

A Duolingo-style vertical level map rendered at `/map`, themed around Switzerland and PostFinance branding. The feature is a self-contained Next.js App Router page living entirely inside `src/app/map/`. It displays 8 financial-topic nodes in a single linear zigzag path, with progressive alpine background zones, a sticky XP bar, and framer-motion animations. Data is served by a `useMapData` hook that ships with mock data and can be switched to a live backend with a single flag change.

### Design Goals

- Zero dependencies outside what is already in `package.json` (framer-motion, tailwind, next, zustand, clsx)
- No graph libraries — layout is pure CSS margin offsets
- Mobile-first PWA: 320 px minimum width, 64 px minimum touch targets
- PostFinance yellow (`#FFCC00`) / black (`#1A1A1A`) as the only brand colours added on top of the existing game palette
- All files confined to `src/app/map/`

---

## Architecture

```
src/app/map/
├── page.tsx                  ← Next.js route entry, composes MapPage
├── MapPage.tsx               ← Full-page orchestrator (scroll, zone, auto-scroll)
├── components/
│   ├── XPBar.tsx             ← Sticky progress bar
│   ├── NodeCard.tsx          ← Individual map node (all three states)
│   ├── ZoneBackground.tsx    ← Scroll-driven alpine background layer
│   └── NodeConnector.tsx     ← SVG curved path between nodes
├── hooks/
│   └── useMapData.ts         ← Data layer (mock ↔ live toggle)
├── data/
│   └── mockMapData.ts        ← Static mock payload
├── types.ts                  ← All map-specific TypeScript interfaces
└── BACKEND_INTEGRATION.md    ← API reference for backend developers
```

### Data Flow

```
page.tsx
  └─ MapPage
       ├─ useMapData()          → { nodes, player_progress, loading, error }
       ├─ ZoneBackground        ← scroll position (%)
       ├─ XPBar                 ← player_progress
       ├─ NodeConnector (SVG)   ← node DOM refs
       └─ NodeCard × 8         ← node data + router.push
```

### Scroll / Zone Logic

The page container is a single `div` with `overflow-y: auto` and a fixed height of `100dvh`. A `scroll` event listener (throttled with `requestAnimationFrame`) computes `scrollTop / (scrollHeight - clientHeight)` → a `[0, 1]` progress value. This value is mapped to one of four zones and passed to `ZoneBackground` as a prop.

---

## Components and Interfaces

### `page.tsx`

Thin Next.js route file. Renders `<MapPage />` with no additional logic.

```tsx
// src/app/map/page.tsx
import MapPage from "./MapPage";
export default function Page() { return <MapPage />; }
```

### `MapPage.tsx`

Orchestrator component. Responsibilities:
- Calls `useMapData()`
- Tracks scroll position via `useRef` + `useEffect`
- Derives active zone index (0–3) from scroll progress
- Triggers auto-scroll to the first `available` node on data load
- Renders `ZoneBackground`, `XPBar`, the SVG connector layer, and the node list

Props: none (reads everything from `useMapData`)

Key internal state:
```ts
const scrollRef = useRef<HTMLDivElement>(null);
const nodeRefs  = useRef<(HTMLDivElement | null)[]>([]);
const [zoneIndex, setZoneIndex] = useState(0);
```

### `XPBar.tsx`

Sticky bar pinned to the top of the viewport.

Props:
```ts
interface XPBarProps {
  level: number;
  currentXP: number;
}
```

Level thresholds (hardcoded constant):
```ts
const XP_THRESHOLDS = [0, 150, 400, 800, 1500];
```

Renders:
- Left: "🇨🇭 PostFinance Challenge"
- Centre: "Level N — X / Y XP"
- Right: filled progress bar in `#FFCC00`

### `NodeCard.tsx`

Single map node. Handles all three visual states internally.

Props:
```ts
interface NodeCardProps {
  node: MapNode;
  index: number;          // used for zigzag margin and stagger delay
  onTap: (nodeId: string) => void;
}
```

Zigzag margin rule (CSS-only, applied inline or via Tailwind arbitrary values):
```
index % 2 === 0  →  marginLeft: "55%"
index % 2 === 1  →  marginLeft: "30%"
```

State-specific rendering:

| Status      | Ring colour | Opacity | Interactive | Animation          |
|-------------|-------------|---------|-------------|--------------------|
| `completed` | green       | 100%    | yes (replay)| float (3 s cycle)  |
| `available` | `#FFCC00`   | 100%    | yes         | glow pulse + hover scale 1.08 |
| `locked`    | grey        | 40%     | no          | none               |

Minimum size: `min-w-[64px] min-h-[64px]`

framer-motion usage:
- Entry: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with `transition={{ delay: index * 0.05 }}`
- Float (completed): `animate={{ y: [0, -4, 0] }}` with `transition={{ duration: 3, repeat: Infinity }}`
- Hover (available): `whileHover={{ scale: 1.08 }}`

### `ZoneBackground.tsx`

Full-screen fixed background layer (`position: fixed`, `z-index: -1`). Receives `zoneIndex` and renders the appropriate gradient + emoji decorations.

Props:
```ts
interface ZoneBackgroundProps {
  zoneIndex: 0 | 1 | 2 | 3;
}
```

Zone definitions:
```ts
const ZONES = [
  { name: "Alpine Meadow",  bg: "from-green-300 to-green-500",   emoji: ["🌸","🐄","🌿"] },
  { name: "Pine Forest",    bg: "from-green-700 to-green-900",   emoji: ["🌲","🌲","🍃"] },
  { name: "Rocky Highlands",bg: "from-gray-400 to-gray-600",     emoji: ["🏔️","🪨","🌫️"] },
  { name: "Mountain Peak",  bg: "from-blue-100 to-white",        emoji: ["❄️","🏔️","⛄"] },
];
```

Background transition: `transition: background 800ms ease-in-out` applied via CSS.

Decorative emojis are absolutely positioned, non-interactive (`pointer-events: none`), and distributed at fixed percentage positions within the layer.

### `NodeConnector.tsx`

SVG overlay rendered between the node list and the background. Uses `useEffect` to read `getBoundingClientRect()` on each node ref and draw a cubic Bézier path through their centres.

Props:
```ts
interface NodeConnectorProps {
  nodeRefs: React.RefObject<(HTMLDivElement | null)[]>;
  nodeCount: number;
}
```

SVG path colour: `#FFCC00` (PostFinance yellow), stroke-width 3, no fill.

Path generation (per segment):
```
M x0 y0
C x0 (y0+y1)/2, x1 (y0+y1)/2, x1 y1
```

The SVG is `position: absolute`, `top: 0`, `left: 0`, `width: 100%`, `height: 100%`, `pointer-events: none`.

### `useMapData` hook

See Data Models section for return type. The hook exports:
```ts
function useMapData(): {
  data: MapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

Toggle mechanism — a single constant at the top of the file:
```ts
const USE_MOCK = true; // ← flip to false to use live API
```

When `USE_MOCK === true` the hook returns `mockMapData` synchronously (wrapped in a `useEffect` to simulate async). When `false` it calls `GET /game/map` via the existing `api.get` helper.

---

## Data Models

All types live in `src/app/map/types.ts` to keep them isolated from the global `src/types/index.ts`.

```ts
// src/app/map/types.ts

export type NodeStatus = "locked" | "available" | "completed";

export type AssetClass = "savings" | "bonds" | "stocks" | "etf" | "mixed";

export interface MapNode {
  node_id: string;       // e.g. "node_01"
  label: string;         // e.g. "Your First Deposit"
  subtitle: string;      // e.g. "Learn about savings"
  difficulty: number;    // 1–5
  asset_class: AssetClass;
  status: NodeStatus;
  score?: number;        // 0–100, present when status === "completed"
  icon: string;          // emoji or icon key, e.g. "💰"
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

// Hook return type
export interface UseMapDataResult {
  data: MapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Zone definition
export interface Zone {
  name: string;
  bg: string;       // Tailwind gradient classes
  emoji: string[];
}
```

### Mock Data (`src/app/map/data/mockMapData.ts`)

```ts
export const mockMapData: MapData = {
  nodes: [
    { node_id: "node_01", label: "Your first deposit",  subtitle: "Learn about savings",       difficulty: 1, asset_class: "savings", status: "completed", score: 85, icon: "💰" },
    { node_id: "node_02", label: "Inflation trap",       subtitle: "Why cash loses value",      difficulty: 2, asset_class: "savings", status: "available",            icon: "📉" },
    { node_id: "node_03", label: "Bonds intro",          subtitle: "Safe lending basics",       difficulty: 2, asset_class: "bonds",   status: "locked",               icon: "📜" },
    { node_id: "node_04", label: "Your first stock",     subtitle: "Owning a piece of a company",difficulty:3, asset_class: "stocks",  status: "locked",               icon: "📈" },
    { node_id: "node_05", label: "Market crash!",        subtitle: "Riding the volatility",     difficulty: 4, asset_class: "stocks",  status: "locked",               icon: "💥" },
    { node_id: "node_06", label: "Diversification",      subtitle: "Don't put eggs in one basket",difficulty:3,asset_class: "mixed",   status: "locked",               icon: "🧺" },
    { node_id: "node_07", label: "ETFs explained",       subtitle: "Passive investing made easy",difficulty:3, asset_class: "etf",     status: "locked",               icon: "🗂️" },
    { node_id: "node_08", label: "The long game",        subtitle: "Compound interest wins",    difficulty: 5, asset_class: "mixed",   status: "locked",               icon: "⏳" },
  ],
  player_progress: {
    completed_nodes: ["node_01"],
    current_xp: 85,
    level: 1,
  },
};
```

### API Response Shape (live mode)

`GET /game/map` returns `MapData` directly (no wrapper). The hook reads `player_id` from `localStorage` and passes it as a query param: `?player_id=<uuid>`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Zigzag margin alternates by index

*For any* array of `MapNode` objects, the CSS margin-left applied to the node at index `i` should be `~55%` when `i` is even and `~30%` when `i` is odd, regardless of node content or status.

**Validates: Requirements 1.2**

---

### Property 2: SVG connector has N-1 Bézier segments

*For any* array of N centre-point coordinates (where N ≥ 2), the SVG path string generated by the connector should contain exactly N-1 cubic Bézier (`C`) commands.

**Validates: Requirements 1.3**

---

### Property 3: Completed node renders ring and score badge

*For any* `MapNode` with `status === "completed"`, the rendered `NodeCard` should contain a green ring element and a visible score badge displaying the node's `score` value, and should have the float animation props applied.

**Validates: Requirements 2.1, 11.2**

---

### Property 4: Available node is interactive with yellow accent

*For any* `MapNode` with `status === "available"`, the rendered `NodeCard` should have an `onClick` handler, the PostFinance yellow (`#FFCC00`) accent applied, and a `whileHover={{ scale: 1.08 }}` prop.

**Validates: Requirements 2.2, 2.6**

---

### Property 5: Locked node is non-interactive and dimmed

*For any* `MapNode` with `status === "locked"`, the rendered `NodeCard` should have no `onClick` handler and should have reduced opacity (≤ 40%).

**Validates: Requirements 2.3**

---

### Property 6: Node always renders label, subtitle, and icon

*For any* `MapNode`, the rendered `NodeCard` output should contain the node's `label`, `subtitle`, and `icon` strings.

**Validates: Requirements 2.4**

---

### Property 7: At most one available node in any nodes array

*For any* `nodes` array derived from `MapData`, the count of nodes with `status === "available"` should be exactly 0 or 1 — never more than 1. When all nodes are `completed`, the count should be 0.

**Validates: Requirements 3.1, 3.2**

---

### Property 8: Non-locked node tap navigates to correct route

*For any* `MapNode` with `status` of `available` or `completed`, calling the `onTap` handler should invoke `router.push` with the path `/game/${node.node_id}`.

**Validates: Requirements 4.1, 4.3**

---

### Property 9: Locked node tap does not navigate

*For any* `MapNode` with `status === "locked"`, calling the `onTap` handler should not invoke `router.push`.

**Validates: Requirements 4.2**

---

### Property 10: XP bar label matches format "Level N — X/Y XP"

*For any* valid `level` (1–5) and `currentXP` value, the string rendered by `XPBar` should match the pattern `Level {level} — {currentXP}/{nextThreshold} XP`.

**Validates: Requirements 5.2**

---

### Property 11: XP threshold lookup is correct for all levels

*For any* level value in {1, 2, 3, 4, 5}, the next-level threshold returned by the threshold lookup function should equal the corresponding value from `[0, 150, 400, 800, 1500]`.

**Validates: Requirements 5.3**

---

### Property 12: XP fill percentage is proportional

*For any* `currentXP`, `currentThreshold`, and `nextThreshold` where `nextThreshold > currentThreshold`, the computed fill percentage should equal `(currentXP - currentThreshold) / (nextThreshold - currentThreshold) * 100`, clamped to `[0, 100]`.

**Validates: Requirements 5.4**

---

### Property 13: Zone index maps correctly from scroll progress

*For any* scroll progress value `p` in `[0, 1]`, the computed zone index should be `0` when `p < 0.25`, `1` when `0.25 ≤ p < 0.5`, `2` when `0.5 ≤ p < 0.75`, and `3` when `p ≥ 0.75`.

**Validates: Requirements 7.1**

---

### Property 14: Zone background renders correct emoji set

*For any* zone index in `{0, 1, 2, 3}`, the rendered `ZoneBackground` should contain the emoji decorations defined for that zone (Meadow: 🌸🐄🌿, Forest: 🌲🍃, Highlands: 🏔️🪨🌫️, Peak: ❄️⛄).

**Validates: Requirements 7.3, 8.4**

---

### Property 15: Staggered entry animation delay is index-proportional

*For any* `NodeCard` at index `i`, the framer-motion `transition.delay` prop should equal `i * 0.05` seconds.

**Validates: Requirements 11.1**

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `GET /game/map` returns non-2xx | `useMapData` sets `error` to the response message; map renders an error state with a retry button |
| `player_id` absent from `localStorage` | Hook generates a temporary UUID, stores it, and proceeds with the API call |
| `nodes` array is empty | `MapPage` renders an empty state ("No levels yet — check back soon") |
| All nodes `completed` | `MapPage` renders a completion banner; no node is marked available |
| Network timeout (> 10 s) | `useMapData` sets `error = "Request timed out"`; AbortController used |
| `score` missing on completed node | `NodeCard` renders the badge as "—" instead of a number |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:
- Unit tests catch concrete bugs in specific scenarios and edge cases
- Property tests verify universal correctness across all valid inputs

### Property-Based Testing

Library: **fast-check** (`npm install --save-dev fast-check`)

Each property test runs a minimum of **100 iterations** (fast-check default). Each test is tagged with a comment referencing the design property.

Tag format: `// Feature: swiss-postfinance-map, Property {N}: {property_text}`

Each correctness property above maps to exactly one property-based test:

| Property | Test file | Arbitraries used |
|---|---|---|
| P1 — Zigzag margin | `NodeCard.test.tsx` | `fc.integer({ min: 0, max: 100 })` for index |
| P2 — SVG N-1 segments | `NodeConnector.test.ts` | `fc.array(fc.record({ x: fc.float(), y: fc.float() }), { minLength: 2 })` |
| P3 — Completed node renders ring+badge | `NodeCard.test.tsx` | `fc.record({ ...completedNodeArb })` |
| P4 — Available node interactive | `NodeCard.test.tsx` | `fc.record({ ...availableNodeArb })` |
| P5 — Locked node non-interactive | `NodeCard.test.tsx` | `fc.record({ ...lockedNodeArb })` |
| P6 — Node renders label/subtitle/icon | `NodeCard.test.tsx` | `fc.record({ ...anyNodeArb })` |
| P7 — At most one available | `useMapData.test.ts` | `fc.array(nodeArb, { minLength: 1, maxLength: 8 })` |
| P8 — Non-locked tap navigates | `NodeCard.test.tsx` | `fc.oneof(availableNodeArb, completedNodeArb)` |
| P9 — Locked tap no-op | `NodeCard.test.tsx` | `fc.record({ ...lockedNodeArb })` |
| P10 — XP label format | `XPBar.test.tsx` | `fc.integer({ min: 1, max: 5 })`, `fc.integer({ min: 0, max: 1500 })` |
| P11 — Threshold lookup | `XPBar.test.ts` | `fc.integer({ min: 1, max: 5 })` |
| P12 — Fill percentage | `XPBar.test.ts` | `fc.tuple(fc.integer(), fc.integer(), fc.integer())` with constraints |
| P13 — Zone index from scroll | `ZoneBackground.test.ts` | `fc.float({ min: 0, max: 1 })` |
| P14 — Zone emoji set | `ZoneBackground.test.tsx` | `fc.integer({ min: 0, max: 3 })` |
| P15 — Stagger delay | `NodeCard.test.tsx` | `fc.integer({ min: 0, max: 7 })` |

### Unit Tests

Focus on specific examples, integration points, and edge cases not covered by property tests:

- `useMapData` returns exact mock data (Requirement 9.3)
- `useMapData` calls `GET /game/map?player_id=<uuid>` in live mode (Requirement 9.5)
- `useMapData` exposes `loading: true` during fetch, `loading: false` after (Requirement 9.6)
- `useMapData` `refetch()` triggers a new API call (Requirement 11.4)
- `MapPage` auto-scrolls to first available node on load (Requirement 6.1)
- `MapPage` stays at top when no available node (Requirement 6.2, edge case)
- `XPBar` renders "PostFinance Challenge" and 🇨🇭 (Requirement 8.3)
- `NodeCard` has `min-w-[64px] min-h-[64px]` classes (Requirement 2.5)
- Error state renders retry button when `useMapData` returns an error
- Completion banner renders when all nodes are `completed`

### Test File Locations

All test files live alongside their source files in `src/app/map/`:

```
src/app/map/
├── MapPage.test.tsx
├── components/
│   ├── NodeCard.test.tsx
│   ├── XPBar.test.tsx
│   └── ZoneBackground.test.tsx
└── hooks/
    └── useMapData.test.ts
```

Test runner: **Jest** + **React Testing Library** (already configured via Next.js).
