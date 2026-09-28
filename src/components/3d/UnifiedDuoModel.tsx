import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { ProductVariantId } from '../../data/productVariants';

export interface UnifiedDuoDeviceProps {
  modelUrl: string;
  variantId: ProductVariantId;
  foldProgress?: number; // 0.0 (closed) to 1.0 (180° flat open)
  foldRef?: React.MutableRefObject<number>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  visible?: boolean;
  isSilhouette?: boolean;
}

export const UnifiedDuoDevice: React.FC<UnifiedDuoDeviceProps> = ({
  modelUrl,
  variantId,
  foldProgress = 1.0,
  foldRef,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  opacity = 1.0,
  visible = true,
  isSilhouette = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelUrl);

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
    clone.traverse((child) => {
      const name = child.name;
      // Hide occluders & animation helper transforms
      if (name.includes('Occluder') || name.includes('_Transform')) {
        child.visible = false;
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({ visible: false });
        }
      }
    });
    return clone;
  }, [gltf.scene]);

  // Bind animation mixer for the authentic 'open-close' animation clip
  const { mixer, action } = useMemo(() => {
    if (!gltf.animations || gltf.animations.length === 0) {
      return { mixer: null, action: null };
    }
    const mix = new THREE.AnimationMixer(clonedScene);
    const clip = gltf.animations[0];
    const act = mix.clipAction(clip);
    act.play();
    act.paused = true;
    return { mixer: mix, action: act };
  }, [clonedScene, gltf.animations]);

  // Configure PBR materials tailored to finish
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

        // Silhouette mode (used in Displays chapter background silhouette)
        if (isSilhouette) {
          mat.color.set('#0d0e14');
          mat.emissive.set('#000000');
          mat.metalness = 0.9;
          mat.roughness = 0.5;
          mat.envMapIntensity = 0.2;
          mat.transparent = true;
          mat.opacity = 0.35 * opacity;
          mat.needsUpdate = true;
          return;
        }

        // Inner Flexible Display
        if (meshName === 'Front_Screen' || matName.includes('Screen_Inner')) {
          mat.map = innerScreenTex;
          mat.emissiveMap = innerScreenTex;
          mat.color.set('#ffffff');
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.42;
          mat.roughness = 0.12;
          mat.metalness = 0.05;
          mat.depthWrite = true;
          mat.transparent = opacity < 0.99;
          mat.opacity = opacity;
        }
        // Outer Cover Display
        else if (meshName === 'Back_Screen' || matName.includes('Screen_Outer')) {
          mat.map = outerScreenTex;
          mat.emissiveMap = outerScreenTex;
          mat.color.set('#ffffff');
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.42;
          mat.roughness = 0.12;
          mat.metalness = 0.05;
          mat.depthWrite = true;
          mat.transparent = opacity < 0.99;
          mat.opacity = opacity;
        }
        // Titanium Chassis & Hinge
        else if (
          matName.includes('Side') ||
          matName.includes('Titanium') ||
          matName.includes('Hinge') ||
          matName.includes('Axle')
        ) {
          if (variantId === 'starry-night' || variantId === 'night-sky') {
            mat.color.set('#161822');
            mat.metalness = 0.94;
            mat.roughness = 0.22;
            mat.envMapIntensity = 2.2;
          } else {
            mat.color.set('#eceff3');
            mat.metalness = 0.88;
            mat.roughness = 0.22;
            mat.envMapIntensity = 1.6;
          }
          mat.transparent = opacity < 0.99;
          mat.opacity = opacity;
        }
        // Ceramic Backpanel
        else if (matName.includes('Backpanel')) {
          if (variantId === 'starry-night' || variantId === 'night-sky') {
            mat.color.set('#111319');
            mat.metalness = 0.22;
            mat.roughness = 0.26;
            mat.envMapIntensity = 1.4;
          } else {
            mat.color.set('#f7f8fa');
            mat.metalness = 0.12;
            mat.roughness = 0.28;
            mat.envMapIntensity = 1.2;
          }
          mat.transparent = opacity < 0.99;
          mat.opacity = opacity;
        }
        // Camera Glass & Sapphire Lenses
        else if (matName.includes('Cam_Glass') || matName.includes('BASE_Glass')) {
          mat.metalness = 0.1;
          mat.roughness = 0.04;
          mat.envMapIntensity = 2.0;
          mat.transparent = true;
          mat.opacity = 0.88 * opacity;
          mat.depthWrite = false;
        }
        // Apple Logo Badge
        else if (matName.includes('Apple') || matName.includes('Logo') || meshName === 'Back_Logo') {
          if (variantId === 'starry-night' || variantId === 'night-sky') {
            mat.color.set('#20222a');
            mat.metalness = 0.95;
            mat.roughness = 0.1;
          } else {
            mat.color.set('#ffffff');
            mat.metalness = 0.95;
            mat.roughness = 0.06;
          }
          mat.transparent = opacity < 0.99;
          mat.opacity = opacity;
        }

        mat.needsUpdate = true;
      }
    });
  }, [clonedScene, innerScreenTex, outerScreenTex, variantId, isSilhouette, opacity]);

  const currentProgressRef = useRef(foldProgress);

  useFrame((_, delta) => {
    const targetFold = foldRef !== undefined ? foldRef.current : foldProgress;
    currentProgressRef.current = THREE.MathUtils.lerp(
      currentProgressRef.current,
      targetFold,
      Math.min(delta * 12, 1)
    );

    if (action) {
      // In the GLB animation clip:
      // time 0.0s = 180° FLAT OPEN
      // time 1.0s = 90° HALF-OPEN
      // time 2.0s = 0° FULLY CLOSED
      // foldProgress convention: 0.0 = CLOSED, 1.0 = 180° FLAT OPEN
      const targetTime = THREE.MathUtils.clamp((1.0 - currentProgressRef.current) * 2.0, 0, 2.0);
      action.time = targetTime;
      if (mixer) mixer.update(0);
    }

    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      groupRef.current.scale.setScalar(scale);
      groupRef.current.visible = visible;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Standardized center point: y = -0.059 centers model on stage (origin [0, 0, 0]) */}
      <primitive object={clonedScene} position={[0, -0.059, 0]} scale={1.0} />
    </group>
  );
};
