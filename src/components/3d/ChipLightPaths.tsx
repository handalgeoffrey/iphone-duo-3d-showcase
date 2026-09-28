import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChipLightPathsProps {
  visible: boolean;
  scrollSpeed?: number;
}

export const ChipLightPaths: React.FC<ChipLightPathsProps> = ({
  visible,
  scrollSpeed = 0
}) => {
  const lineGroupRef = useRef<THREE.Group>(null);
  const lineCount = 36;

  // Generate elegant procedural circuit curves underneath the opened phone
  const paths = useMemo(() => {
    const list = [];
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 0.04 + Math.random() * 0.08;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + 0.3) * (radius + 0.06);
      const z2 = Math.sin(angle + 0.3) * (radius + 0.06);
      const y = -0.05 + (Math.random() - 0.5) * 0.01;

      const points = [
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x1 * 1.2, y, z2 * 0.8),
        new THREE.Vector3(x2, y, z2)
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      list.push(curve.getPoints(24));
    }
    return list;
  }, [lineCount]);

  useFrame((_, delta) => {
    if (!lineGroupRef.current || !visible) return;
    // Rotate and pulse light paths
    const speed = 0.3 + Math.abs(scrollSpeed) * 1.5;
    lineGroupRef.current.rotation.y += delta * speed;
  });

  if (!visible) return null;

  return (
    <group ref={lineGroupRef} position={[0, -0.02, 0]}>
      {paths.map((pts, idx) => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const color = idx % 3 === 0 ? '#ff375f' : idx % 2 === 0 ? '#0071e3' : '#bf5af2';
        const mat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending
        });
        const lineObj = new THREE.Line(lineGeo, mat);
        return <primitive key={idx} object={lineObj} />;
      })}

      {/* Central A20 Pro Silicon Monolith Glow */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.024, 0.001, 0.024]} />
        <meshStandardMaterial
          color="#15151c"
          emissive="#0071e3"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};
