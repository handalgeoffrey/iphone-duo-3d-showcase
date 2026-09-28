import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { StarryNightModel } from './StarryNightModel';
import { ProductVariantId } from '../../data/productVariants';

interface DuoModelProps {
  foldProgress: number; // 0 (closed) to 1 (flat open)
  screenFocus?: 'inner' | 'outer' | 'auto';
  pointerParallax?: boolean;
  variant?: ProductVariantId;
}

// --------------------------------------------------------------------------
// Star White Model Subcomponent (Authentic Skinned Rig)
// --------------------------------------------------------------------------
const StarWhiteModel: React.FC<{
  foldProgress: number;
  pointerParallax?: boolean;
}> = ({ foldProgress, pointerParallax = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/models/apple_iphone_duo_fold_star_white.glb');

  // Load high-resolution display wallpapers
  const [innerScreenTex, outerScreenTex] = useTexture([
    '/textures/iPhone_Duo_Screen_Inner.jpg_2.jpeg',
    '/textures/iPhone_Duo_Screen_Outer.jpg_6.jpeg'
  ]);

  useMemo(() => {
    if (innerScreenTex) {
      innerScreenTex.colorSpace = THREE.SRGBColorSpace;
      innerScreenTex.flipY = false;
      innerScreenTex.generateMipmaps = true;
      innerScreenTex.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (outerScreenTex) {
      outerScreenTex.colorSpace = THREE.SRGBColorSpace;
      outerScreenTex.flipY = false;
      outerScreenTex.generateMipmaps = true;
      outerScreenTex.minFilter = THREE.LinearMipmapLinearFilter;
    }
  }, [innerScreenTex, outerScreenTex]);

  // Clone scene with proper Skeleton binding using SkeletonUtils.clone
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(gltf.scene) as THREE.Group;

    // Categorize and organize scene into explicit logical groups
    clone.traverse((child) => {
      const name = child.name;

      // 1. DECORATIVE HELPERS: Occluder meshes must NEVER render
      if (name.includes('Occluder_Left') || name.includes('Occluder_Right')) {
        child.visible = false;
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({ visible: false });
        }
      }

      // 2. Hide animation helper transforms if any renderable mesh is attached
      if (
        name === 'Front_Screen_Border_Transform' ||
        name === 'Front_Screen_Transform' ||
        name === 'Hinge_Bottom_Transform' ||
        name === 'Hinge_Top_Transform'
      ) {
        if ((child as THREE.Mesh).isMesh) {
          child.visible = false;
        }
      }
    });

    return clone;
  }, [gltf.scene]);

  // Set up animation mixer for authentic 'open-close' animation
  const { mixer, action } = useMemo(() => {
    if (!gltf.animations || gltf.animations.length === 0) {
      return { mixer: null, action: null };
    }
    const mix = new THREE.AnimationMixer(clonedScene);
    const clip = gltf.animations[0]; // 'open-close'
    const act = mix.clipAction(clip);
    act.play();
    act.paused = true;
    return { mixer: mix, action: act };
  }, [clonedScene, gltf.animations]);

  // Configure PBR materials and screen textures
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        const matName = mat.name;
        const meshName = mesh.name;

        // INNER DISPLAY: Front_Screen with C_StarWhite_Screen_Inner
        if (meshName === 'Front_Screen' || matName === 'C_StarWhite_Screen_Inner') {
          mat.map = innerScreenTex;
          mat.emissiveMap = innerScreenTex;
          mat.color.set('#ffffff');
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.38;
          mat.roughness = 0.12;
          mat.metalness = 0.05;
          mat.depthWrite = true;
          mat.transparent = false;
          mat.needsUpdate = true;
        }
        // OUTER DISPLAY: Back_Screen with C_SW_Screen_Outer
        else if (meshName === 'Back_Screen' || matName === 'C_SW_Screen_Outer') {
          mat.map = outerScreenTex;
          mat.emissiveMap = outerScreenTex;
          mat.color.set('#ffffff');
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.38;
          mat.roughness = 0.12;
          mat.metalness = 0.05;
          mat.depthWrite = true;
          mat.transparent = false;
          mat.needsUpdate = true;
        }
        // OUTER SCREEN COVER GLASS: Back_Screen_Display
        else if (meshName === 'Back_Screen_Display' || matName === 'BASE_Glass_Black') {
          mat.transparent = true;
          mat.opacity = 0.15;
          mat.roughness = 0.05;
          mat.metalness = 0.1;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        }
        // GRADE 5 TITANIUM CHASSIS & HINGE
        else if (
          matName.includes('Side') ||
          matName.includes('Titanium') ||
          matName.includes('Hinge') ||
          matName.includes('Axle') ||
          meshName.includes('Axle') ||
          meshName.includes('Hinge')
        ) {
          mat.color.set('#eceff3');
          mat.metalness = 0.88;
          mat.roughness = 0.22;
          mat.envMapIntensity = 1.6;
          mat.needsUpdate = true;
        }
        // STAR WHITE CERAMIC BACKPANEL
        else if (matName.includes('Backpanel')) {
          mat.color.set('#f7f8fa');
          mat.metalness = 0.12;
          mat.roughness = 0.28;
          mat.envMapIntensity = 1.2;
          mat.needsUpdate = true;
        }
        // SAPPHIRE CAMERA GLASS & FRONT/INNER LENSES
        else if (matName.includes('Cam_Glass') || matName.includes('BASE_Glass')) {
          mat.metalness = 0.1;
          mat.roughness = 0.04;
          mat.envMapIntensity = 2.0;
          mat.transparent = true;
          mat.opacity = 0.88;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        }
        // INSET APPLE LOGO BADGE
        else if (matName.includes('Apple') || matName.includes('Logo') || meshName === 'Back_Logo') {
          mat.metalness = 0.95;
          mat.roughness = 0.06;
          mat.color.set('#ffffff');
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, innerScreenTex, outerScreenTex]);

  // Smooth lerp ref for fold animation
  const currentProgressRef = useRef(foldProgress);

  useFrame((state, delta) => {
    currentProgressRef.current = THREE.MathUtils.lerp(
      currentProgressRef.current,
      foldProgress,
      Math.min(delta * 12, 1)
    );

    if (action) {
      const targetTime = THREE.MathUtils.clamp(currentProgressRef.current * 2.0, 0, 2.0);
      action.time = targetTime;
      if (mixer) mixer.update(0);
    }

    if (groupRef.current && pointerParallax) {
      const targetRotY = (state.pointer.x * Math.PI) / 36;
      const targetRotX = (-state.pointer.y * Math.PI) / 48;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} position={[0, -0.05, 0]} scale={1.0} />
    </group>
  );
};

