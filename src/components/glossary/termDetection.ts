import { GlossaryEntry } from './glossaryData';

export interface TextSegment {
  type: 'term' | 'text';
  content: string;
  entry?: GlossaryEntry;
}

// Cache for sorted terms list to avoid rebuilding on every call
let cachedTermsList: string[] | null = null;
let cachedTermsMap: Map<string, GlossaryEntry> | null = null;

/**
 * Detects glossary terms in text using greedy longest-match algorithm.
 * Multi-word terms are matched before single-word terms.
 * Matching is case-insensitive, but original casing is preserved.
 */
export function detectTerms(
  text: string,
  termsMap: Map<string, GlossaryEntry>
): TextSegment[] {
  if (!text) return [];
  
  // Build sorted list of all possible terms (longest first) - cached for performance
  if (cachedTermsMap !== termsMap) {
    cachedTermsList = Array.from(termsMap.keys()).sort((a, b) => b.length - a.length);
    cachedTermsMap = termsMap;
  }
  const allTerms = cachedTermsList!;
  
  const segments: TextSegment[] = [];
  let position = 0;
  
  while (position < text.length) {
    let matchFound = false;
    
    // Try to match longest possible term at current position
    for (const term of allTerms) {
      const remainingText = text.slice(position);
      const lowerRemaining = remainingText.toLowerCase();
      
      // Check if term matches at current position
      if (lowerRemaining.startsWith(term)) {
        // Check word boundaries to avoid partial matches
        const beforeChar = position > 0 ? text[position - 1] : ' ';
        const afterPos = position + term.length;
        const afterChar = afterPos < text.length ? text[afterPos] : ' ';
        
        const isWordBoundaryBefore = /[\s.,!?;:()\[\]{}"']/.test(beforeChar) || position === 0;
        const isWordBoundaryAfter = /[\s.,!?;:()\[\]{}"']/.test(afterChar) || afterPos === text.length;
        
        if (isWordBoundaryBefore && isWordBoundaryAfter) {
          // Match found - preserve original casing
          const originalText = text.slice(position, position + term.length);
          const entry = termsMap.get(term);
          
          segments.push({
            type: 'term',
            content: originalText,
            entry,
          });
          
          position += term.length;
          matchFound = true;
          break;
        }
      }
    }
    
    // No term matched - add character to plain text
    if (!matchFound) {
      const char = text[position];
      
      // Merge with previous text segment if exists
      if (segments.length > 0 && segments[segments.length - 1].type === 'text') {
        segments[segments.length - 1].content += char;
      } else {
        segments.push({
          type: 'text',
          content: char,
        });
      }
      
      position++;
    }
  }
  
  return segments;
}
