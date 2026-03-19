# Implementation Plan: swiss-postfinance-map

## Overview

Build a Duolingo-style vertical level map at `/map` using TypeScript, Next.js App Router, Tailwind CSS, and framer-motion. All files live in `src/app/map/`. The feature ships with mock data and a `USE_MOCK` toggle so the `/map` route is fully functional as a standalone site with no backend dependency.

## Tasks

- [x] 1. Define TypeScript types
  - Create `src/app/map/types.ts` with `NodeStatus`, `AssetClass`, `MapNode`, `PlayerProgress`, `MapData`, `UseMapDataResult`, and `Zone` interfaces exactly as specified in the design
  - _Requirements: 9.2_

- [x] 2. Create mock data
  - Create `src/app/map/data/mockMapData.ts` exporting `mockMapData: MapData` with all 8 sprint nodes (node_01 completed/score 85, node_02 available, node_03–08 locked) and `player_progress` (current_xp: 85, level: 1)
  - _Requirements: 9.3_

- [x] 3. Implement `useMapData` hook
  - [x] 3.1 Create `src/app/map/hooks/useMapData.ts` with `const USE_MOCK = true` toggle at the top
    - When `USE_MOCK === true`: return `mockMapData` via `useEffect` (simulated async), exposing `{ data, loading, error, refetch }`
    - When `USE_MOCK === false`: fetch `GET ${NEXT_PUBLIC_API_URL}/game/map?player_id=<uuid>` using an `AbortController` with a 10 s timeout; read/generate `player_id` from `localStorage`; surface `error` from response `message` field on non-2xx
    - Expose `loading: true` during fetch, `loading: false` after resolution
    - `refetch()` increments an internal counter to re-trigger the `useEffect`
    - _Requirements: 9.1, 9.4, 9.5, 9.6_

  - [ ]* 3.2 Write unit tests for `useMapData` hook
    - Test: returns exact mock data when `USE_MOCK = true` (Requirement 9.3)
    - Test: calls `GET /game/map?player_id=<uuid>` in live mode (Requirement 9.5)
    - Test: `loading` is `true` during fetch, `false` after (Requirement 9.6)
    - Test: `refetch()` triggers a new API call (Requirement 11.4)
    - Test: sets `error = "Request timed out"` on timeout
    - _Requirements: 9.3, 9.5, 9.6, 11.4_

  - [ ]* 3.3 Write property test for `useMapData` — at most one available node
    - **Property 7: At most one available node in any nodes array**
    - **Validates: Requirements 3.1, 3.2**
    - File: `src/app/map/hooks/useMapData.test.ts`
    - Arbitrary: `fc.array(nodeArb, { minLength: 1, maxLength: 8 })`

- [x] 4. Implement `ZoneBackground` component
  - [x] 4.1 Create `src/app/map/components/ZoneBackground.tsx`
    - Props: `{ zoneIndex: 0 | 1 | 2 | 3 }`
    - `position: fixed`, `z-index: -1`, full-screen background layer
    - Four zone definitions: Alpine Meadow (green-300→green-500, 🌸🐄🌿), Pine Forest (green-700→green-900, 🌲🍃), Rocky Highlands (gray-400→gray-600, 🏔️🪨🌫️), Mountain Peak (blue-100→white, ❄️🏔️⛄)
    - Background gradient transitions with `transition: background 800ms ease-in-out`
    - Decorative emojis absolutely positioned, `pointer-events: none`, distributed at fixed percentage positions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.4_

  - [ ]* 4.2 Write property test for `ZoneBackground` — zone index maps from scroll progress
    - **Property 13: Zone index maps correctly from scroll progress**
    - **Validates: Requirements 7.1**
    - File: `src/app/map/components/ZoneBackground.test.ts`
    - Arbitrary: `fc.float({ min: 0, max: 1 })`; assert `zoneIndex === 0` when `p < 0.25`, `1` when `0.25 ≤ p < 0.5`, `2` when `0.5 ≤ p < 0.75`, `3` when `p ≥ 0.75`

  - [ ]* 4.3 Write property test for `ZoneBackground` — correct emoji set per zone
    - **Property 14: Zone background renders correct emoji set**
    - **Validates: Requirements 7.3, 8.4**
    - File: `src/app/map/components/ZoneBackground.test.tsx`
    - Arbitrary: `fc.integer({ min: 0, max: 3 })`

