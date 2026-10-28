'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DuoModel } from '@/components/three/duo-model';
import { StudioLighting } from '@/components/three/studio-lighting';
import { useVariant } from '@/components/variant-provider';
import { CLOSED_CENTER_SHIFT, stagePose } from '@/lib/viewer-store';
import type { Variant } from '@/lib/variants';

function PosterScene() {
  const params = useSearchParams();
  const requested = params.get('v');
  const { variant, setVariant } = useVariant();
  const target: Variant = requested === 'night' ? 'night' : 'white';

  useEffect(() => {
    setVariant(target);
  }, [target, setVariant]);

  useEffect(() => {
    stagePose.open = 1;
  }, []);

  return (
    <div
      className="h-screen w-screen"
      style={{ background: variant === 'night' ? '#000000' : '#f5f5f7' }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 32 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <StudioLighting />
        <group scale={1.12} position={[0, -0.05, 0]}>
          <group position-x={-CLOSED_CENTER_SHIFT}>
            <Suspense fallback={null}>
              <DuoModel variant={variant} opacity={1} />
            </Suspense>
          </group>
        </group>
      </Canvas>
    </div>
  );
}

export default function PosterPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#f5f5f7]" />}>
      <PosterScene />
    </Suspense>
  );
}
