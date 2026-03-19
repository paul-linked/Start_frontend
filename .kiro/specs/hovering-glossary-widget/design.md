# Design Document: Hovering Glossary Widget

## Overview

The hovering glossary widget is a React-based UI component that provides contextual definitions for financial terms throughout the game. It detects glossary terms in text content, marks them visually, and displays definitions via hover (desktop) or tap (mobile) interactions.

The system consists of three main parts:
1. **Glossary data store** - centralized term definitions in TypeScript
2. **Term detection and marking** - React component that wraps text and identifies terms
3. **Tooltip display** - floating popup with smart positioning

The widget integrates seamlessly with the existing warm, paper-like aesthetic using CSS variables from the theme system. It's designed to be non-intrusive, accessible, and performant across all game views (map, reigns cards, allocation sliders, event choices).

## Architecture

### Component Structure

```
src/components/glossary/
├── GlossaryProvider.tsx      # Context provider for glossary data
├── GlossaryText.tsx           # Main wrapper component for text with terms
├── GlossaryTooltip.tsx        # Floating tooltip display
├── GlossaryTerm.tsx           # Individual term marker component
├── useGlossary.ts             # Hook for accessing glossary data
└── glossaryData.ts            # Term definitions data store
```

### Data Flow

1. `GlossaryProvider` loads term definitions at app startup and provides them via React Context
2. `GlossaryText` component receives text content as children
3. Text is parsed to detect glossary terms (case-insensitive, multi-word matching)
4. Detected terms are wrapped in `GlossaryTerm` components with visual markers
5. User interaction (hover/tap) triggers `GlossaryTooltip` to display
6. Tooltip positions itself intelligently based on available viewport space

### Integration Points

- **Theme System**: Uses CSS variables from `globals.css` for colors, fonts, shadows
- **Game Components**: Wraps text in `ReignsView`, `EventView`, `AllocationView`, map descriptions
- **Accessibility**: Keyboard navigation, ARIA attributes, screen reader support
- **Mobile**: Touch event handling, tap-to-dismiss, single tooltip constraint

## Components and Interfaces

### GlossaryProvider

Context provider that loads and distributes glossary data.

```typescript
interface GlossaryProviderProps {
  children: React.ReactNode;
}

interface GlossaryContextValue {
  terms: Map<string, GlossaryEntry>;
  getDefinition: (term: string) => GlossaryEntry | undefined;
}
```

### GlossaryText

Main component for wrapping text content with glossary term detection.

```typescript
interface GlossaryTextProps {
  children: string;
  className?: string;
}

// Usage:
<GlossaryText>
  You just received $1,000 in your savings account. Interest will help it grow.
</GlossaryText>
```

Parses children text, identifies terms, returns JSX with `GlossaryTerm` components for matches and plain text for non-matches.

### GlossaryTerm

Individual term marker with interaction handling.

```typescript
interface GlossaryTermProps {
  term: string;
  definition: string;
  category?: string;
  children: string;
}
```

Renders the term text with visual styling (dotted underline). Handles hover/tap events to trigger tooltip display. Manages keyboard focus and ARIA attributes.

### GlossaryTooltip

Floating tooltip with smart positioning.

```typescript
interface GlossaryTooltipProps {
  term: string;
  definition: string;
  category?: string;
  anchorElement: HTMLElement;
  onClose: () => void;
  isMobile: boolean;
}
```

Calculates optimal position (above/below, left/right adjustments). Renders with theme-consistent styling. Includes close button for mobile. Handles click-outside and escape key dismissal.

### useGlossary Hook

Custom hook for accessing glossary data.

```typescript
function useGlossary() {
  const context = useContext(GlossaryContext);
  if (!context) throw new Error("useGlossary must be used within GlossaryProvider");
  return context;
}
```

## Data Models

### GlossaryEntry

```typescript
interface GlossaryEntry {
  term: string;              // Display term (e.g., "Savings Account")
  definition: string;        // Beginner-friendly explanation (<100 words)
  category?: string;         // Optional grouping (e.g., "Banking", "Investing")
  aliases?: string[];        // Alternative forms (e.g., ["savings", "savings acct"])
}
```

### GlossaryData

