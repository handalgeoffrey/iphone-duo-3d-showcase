'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MODEL_URLS, type Variant } from '@/lib/variants';
import { FIT, stagePose } from '@/lib/viewer-store';

interface DuoModelProps {
  variant: Variant;
  opacity?: number;
  onReady?: (variant: Variant) => void;
}

/**
 * Loads one finish of the iPhone Duo, clones its skinned hierarchy, hides the
 * manufacturer mark, and drives the supplied open/close fold animation.
 * The shared stage pose is read every frame so scrolling never re-renders React.
 */
export function DuoModel({ variant, opacity = 1, onReady }: DuoModelProps) {
  const { scene, animations } = useGLTF(MODEL_URLS[variant]);

  const model = useMemo(() => {
    const clone = cloneSkeleton(scene);
    const materials: THREE.Material[] = [];

    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;

      // The supplied asset contains a brand mark on the back panel. The site is
      // a fictional concept, so the mark is removed rather than shown.
      if (object.name.toLowerCase().includes('logo')) {
        object.visible = false;
      }

      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = source.map((material) => {
        const copy = material.clone();
        copy.userData.baseTransparent = copy.transparent;
        copy.userData.baseDepthWrite = copy.depthWrite;
        materials.push(copy);
        return copy;
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0];
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z);
    const scale = largest > 0 ? FIT / largest : 1;

    return { clone, materials, center, scale };
  }, [scene]);

  const group = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, group);

  const currentOpacity = useRef(0);
  const targetOpacity = useRef(opacity);
  targetOpacity.current = opacity;

  useEffect(() => {
    const action = actions['open-close'];
    if (!action) return;
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.play();
    action.paused = false;
    action.clampWhenFinished = true;
    action.time = stagePose.open * 2;
    mixer.update(0);
  }, [actions, mixer]);

  useEffect(() => {
    const id = requestAnimationFrame(() => onReady?.(variant));
    return () => cancelAnimationFrame(id);
  }, [onReady, variant]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);

    currentOpacity.current = THREE.MathUtils.damp(
      currentOpacity.current,
      targetOpacity.current,
      4.2,
      step,
    );

    if (group.current) group.current.visible = currentOpacity.current > 0.008;

    for (const material of model.materials) {
      const target = currentOpacity.current;
      material.opacity = target;
      const base = (material.userData.baseTransparent as boolean | undefined) ?? false;
      material.transparent = base || target < 0.995;
      material.depthWrite = target >= 0.995;
    }

    const action = actions['open-close'];
    if (action) {
      action.time = stagePose.open * 2;
      mixer.update(0);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <group scale={model.scale}>
        <primitive
          object={model.clone}
          position={[-model.center.x, -model.center.y, -model.center.z]}
        />
      </group>
    </group>
  );
}