- [x] 5. Implement `XPBar` component
  - [x] 5.1 Create `src/app/map/components/XPBar.tsx`
    - Props: `{ level: number; currentXP: number }`
    - Sticky at top of viewport (`position: sticky`, `top: 0`, high z-index)
    - Hardcoded `XP_THRESHOLDS = [0, 150, 400, 800, 1500]`
    - Left: "🇨🇭 PostFinance Challenge"; Centre: "Level N — X/Y XP"; Right: filled progress bar in `#FFCC00`
    - Fill percentage: `(currentXP - currentThreshold) / (nextThreshold - currentThreshold) * 100`, clamped to `[0, 100]`
    - PostFinance black (`#1A1A1A`) for text
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3_

  - [ ]* 5.2 Write property test for `XPBar` — label format
    - **Property 10: XP bar label matches format "Level N — X/Y XP"**
    - **Validates: Requirements 5.2**
    - File: `src/app/map/components/XPBar.test.tsx`
    - Arbitraries: `fc.integer({ min: 1, max: 5 })`, `fc.integer({ min: 0, max: 1500 })`

  - [ ]* 5.3 Write property test for `XPBar` — threshold lookup
    - **Property 11: XP threshold lookup is correct for all levels**
    - **Validates: Requirements 5.3**
    - File: `src/app/map/components/XPBar.test.tsx`
    - Arbitrary: `fc.integer({ min: 1, max: 5 })`

  - [ ]* 5.4 Write property test for `XPBar` — fill percentage
    - **Property 12: XP fill percentage is proportional**
    - **Validates: Requirements 5.4**
    - File: `src/app/map/components/XPBar.test.tsx`
    - Arbitrary: `fc.tuple(fc.integer(), fc.integer(), fc.integer())` with `nextThreshold > currentThreshold`

  - [ ]* 5.5 Write unit tests for `XPBar`
    - Test: renders "🇨🇭 PostFinance Challenge" (Requirement 8.3)
    - _Requirements: 8.3_

- [x] 6. Implement `NodeConnector` component
  - [x] 6.1 Create `src/app/map/components/NodeConnector.tsx`
    - Props: `{ nodeRefs: React.RefObject<(HTMLDivElement | null)[]>; nodeCount: number }`
    - `position: absolute`, `top: 0`, `left: 0`, `width: 100%`, `height: 100%`, `pointer-events: none`
    - `useEffect` reads `getBoundingClientRect()` on each ref and builds a single SVG `<path>` with N-1 cubic Bézier segments: `M x0 y0 C x0 (y0+y1)/2, x1 (y0+y1)/2, x1 y1` per segment
    - Stroke: `#FFCC00`, stroke-width 3, no fill
    - Re-runs on window resize via `ResizeObserver` or resize event listener
    - _Requirements: 1.3, 8.1_

  - [ ]* 6.2 Write property test for `NodeConnector` — N-1 Bézier segments
    - **Property 2: SVG connector has N-1 Bézier segments**
    - **Validates: Requirements 1.3**
    - File: `src/app/map/components/NodeConnector.test.ts`
    - Arbitrary: `fc.array(fc.record({ x: fc.float(), y: fc.float() }), { minLength: 2 })`; assert path string contains exactly N-1 `C` commands

- [x] 7. Implement `NodeCard` component
  - [x] 7.1 Create `src/app/map/components/NodeCard.tsx`
    - Props: `{ node: MapNode; index: number; onTap: (nodeId: string) => void }`
    - Zigzag layout: `index % 2 === 0` → `marginLeft: "55%"`, `index % 2 === 1` → `marginLeft: "30%"` (inline style or Tailwind arbitrary)
    - Minimum size: `min-w-[64px] min-h-[64px]`
    - `completed`: green ring, score badge (shows `score` or "—" if missing), float animation `animate={{ y: [0, -4, 0] }}` with `transition={{ duration: 3, repeat: Infinity }}`
    - `available`: `#FFCC00` ring/glow, `onClick` → `onTap(node.node_id)`, `whileHover={{ scale: 1.08 }}` with yellow drop shadow
    - `locked`: grey ring, opacity 40%, no `onClick`
    - All states: display `node.label`, `node.subtitle`, `node.icon`
    - Entry animation: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with `transition={{ delay: index * 0.05 }}`
    - Use `framer-motion` `motion.div` for all animations
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 8.1, 8.2, 11.1, 11.2, 11.3_

  - [ ]* 7.2 Write property tests for `NodeCard`
    - **Property 1: Zigzag margin alternates by index** — Arbitrary: `fc.integer({ min: 0, max: 100 })`; **Validates: Requirements 1.2**
    - **Property 3: Completed node renders ring and score badge** — Arbitrary: `fc.record({ ...completedNodeArb })`; **Validates: Requirements 2.1, 11.2**
    - **Property 4: Available node is interactive with yellow accent** — Arbitrary: `fc.record({ ...availableNodeArb })`; **Validates: Requirements 2.2, 2.6**
    - **Property 5: Locked node is non-interactive and dimmed** — Arbitrary: `fc.record({ ...lockedNodeArb })`; **Validates: Requirements 2.3**
    - **Property 6: Node always renders label, subtitle, and icon** — Arbitrary: `fc.record({ ...anyNodeArb })`; **Validates: Requirements 2.4**
    - **Property 8: Non-locked node tap navigates to correct route** — Arbitrary: `fc.oneof(availableNodeArb, completedNodeArb)`; **Validates: Requirements 4.1, 4.3**
    - **Property 9: Locked node tap does not navigate** — Arbitrary: `fc.record({ ...lockedNodeArb })`; **Validates: Requirements 4.2**
    - **Property 15: Staggered entry animation delay is index-proportional** — Arbitrary: `fc.integer({ min: 0, max: 7 })`; **Validates: Requirements 11.1**
    - File: `src/app/map/components/NodeCard.test.tsx`

  - [ ]* 7.3 Write unit tests for `NodeCard`
    - Test: has `min-w-[64px] min-h-[64px]` classes (Requirement 2.5)
    - _Requirements: 2.5_

