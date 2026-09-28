import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, RotateCcw } from 'lucide-react';
import { UnifiedDuoDevice } from '../3d/UnifiedDuoModel';
import { StudioEnvironment } from '../3d/StudioEnvironment';
import { sounds } from './AudioHaptics';

interface ModelViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ModelViewerModal: React.FC<ModelViewerModalProps> = ({
  isOpen,
  onClose,
  triggerRef
}) => {
  const [foldRatio, setFoldRatio] = useState<number>(1.0); // 0 (closed), 0.5 (90° Duo), 1.0 (180° Flat)
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Standardized camera presets framing both finishes
  const getCameraPreset = (ratio: number) => {
    if (ratio < 0.25) {
      // Closed: Upright framing both phones side-by-side
      return { pos: new THREE.Vector3(0, 0.04, 0.36), target: new THREE.Vector3(0, 0, 0) };
    } else if (ratio < 0.75) {
      // 90° Duo: Angled studio perspective
      return { pos: new THREE.Vector3(0, 0.05, 0.38), target: new THREE.Vector3(0, 0, 0) };
    } else {
      // 180° Flat: Broad perspective framing both expansive displays
      return { pos: new THREE.Vector3(0, 0.03, 0.40), target: new THREE.Vector3(0, 0, 0) };
    }
  };

  // Accessibility: Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  // Idle timer for auto-rotate
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleUserInteract = () => {
    setAutoRotate(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 4500);
  };

  const handleResetCamera = () => {
    sounds.playClick();
    if (controlsRef.current) {
      const preset = getCameraPreset(foldRatio);
      const cam = controlsRef.current.object as THREE.Camera;
      cam.position.copy(preset.pos);
      controlsRef.current.target.copy(preset.target);
      controlsRef.current.update();
    }
  };

  const applyPreset = (targetRatio: number) => {
    setFoldRatio(targetRatio);
    sounds.playClick();
    if (controlsRef.current) {
      const preset = getCameraPreset(targetRatio);
      const cam = controlsRef.current.object as THREE.Camera;
      cam.position.copy(preset.pos);
      controlsRef.current.target.copy(preset.target);
      controlsRef.current.update();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explorer-modal-title"
    >
      <div className="model-viewer-modal" ref={dialogRef}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="explorer-modal-title" className="modal-title">
              iPhone Duo 3D Inspector
            </h2>
            <span className="modal-subtitle">
              Dual Finish Studio • Star White & Night Sky Titanium Side-by-Side
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            aria-label="Close 3D explorer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Canvas Stage */}
        <div
          className="modal-canvas-stage"
          onPointerDown={handleUserInteract}
          onTouchStart={handleUserInteract}
          onWheel={handleUserInteract}
        >
          <Canvas
            camera={{ position: [0, 0.03, 0.38], fov: 38, near: 0.05, far: 20 }}
            dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.25
            }}
          >
            <Suspense fallback={null}>
              <StudioEnvironment theme="dark" introSweep={0} />

              <OrbitControls
                ref={controlsRef}
                autoRotate={autoRotate}
                autoRotateSpeed={0.8}
                enableDamping
                dampingFactor={0.06}
                minDistance={0.18}
                maxDistance={0.75}
                maxPolarAngle={Math.PI / 2 + 0.3}
                minPolarAngle={Math.PI / 6}
                target={[0, 0, 0]}
              />

              {/* Star White Titanium Device (Left) */}
              <UnifiedDuoDevice
                modelUrl="/models/main-starwhite.glb"
                variantId="star-white"
                foldProgress={foldRatio}
                position={[-0.075, 0, 0]}
                rotation={[0, 0.15, 0]}
                visible={true}
              />

              {/* Night Sky Titanium Device (Right) */}
              <UnifiedDuoDevice
                modelUrl="/models/main-starrynight.glb"
                variantId="starry-night"
                foldProgress={foldRatio}
                position={[0.075, 0, 0]}
                rotation={[0, -0.15, 0]}
                visible={true}
              />
            </Suspense>
          </Canvas>

          {/* Floating Minimal Controls Panel */}
          <div className="explorer-control-bar">
            {/* Dual Finish Indicator Badge */}
            <div className="explorer-swatch-group" style={{ padding: '6px 14px', gap: '10px' }}>
              <span className="dot-white" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f5f6f8', border: '1px solid rgba(255,255,255,0.6)' }} />
              <span className="dot-night" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1c1f2e', border: '1px solid #3b82f6' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em', color: '#f5f5f7' }}>
                Star White & Night Sky
              </span>
            </div>

            <div className="explorer-divider" aria-hidden="true" />

            {/* Fold State Milestones */}
            <div className="explorer-fold-group" role="group" aria-label="Fold State Presets">
              <button
                type="button"
                className={`explorer-preset-btn ${foldRatio === 0 ? 'active' : ''}`}
                onClick={() => applyPreset(0)}
              >
                Closed
              </button>
              <button
                type="button"
                className={`explorer-preset-btn ${foldRatio === 0.5 ? 'active' : ''}`}
                onClick={() => applyPreset(0.5)}
              >
                90° Duo
              </button>
              <button
                type="button"
                className={`explorer-preset-btn ${foldRatio === 1.0 ? 'active' : ''}`}
                onClick={() => applyPreset(1.0)}
              >
                180° Flat
              </button>
            </div>

            <div className="explorer-divider" aria-hidden="true" />

            {/* Reset Camera View */}
            <button
              type="button"
              className="explorer-reset-btn"
              onClick={handleResetCamera}
              title="Reset Camera Framing"
              aria-label="Reset Camera Framing"
            >
              <RotateCcw size={14} />
              <span>Reset View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