```typescript
// glossaryData.ts
export const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    term: "Savings Account",
    definition: "A bank account that holds your money safely and pays you interest over time. You can withdraw money when needed, but it's meant for saving rather than daily spending.",
    category: "Banking",
    aliases: ["savings", "savings acct"],
  },
  {
    term: "Checking Account",
    definition: "A bank account for everyday transactions like paying bills and buying things. Usually earns little or no interest, but gives you easy access to your money.",
    category: "Banking",
    aliases: ["checking"],
  },
  {
    term: "Interest",
    definition: "Money that grows your savings over time, or money you pay to borrow. When you save, the bank pays you interest. When you borrow, you pay interest to the lender.",
    category: "Banking",
  },
  {
    term: "Investing",
    definition: "Putting money into assets like stocks or bonds with the goal of growing your wealth over time. Involves more risk than saving, but offers higher potential returns.",
    category: "Investing",
    aliases: ["invest", "investment"],
  },
  {
    term: "Compound Interest",
    definition: "Interest earned on both your original money and the interest it has already earned. This creates a snowball effect that helps your money grow faster over time.",
    category: "Banking",
  },
  {
    term: "Emergency Fund",
    definition: "Money set aside for unexpected expenses like car repairs or medical bills. Financial experts recommend saving 3-6 months of living expenses.",
    category: "Banking",
  },
  {
    term: "Budget",
    definition: "A plan for how you'll spend and save your money each month. Helps you track income and expenses so you can reach your financial goals.",
    category: "Personal Finance",
  },
  {
    term: "Debt",
    definition: "Money you owe to someone else. Common types include credit card debt, student loans, and mortgages. Paying off high-interest debt should be a priority.",
    category: "Personal Finance",
  },
  {
    term: "Credit",
    definition: "Your ability to borrow money based on trust that you'll pay it back. Good credit makes it easier and cheaper to borrow for big purchases like homes or cars.",
    category: "Personal Finance",
  },
  {
    term: "Asset",
    definition: "Something you own that has value, like cash, investments, property, or a car. Building assets is key to growing wealth over time.",
    category: "Investing",
  },
  {
    term: "Stock",
    definition: "A share of ownership in a company. When you buy stock, you own a small piece of that business and can profit if the company grows.",
    category: "Investing",
    aliases: ["stocks", "shares"],
  },
  {
    term: "Bond",
    definition: "A loan you give to a company or government that pays you interest over time. Generally safer than stocks but with lower potential returns.",
    category: "Investing",
    aliases: ["bonds"],
  },
  {
    term: "Diversification",
    definition: "Spreading your investments across different types of assets to reduce risk. The idea is 'don't put all your eggs in one basket.'",
    category: "Investing",
    aliases: ["diversify", "diversified"],
  },
  {
    term: "Risk",
    definition: "The chance that an investment will lose value. Higher-risk investments can offer bigger rewards but also bigger losses.",
    category: "Investing",
  },
  {
    term: "Return",
    definition: "The profit or loss you make on an investment. Usually expressed as a percentage of what you originally invested.",
    category: "Investing",
    aliases: ["returns"],
  },
];
```

### Term Matching Algorithm

The term detector uses a greedy longest-match algorithm:

1. Convert input text to lowercase for matching (preserve original for display)
2. Build a trie or sorted list of terms (longest first) for efficient matching
3. Scan text left-to-right:
   - Try to match longest possible term at current position
   - If match found, create `GlossaryTerm` component and advance position
   - If no match, add character to plain text buffer and advance
4. Return array of React elements (mix of `GlossaryTerm` and plain text)

Multi-word terms are matched before single-word terms to avoid partial matches (e.g., "compound interest" matched before "interest").

### Positioning Algorithm

Tooltip positioning follows this priority:

1. **Vertical**: Above term (default) → Below term (if insufficient space above)
2. **Horizontal**: Centered on term → Shifted left/right to stay in viewport
3. **Constraints**: Minimum 8px margin from all viewport edges

