import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface StarryNightModelProps {
  foldProgress: number; // 0 (closed) to 1 (flat open)
  pointerParallax?: boolean;
}

// Utility to split non-indexed geometry across the hinge seam at x = 0
function splitGeometryAtXZero(sourceGeo: THREE.BufferGeometry) {
  const nonIndexed = sourceGeo.toNonIndexed();
  const pos = nonIndexed.attributes.position;
  const norm = nonIndexed.attributes.normal;
  const uv = nonIndexed.attributes.uv;

  const leftIndices: number[] = [];
  const rightIndices: number[] = [];

  for (let i = 0; i < pos.count; i += 3) {
    const x0 = pos.getX(i);
    const x1 = pos.getX(i + 1);
    const x2 = pos.getX(i + 2);
    const avgX = (x0 + x1 + x2) / 3;
    if (avgX < 0) {
      leftIndices.push(i, i + 1, i + 2);
    } else {
      rightIndices.push(i, i + 1, i + 2);
    }
  }

  function createSubGeo(indices: number[]) {
    const subGeo = new THREE.BufferGeometry();
    const count = indices.length;
    const subPos = new Float32Array(count * 3);
    const subNorm = norm ? new Float32Array(count * 3) : null;
    const subUv = uv ? new Float32Array(count * 2) : null;

    for (let j = 0; j < count; j++) {
      const idx = indices[j];
      subPos[j * 3 + 0] = pos.getX(idx);
      subPos[j * 3 + 1] = pos.getY(idx);
      subPos[j * 3 + 2] = pos.getZ(idx);

      if (subNorm && norm) {
        subNorm[j * 3 + 0] = norm.getX(idx);
        subNorm[j * 3 + 1] = norm.getY(idx);
        subNorm[j * 3 + 2] = norm.getZ(idx);
      }
      if (subUv && uv) {
        subUv[j * 2 + 0] = uv.getX(idx);
        subUv[j * 2 + 1] = uv.getY(idx);
      }
    }

    subGeo.setAttribute('position', new THREE.BufferAttribute(subPos, 3));
    if (subNorm) subGeo.setAttribute('normal', new THREE.BufferAttribute(subNorm, 3));
    if (subUv) subGeo.setAttribute('uv', new THREE.BufferAttribute(subUv, 2));
    return subGeo;
  }

  return {
    leftGeo: createSubGeo(leftIndices),
    rightGeo: createSubGeo(rightIndices)
  };
}

