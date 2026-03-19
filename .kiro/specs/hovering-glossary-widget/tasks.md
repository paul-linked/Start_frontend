# Implementation Plan: Hovering Glossary Widget

## Overview

This plan implements a React-based glossary widget that provides contextual definitions for financial terms throughout the game. The implementation follows a bottom-up approach: data layer first, then core components, then integration, with property-based tests using fast-check to validate correctness properties.

## Tasks

- [x] 1. Set up glossary infrastructure and data layer
  - [x] 1.1 Create glossary directory structure and data store
    - Create `src/components/glossary/` directory
    - Create `glossaryData.ts` with `GlossaryEntry` interface and `GLOSSARY_TERMS` array containing all 15 financial terms from design
    - Validate all definitions are under 100 words
    - _Requirements: 1.1, 1.2, 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 1.2 Write property test for definition word count limit
    - **Property 9: For all glossary entries, the definition text should contain 100 words or fewer**
    - **Validates: Requirements 10.4**
    - Use fast-check to verify all definitions in GLOSSARY_TERMS meet word count constraint
    - _Requirements: 10.4_

- [x] 2. Implement GlossaryProvider and context
  - [x] 2.1 Create GlossaryProvider component with React Context
    - Implement `GlossaryContext` with `terms` Map and `getDefinition` function
    - Implement `GlossaryProvider` component that loads terms into context
    - Support case-insensitive term lookup using lowercase keys
    - _Requirements: 1.1, 1.3, 9.1_
  
  - [x] 2.2 Create useGlossary custom hook
    - Implement hook that accesses GlossaryContext
    - Throw descriptive error if used outside provider
    - _Requirements: 9.1, 9.5_
  
  - [ ]* 2.3 Write unit tests for GlossaryProvider and useGlossary
    - Test context provides correct term data
    - Test case-insensitive lookup
    - Test error thrown when hook used outside provider
    - _Requirements: 1.3_

- [x] 3. Implement term detection algorithm
  - [x] 3.1 Create term detection function with greedy longest-match algorithm
    - Implement function that takes text string and returns array of segments (term matches and plain text)
    - Build sorted term list (longest first) for matching priority
    - Scan text left-to-right, matching longest possible term at each position
    - Handle multi-word terms before single-word terms
    - Preserve original text casing while matching case-insensitively
    - _Requirements: 1.3, 1.4, 1.5, 2.1_
  
  - [ ]* 3.2 Write property test for case-insensitive term detection
    - **Property 1: For any glossary term and any text containing that term in any combination of uppercase/lowercase letters, the term detector should identify and mark the term correctly**
    - **Validates: Requirements 1.3**
    - Use fast-check to generate random casing variations of glossary terms
    - _Requirements: 1.3_
  
  - [ ]* 3.3 Write property test for multi-word term detection
    - **Property 2: For any multi-word glossary term and any text containing that term, the term detector should identify the complete phrase as a single term**
    - **Validates: Requirements 1.4**
    - Use fast-check to generate text with multi-word terms embedded
    - _Requirements: 1.4, 1.5_
  
  - [ ]* 3.4 Write unit tests for term detection edge cases
    - Test terms at start, middle, end of text
    - Test overlapping terms (e.g., "interest" vs "compound interest")
    - Test terms with punctuation nearby
    - Test empty text and text with no terms
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 4. Implement GlossaryTerm component
  - [x] 4.1 Create GlossaryTerm component with visual styling
    - Implement component that renders term text with dotted underline
    - Apply theme colors using CSS variables (--game-primary or --game-accent)
    - Handle hover events (desktop) and tap events (mobile)
    - Manage keyboard focus and ARIA attributes (aria-describedby, role)
    - Trigger tooltip display on interaction
    - _Requirements: 2.2, 2.3, 2.5, 3.1, 4.1, 7.1, 7.2, 7.4_
  
  - [ ]* 4.2 Write property test for term styling consistency
    - **Property 3: For any text containing multiple glossary terms, the term detector should mark each occurrence independently with the appropriate visual styling**
    - **Validates: Requirements 2.2, 2.5**
    - Use fast-check to generate text with multiple embedded terms
    - _Requirements: 2.2, 2.5_
  
  - [ ]* 4.3 Write unit tests for GlossaryTerm interactions
    - Test hover triggers tooltip on desktop
    - Test tap triggers tooltip on mobile
    - Test keyboard focus triggers tooltip
    - Test ARIA attributes are present
    - _Requirements: 3.1, 4.1, 7.1, 7.2, 7.4_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement tooltip positioning algorithm
  - [x] 6.1 Create calculatePosition function with viewport constraints
    - Implement function that calculates optimal tooltip position based on anchor element
    - Position above term by default, below if insufficient space
    - Center horizontally on term, adjust to stay within viewport
    - Enforce minimum 8px margin from all viewport edges
    - Apply max-width constraints (320px mobile, 360px desktop)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 6.2 Write property test for viewport margin constraint
    - **Property 7: For any tooltip position calculation, the resulting position should maintain at least 8px margin from all viewport edges**
    - **Validates: Requirements 6.4**
    - Use fast-check to generate random anchor positions and viewport sizes
    - _Requirements: 6.4_
  
  - [ ]* 6.3 Write unit tests for positioning edge cases
    - Test positioning above term when space available
    - Test positioning below term when insufficient space above
    - Test horizontal adjustment near viewport edges
    - Test max-width constraints
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 7. Implement GlossaryTooltip component
  - [x] 7.1 Create GlossaryTooltip component with theme styling
    - Implement floating tooltip with term and definition display
    - Apply theme colors using CSS variables (--game-bg, --game-border, --game-text, --game-primary, --game-surface)
    - Apply rounded corners (16px-24px border radius) and shadow matching game style
    - Use --font-body for definition text
    - Include close button for mobile
    - Handle click-outside and Escape key dismissal
    - Use calculatePosition function for smart positioning
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 4.2, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 7.3_
  
  - [ ]* 7.2 Write property test for tooltip displays correct definition
    - **Property 4: For any glossary term that is activated, the displayed tooltip should contain the exact definition associated with that term**
    - **Validates: Requirements 3.2**
    - Use fast-check to generate random term selections
    - _Requirements: 3.2_
  
  - [ ]* 7.3 Write property test for theme color consistency
    - **Property 6: For any rendered tooltip, all color properties should use CSS variables from the theme system**
    - **Validates: Requirements 5.1**
    - Use fast-check to generate random term activations and verify CSS variables
    - _Requirements: 5.1_
  
  - [ ]* 7.4 Write unit tests for GlossaryTooltip rendering and interactions
    - Test tooltip renders with correct content
    - Test close button appears on mobile
    - Test click outside dismisses tooltip
    - Test Escape key dismisses tooltip
    - Test theme styling is applied
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 4.2, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.3_

