'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useGlossary } from './useGlossary';
import { detectTerms } from './termDetection';
import { GlossaryTerm } from './GlossaryTerm';
import { GlossaryTooltip } from './GlossaryTooltip';

interface GlossaryTextProps {
  children: string;
  className?: string;
}

interface TooltipState {
  anchorElement: HTMLElement;
  term: string;
  definition: string;
  category?: string;
}

export function GlossaryText({ children, className }: GlossaryTextProps) {
  const { terms } = useGlossary();
  const [tooltipState, setTooltipState] = useState<TooltipState | null>(null);
  const [isMobile] = useState(() => 
    typeof window !== 'undefined' && 'ontouchstart' in window
  );

  const handleTooltipOpen = useCallback((
    anchorElement: HTMLElement,
    term: string,
    definition: string,
    category?: string
  ) => {
    setTooltipState({ anchorElement, term, definition, category });
  }, []);

  const handleTooltipClose = useCallback(() => {
    setTooltipState(null);
  }, []);

  const segments = useMemo(() => {
    if (typeof children !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('GlossaryText: children must be a string');
      }
      return [];
    }
    
    if (!children) return [];
    
    return detectTerms(children, terms);
  }, [children, terms]);

  if (!children || typeof children !== 'string') {
    return null;
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'term' && segment.entry) {
          return (
            <GlossaryTerm
              key={index}
              term={segment.entry.term}
              definition={segment.entry.definition}
              category={segment.entry.category}
              onTooltipOpen={handleTooltipOpen}
            >
              {segment.content}
            </GlossaryTerm>
          );
        }
        return <React.Fragment key={index}>{segment.content}</React.Fragment>;
      })}
      
      {tooltipState && (
        <GlossaryTooltip
          term={tooltipState.term}
          definition={tooltipState.definition}
          category={tooltipState.category}
          anchorElement={tooltipState.anchorElement}
          onClose={handleTooltipClose}
          isMobile={isMobile}
        />
      )}
    </span>
  );
}