export const StarryNightModel: React.FC<StarryNightModelProps> = ({
  foldProgress = 0,
  pointerParallax = true
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftGroupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/models/apple_iphone_duo_starry_night.glb');

  // Load Starry Night display textures
  const [innerWallpaper, outerWallpaper] = useTexture([
    '/textures/Screenshot 2026-09-10 110342_1.jpeg',
    '/textures/diting_result_0556d80face611f18fdc32c7adbddc79_1 (1)_0.jpeg'
  ]);

  useMemo(() => {
    if (innerWallpaper) {
      innerWallpaper.colorSpace = THREE.SRGBColorSpace;
      innerWallpaper.flipY = false;
      innerWallpaper.generateMipmaps = true;
    }
    if (outerWallpaper) {
      outerWallpaper.colorSpace = THREE.SRGBColorSpace;
      outerWallpaper.flipY = false;
      outerWallpaper.generateMipmaps = true;
    }
  }, [innerWallpaper, outerWallpaper]);

  // Build normalized, grouped Starry Night assembly
  const { rootAssembly, leftGroup } = useMemo(() => {
    const root = new THREE.Group();
    root.name = 'StarryNight_Root';

    // The GLB has Apple_iPhone_Duo_1 (closed duplicate) and Apple_iPhone_Duo_2 (open base)
    const clone = gltf.scene.clone(true);

    // Hide Apple_iPhone_Duo_1
    const closedDuplicate = clone.getObjectByName('Apple_iPhone_Duo_1');
    if (closedDuplicate) {
      closedDuplicate.visible = false;
    }

    const openBase = clone.getObjectByName('Apple_iPhone_Duo_2') as THREE.Group;
    if (!openBase) {
      return { rootAssembly: root, leftGroup: new THREE.Group() };
    }

    // Reset transform & normalize scale to 0.1 (bringing 1.65m to 0.165m)
    openBase.position.set(0, 0, 0);
    openBase.rotation.set(0, 0, 0);
    openBase.scale.set(0.1, 0.1, 0.1);
    openBase.updateMatrixWorld(true);

    const lGroup = new THREE.Group();
    lGroup.name = 'StarryNight_LeftHalf';
    const rGroup = new THREE.Group();
    rGroup.name = 'StarryNight_RightHalf';
    const hGroup = new THREE.Group();
    hGroup.name = 'StarryNight_Hinge';

    // Collect meshes to re-parent
    const toReparent: { obj: THREE.Object3D; target: THREE.Group }[] = [];

    openBase.children.forEach((child) => {
      const name = child.name;

      if (name.includes('Cube001')) {
        // Hinge mechanism at x = 0
        toReparent.push({ obj: child, target: hGroup });
      } else if (name.includes('Frame_L') || name.includes('Screen_back') || name.includes('Screw002') || name.includes('USB')) {
        // Left half components (x < 0)
        toReparent.push({ obj: child, target: lGroup });
      } else if (
        name.includes('Frame_R') ||
        name.includes('Camera') ||
        name.includes('Frame_camera') ||
        name.includes('glass_back') ||
        name.includes('Glass004') ||
        name.includes('Apple_logo') ||
        name.includes('button')
      ) {
        // Right half components (x > 0)
        toReparent.push({ obj: child, target: rGroup });
      }
    });

    toReparent.forEach(({ obj, target }) => {
      target.add(obj);
    });

    // Handle screen split: Screen & Glass_Screen span across both halves
    const screenGroup = openBase.getObjectByName('Screen');
    if (screenGroup) {
      screenGroup.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          const { leftGeo, rightGeo } = splitGeometryAtXZero(m.geometry);

          const leftMesh = new THREE.Mesh(leftGeo, m.material);
          leftMesh.name = `${m.name}_Left`;
          lGroup.add(leftMesh);

          const rightMesh = new THREE.Mesh(rightGeo, m.material);
          rightMesh.name = `${m.name}_Right`;
          rGroup.add(rightMesh);
        }
      });
      screenGroup.visible = false;
    }

    const glassScreen = openBase.getObjectByName('Glass_Screen') as THREE.Mesh;
    if (glassScreen && glassScreen.isMesh) {
      const { leftGeo, rightGeo } = splitGeometryAtXZero(glassScreen.geometry);

      const leftGlass = new THREE.Mesh(leftGeo, glassScreen.material);
      leftGlass.name = 'Glass_Screen_Left';
      lGroup.add(leftGlass);

      const rightGlass = new THREE.Mesh(rightGeo, glassScreen.material);
      rightGlass.name = 'Glass_Screen_Right';
      rGroup.add(rightGlass);

      glassScreen.visible = false;
    }

    openBase.add(lGroup);
    openBase.add(rGroup);
    openBase.add(hGroup);

    root.add(openBase);

    return { rootAssembly: root, leftGroup: lGroup };
  }, [gltf.scene]);

  // Keep leftGroup ref
  useEffect(() => {
    (leftGroupRef as any).current = leftGroup;
  }, [leftGroup]);

  // Tune materials for Starry Night finish
  useEffect(() => {
    rootAssembly.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        const matName = mat.name;
        const meshName = mesh.name;

        // 1. TITANIUM FRAME (NIGHT SKY)
        if (matName.includes('Frame') || matName.includes('Night Sky')) {
          mat.color.set('#161822'); // Obsidian midnight titanium
          mat.metalness = 0.94;
          mat.roughness = 0.22;
          mat.envMapIntensity = 1.8;
          mat.needsUpdate = true;
        }
        // 2. GLASS BACKPANEL
        else if (matName.includes('Glass back') || meshName.includes('glass_back')) {
          mat.color.set('#111319'); // Deep dark ceramic glass
          mat.metalness = 0.18;
          mat.roughness = 0.28;
          mat.envMapIntensity = 1.3;
          mat.needsUpdate = true;
        }
        // 3. CAMERA MODULE
        else if (matName.includes('Camera') || meshName.includes('Camera')) {
          mat.color.set('#1b1d28');
          mat.metalness = 0.92;
          mat.roughness = 0.18;
          mat.envMapIntensity = 2.0;
          mat.needsUpdate = true;
        }
        // 4. INNER DISPLAY WALLPAPER
        else if (matName.includes('Screen.001') || meshName.includes('Cube011')) {
          mat.map = innerWallpaper;
          mat.emissiveMap = innerWallpaper;
          mat.color.set('#ffffff');
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.38;
          mat.roughness = 0.12;
          mat.metalness = 0.05;
          mat.needsUpdate = true;
        }
        // 5. OUTER COVER SCREEN WALLPAPER
        else if (matName.includes('Screen.002') || meshName.includes('Screen_back')) {
          if (!meshName.includes('Screen_back001')) {
            mat.map = outerWallpaper;
            mat.emissiveMap = outerWallpaper;
            mat.color.set('#ffffff');
            mat.emissive.set('#ffffff');
            mat.emissiveIntensity = 0.38;
            mat.roughness = 0.12;
            mat.metalness = 0.05;
            mat.needsUpdate = true;
          }
        }
        // 6. PROTECTIVE COVER GLASS
        else if (matName.includes('Glass screen') || meshName.includes('Screen_back001') || meshName.includes('Glass_Screen')) {
          mat.transparent = true;
          mat.opacity = 0.12;
          mat.roughness = 0.04;
          mat.metalness = 0.1;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        }
        // 7. SAPPHIRE CAMERA GLASS
        else if (matName.includes('Glass сamera') || matName.includes('Glass.001')) {
          mat.transparent = true;
          mat.opacity = 0.88;
          mat.roughness = 0.04;
          (mat as THREE.MeshPhysicalMaterial).transmission = 0.9;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        }
      }
    });
  }, [rootAssembly, innerWallpaper, outerWallpaper]);

  // Smooth lerp ref for fold animation
  const currentProgressRef = useRef(foldProgress);

  useFrame((state, delta) => {
    currentProgressRef.current = THREE.MathUtils.lerp(
      currentProgressRef.current,
      foldProgress,
      Math.min(delta * 12, 1)
    );

    // Fold rotation: at foldProgress 1.0 (180° open), rotation is 0
    // at foldProgress 0.0 (closed), left half folds inward around Y axis by Math.PI
    if (leftGroupRef.current) {
      const targetRotationY = (1.0 - currentProgressRef.current) * Math.PI;
      leftGroupRef.current.rotation.y = targetRotationY;
    }

    // Gentle subtle pointer parallax on desktop
    if (groupRef.current && pointerParallax) {
      const targetRotY = (state.pointer.x * Math.PI) / 36;
      const targetRotX = (-state.pointer.y * Math.PI) / 48;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={rootAssembly} position={[0, -0.05, 0]} scale={1.0} />
    </group>
  );
};

useGLTF.preload('/models/apple_iphone_duo_starry_night.glb');
