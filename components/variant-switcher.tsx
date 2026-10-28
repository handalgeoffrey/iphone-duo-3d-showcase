'use client';

import clsx from 'clsx';
import { useVariant } from '@/components/variant-provider';
import { VARIANTS, type Variant } from '@/lib/variants';

interface VariantSwitcherProps {
  size?: 'sm' | 'md' | 'lg';
  showTaglines?: boolean;
  className?: string;
}

const SIZES = {
  sm: { swatch: 'h-8 w-8', dot: 'h-1.5 w-1.5', name: 'text-[11px]', tagline: 'text-[10px]', gap: 'gap-2.5' },
  md: { swatch: 'h-11 w-11', dot: 'h-2 w-2', name: 'text-[12px]', tagline: 'text-[11px]', gap: 'gap-3' },
  lg: { swatch: 'h-14 w-14', dot: 'h-2.5 w-2.5', name: 'text-[13px]', tagline: 'text-[12px]', gap: 'gap-4' },
} as const;

export function VariantSwitcher({
  size = 'md',
  showTaglines = false,
  className,
}: VariantSwitcherProps) {
  const { variant, setVariant } = useVariant();
  const sizing = SIZES[size];

  return (
    <div
      role="radiogroup"
      aria-label="Choose a finish"
      className={clsx('flex items-start', sizing.gap, className)}
      style={{ gap: size === 'lg' ? '2.5rem' : size === 'sm' ? '1.25rem' : '2rem' }}
    >
      {(['white', 'night'] as Variant[]).map((candidate) => {
        const meta = VARIANTS[candidate];
        const selected = variant === candidate;

        return (
          <button
            key={candidate}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${meta.name} finish${selected ? ', selected' : ''}`}
            onClick={() => setVariant(candidate)}
            className="group flex flex-col items-center gap-2 rounded-lg py-1 text-center"
          >
            <span
              className={clsx(
                'relative flex items-center justify-center rounded-full border shadow-sm transition-all duration-500 ease-apple',
                sizing.swatch,
                selected ? 'scale-100' : 'scale-95 opacity-75 group-hover:scale-100 group-hover:opacity-100',
              )}
              style={{
                backgroundColor: meta.swatch,
                borderColor: meta.swatchBorder,
                boxShadow: selected
                  ? 'inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 10px rgba(0,0,0,0.12)'
                  : 'inset 0 1px 1px rgba(255,255,255,0.25)',
              }}
            >
              {selected ? (
                <span
                  aria-hidden="true"
                  className={clsx('rounded-full transition-opacity duration-300', sizing.dot)}
                  style={{ backgroundColor: candidate === 'white' ? '#1d1d1f' : '#f5f5f7' }}
                />
              ) : null}
            </span>

            <span
              className={clsx(
                'font-medium leading-tight transition-colors duration-300',
                sizing.name,
                selected ? 'text-page' : 'text-page-2',
              )}
            >
              {meta.name}
            </span>

            {showTaglines ? (
              <span className={clsx('max-w-[8rem] leading-snug text-page-2', sizing.tagline)}>
                {meta.shortTagline}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
