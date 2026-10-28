'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { useVariant } from '@/components/variant-provider';

export function StudioLighting() {
  const { variant } = useVariant();
  const night = variant === 'night';

  return (
    <>
      <ambientLight intensity={night ? 0.28 : 0.62} />
      <directionalLight
        position={[3.5, 5, 4]}
        intensity={night ? 2.6 : 2.1}
        color={night ? '#d7e0ff' : '#fff6ea'}
      />
      <directionalLight
        position={[-4.5, 2.5, -3]}
        intensity={night ? 2.2 : 1.15}
        color={night ? '#7e94d6' : '#e2ebff'}
      />
      <directionalLight position={[0, -3, 2]} intensity={0.35} color={night ? '#4a5a88' : '#ffffff'} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={[night ? '#05060b' : '#f4f2ef']} />
        <Lightformer
          form="rect"
          intensity={night ? 3 : 2.5}
          position={[0, 6, 2]}
          scale={[10, 6, 1]}
          target={[0, 0, 0]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          position={[-6, 2, 3]}
          scale={[1, 8, 1]}
          rotation-y={Math.PI / 2}
          color={night ? '#a8baff' : '#fff3e0'}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[6, 2, -2]}
          scale={[1, 8, 1]}
          rotation-y={-Math.PI / 2}
          color={night ? '#8c9ed4' : '#e6efff'}
        />
        <Lightformer
          form="ring"
          intensity={1.1}
          position={[0, -2, 4]}
          scale={3}
          color={night ? '#93a6dd' : '#ffffff'}
        />
      </Environment>
    </>
  );
}
