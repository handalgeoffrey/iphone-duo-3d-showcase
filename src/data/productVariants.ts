export type ProductVariantId = 'star-white' | 'night-sky' | 'starry-night';

export interface ProductVariant {
  id: ProductVariantId;
  name: string;
  tagline: string;
  finishDescription: string;
  swatchColor: string;
  swatchBorder: string;
  modelUrl: string;
  backgrounds: {
    light: string;
    dark: string;
  };
  lighting: {
    ambientIntensity: number;
    softboxTopIntensity: number;
    softboxSideIntensity: number;
    rimColor: string;
    rimIntensity: number;
    keyLightColor: string;
  };
}

export const OFFICIAL_VARIANTS: ProductVariantId[] = ['star-white', 'night-sky'];

export const PRODUCT_VARIANTS: Record<ProductVariantId, ProductVariant> = {
  'star-white': {
    id: 'star-white',
    name: 'Star White',
    tagline: 'Titanium foldable design. Star White.',
    finishDescription: 'Satin-brushed Star White Grade 5 titanium with pearlescent PVD finish and frosted ceramic glass back.',
    swatchColor: '#f5f6f8',
    swatchBorder: '#d1d5db',
    modelUrl: '/models/main-starwhite.glb',
    backgrounds: {
      light: '#f5f5f7',
      dark: '#08080a'
    },
    lighting: {
      ambientIntensity: 1.5,
      softboxTopIntensity: 3.8,
      softboxSideIntensity: 2.6,
      rimColor: '#ffffff',
      rimIntensity: 2.8,
      keyLightColor: '#fffaf2'
    }
  },
  'night-sky': {
    id: 'night-sky',
    name: 'Night Sky',
    tagline: 'Titanium foldable design. Night Sky.',
    finishDescription: 'Deep midnight obsidian Grade 5 titanium with cool indigo undertones and dark ceramic back.',
    swatchColor: '#161822',
    swatchBorder: '#374151',
    modelUrl: '/models/main-starrynight.glb',
    backgrounds: {
      light: '#e8eaed',
      dark: '#06070a'
    },
    lighting: {
      ambientIntensity: 1.6,
      softboxTopIntensity: 4.2,
      softboxSideIntensity: 3.2,
      rimColor: '#6898fa',
      rimIntensity: 4.6,
      keyLightColor: '#e2e8f5'
    }
  },
  // Alias for backward compatibility
  'starry-night': {
    id: 'night-sky',
    name: 'Night Sky',
    tagline: 'Titanium foldable design. Night Sky.',
    finishDescription: 'Deep midnight obsidian Grade 5 titanium with cool indigo undertones and dark ceramic back.',
    swatchColor: '#161822',
    swatchBorder: '#374151',
    modelUrl: '/models/main-starrynight.glb',
    backgrounds: {
      light: '#e8eaed',
      dark: '#06070a'
    },
    lighting: {
      ambientIntensity: 1.6,
      softboxTopIntensity: 4.2,
      softboxSideIntensity: 3.2,
      rimColor: '#6898fa',
      rimIntensity: 4.6,
      keyLightColor: '#e2e8f5'
    }
  }
};
