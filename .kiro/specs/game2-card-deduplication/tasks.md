# Game2 Card Deduplication — Tasks

## Tasks

- [ ] 1. Exploratory tests (unfixed code)
  - [ ] 1.1 Write a test that builds a mock state with 7+ resolved events and calls the current `drawCards` with only the last-6 slice, asserting that the 1st-seen card is eligible (demonstrates the bug)
  - [ ] 1.2 Write a full-game simulation test that runs 9 rounds × 2 cards with the current implementation and asserts no duplicate card IDs — expect this to fail on unfixed code
  - [ ] 1.3 Run the exploratory tests on unfixed code and confirm failures match the expected counterexamples from the design

- [ ] 2. Fix `drawCards` in `src/lib/gameData2.ts`
  - [ ] 2.1 Rename parameter `recentCardIds` to `seenCardIds`
  - [ ] 2.2 Build `seenSet` (all seen IDs) and `recentSet` (last-6 IDs) from `seenCardIds`
  - [ ] 2.3 Implement three-tier pool: Tier 1 `neverSeen`, Tier 2 `notRecent`, Tier 3 `anyEligible`
  - [ ] 2.4 Assemble pool by filling from Tier 1, appending Tier 2 if needed, then Tier 3 if still needed

- [ ] 3. Fix call site in `src/lib/GameContext2.tsx`
  - [ ] 3.1 In the `START_ROUND` case, replace `state.resolvedEvents.slice(-6).map((e) => e.cardId)` with `state.resolvedEvents.map((e) => e.cardId)`

- [ ] 4. Fix-checking tests (Property 1)
  - [ ] 4.1 Write a unit test: given 7+ seen card IDs, assert drawn cards contain no IDs from the seen set (excluding forced cards)
  - [ ] 4.2 Write a unit test: simulate a full 9-round game with the fixed implementation and assert no card ID appears more than once in the drawn history
  - [ ] 4.3 Write a property-based test: for random `seenCardIds` arrays of length 7–30, assert `INTERSECTION(drawnIds, seenIds) = ∅` (unless forced)

- [ ] 5. Preservation-checking tests (Property 2)
  - [ ] 5.1 Write a unit test: `resolvedEvents = []` — fixed version draws from the full age-eligible pool (same as original)
  - [ ] 5.2 Write a unit test: for `resolvedEvents.length` 1–6, fixed and original versions exclude the same IDs and produce equivalent pools
  - [ ] 5.3 Write a unit test: forced cards appear in output regardless of seen history
  - [ ] 5.4 Write a unit test: age-filtered cards never appear regardless of seen history
  - [ ] 5.5 Write a property-based test: for random states with `resolvedEvents.length <= 6`, verify pool equivalence between original and fixed implementations

- [ ] 6. Integration tests
  - [ ] 6.1 Write an integration test: simulate a full 9-round game via the reducer and assert no card ID appears more than once in `resolvedEvents`
  - [ ] 6.2 Write an integration test: simulate pool exhaustion (all age-eligible cards seen) and verify the fallback tiers return a valid non-empty draw
  - [ ] 6.3 Run all tests and confirm they pass
