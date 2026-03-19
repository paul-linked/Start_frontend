# Requirements Document

## Introduction

This document defines requirements for a hovering glossary widget that displays investing terminology definitions throughout the financial education game. The widget provides contextual help for users encountering financial terms like "savings account", "interest", "checking", and "investing" across all game views (map, reigns-style cards, allocation sliders, event choices). The widget must integrate seamlessly with the existing warm, paper-like aesthetic and support both desktop hover and mobile tap interactions.

## Glossary

- **Glossary_Widget**: The UI component that displays financial term definitions
- **Glossary_Term**: A financial or investing word or phrase that has a definition in the glossary
- **Glossary_Tooltip**: The floating popup that displays the definition when a term is activated
- **Term_Marker**: Visual indicator (underline, dotted line, or styling) that shows a word is a glossary term
- **Game_View**: Any screen in the game (map view, reigns cards, allocation sliders, event choices, results)
- **Theme_System**: The existing CSS variable-based styling system using warm colors and serif fonts

## Requirements

### Requirement 1: Glossary Data Management

**User Story:** As a developer, I want to define glossary terms and definitions in a centralized location, so that I can maintain consistent terminology across the game.

#### Acceptance Criteria

1. THE Glossary_System SHALL store term definitions in a structured data format (JSON or TypeScript object)
2. THE Glossary_System SHALL support term entries with at minimum: term text, definition text, and optional category
3. THE Glossary_System SHALL allow case-insensitive term matching
4. THE Glossary_System SHALL support multi-word terms (e.g., "savings account", "compound interest")
5. WHEN a term has multiple words, THE Glossary_System SHALL match the complete phrase before matching individual words

### Requirement 2: Term Detection and Marking

**User Story:** As a player, I want to see which words in the game have definitions available, so that I know what I can learn more about.

#### Acceptance Criteria

1. THE Term_Detector SHALL identify Glossary_Terms within text content across all Game_Views
2. THE Term_Marker SHALL apply visual styling to identified terms using Theme_System colors
3. THE Term_Marker SHALL use a subtle visual indicator (dotted underline or color change) that matches the game aesthetic
4. THE Term_Marker SHALL not disrupt the readability of game text
5. WHEN multiple terms appear in the same text, THE Term_Detector SHALL mark each occurrence independently

### Requirement 3: Desktop Hover Interaction

**User Story:** As a desktop player, I want to hover over glossary terms to see their definitions, so that I can learn without interrupting my gameplay.

#### Acceptance Criteria

1. WHEN a user hovers over a Term_Marker on desktop, THE Glossary_Tooltip SHALL appear within 200ms
2. THE Glossary_Tooltip SHALL display the term definition in a floating popup
3. THE Glossary_Tooltip SHALL position itself near the hovered term without obscuring critical UI elements
4. WHEN the user moves the cursor away from the term, THE Glossary_Tooltip SHALL disappear within 150ms
5. THE Glossary_Tooltip SHALL remain visible while the cursor is over the tooltip itself

### Requirement 4: Mobile Tap Interaction

**User Story:** As a mobile player, I want to tap glossary terms to see their definitions, so that I can learn financial concepts on my phone.

#### Acceptance Criteria

1. WHEN a user taps a Term_Marker on mobile, THE Glossary_Tooltip SHALL appear immediately
2. THE Glossary_Tooltip SHALL remain visible until the user taps outside the tooltip or taps a close button
3. WHEN a Glossary_Tooltip is open, THE Glossary_Widget SHALL prevent multiple tooltips from displaying simultaneously
4. THE Glossary_Tooltip SHALL include a visible close button or dismiss indicator on mobile
5. WHEN the user taps another Term_Marker while a tooltip is open, THE Glossary_Widget SHALL close the current tooltip and open the new one

### Requirement 5: Visual Design and Theme Integration

**User Story:** As a player, I want the glossary widget to feel like a natural part of the game, so that it doesn't break my immersion.

