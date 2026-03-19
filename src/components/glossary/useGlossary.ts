'use client';

import { useContext } from 'react';
import { GlossaryContext } from './GlossaryProvider';

export function useGlossary() {
  const context = useContext(GlossaryContext);
  
  if (!context) {
    throw new Error('useGlossary must be used within GlossaryProvider');
  }
  
  return context;
}
