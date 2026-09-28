import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { UnifiedDuoDevice } from './UnifiedDuoModel';
import { PRODUCT_VARIANTS } from '../../data/productVariants';
import { DimensionLines3D } from './DimensionLines3D';
import { DurabilityParticles } from './DurabilityParticles';
import { CameraFocusRings } from './CameraFocusRings';
import { ChipLightPaths } from './ChipLightPaths';

interface ProductStageProps {
  currentChapterIndex: number;
  chapterProgress: number; // 0 to 1
  foldProgress: number;    // 0 to 1
  theme: 'dark' | 'light';
  scrollSpeed: number;
}

export const ProductStage: React.FC<ProductStageProps> = ({
  currentChapterIndex,
  chapterProgress,
  foldProgress,
  scrollSpeed
}) => {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  // Direct Group refs for 60/120fps direct Three.js transform manipulation
  const whiteGroupRef = useRef<THREE.Group>(null);
  const nightGroupRef = useRef<THREE.Group>(null);

  // Position & rotation refs for Star White model
  const whitePos = useRef(new THREE.Vector3());
  const whiteRot = useRef(new THREE.Euler());
  const whiteScale = useRef(1.0);
  const whiteFold = useRef(1.0);

  // Position & rotation refs for Night Sky model
  const nightPos = useRef(new THREE.Vector3());
  const nightRot = useRef(new THREE.Euler());
  const nightScale = useRef(0.92);
  const nightFold = useRef(0.5);

  useFrame((state, delta) => {
    const idleTime = state.clock.getElapsedTime();
    // Gentle floating breathing motion with subtle phase shift between devices
    const idleBobWhite = Math.sin(idleTime * 1.2) * 0.0016;
    const idleRotWhite = Math.cos(idleTime * 0.8) * 0.012;

    const idleBobNight = Math.sin(idleTime * 1.2 + 1.2) * 0.0014;
    const idleRotNight = Math.cos(idleTime * 0.8 + 1.2) * 0.010;

    // ------------------------------------------------------------------------
    // Chapter Choreography for BOTH Phones (Star White & Night Sky Co-Starring)
    // ------------------------------------------------------------------------
    switch (currentChapterIndex) {
      // ----------------------------------------------------------------------
      // Chapter 0: HERO (Sculptural Duo Monolith)
      // Star White: Unfolded 180° flat, luminous 7.6" OLED canvas in foreground
      // Night Sky: Sculpted 90° Duo laptop mode, showing dark titanium back & cover
      // ----------------------------------------------------------------------
      case 0: {
        if (isMobile) {
          // Mobile: Stacked gracefully with depth
          whitePos.current.set(0, 0.02 + idleBobWhite, 0.02);
          whiteRot.current.set(0.06, 0.16 + idleRotWhite, -0.02);
          whiteScale.current = 0.95;
          whiteFold.current = 1.0;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.03);
          nightRot.current.set(-0.04, -0.25 + idleRotNight, 0.02);
          nightScale.current = 0.82;
          nightFold.current = 0.5;
        } else {
          // Desktop / Tablet: Perfectly balanced dual-device composition
          const wX = isTablet ? 0.020 : 0.046;
          const nX = isTablet ? 0.098 : 0.120;

          whitePos.current.set(wX, idleBobWhite, 0.02);
          whiteRot.current.set(0.08, 0.20 + idleRotWhite, -0.02);
          whiteScale.current = 1.0;
          whiteFold.current = 1.0;

          nightPos.current.set(nX, -0.005 + idleBobNight, -0.035);
          nightRot.current.set(-0.04, -0.32 + idleRotNight, 0.02);
          nightScale.current = 0.90;
          nightFold.current = 0.5;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 1: Unfold Moment (Synchronized Unfolding)
      // Star White opens smoothly from 0 to 180° driven by scroll
      // Night Sky articulates into 90° Duo mode, demonstrating the zero-gap hinge
      // ----------------------------------------------------------------------
      case 1: {
        const targetFold = THREE.MathUtils.clamp(foldProgress, 0, 1.0);
        whiteFold.current = THREE.MathUtils.lerp(whiteFold.current, targetFold, delta * 12);

        if (isMobile) {
          whitePos.current.set(0, 0.015 + idleBobWhite, 0.02);
          whiteRot.current.set(0.06, 0.12 + idleRotWhite * 0.5, 0);
          whiteScale.current = 0.95;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.03);
          nightRot.current.set(-0.04, -0.22 + idleRotNight * 0.5, 0);
          nightScale.current = 0.82;
          nightFold.current = 0.5;
        } else {
          whitePos.current.set(0.038, 0.01 + idleBobWhite, 0.02);
          whiteRot.current.set(0.06, 0.14 + idleRotWhite * 0.5, 0);
          whiteScale.current = 1.0;

          nightPos.current.set(0.112, -0.005 + idleBobNight, -0.03);
          nightRot.current.set(-0.04, -0.28 + idleRotNight * 0.5, 0);
          nightScale.current = 0.90;
          nightFold.current = 0.5 + 0.3 * targetFold;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 2: Precision Design & Dimensions (Dual Turntable)
      // Both devices spin in synchronized orbital turntable
      // DimensionLines3D attached around them
      // ----------------------------------------------------------------------
      case 2: {
        const turntableAngle1 = idleTime * 0.35 + chapterProgress * Math.PI * 0.8;
        const turntableAngle2 = turntableAngle1 + Math.PI * 0.55;

        if (isMobile) {
          whitePos.current.set(0, 0.02 + idleBobWhite, 0.01);
          whiteRot.current.set(0.05, turntableAngle1, 0);
          whiteScale.current = 0.92;
          whiteFold.current = 0.85;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.02);
          nightRot.current.set(-0.05, turntableAngle2, 0);
          nightScale.current = 0.82;
          nightFold.current = 0.0; // Closed 11.3mm profile
        } else {
          whitePos.current.set(0.038, idleBobWhite, 0.01);
          whiteRot.current.set(0.05, turntableAngle1, 0);
          whiteScale.current = 1.0;
          whiteFold.current = 0.85;

          nightPos.current.set(0.114, idleBobNight, -0.02);
          nightRot.current.set(-0.05, turntableAngle2, 0);
          nightScale.current = 0.92;
          nightFold.current = 0.0; // Closed profile
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 3: Displays (Inner 7.6" Canvas vs Outer 5.4" Cover Screen)
      // Star White stands open flat 180° facing front (7.6" OLED)
      // Night Sky stands closed upright (5.4" Cover screen with 3000 nits)
      // ----------------------------------------------------------------------
      case 3: {
        if (isMobile) {
          whitePos.current.set(0, 0.025 + idleBobWhite, 0.02);
          whiteRot.current.set(0.04, 0.08 + idleRotWhite * 0.4, 0);
          whiteScale.current = 0.95;
          whiteFold.current = 1.0;

          nightPos.current.set(0.02, -0.05 + idleBobNight, -0.02);
          nightRot.current.set(0.04, -0.16 + idleRotNight * 0.4, 0);
          nightScale.current = 0.85;
          nightFold.current = 0.0;
        } else {
          whitePos.current.set(0.036, 0.01 + idleBobWhite, 0.02);
          whiteRot.current.set(0.04, 0.08 + idleRotWhite * 0.4, 0);
          whiteScale.current = 1.0;
          whiteFold.current = 1.0;

          nightPos.current.set(0.112, -idleBobNight, -0.015);
          nightRot.current.set(0.04, -0.18 + idleRotNight * 0.4, 0);
          nightScale.current = 0.92;
          nightFold.current = 0.0;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 4: Pro Camera System (48MP Dual Fusion Optics)
      // Night Sky turns around to showcase rear camera bump with Focus Rings
      // Star White floats alongside in Duo mode showing camera viewfinder
      // ----------------------------------------------------------------------
      case 4: {
        if (isMobile) {
          // Night Sky front and center showcasing camera rings
          nightPos.current.set(0, 0.01 + idleBobNight * 0.5, 0.01);
          nightRot.current.set(0.06, Math.PI - 0.14 + idleRotNight * 0.4, 0);
          nightScale.current = 0.95;
          nightFold.current = 0.0;

          whitePos.current.set(-0.02, -0.06 + idleBobWhite, -0.04);
          whiteRot.current.set(-0.04, 0.28, 0);
          whiteScale.current = 0.80;
          whiteFold.current = 0.65;
        } else {
          nightPos.current.set(0.098, idleBobNight * 0.5, 0.01);
          nightRot.current.set(0.06, Math.PI - 0.14 + idleRotNight * 0.4, 0);
          nightScale.current = 1.0;
          nightFold.current = 0.0;

          whitePos.current.set(0.025, 0.01 + idleBobWhite, -0.035);
          whiteRot.current.set(-0.04, 0.28 + idleRotWhite * 0.4, 0);
          whiteScale.current = 0.90;
          whiteFold.current = 0.65;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 5: Performance (Apple A20 Pro Silicon)
      // Both devices levitate slightly over pulsing ChipLightPaths circuits
      // ----------------------------------------------------------------------
      case 5: {
        if (isMobile) {
          whitePos.current.set(0, 0.02 + idleBobWhite, 0.02);
          whiteRot.current.set(0.14, 0.08 + idleRotWhite * 0.5, 0);
          whiteScale.current = 0.92;
          whiteFold.current = 0.85;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.025);
          nightRot.current.set(0.12, -0.16 + idleRotNight * 0.5, 0);
          nightScale.current = 0.85;
          nightFold.current = 0.45;
        } else {
          whitePos.current.set(0.038, 0.01 + idleBobWhite, 0.02);
          whiteRot.current.set(0.14, 0.08 + idleRotWhite * 0.5, 0);
          whiteScale.current = 1.0;
          whiteFold.current = 0.85;

          nightPos.current.set(0.112, -0.005 + idleBobNight, -0.025);
          nightRot.current.set(0.12, -0.16 + idleRotNight * 0.5, 0);
          nightScale.current = 0.92;
          nightFold.current = 0.45;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 6: Battery & Power (Ultrathin 5.2mm Dual Cells)
      // Both devices angled to show the razor-thin titanium edge
      // ----------------------------------------------------------------------
      case 6: {
        if (isMobile) {
          whitePos.current.set(0, 0.02 + idleBobWhite, 0.01);
          whiteRot.current.set(0.06, 0.35 + idleRotWhite * 0.5, 0);
          whiteScale.current = 0.92;
          whiteFold.current = 0.35;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.025);
          nightRot.current.set(-0.04, -0.38 + idleRotNight * 0.5, 0);
          nightScale.current = 0.85;
          nightFold.current = 0.35;
        } else {
          whitePos.current.set(0.038, idleBobWhite, 0.01);
          whiteRot.current.set(0.06, 0.35 + idleRotWhite * 0.5, 0);
          whiteScale.current = 1.0;
          whiteFold.current = 0.35;

          nightPos.current.set(0.112, -idleBobNight, -0.025);
          nightRot.current.set(-0.04, -0.38 + idleRotNight * 0.5, 0);
          nightScale.current = 0.92;
          nightFold.current = 0.35;
        }
        break;
      }

      // ----------------------------------------------------------------------
      // Chapter 7: Grand Finale & Pre-Order Studio
      // Both devices in museum-grade twin presentation
      // ----------------------------------------------------------------------
      case 7:
      default: {
        if (isMobile) {
          whitePos.current.set(0, 0.02 + idleBobWhite, 0.02);
          whiteRot.current.set(0.08, 0.22 + idleRotWhite * 0.6, 0);
          whiteScale.current = 0.92;
          whiteFold.current = 0.85;

          nightPos.current.set(0.01, -0.05 + idleBobNight, -0.025);
          nightRot.current.set(-0.06, -0.30 + idleRotNight * 0.6, 0);
          nightScale.current = 0.85;
          nightFold.current = 0.35;
        } else {
          whitePos.current.set(0.038, idleBobWhite, 0.02);
          whiteRot.current.set(0.08, 0.24 + idleRotWhite * 0.7, 0);
          whiteScale.current = 1.0;
          whiteFold.current = 0.85;

          nightPos.current.set(0.112, -idleBobNight - 0.005, -0.025);
          nightRot.current.set(-0.06, -0.32 + idleRotNight * 0.7, 0);
          nightScale.current = 0.92;
          nightFold.current = 0.35;
        }
        break;
      }
    }

    // Direct, zero-react-overhead Three.js updates on every animation frame
    if (whiteGroupRef.current) {
      whiteGroupRef.current.position.copy(whitePos.current);
      whiteGroupRef.current.rotation.copy(whiteRot.current);
      whiteGroupRef.current.scale.setScalar(whiteScale.current);
    }
    if (nightGroupRef.current) {
      nightGroupRef.current.position.copy(nightPos.current);
      nightGroupRef.current.rotation.copy(nightRot.current);
      nightGroupRef.current.scale.setScalar(nightScale.current);
    }
  });

  return (
    <group name="ProductStage_Root">
      {/* 1. Star White Model Group (Always Mounted & Choreographed) */}
      <group ref={whiteGroupRef} name="StarWhite_Device_Group">
        <UnifiedDuoDevice
          modelUrl={PRODUCT_VARIANTS['star-white'].modelUrl}
          variantId="star-white"
          foldRef={whiteFold}
          visible={true}
        />

        {/* A20 Pro Chip Light Paths: Chapter 5 */}
        <ChipLightPaths
          visible={currentChapterIndex === 5}
          scrollSpeed={scrollSpeed}
        />

        {/* Dimension Lines: Chapter 2 */}
        <DimensionLines3D
          visible={currentChapterIndex === 2}
          isFolded={whiteFold.current < 0.5}
        />
      </group>

      {/* 2. Night Sky Model Group (Always Mounted & Choreographed) */}
      <group ref={nightGroupRef} name="NightSky_Device_Group">
        <UnifiedDuoDevice
          modelUrl={PRODUCT_VARIANTS['night-sky'].modelUrl}
          variantId="night-sky"
          foldRef={nightFold}
          visible={true}
        />

        {/* Camera Focus Rings: attached to rear camera module on Night Sky during Chapter 4 */}
        <group position={[0, -0.059, 0]}>
          <CameraFocusRings
            visible={currentChapterIndex === 4}
            explodedProgress={chapterProgress}
          />
        </group>
      </group>

      {/* Durability Particles: Chapters 1 & 3 */}
      <DurabilityParticles
        visible={currentChapterIndex === 1 || currentChapterIndex === 3}
        intensity={1.2}
      />
    </group>
  );
};
