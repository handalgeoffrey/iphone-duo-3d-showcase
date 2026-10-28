'use client';

import { useVariant } from '@/components/variant-provider';
import { showToast } from '@/lib/toast-store';

interface BuyButtonProps {
  className?: string;
  label?: string;
}

export function BuyButton({ className, label = 'Buy iPhone Duo' }: BuyButtonProps) {
  const { meta } = useVariant();

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        showToast(
          `${meta.name} is a design concept. Checkout is not available in this demo.`,
        )
      }
    >
      {label}
    </button>
  );
}