```typescript
interface TooltipPosition {
  top?: number;
  bottom?: number;
  left: number;
  maxWidth: number;
}

function calculatePosition(
  anchorRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  isMobile: boolean
): TooltipPosition {
  const margin = 8;
  const maxWidth = isMobile ? 320 : 360;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Vertical positioning
  const spaceAbove = anchorRect.top;
  const spaceBelow = viewportHeight - anchorRect.bottom;
  const showAbove = spaceAbove > tooltipHeight + margin || spaceAbove > spaceBelow;
  
  // Horizontal positioning
  let left = anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2;
  left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin));
  
  return {
    [showAbove ? 'bottom' : 'top']: showAbove 
      ? viewportHeight - anchorRect.top + margin 
      : anchorRect.bottom + margin,
    left,
    maxWidth,
  };
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Case-insensitive term detection

*For any* glossary term and any text containing that term in any combination of uppercase/lowercase letters, the term detector should identify and mark the term correctly.

**Validates: Requirements 1.3**

### Property 2: Multi-word term detection

*For any* multi-word glossary term (e.g., "savings account", "compound interest") and any text containing that term, the term detector should identify the complete phrase as a single term.

**Validates: Requirements 1.4**

### Property 3: All terms marked with correct styling

*For any* text containing multiple glossary terms, the term detector should mark each occurrence independently with the appropriate visual styling (CSS classes or inline styles from the theme system).

**Validates: Requirements 2.2, 2.5**

### Property 4: Tooltip displays correct definition

*For any* glossary term that is activated (hovered or tapped), the displayed tooltip should contain the exact definition associated with that term in the glossary data.

**Validates: Requirements 3.2**

### Property 5: Single tooltip constraint

*For any* sequence of term activations, at most one tooltip should be visible at any given time - opening a new tooltip should automatically close any previously open tooltip.

**Validates: Requirements 4.3**

### Property 6: Theme color consistency

*For any* rendered tooltip, all color properties (background, border, text) should use CSS variables from the theme system (--game-bg, --game-border, --game-text, --game-primary, --game-surface).

**Validates: Requirements 5.1**

### Property 7: Viewport margin constraint

*For any* tooltip position calculation, the resulting position should maintain at least 8px margin from all viewport edges (top, bottom, left, right).

**Validates: Requirements 6.4**

### Property 8: Dynamic content re-detection

*For any* GlossaryText component, when the text content changes, the component should re-process the new text and correctly identify and mark all terms in the updated content.

**Validates: Requirements 9.4**

### Property 9: Definition word count limit

*For all* glossary entries, the definition text should contain 100 words or fewer to ensure beginner-friendly, concise explanations.

**Validates: Requirements 10.4**

## Error Handling

### Invalid Term References

If a `GlossaryTerm` component is rendered with a term that doesn't exist in the glossary data:
- Log a warning to the console in development mode
- Render the term as plain text without marking or tooltip functionality
- Do not crash or throw errors that would break the UI

### Positioning Edge Cases

If tooltip positioning calculation fails (e.g., anchor element not in DOM):
- Fall back to center of viewport
- Log error in development mode
- Ensure tooltip is still dismissible

### Missing Context

If `useGlossary` hook is called outside of `GlossaryProvider`:
- Throw descriptive error: "useGlossary must be used within GlossaryProvider"
- This is a developer error that should be caught during development

### Empty or Invalid Text

If `GlossaryText` receives empty string or non-string children:
- Return empty fragment or null
- Log warning in development mode for non-string children

### Tooltip Overflow

If tooltip content exceeds maximum width:
- Apply CSS `overflow-wrap: break-word` to prevent horizontal overflow
- Allow vertical scrolling if definition is exceptionally long (though word limit should prevent this)

## Testing Strategy

### Unit Testing

Unit tests will focus on specific examples, edge cases, and component integration:

**Term Detection Logic:**
- Test exact term matches in various positions (start, middle, end of text)
- Test case variations (lowercase, UPPERCASE, MixedCase)
- Test multi-word terms with punctuation nearby
- Test overlapping terms (e.g., "interest" vs "compound interest")
- Test terms with special characters or numbers
- Test empty text and text with no terms

**Component Rendering:**
- Test GlossaryText renders correct number of term markers
- Test GlossaryTerm applies correct CSS classes
- Test GlossaryTooltip renders with correct content
- Test tooltip close button appears on mobile
- Test ARIA attributes are present

**Interaction Handling:**
- Test hover triggers tooltip on desktop
- Test tap triggers tooltip on mobile
- Test click outside dismisses tooltip
- Test Escape key dismisses tooltip
- Test keyboard focus triggers tooltip
- Test opening second tooltip closes first

**Positioning Logic:**
- Test tooltip positions above term when space available
- Test tooltip positions below term when insufficient space above
- Test horizontal adjustment near viewport edges
- Test 8px margin constraint enforcement
- Test max-width constraints (320px mobile, 360px desktop)

**Theme Integration:**
- Test tooltip uses correct CSS variables
- Test term markers use correct underline color
- Test border radius is in expected range
- Test shadow is applied

**Data Validation:**
- Test all required terms exist in glossary
- Test all definitions are under 100 words
- Test term lookup is case-insensitive

### Property-Based Testing

Property-based tests will verify universal behaviors across randomized inputs using **fast-check** (JavaScript property testing library). Each test will run a minimum of 100 iterations.

**Library Choice:** fast-check is the standard property-based testing library for JavaScript/TypeScript, providing generators for strings, numbers, arrays, and custom types.

**Property Test 1: Case-insensitive term detection**
- Generate: random glossary term, random casing variations
- Test: term is detected regardless of case
- Tag: **Feature: hovering-glossary-widget, Property 1: For any glossary term and any text containing that term in any combination of uppercase/lowercase letters, the term detector should identify and mark the term correctly**

**Property Test 2: Multi-word term detection**
- Generate: random multi-word terms, random surrounding text
- Test: complete phrase is matched as single term
- Tag: **Feature: hovering-glossary-widget, Property 2: For any multi-word glossary term and any text containing that term, the term detector should identify the complete phrase as a single term**

**Property Test 3: All terms marked with styling**
- Generate: random text with multiple embedded glossary terms
- Test: each term occurrence has correct CSS classes/styles
- Tag: **Feature: hovering-glossary-widget, Property 3: For any text containing multiple glossary terms, the term detector should mark each occurrence independently with the appropriate visual styling**

**Property Test 4: Tooltip displays correct definition**
- Generate: random glossary term selection
- Test: activated tooltip contains exact definition from glossary data
- Tag: **Feature: hovering-glossary-widget, Property 4: For any glossary term that is activated, the displayed tooltip should contain the exact definition associated with that term**

**Property Test 5: Single tooltip constraint**
- Generate: random sequence of term activations
- Test: only one tooltip visible after each activation
- Tag: **Feature: hovering-glossary-widget, Property 5: For any sequence of term activations, at most one tooltip should be visible at any given time**

**Property Test 6: Theme color consistency**
- Generate: random term activations
- Test: all rendered tooltips use theme CSS variables
- Tag: **Feature: hovering-glossary-widget, Property 6: For any rendered tooltip, all color properties should use CSS variables from the theme system**

**Property Test 7: Viewport margin constraint**
- Generate: random anchor positions and viewport sizes
- Test: calculated tooltip position maintains 8px margin from all edges
- Tag: **Feature: hovering-glossary-widget, Property 7: For any tooltip position calculation, the resulting position should maintain at least 8px margin from all viewport edges**

**Property Test 8: Dynamic content re-detection**
- Generate: random initial text, random updated text
- Test: component correctly identifies terms in both versions
- Tag: **Feature: hovering-glossary-widget, Property 8: For any GlossaryText component, when the text content changes, the component should re-process and correctly mark all terms**

**Property Test 9: Definition word count limit**
- Generate: all glossary entries
- Test: each definition has ≤100 words
- Tag: **Feature: hovering-glossary-widget, Property 9: For all glossary entries, the definition text should contain 100 words or fewer**

### Integration Testing

Integration tests will verify the glossary widget works correctly within actual game components:

- Test GlossaryText integration in ReignsView card prompts
- Test GlossaryText integration in EventView descriptions
- Test GlossaryText integration in AllocationView account descriptions
- Test GlossaryText integration in map node descriptions
- Test tooltip doesn't interfere with game interactions (button clicks, swipes)
- Test tooltip visibility during animations and transitions
- Test multiple GlossaryText components on same page

### Accessibility Testing

Manual testing with assistive technologies:

- Test with screen reader (NVDA/JAWS on Windows, VoiceOver on macOS/iOS)
- Test keyboard-only navigation (Tab, Shift+Tab, Escape)
- Test with browser zoom at 200%
- Test with high contrast mode
- Verify ARIA attributes are correctly announced

### Performance Testing

Benchmark tests to ensure performance requirements:

- Measure term detection time for text with 50+ terms
- Measure tooltip render time from trigger to display
- Measure impact on initial page load time
- Test with 100+ glossary terms in data store
- Profile React re-renders when text content changes

### Visual Regression Testing

Capture screenshots to verify visual consistency:

- Tooltip appearance on light backgrounds
- Tooltip appearance near viewport edges
- Term marker styling in different text contexts
- Mobile vs desktop tooltip differences
- Tooltip with long definitions
- Multiple terms in single sentence

