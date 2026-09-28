import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ProductVariantId } from '../../data/productVariants';

interface StudioEnvironmentProps {
  theme: 'dark' | 'light';
  introSweep: number; // 0 to 1 during hero scroll
  variant?: ProductVariantId;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({
  theme = 'dark',
  introSweep = 0,
  variant = 'star-white'
}) => {
  // Left softbox for Star White (warm, soft pearlescent light)
  const whiteSoftboxRef = useRef<THREE.DirectionalLight>(null);
  // Right rim/key light for Starry Night (cool blue-violet graphite rim)
  const nightRimRef = useRef<THREE.SpotLight>(null);
  const nightKeyRef = useRef<THREE.DirectionalLight>(null);
  // Overhead studio fill
  const overheadRef = useRef<THREE.DirectionalLight>(null);

  // Variant focus factor (1 = Star White focus, 0 = Starry Night focus)
  const variantFactorRef = useRef(variant === 'star-white' ? 1.0 : 0.0);

  useFrame((_, delta) => {
    // 1. Star White Studio Light (Left side, warm pearl softbox)
    if (whiteSoftboxRef.current) {
      whiteSoftboxRef.current.intensity = THREE.MathUtils.lerp(
        whiteSoftboxRef.current.intensity,
        2.6,
        delta * 4
      );
    }

    // 2. Night Sky Rim Light (Right side, crisp starlight indigo rim)
    if (nightRimRef.current) {
      nightRimRef.current.intensity = THREE.MathUtils.lerp(
        nightRimRef.current.intensity,
        4.6 + introSweep * 0.8,
        delta * 4
      );
      nightRimRef.current.position.x = THREE.MathUtils.lerp(
        nightRimRef.current.position.x,
        0.65,
        delta * 3
      );
    }

    // 3. Night Sky Key Light (Highlights obsidian titanium)
    if (nightKeyRef.current) {
      nightKeyRef.current.intensity = THREE.MathUtils.lerp(
        nightKeyRef.current.intensity,
        2.2,
        delta * 4
      );
    }

    // 4. Overhead Softbox (Clean diffuse highlights)
    if (overheadRef.current) {
      overheadRef.current.intensity = 2.0;
    }
  });

  return (
    <>
      {/* Studio HDRI Environment Reflections */}
      <Environment
        preset="city"
        environmentIntensity={theme === 'dark' ? 0.75 : 1.15}
      />

      {/* Balanced Studio Ambient Light */}
      <ambientLight intensity={theme === 'dark' ? 0.45 : 0.65} />

      {/* Overhead Studio Softbox (Even dispersion) */}
      <directionalLight
        ref={overheadRef}
        position={[0, 1.4, 0.5]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={3}
        shadow-bias={-0.0001}
      />

      {/* LEFT: Star White Studio Key (Warm Soft White #fffbf5) */}
      <directionalLight
        ref={whiteSoftboxRef}
        position={[-0.7, 0.6, 0.45]}
        intensity={2.2}
        color="#fffaf0"
      />

      {/* RIGHT: Starry Night Titanium Key (Neutral Cool #f0f4ff) */}
      <directionalLight
        ref={nightKeyRef}
        position={[0.7, 0.6, 0.45]}
        intensity={1.8}
        color="#f0f4ff"
      />

      {/* RIGHT-BACK: Starry Night Rim Light (Cool Blue-Violet #70a0ff) */}
      <spotLight
        ref={nightRimRef}
        position={[0.55, 0.45, -0.35]}
        target-position={[0.08, 0, 0]}
        intensity={3.6}
        color="#6898fa"
        angle={Math.PI / 4}
        penumbra={0.85}
      />

      {/* Subtle Central Fill to seamlessly unify both environments */}
      <pointLight position={[0, -0.15, 0.35]} intensity={0.5} color="#edf2f7" />
    </>
  );
};
