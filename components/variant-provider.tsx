'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { VARIANTS, type Variant, type VariantMeta } from '@/lib/variants';

interface VariantContextValue {
  variant: Variant;
  meta: VariantMeta;
  setVariant: (variant: Variant) => void;
  ready: boolean;
}

const VariantContext = createContext<VariantContextValue | null>(null);

const STORAGE_KEY = 'duo-variant';

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<Variant>('white');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'white' || stored === 'night') {
        setVariantState(stored);
      }
    } catch {
      // sessionStorage may be unavailable in private mode
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    if (ready) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, variant);
      } catch {
        // ignore
      }
    }
  }, [variant, ready]);

  const setVariant = useCallback((next: Variant) => {
    setVariantState(next);
  }, []);

  const value = useMemo(
    () => ({ variant, meta: VARIANTS[variant], setVariant, ready }),
    [variant, setVariant, ready],
  );

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export function useVariant() {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error('useVariant must be used inside VariantProvider');
  }
  return context;
}
