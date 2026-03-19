'use client';

import React, { useRef, useState, useCallback } from 'react';

interface GlossaryTermProps {
  term: string;
  definition: string;
  category?: string;
  children: string;
  onTooltipOpen: (anchorElement: HTMLElement, term: string, definition: string, category?: string) => void;
}

export const GlossaryTerm = React.memo(function GlossaryTerm({ 
  term, 
  definition, 
  category, 
  children,
  onTooltipOpen 
}: GlossaryTermProps) {
  const termRef = useRef<HTMLSpanElement>(null);
  const [isMobile] = useState(() => 
    typeof window !== 'undefined' && 'ontouchstart' in window
  );

  const handleInteraction = useCallback(() => {
    if (termRef.current) {
      onTooltipOpen(termRef.current, term, definition, category);
    }
  }, [term, definition, category, onTooltipOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteraction();
    }
  }, [handleInteraction]);

  return (
    <span
      ref={termRef}
      className="glossary-term"
      onMouseEnter={!isMobile ? handleInteraction : undefined}
      onClick={isMobile ? handleInteraction : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${children} - click for definition`}
      style={{
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: 'var(--game-primary)',
        textUnderlineOffset: '2px',
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
});
