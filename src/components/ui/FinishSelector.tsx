import React from 'react';
import { PRODUCT_VARIANTS, ProductVariantId, OFFICIAL_VARIANTS } from '../../data/productVariants';
import { sounds } from './AudioHaptics';

interface FinishSelectorProps {
  currentVariant: ProductVariantId;
  onSelectVariant: (variant: ProductVariantId) => void;
  className?: string;
}

export const FinishSelector: React.FC<FinishSelectorProps> = ({
  currentVariant,
  onSelectVariant,
  className = ''
}) => {
  const variantKeys = OFFICIAL_VARIANTS;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % variantKeys.length;
      onSelectVariant(variantKeys[nextIndex]);
      sounds.playClick();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + variantKeys.length) % variantKeys.length;
      onSelectVariant(variantKeys[prevIndex]);
      sounds.playClick();
    }
  };

  return (
    <div
      className={`finish-selector-wrapper ${className}`}
      role="radiogroup"
      aria-label="iPhone Duo Finish Options"
    >
      <div className="finish-selector-label">
        Finish: <span className="active-finish-name">{PRODUCT_VARIANTS[currentVariant].name}</span>
      </div>

      <div className="finish-swatches-row">
        {variantKeys.map((key, index) => {
          const variant = PRODUCT_VARIANTS[key];
          const isSelected = currentVariant === key;

          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={`finish-swatch-btn ${isSelected ? 'active' : ''}`}
              onClick={() => {
                if (!isSelected) {
                  sounds.playClick();
                  onSelectVariant(key);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              title={variant.name}
              aria-label={`Select ${variant.name} finish`}
            >
              <span
                className="finish-swatch-color"
                style={{
                  backgroundColor: variant.swatchColor,
                  borderColor: variant.swatchBorder
                }}
              />
              <span className="finish-swatch-text">{variant.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
