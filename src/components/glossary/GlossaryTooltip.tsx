'use client';

import React, { useEffect, useRef, useState } from 'react';
import { calculatePosition } from './tooltipPositioning';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  category?: string;
  anchorElement: HTMLElement;
  onClose: () => void;
  isMobile: boolean;
}

export const GlossaryTooltip = React.memo(function GlossaryTooltip({
  term,
  definition,
  category,
  anchorElement,
  onClose,
  isMobile,
}: GlossaryTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<ReturnType<typeof calculatePosition> | null>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    const anchorRect = anchorElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const calculatedPosition = calculatePosition(
      anchorRect,
      tooltipRect.width || (isMobile ? 320 : 360),
      tooltipRect.height || 100,
      isMobile
    );
    
    setPosition(calculatedPosition);
  }, [anchorElement, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={tooltipRef}
      className="glossary-tooltip"
      style={{
        position: 'fixed',
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        maxWidth: position.maxWidth,
        backgroundColor: 'var(--game-surface)',
        border: '2px solid var(--game-border)',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontFamily: 'var(--font-body)',
        color: 'var(--game-text)',
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ 
            fontWeight: 600, 
            fontSize: '16px', 
            color: 'var(--game-primary)',
            marginBottom: '4px'
          }}>
            {term}
          </div>
          {category && (
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--game-text)',
              opacity: 0.7
            }}>
              {category}
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0 0 0 8px',
              color: 'var(--game-text)',
              opacity: 0.6,
            }}
            aria-label="Close tooltip"
          >
            ×
          </button>
        )}
      </div>
      <div style={{ 
        fontSize: '14px', 
        lineHeight: '1.5',
        overflowWrap: 'break-word'
      }}>
        {definition}
      </div>
    </div>
  );
});