import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CameraFocusRingsProps {
  visible: boolean;
  explodedProgress?: number; // 0 to 1
}

export const CameraFocusRings: React.FC<CameraFocusRingsProps> = ({
  visible,
  explodedProgress = 0
}) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Position offset for the rear camera module on Side_Panel_Right
  const basePos: [number, number, number] = [0.035, 0.088, 0.008];

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4;
      const targetZ = 0.006 + explodedProgress * 0.015;
      ring1Ref.current.position.z = THREE.MathUtils.lerp(ring1Ref.current.position.z, targetZ, delta * 8);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.35;
      const targetZ = 0.006 + explodedProgress * 0.024;
      ring2Ref.current.position.z = THREE.MathUtils.lerp(ring2Ref.current.position.z, targetZ, delta * 8);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3;
      const targetZ = 0.006 + explodedProgress * 0.032;
      ring3Ref.current.position.z = THREE.MathUtils.lerp(ring3Ref.current.position.z, targetZ, delta * 8);
    }
  });

  if (!visible) return null;

  return (
    <group position={basePos}>
      {/* 1. 48MP Fusion Main Lens Ring (Upper Lens) */}
      <mesh ref={ring1Ref} position={[0, 0.012, 0.006]}>
        <torusGeometry args={[0.011, 0.0006, 16, 64]} />
        <meshStandardMaterial
          color="#0071e3"
          emissive="#0071e3"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
        {explodedProgress > 0.25 && (
          <Html
            position={[0.018, 0.005, 0]}
            className="camera-callout-html"
            style={{ pointerEvents: 'none' }}
          >
            <div className="camera-callout-card">
              <div className="callout-title" style={{ color: '#2997ff' }}>48MP Fusion Main</div>
              <div className="callout-spec">26 mm • ƒ/1.6 • Sensor-Shift OIS</div>
            </div>
          </Html>
        )}
      </mesh>

      {/* 2. 12MP 2x Telephoto Lens Ring */}
      <mesh ref={ring2Ref} position={[0, 0.012, 0.006]}>
        <torusGeometry args={[0.013, 0.0004, 16, 64]} />
        <meshStandardMaterial
          color="#bf5af2"
          emissive="#bf5af2"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.9}
        />
        {explodedProgress > 0.35 && (
          <Html
            position={[-0.032, 0.018, 0]}
            className="camera-callout-html"
            style={{ pointerEvents: 'none' }}
          >
            <div className="camera-callout-card">
              <div className="callout-title" style={{ color: '#bf5af2' }}>12MP 2x Telephoto</div>
              <div className="callout-spec">52 mm • ƒ/1.6 • Optical Quality</div>
            </div>
          </Html>
        )}
      </mesh>

      {/* 3. 48MP Ultra Wide Lens Ring (Lower Lens) */}
      <mesh ref={ring3Ref} position={[0, -0.014, 0.006]}>
        <torusGeometry args={[0.011, 0.0006, 16, 64]} />
        <meshStandardMaterial
          color="#30d158"
          emissive="#30d158"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
        {explodedProgress > 0.25 && (
          <Html
            position={[0.018, -0.005, 0]}
            className="camera-callout-html"
            style={{ pointerEvents: 'none' }}
          >
            <div className="camera-callout-card">
              <div className="callout-title" style={{ color: '#30d158' }}>48MP Ultra Wide</div>
              <div className="callout-spec">13 mm • ƒ/2.2 • 120° FOV & Macro</div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};
