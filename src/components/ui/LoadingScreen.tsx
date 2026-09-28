import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { UnifiedDuoDevice } from '../3d/UnifiedDuoModel';

interface LoadingScreenProps {
  onLoaded?: () => void;
  reducedMotion?: boolean;
}

// ----------------------------------------------------------------------------
// Internal 3D Loader Animation: Folded silhouette opening to 90° & rim sweep
// ----------------------------------------------------------------------------
const LoaderCanvasScene: React.FC<{ animProgress: number }> = ({ animProgress }) => {
  const rimLightRef = useRef<THREE.SpotLight>(null);

  // Animate fold: closed (0) -> 90° (0.5) -> closed (0)
  // animProgress goes 0 to 1 over ~2.4 seconds
  let fold = 0;
  if (animProgress < 0.45) {
    fold = THREE.MathUtils.smoothstep(animProgress, 0, 0.45) * 0.5; // Open to 90°
  } else if (animProgress < 0.65) {
    fold = 0.5; // Brief pause at 90°
  } else {
    fold = THREE.MathUtils.smoothstep(animProgress, 1.0, 0.65) * 0.5; // Smoothly close
  }

  useFrame((_, delta) => {
    if (rimLightRef.current) {
      // Titanium rim light sweeps slowly across the hinge
      const sweepX = THREE.MathUtils.lerp(-0.25, 0.25, animProgress);
      rimLightRef.current.position.x = sweepX;
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0.5, 0.4]} intensity={0.6} />

      {/* Sweeping Titanium Rim Light */}
      <spotLight
        ref={rimLightRef}
        position={[-0.2, 0.1, 0.3]}
        intensity={3.8}
        color="#e0e8ff"
        angle={Math.PI / 4}
        penumbra={0.7}
      />

      <UnifiedDuoDevice
        modelUrl="/models/main-starwhite.glb"
        variantId="star-white"
        foldProgress={fold}
        position={[0, 0, 0]}
        rotation={[0.08, 0.15, 0]}
        scale={0.92}
        visible={true}
      />
    </>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded, reducedMotion = false }) => {
  const { progress } = useProgress();
  const [animProgress, setAnimProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('noloading')) {
      return true;
    }
    return false;
  });
  const [isDoneLoading, setIsDoneLoading] = useState(false);

  // Fast-track dismissal for reduced-motion or pre-loaded assets
  useEffect(() => {
    if (reducedMotion && progress >= 100) {
      setIsDoneLoading(true);
      setIsDismissed(true);
      if (onLoaded) onLoaded();
    }
  }, [reducedMotion, progress, onLoaded]);

  // Animate fold intro sequence
  useEffect(() => {
    if (reducedMotion || isDismissed) return;

    let start: number | null = null;
    const duration = 2000; // 2s sequence

    let reqId: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1.0);
      setAnimProgress(p);

      if (p < 1.0) {
        reqId = requestAnimationFrame(step);
      } else {
        setIsDoneLoading(true);
      }
    };

    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [reducedMotion, isDismissed]);

  // Dismiss when assets are ready
  useEffect(() => {
    if (isDismissed) return;

    if (progress >= 100 || isDoneLoading) {
      const timer = setTimeout(() => {
        setIsDismissed(true);
        if (onLoaded) onLoaded();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isDoneLoading, isDismissed, onLoaded]);

  // Safety fallback timeout threshold (2.5 seconds max)
  useEffect(() => {
    if (isDismissed) return;
    const safetyTimer = setTimeout(() => {
      setIsDismissed(true);
      if (onLoaded) onLoaded();
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, [isDismissed, onLoaded]);

  if (isDismissed) return null;

  return (
    <div
      className={`loading-overlay ${isDoneLoading && progress >= 100 ? 'loaded' : ''}`}
      role="status"
      aria-label="Loading iPhone Duo 3D Experience"
      aria-live="polite"
    >
      {/* 3D Fold Animation (unless reduced motion) */}
      <div className="loading-canvas-container" aria-hidden="true">
        {!reducedMotion ? (
          <Canvas
            camera={{ position: [0, 0, 0.38], fov: 36, near: 0.05, far: 5 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <LoaderCanvasScene animProgress={animProgress} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="loading-static-silhouette" />
        )}
      </div>

      {/* Minimal Brand Wordmark & Hairline Progress */}
      <div className="loading-branding-zone">
        <span className="loading-wordmark">iPhone Duo</span>
        <div className="loading-hairline-track" aria-hidden="true">
          <div
            className="loading-hairline-fill"
            style={{ width: `${Math.min(Math.max(progress, animProgress * 100), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
