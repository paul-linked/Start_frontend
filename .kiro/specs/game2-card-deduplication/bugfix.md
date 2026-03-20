# Bugfix Requirements Document

## Introduction

In Game 2 (the extended long game, ages 25–65), chaos event cards are drawn each round via `drawCards()`. The current implementation only excludes the last 6 seen cards from re-selection, meaning cards encountered earlier in the game can and do repeat. Across ~9 rounds with 2–3 cards each (~20+ total card plays), this produces noticeable repetition and undermines the variety the game is designed to deliver. The fix must ensure no card is shown more than once across the full game session, while preserving all other draw behavior (age filtering, forced cards, fallback logic).

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a player has seen a card in an earlier round (beyond the last 6 resolved events) THEN the system may select that same card again in a later round
1.2 WHEN `drawCards()` is called with `recentCardIds` containing only the last 6 card IDs THEN the system treats all other previously seen cards as eligible for re-selection
1.3 WHEN the total number of resolved events exceeds 6 THEN the system ignores the full history and only deduplicates against the most recent 6

### Expected Behavior (Correct)

2.1 WHEN a player has seen a card in any previous round THEN the system SHALL NOT select that card again for the remainder of the game session
2.2 WHEN `drawCards()` is called THEN the system SHALL exclude all previously seen card IDs, not just the last 6
2.3 WHEN the eligible pool after full-history exclusion is too small to fill the required card count THEN the system SHALL fall back to cards not seen in the most recent 6 rounds, then to any eligible card, to avoid an empty draw

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a round specifies `forcedCardIds` THEN the system SHALL CONTINUE TO include those cards regardless of seen history
3.2 WHEN a card has a `minAge` or `maxAge` constraint THEN the system SHALL CONTINUE TO filter it out if the current round age is outside that range
3.3 WHEN the eligible pool is sufficient THEN the system SHALL CONTINUE TO return exactly `round.cardCount` cards
3.4 WHEN cards are drawn THEN the system SHALL CONTINUE TO use an unbiased Fisher-Yates shuffle for random selection order
3.5 WHEN `resolvedEvents` is empty (first round) THEN the system SHALL CONTINUE TO draw from the full age-eligible pool

---

## Bug Condition Pseudocode

```pascal
FUNCTION isBugCondition(state, round)
  INPUT: state of type ExtendedState, round of type ChaosRound
  OUTPUT: boolean

  allSeenIds ← state.resolvedEvents.map(e => e.cardId)
  recentIds  ← allSeenIds.slice(-6)

  // Bug fires when there exist cards seen before the last-6 window
  // that are still eligible and would be drawn
  RETURN allSeenIds.length > 6
END FUNCTION
```

```pascal
// Property: Fix Checking — no card repeats across full game
FOR ALL state WHERE isBugCondition(state, round) DO
  cards ← drawCards'(round, state.resolvedEvents.map(e => e.cardId))
  drawnIds ← cards.map(c => c.id)
  ASSERT INTERSECTION(drawnIds, state.resolvedEvents.map(e => e.cardId)) = ∅
         UNLESS card is in round.forcedCardIds
END FOR
```

```pascal
// Property: Preservation Checking — non-buggy inputs unchanged
FOR ALL state WHERE NOT isBugCondition(state, round) DO
  ASSERT drawCards(round, recentIds) = drawCards'(round, allSeenIds)
END FOR
```
