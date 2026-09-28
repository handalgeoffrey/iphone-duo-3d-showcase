import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ProductStage } from './ProductStage';
import { StudioEnvironment } from './StudioEnvironment';
import { CameraRig } from './CameraRig';
import { ProductVariantId } from '../../data/productVariants';

interface DuoCanvasProps {
  currentChapterIndex: number;
  chapterProgress: number;
  foldProgress: number;
  theme: 'dark' | 'light';
  introSweep: number;
  scrollSpeed: number;
  variant?: ProductVariantId;
}

export const DuoCanvas: React.FC<DuoCanvasProps> = ({
  currentChapterIndex,
  chapterProgress,
  foldProgress,
  theme,
  introSweep,
  scrollSpeed,
  variant = 'star-white'
}) => {
  return (
    <div
      className="webgl-stage-container"
      role="region"
      aria-label="Interactive 3D model of iPhone Duo"
    >
      <Canvas
        camera={{ position: [0, 0, 0.44], fov: 38, near: 0.05, far: 20 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === 'dark' ? 1.18 : 1.3
        }}
        shadows
      >
        <Suspense fallback={null}>
          <CameraRig
            currentChapterIndex={currentChapterIndex}
            chapterProgress={chapterProgress}
          />

          <StudioEnvironment
            theme={theme}
            introSweep={introSweep}
            variant={variant}
          />

          <ProductStage
            currentChapterIndex={currentChapterIndex}
            chapterProgress={chapterProgress}
            foldProgress={foldProgress}
            theme={theme}
            scrollSpeed={scrollSpeed}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
