export interface TooltipPosition {
  top?: number;
  bottom?: number;
  left: number;
  maxWidth: number;
}

/**
 * Calculates optimal tooltip position based on anchor element and viewport constraints.
 * Positions above term by default, below if insufficient space.
 * Centers horizontally on term, adjusts to stay within viewport.
 * Enforces minimum 8px margin from all viewport edges.
 */
export function calculatePosition(
  anchorRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  isMobile: boolean
): TooltipPosition {
  const margin = 8;
  const maxWidth = isMobile ? 320 : 360;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Vertical positioning: above by default, below if insufficient space
  const spaceAbove = anchorRect.top;
  const spaceBelow = viewportHeight - anchorRect.bottom;
  const showAbove = spaceAbove > tooltipHeight + margin || spaceAbove > spaceBelow;
  
  // Horizontal positioning: centered on term, adjusted to stay in viewport
  let left = anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2;
  left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin));
  
  // Calculate vertical position with margin
  const verticalPosition = showAbove 
    ? viewportHeight - anchorRect.top + margin 
    : anchorRect.bottom + margin;
  
  return {
    [showAbove ? 'bottom' : 'top']: verticalPosition,
    left,
    maxWidth,
  };
}