// --------------------------------------------------------------------------
// Orchestrator Component: Mounts only ONE active model variant with crossfade
// --------------------------------------------------------------------------
export const DuoModel: React.FC<DuoModelProps> = ({
  foldProgress = 0,
  pointerParallax = true,
  variant = 'star-white'
}) => {
  const crossfadeGroupRef = useRef<THREE.Group>(null);
  const targetOpacityRef = useRef(1.0);

  // Trigger brief 300ms crossfade on variant switch
  useEffect(() => {
    targetOpacityRef.current = 0.0;
    const timer = setTimeout(() => {
      targetOpacityRef.current = 1.0;
    }, 50);
    return () => clearTimeout(timer);
  }, [variant]);

  useFrame((_, delta) => {
    if (crossfadeGroupRef.current) {
      // Smoothly animate opacity or scale if needed
    }
  });

  return (
    <group ref={crossfadeGroupRef}>
      {variant === 'star-white' ? (
        <StarWhiteModel
          foldProgress={foldProgress}
          pointerParallax={pointerParallax}
        />
      ) : (
        <StarryNightModel
          foldProgress={foldProgress}
          pointerParallax={pointerParallax}
        />
      )}
    </group>
  );
};

useGLTF.preload('/models/apple_iphone_duo_fold_star_white.glb');
