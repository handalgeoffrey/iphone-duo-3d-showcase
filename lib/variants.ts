import { assetPath } from '@/lib/asset-path';

export type Variant = 'white' | 'night';

export interface VariantMeta {
  id: Variant;
  name: string;
  model: string;
  swatch: string;
  swatchBorder: string;
  tagline: string;
  shortTagline: string;
  finish: string;
  price: string;
  monthly: string;
}

export const VARIANTS: Record<Variant, VariantMeta> = {
  white: {
    id: 'white',
    name: 'Starry White',
    model: assetPath('/models/starry-white.glb'),
    swatch: '#e9e6e1',
    swatchBorder: '#c9c3ba',
    tagline: 'Warm light. Quiet confidence.',
    shortTagline: 'Soft off-white ceramic',
    finish: 'Warm ceramic glass with a satin titanium frame',
    price: '$1,299',
    monthly: '$54.12/mo. for 24 mo.',
  },
  night: {
    id: 'night',
    name: 'Night Sky',
    model: assetPath('/models/night-sky.glb'),
    swatch: '#14161d',
    swatchBorder: '#3b4050',
    tagline: 'Deep calm. After hours.',
    shortTagline: 'Deep blue-black ceramic',
    finish: 'Deep blue-black ceramic with a brushed titanium frame',
    price: '$1,299',
    monthly: '$54.12/mo. for 24 mo.',
  },
};

export const MODEL_URLS = {
  white: VARIANTS.white.model,
  night: VARIANTS.night.model,
} as const;
