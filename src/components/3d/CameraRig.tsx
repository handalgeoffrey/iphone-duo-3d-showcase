import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CHAPTERS } from '../../data/chapters';

interface CameraRigProps {
  currentChapterIndex: number;
  chapterProgress: number; // 0 to 1 within current chapter
  isManualViewer?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  currentChapterIndex,
  chapterProgress,
  isManualViewer = false
}) => {
  const { camera, size } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 0.44));
  const currentTarget = useRef(new THREE.Vector3(0, 0.01, 0));

  useFrame((_, delta) => {
    if (isManualViewer) return;

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    const cur = CHAPTERS[currentChapterIndex] || CHAPTERS[0];
    const nextIndex = Math.min(currentChapterIndex + 1, CHAPTERS.length - 1);
    const nxt = CHAPTERS[nextIndex];

    // Trajectory interpolation
    const startPos = new THREE.Vector3(...cur.cameraPosition);
    const endPos = new THREE.Vector3(...nxt.cameraPosition);
    const targetPos = new THREE.Vector3().lerpVectors(startPos, endPos, chapterProgress);

    const startTgt = new THREE.Vector3(...cur.cameraTarget);
    const endTgt = new THREE.Vector3(...nxt.cameraTarget);
    const targetLookAt = new THREE.Vector3().lerpVectors(startTgt, endTgt, chapterProgress);

    // Responsive Camera Presets & Calibration:
    if (isMobile) {
      // Mobile: pull camera back and lift gaze so the 3D model stays strictly below top copy
      targetPos.z *= 1.38;
      targetPos.y += 0.035;
      targetLookAt.y += 0.015;
    } else if (isTablet) {
      // Tablet: subtle pullback to ensure dual models in hero remain within safe margins
      targetPos.z *= 1.15;
    } else {
      // Desktop: preserve right-side product bias for hero and technical chapters
      if (currentChapterIndex === 0) {
        // Keep center gaze so both left primary and right secondary models are framed
        targetLookAt.x = 0.02;
      }
    }

    // Smooth lerping to destination
    const lerpFactor = Math.min(delta * 4.5, 1);
    currentPos.current.lerp(targetPos, lerpFactor);
    currentTarget.current.lerp(targetLookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
