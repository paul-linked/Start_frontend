# Game2 Card Deduplication Bugfix Design

## Overview

The bug is in `drawCards()` (`src/lib/gameData2.ts`) and its call site in `GameContext2.tsx`. The function only excludes the last 6 resolved event card IDs from re-selection. With ~9 rounds × 2–3 cards each (~20+ total plays), cards seen early in the game become eligible again once they fall outside that 6-card window.

The fix is two-part: (1) rename the parameter to `seenCardIds` and implement tiered fallback logic in `drawCards()`, and (2) pass the full `resolvedEvents` history instead of just the last 6 in the `START_ROUND` reducer case.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — when `resolvedEvents.length > 6`, cards outside the last-6 window are incorrectly eligible for re-selection
- **Property (P)**: The desired behavior — no previously seen card should be drawn again unless the pool is exhausted (tiered fallback)
- **Preservation**: All existing draw behavior that must remain unchanged: forced cards, age filtering, Fisher-Yates shuffle, correct card count, first-round behavior
- **drawCards**: The function in `src/lib/gameData2.ts` that selects chaos event cards for a round
- **recentCardIds / seenCardIds**: The parameter passed to `drawCards` — currently only the last 6 IDs; after the fix, the full game-session history
- **resolvedEvents**: The array in `ExtendedState` tracking every card played, used to build the seen-card history
- **tiered fallback**: The three-tier pool selection: (1) never-seen cards, (2) seen-but-not-recent cards, (3) any eligible card — used when the pool is too small

## Bug Details

### Bug Condition

The bug manifests when `resolvedEvents.length > 6`. At that point, cards seen in rounds 1–N (beyond the last-6 window) are treated as unseen and become eligible for re-selection. The `drawCards()` function receives only `recentIds = state.resolvedEvents.slice(-6).map(e => e.cardId)`, so it has no knowledge of the full history.

**Formal Specification:**
```
FUNCTION isBugCondition(state, round)
  INPUT: state of type ExtendedState, round of type ChaosRound
  OUTPUT: boolean

  allSeenIds ← state.resolvedEvents.map(e => e.cardId)
  RETURN allSeenIds.length > 6
END FUNCTION
```

### Examples

- Round 1 draws cards `["job_loss", "market_crash", "bonus"]`. Round 8 draws again — `"job_loss"` is now outside the last-6 window and is eligible again. **Expected**: `"job_loss"` should not appear in round 8.
- After 7 resolved events, the 1st card ever seen re-enters the eligible pool. **Expected**: it should remain excluded for the full game session.
- Round 1 (first round, `resolvedEvents` is empty): all age-eligible cards are in the pool. **Expected**: unchanged — full pool available.
- Pool exhaustion: all age-eligible cards have been seen. **Expected**: fall back to cards not seen in the last 6, then to any eligible card.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- When a round specifies `forcedCardIds`, those cards must be included regardless of seen history
- When a card has `minAge` or `maxAge` constraints, it must be filtered out if the current round age is outside that range
- When the eligible pool is sufficient, exactly `round.cardCount` cards must be returned
- The Fisher-Yates shuffle must remain the selection mechanism for random ordering
- When `resolvedEvents` is empty (first round), the full age-eligible pool must be available

**Scope:**
All inputs where `resolvedEvents.length <= 6` produce identical results before and after the fix, because the full-history set and the last-6 set are the same. The fix only changes behavior when `resolvedEvents.length > 6`.

## Hypothesized Root Cause

1. **Truncated history at call site**: `GameContext2.tsx` passes `state.resolvedEvents.slice(-6).map(e => e.cardId)` instead of the full history. This is the primary cause — `drawCards()` never receives the information it needs to deduplicate correctly.

2. **No tiered fallback in `drawCards()`**: The current implementation has only a two-tier pool (not-recent vs. fallback-all-eligible). With full-history exclusion, the "never seen" pool may be smaller, so a proper three-tier fallback is needed to avoid returning fewer cards than `round.cardCount`.

3. **Parameter naming misleads intent**: The parameter is named `recentCardIds`, implying a recency window rather than a full-history set. This likely contributed to the original implementation choosing a slice.

## Correctness Properties

Property 1: Bug Condition - No Card Repeats Across Full Game Session

_For any_ game state where `isBugCondition` holds (i.e., `resolvedEvents.length > 6`), the fixed `drawCards` function SHALL NOT return any card whose ID appears in `state.resolvedEvents.map(e => e.cardId)`, unless that card is in `round.forcedCardIds` and no non-seen alternative exists.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Non-Buggy State Draw Behavior Unchanged

_For any_ game state where `isBugCondition` does NOT hold (i.e., `resolvedEvents.length <= 6`), the fixed `drawCards` function SHALL produce a draw from the same eligible pool as the original function, preserving age filtering, forced cards, shuffle behavior, and card count.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File**: `src/lib/gameData2.ts`