- [x] 8. Implement GlossaryText component
  - [x] 8.1 Create GlossaryText component with term detection integration
    - Implement component that wraps text content and detects terms
    - Use term detection algorithm to parse children text
    - Render mix of GlossaryTerm components and plain text
    - Manage tooltip state (single tooltip constraint)
    - Handle dynamic content updates (re-detect terms when text changes)
    - _Requirements: 2.1, 2.4, 4.3, 4.5, 9.2, 9.4, 9.5_
  
  - [ ]* 8.2 Write property test for single tooltip constraint
    - **Property 5: For any sequence of term activations, at most one tooltip should be visible at any given time**
    - **Validates: Requirements 4.3**
    - Use fast-check to generate random sequences of term activations
    - _Requirements: 4.3, 4.5_
  
  - [ ]* 8.3 Write property test for dynamic content re-detection
    - **Property 8: For any GlossaryText component, when the text content changes, the component should re-process and correctly mark all terms**
    - **Validates: Requirements 9.4**
    - Use fast-check to generate random initial and updated text
    - _Requirements: 9.4_
  
  - [ ]* 8.4 Write unit tests for GlossaryText component
    - Test renders correct number of term markers
    - Test handles empty text
    - Test handles text with no terms
    - Test opening second tooltip closes first
    - Test re-renders when text content changes
    - _Requirements: 2.1, 2.4, 4.3, 9.4_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integrate GlossaryProvider into app layout
  - [x] 10.1 Add GlossaryProvider to root layout
    - Wrap app content with GlossaryProvider in `src/app/layout.tsx`
    - Ensure glossary data loads once at application startup
    - _Requirements: 8.1, 9.1_
  
  - [ ]* 10.2 Write performance test for glossary initialization
    - Measure impact on initial page load time (should be <50ms)
    - _Requirements: 8.1, 8.4_

- [x] 11. Integrate GlossaryText into game components
  - [x] 11.1 Add GlossaryText to ReignsView card prompts
    - Wrap card prompt text in GlossaryText component
    - Test tooltip doesn't interfere with swipe interactions
    - _Requirements: 9.2, 9.3_
  
  - [x] 11.2 Add GlossaryText to EventView descriptions
    - Wrap event description text in GlossaryText component
    - Test tooltip doesn't interfere with choice button clicks
    - _Requirements: 9.2, 9.3_
  
  - [x] 11.3 Add GlossaryText to AllocationView account descriptions
    - Wrap account description text in GlossaryText component
    - Test tooltip doesn't interfere with slider interactions
    - _Requirements: 9.2, 9.3_
  
  - [x] 11.4 Add GlossaryText to map node descriptions
    - Wrap node description text in GlossaryText component in NodeCard
    - Test tooltip doesn't interfere with node selection
    - _Requirements: 9.2, 9.3_
  
  - [ ]* 11.5 Write integration tests for game component integration
    - Test GlossaryText works in ReignsView
    - Test GlossaryText works in EventView
    - Test GlossaryText works in AllocationView
    - Test GlossaryText works in map NodeCard
    - Test multiple GlossaryText components on same page
    - _Requirements: 9.2, 9.3_

- [x] 12. Performance optimization and validation
  - [x] 12.1 Optimize term detection performance
    - Profile term detection with text containing 50+ terms
    - Ensure processing completes within 100ms
    - Optimize algorithm if needed (memoization, trie structure)
    - _Requirements: 8.2, 8.5_
  
  - [x] 12.2 Optimize tooltip render performance
    - Measure tooltip render time from trigger to display
    - Ensure renders within 16ms (60fps)
    - Optimize if needed (React.memo, useMemo)
    - _Requirements: 8.3_
  
  - [ ]* 12.3 Write performance benchmarks
    - Benchmark term detection with 50+ terms
    - Benchmark tooltip render time
    - Benchmark initial load time impact
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [x] 13. Final checkpoint and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All property-based tests use fast-check library with minimum 100 iterations
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from design document
- Unit tests validate specific examples and edge cases
- Integration tests verify glossary works within actual game components