#### Acceptance Criteria

1. THE Glossary_Tooltip SHALL use colors from the Theme_System (--game-bg, --game-border, --game-text, --game-primary)
2. THE Glossary_Tooltip SHALL use rounded corners consistent with existing game cards (16px-24px border radius)
3. THE Glossary_Tooltip SHALL include a subtle shadow matching the game's shadow style
4. THE Glossary_Tooltip SHALL use the game's body font (--font-body) for definition text
5. THE Term_Marker SHALL use a dotted underline in --game-primary or --game-accent color
6. THE Glossary_Tooltip SHALL have a warm background color (--game-bg or --game-surface)

### Requirement 6: Positioning and Layout

**User Story:** As a player, I want glossary tooltips to appear in convenient locations, so that they don't block important game content.

#### Acceptance Criteria

1. THE Glossary_Tooltip SHALL position itself above the term by default
2. WHEN there is insufficient space above the term, THE Glossary_Tooltip SHALL position itself below the term
3. WHEN there is insufficient horizontal space, THE Glossary_Tooltip SHALL adjust its horizontal position to remain on screen
4. THE Glossary_Tooltip SHALL maintain a minimum 8px margin from viewport edges
5. THE Glossary_Tooltip SHALL have a maximum width of 320px on mobile and 360px on desktop

### Requirement 7: Accessibility

**User Story:** As a player using assistive technology, I want to access glossary definitions, so that I can learn financial concepts regardless of my abilities.

#### Acceptance Criteria

1. THE Term_Marker SHALL be keyboard accessible (focusable via Tab key)
2. WHEN a Term_Marker receives keyboard focus, THE Glossary_Tooltip SHALL display
3. WHEN the user presses Escape while a tooltip is open, THE Glossary_Tooltip SHALL close
4. THE Term_Marker SHALL include appropriate ARIA attributes (aria-describedby or role="tooltip")
5. THE Glossary_Tooltip SHALL be announced by screen readers when it appears

### Requirement 8: Performance and Optimization

**User Story:** As a player, I want the glossary to load quickly and not slow down the game, so that my experience remains smooth.

#### Acceptance Criteria

1. THE Glossary_System SHALL load term definitions once at application startup
2. THE Term_Detector SHALL process text content without causing visible UI lag
3. THE Glossary_Tooltip SHALL render within 16ms of being triggered (60fps)
4. THE Glossary_Widget SHALL not increase initial page load time by more than 50ms
5. WHEN a Game_View contains many terms, THE Term_Detector SHALL mark all terms within 100ms

### Requirement 9: Integration with Game Components

**User Story:** As a developer, I want to easily add glossary support to any game component, so that I can provide contextual help throughout the game.

#### Acceptance Criteria

1. THE Glossary_Widget SHALL provide a React component or hook for wrapping text content
2. THE Glossary_Widget SHALL work with text in card prompts, button labels, and descriptions
3. THE Glossary_Widget SHALL integrate with existing game components without requiring major refactoring
4. THE Glossary_Widget SHALL support dynamic content (text that changes based on game state)
5. THE Glossary_Widget SHALL provide a simple API for developers (e.g., `<GlossaryText>content</GlossaryText>`)

### Requirement 10: Initial Glossary Content

**User Story:** As a player, I want definitions for common financial terms I encounter in the game, so that I can understand the concepts being taught.

#### Acceptance Criteria

1. THE Glossary_System SHALL include definitions for at minimum: "savings account", "checking account", "interest", "investing", "compound interest"
2. THE Glossary_System SHALL include definitions for: "emergency fund", "budget", "debt", "credit", "asset"
3. THE Glossary_System SHALL include definitions for: "stock", "bond", "diversification", "risk", "return"
4. THE Glossary_System SHALL provide clear, beginner-friendly definitions (under 100 words each)
5. THE Glossary_System SHALL allow easy addition of new terms without code changes