**Function**: `drawCards`

**Specific Changes**:
1. **Rename parameter**: `recentCardIds` → `seenCardIds` to reflect full-history semantics
2. **Build two exclusion sets**: `seenSet` (all seen IDs) and `recentSet` (last-6 IDs for fallback tier)
3. **Three-tier pool selection**:
   - Tier 1 (`neverSeen`): eligible cards not in `seenSet` and not forced
   - Tier 2 (`notRecent`): eligible cards in `seenSet` but not in `recentSet` and not forced
   - Tier 3 (`anyEligible`): all eligible cards not forced (last resort)
4. **Pool assembly**: fill from Tier 1, then append Tier 2 if needed, then Tier 3 if still needed

---

**File**: `src/lib/GameContext2.tsx`

**Location**: `START_ROUND` case in `extendedReducer`

**Specific Changes**:
1. **Replace** `state.resolvedEvents.slice(-6).map((e) => e.cardId)` with `state.resolvedEvents.map((e) => e.cardId)` to pass the full history

## Testing Strategy

### Validation Approach

Two-phase: first run exploratory tests on the unfixed code to confirm the bug and root cause, then verify the fix with fix-checking and preservation-checking tests.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples demonstrating the bug on unfixed code. Confirm that cards outside the last-6 window are re-selected.

**Test Plan**: Build a mock `ExtendedState` with more than 6 resolved events containing specific card IDs. Call the current `drawCards()` with only the last-6 slice and assert that earlier-seen cards appear in the result. Run on unfixed code to observe the failure.

**Test Cases**:
1. **7-event history test**: Resolve 7 events with known card IDs; call `drawCards` with only the last 6; assert the 1st card is eligible and appears in drawn results (will pass on unfixed code, demonstrating the bug)
2. **Full-game simulation**: Simulate 9 rounds × 2 cards; collect all drawn IDs; assert no duplicates (will fail on unfixed code)
3. **Boundary test**: Exactly 6 resolved events — assert behavior is identical before and after fix (should pass on both)

**Expected Counterexamples**:
- Cards from early rounds reappear in later rounds when the history exceeds 6 events
- The 7th-oldest card is always eligible for re-selection on unfixed code

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces no repeated cards.

**Pseudocode:**
```
FOR ALL state WHERE isBugCondition(state, round) DO
  allSeenIds ← state.resolvedEvents.map(e => e.cardId)
  cards ← drawCards_fixed(round, allSeenIds)
  drawnIds ← cards.map(c => c.id)
  ASSERT INTERSECTION(drawnIds, allSeenIds) = ∅
         UNLESS card.id IN round.forcedCardIds
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (`resolvedEvents.length <= 6`), the fixed function produces draws from the same pool as the original.

**Pseudocode:**
```
FOR ALL state WHERE NOT isBugCondition(state, round) DO
  recentIds ← state.resolvedEvents.map(e => e.cardId)   // same as allSeenIds when length <= 6
  ASSERT drawCards_original(round, recentIds) and drawCards_fixed(round, recentIds)
         draw from identical eligible pools
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many random game states and verifies pool equivalence across the full input domain.

**Test Cases**:
1. **Empty history preservation**: `resolvedEvents = []` — both versions draw from the full age-eligible pool
2. **1–6 event history preservation**: For lengths 1–6, both versions exclude the same IDs and produce equivalent pools
3. **Forced card preservation**: Forced cards appear in output regardless of seen history, before and after fix
4. **Age filter preservation**: Cards outside `minAge`/`maxAge` are excluded in both versions

### Unit Tests

- Test `drawCards` with 0, 1, 6, 7, and 20 seen card IDs and assert no repeats in the drawn result
- Test that forced cards always appear even when they are in the seen set
- Test that age-filtered cards never appear regardless of seen history
- Test that exactly `round.cardCount` cards are returned when the pool is large enough
- Test tiered fallback: when all cards are seen, fall back to not-recent, then to any eligible

### Property-Based Tests

- Generate random `seenCardIds` arrays of length 0–30 and verify drawn cards never overlap with seen IDs (unless forced or pool exhausted)
- Generate random allocations of seen vs. unseen cards and verify the three-tier priority order is respected
- Generate random game states with `resolvedEvents.length <= 6` and verify pool equivalence between original and fixed implementations

### Integration Tests

- Simulate a full 9-round game and assert no card ID appears more than once in `resolvedEvents` (excluding forced cards)
- Simulate pool exhaustion (all age-eligible cards seen) and verify the fallback tiers produce a valid non-empty draw
- Verify the `START_ROUND` reducer case passes the full history to `drawCards` and the resulting `cardQueue` contains no previously seen cards
