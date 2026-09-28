import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DurabilityParticlesProps {
  visible: boolean;
  intensity?: number;
}

export const DurabilityParticles: React.FC<DurabilityParticlesProps> = ({
  visible,
  intensity = 1.0
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120; // Lightweight and restrained

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Bounded box around phone dimensions
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.22;
      pos[i * 3 + 1] = Math.random() * 0.18 - 0.04;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = -(Math.random() * 0.04 + 0.02); // gentle downward glide
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [pos, vel];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !visible) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += velocities[i * 3 + 1] * delta * intensity;
      array[i * 3 + 0] += velocities[i * 3 + 0] * delta * intensity;

      // Wrap around top if dropped past bottom
      if (array[i * 3 + 1] < -0.06) {
        array[i * 3 + 1] = 0.12;
        array[i * 3 + 0] = (Math.random() - 0.5) * 0.22;
      }
    }

    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.0022}
        color="#a5c8ed"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
