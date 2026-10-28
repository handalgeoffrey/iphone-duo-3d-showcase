export type StageName = 'hero' | 'scrolly' | 'colour' | 'materials' | 'hidden';

export interface SectionRect {
  top: number;
  height: number;
}

/**
 * Mutable values shared between the DOM sections and the fixed 3D stage.
 * These are intentionally outside React so scroll and drag can update at
 * frame rate without re-rendering the page.
 */
export const viewerInput = {
  userYaw: 0,
  userPitch: 0,
  dragging: false,
  lastInteraction: 0,
};

export const stagePose = {
  open: 1,
  yaw: 0,
  pitch: 0,
  scale: 1.12,
  x: 0,
  y: -0.1,
  z: 0,
};

export const scrollState = {
  y: 0,
  vh: 800,
  width: 1280,
  mobile: false,
  heroSplit: false,
  reducedMotion: false,
  active: 'hero' as StageName,
  heroProgress: 0,
  scrollyProgress: 0,
  colourProgress: 0,
  materialsProgress: 0,
  sections: {} as Record<string, SectionRect>,
};

export const FIT = 3.2;
/** The fold pivots at the hinge, so the closed silhouette sits off-centre. */
export const CLOSED_CENTER_SHIFT = 0.239 * FIT;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
