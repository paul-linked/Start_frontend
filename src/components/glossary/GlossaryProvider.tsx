'use client';

import React, { createContext, useMemo } from 'react';
import { GLOSSARY_TERMS, GlossaryEntry } from './glossaryData';

interface GlossaryContextValue {
  terms: Map<string, GlossaryEntry>;
  getDefinition: (term: string) => GlossaryEntry | undefined;
}

export const GlossaryContext = createContext<GlossaryContextValue | null>(null);

interface GlossaryProviderProps {
  children: React.ReactNode;
}

export function GlossaryProvider({ children }: GlossaryProviderProps) {
  const contextValue = useMemo(() => {
    // Build a map with lowercase keys for case-insensitive lookup
    const termsMap = new Map<string, GlossaryEntry>();
    
    GLOSSARY_TERMS.forEach(entry => {
      // Add main term
      termsMap.set(entry.term.toLowerCase(), entry);
      
      // Add aliases
      if (entry.aliases) {
        entry.aliases.forEach(alias => {
          termsMap.set(alias.toLowerCase(), entry);
        });
      }
    });
    
    return {
      terms: termsMap,
      getDefinition: (term: string) => termsMap.get(term.toLowerCase()),
    };
  }, []);

  return (
    <GlossaryContext.Provider value={contextValue}>
      {children}
    </GlossaryContext.Provider>
  );
}