- [x] 8. Checkpoint — verify components compile and render in isolation
  - Ensure all components have no TypeScript errors, ask the user if questions arise.

- [x] 9. Implement `MapPage` orchestrator
  - [x] 9.1 Create `src/app/map/MapPage.tsx`
    - Call `useMapData()`; render loading spinner while `loading`, error state with retry button when `error` is set, empty state ("No levels yet — check back soon") when `nodes` is empty, completion banner when all nodes are `completed`
    - Outer container: `ref={scrollRef}`, `overflow-y: auto`, `height: 100dvh`, `position: relative`
    - Track scroll: `useEffect` attaches a `scroll` listener on `scrollRef.current`, throttled with `requestAnimationFrame`; computes `scrollTop / (scrollHeight - clientHeight)` → `[0, 1]`; maps to `zoneIndex` (0–3) via `Math.min(3, Math.floor(progress * 4))`; stores in `useState`
    - Auto-scroll: after data loads, find first node with `status === "available"` by index, call `nodeRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })`; if none found, stay at top
    - Render order: `<ZoneBackground zoneIndex={zoneIndex} />`, sticky `<XPBar />`, scrollable node list with `<NodeConnector nodeRefs={nodeRefs} nodeCount={nodes.length} />` as absolute overlay, `<NodeCard />` per node with `ref` callback into `nodeRefs`
    - Navigation: pass `onTap={(id) => router.push(\`/game/\${id}\`)}` to each `NodeCard`
    - PostFinance header: "🇨🇭 PostFinance Challenge" text above the node list (also satisfies Requirement 8.3 at page level)
    - _Requirements: 1.1, 1.4, 1.5, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 6.1, 6.2, 7.4, 8.3, 11.4_

  - [ ]* 9.2 Write unit tests for `MapPage`
    - Test: auto-scrolls to first available node on load (Requirement 6.1)
    - Test: stays at top when no available node (Requirement 6.2)
    - Test: renders error state with retry button when `useMapData` returns an error
    - Test: renders completion banner when all nodes are `completed`
    - _Requirements: 6.1, 6.2_

- [x] 10. Wire up `page.tsx`
  - Create `src/app/map/page.tsx` as a thin Next.js route file that imports and renders `<MapPage />`
  - Ensure no logic lives in `page.tsx` — all orchestration is in `MapPage.tsx`
  - _Requirements: 1.4_

- [x] 11. Verify standalone accessibility (no backend dependency)
  - Confirm `USE_MOCK = true` is the default in `useMapData.ts` so `/map` renders fully with mock data and zero network requests
  - Confirm no component imports from outside `src/app/map/` except from `next`, `react`, `framer-motion`, `clsx`, and `tailwind-merge`
  - Confirm `NEXT_PUBLIC_API_URL` is not required at build time when `USE_MOCK = true`
  - Verify `src/app/map/BACKEND_INTEGRATION.md` exists and documents all three endpoints, the `USE_MOCK` toggle, and the `NEXT_PUBLIC_API_URL` env var — update if any detail is missing
  - _Requirements: 9.4, 10.1, 10.2, 10.3, 10.4_

- [ ] 12. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `USE_MOCK = true` is the default; flipping it to `false` is the only change needed to go live
- Property tests require `fast-check` (`npm install --save-dev fast-check`)
- All files must live in `src/app/map/` — no modifications to files outside that directory
- The `/map` route is fully deployable as a standalone site with mock data
