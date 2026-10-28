'use client';

import Image from 'next/image';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DuoModel } from '@/components/three/duo-model';
import { StudioLighting } from '@/components/three/studio-lighting';
import { useVariant } from '@/components/variant-provider';
import {
  CLOSED_CENTER_SHIFT,
  clamp,
  scrollState,
  smoothstep,
  stagePose,
  viewerInput,
  type StageName,
} from '@/lib/viewer-store';
import type { Variant } from '@/lib/variants';

interface ScrollKey {
  p: number;
  yaw: number;
  pitch: number;
  open: number;
  scale: number;
  scaleMobile: number;
}

const SCROLLY_KEYS: ScrollKey[] = [
  { p: 0.0, yaw: 0.12, pitch: 0.02, open: 1, scale: 1.0, scaleMobile: 0.95 },
  { p: 0.28, yaw: -1.28, pitch: 0.06, open: 1, scale: 1.0, scaleMobile: 0.95 },
  { p: 0.52, yaw: -2.86, pitch: 0.04, open: 1, scale: 1.0, scaleMobile: 0.95 },
  { p: 0.66, yaw: -3.02, pitch: 0.0, open: 0.92, scale: 0.98, scaleMobile: 0.92 },
  { p: 0.84, yaw: -0.52, pitch: 0.2, open: 0.24, scale: 0.94, scaleMobile: 0.62 },
  { p: 1.0, yaw: 0.18, pitch: 0.2, open: 0, scale: 0.92, scaleMobile: 0.5 },
];

function sampleScrolly(progress: number) {
  if (progress <= SCROLLY_KEYS[0].p) return SCROLLY_KEYS[0];
  for (let i = 0; i < SCROLLY_KEYS.length - 1; i += 1) {
    const from = SCROLLY_KEYS[i];
    const to = SCROLLY_KEYS[i + 1];
    if (progress <= to.p) {
      const t = smoothstep(from.p, to.p, progress);
      return {
        p: progress,
        yaw: THREE.MathUtils.lerp(from.yaw, to.yaw, t),
        pitch: THREE.MathUtils.lerp(from.pitch, to.pitch, t),
        open: THREE.MathUtils.lerp(from.open, to.open, t),
        scale: THREE.MathUtils.lerp(from.scale, to.scale, t),
        scaleMobile: THREE.MathUtils.lerp(from.scaleMobile, to.scaleMobile, t),
      };
    }
  }
  return SCROLLY_KEYS[SCROLLY_KEYS.length - 1];
}

function SoftContactShadow({ night }: { night: boolean }) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(128, 64, 4, 128, 64, 118);
    gradient.addColorStop(0, 'rgba(0,0,0,0.62)');
    gradient.addColorStop(0.38, 'rgba(0,0,0,0.34)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.12)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 128);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);

  if (!texture) return null;

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.17, 0]} scale={[3.25, 1.62, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={night ? 0.62 : 0.3}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

interface StageSceneProps {
  night: boolean;
  seen: Variant[];
  opacityFor: (variant: Variant) => number;
  onModelReady: (variant: Variant) => void;
}

function StageScene({ night, seen, opacityFor, onModelReady }: StageSceneProps) {
  const { camera } = useThree();
  const stageRef = useRef<THREE.Group>(null);
  const rotationRef = useRef<THREE.Group>(null);
  const offsetRef = useRef<THREE.Group>(null);

  useEffect(() => {
    (window as unknown as { __duoDebug?: unknown }).__duoDebug = {
      scrollState,
      stagePose,
      viewerInput,
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const active = scrollState.active;
    const mobile = scrollState.mobile;
    const now = state.clock.elapsedTime;
    const idleFor = performance.now() - viewerInput.lastInteraction;

    if (active !== 'hero') {
      viewerInput.userYaw = THREE.MathUtils.damp(viewerInput.userYaw, 0, 1.6, dt);
      viewerInput.userPitch = THREE.MathUtils.damp(viewerInput.userPitch, 0, 1.6, dt);
    }

    let target = {
      open: 1,
      yaw: 0,
      pitch: 0,
      scale: 1,
      x: 0,
      y: 0,
      cameraZ: 6,
    };

    if (active === 'hero') {
      const narrow = scrollState.width < 600;
      const split = scrollState.heroSplit;
      const sway =
        scrollState.reducedMotion || viewerInput.dragging || idleFor < 2600
          ? 0
          : Math.sin(now * 0.2) * 0.16;
      target = {
        open: 1,
        yaw: sway + viewerInput.userYaw,
        pitch: clamp(viewerInput.userPitch + 0.03, -0.3, 0.3),
        scale: split ? 0.9 : narrow ? 0.78 : 0.92,
        x: split
          ? 1.4 - clamp((scrollState.width - 912) / 528, 0, 1) * 0.5
          : 0,
        y: split ? -0.05 : narrow ? -0.9 : -0.95,
        cameraZ: split ? 6 : 6.6,
      };
    } else if (active === 'scrolly') {
      const key = sampleScrolly(scrollState.scrollyProgress);
      target = {
        open: key.open,
        yaw: key.yaw,
        pitch: key.pitch,
        scale: mobile ? key.scaleMobile : key.scale,
        x: mobile ? 0 : 0.8,
        y: mobile ? 0.55 : 0,
        cameraZ: mobile ? 7.4 : 6,
      };
    } else if (active === 'colour') {
      target = {
        open: 1,
        yaw: 0.55 + Math.sin(now * 0.22) * 0.18,
        pitch: 0.02,
        scale: mobile ? 0.8 : 0.82,
        x: 0,
        y: mobile ? -0.28 : -0.5,
        cameraZ: mobile ? 6.6 : 6,
      };
    } else if (active === 'materials') {
      const progress = smoothstep(0, 1, scrollState.materialsProgress);
      target = {
        open: 0.16,
        yaw: -0.65 + progress * 0.25,
        pitch: 0.16 + progress * 0.1,
        scale: mobile ? 0.95 : 1.0,
        x: mobile ? 0 : 0.72,
        y: mobile ? 0.32 : 0.05,
        cameraZ: mobile ? 6.0 : THREE.MathUtils.lerp(5.9, 3.15, progress),
      };
    }

    const damping = active === 'scrolly' ? 5.2 : 4.6;
    stagePose.open = THREE.MathUtils.damp(stagePose.open, target.open, 5.4, dt);
    stagePose.yaw = THREE.MathUtils.damp(stagePose.yaw, target.yaw, damping, dt);
    stagePose.pitch = THREE.MathUtils.damp(stagePose.pitch, target.pitch, damping, dt);
    stagePose.scale = THREE.MathUtils.damp(stagePose.scale, target.scale, damping, dt);
    stagePose.x = THREE.MathUtils.damp(stagePose.x, target.x, damping, dt);
    stagePose.y = THREE.MathUtils.damp(stagePose.y, target.y, damping, dt);

    if (stageRef.current) {
      stageRef.current.position.set(stagePose.x, stagePose.y, stagePose.z);
      stageRef.current.scale.setScalar(stagePose.scale);
    }
    if (rotationRef.current) {
      rotationRef.current.rotation.set(stagePose.pitch, stagePose.yaw, 0);
    }
    if (offsetRef.current) {
      offsetRef.current.position.x = -CLOSED_CENTER_SHIFT * stagePose.open;
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0, 4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.cameraZ, 3.6, dt);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <StudioLighting />
      <group ref={stageRef}>
        <SoftContactShadow night={night} />
        <group ref={rotationRef}>
          <group ref={offsetRef}>
            {seen.map((variant) => (
              <DuoModel
                key={variant}
                variant={variant}
                opacity={opacityFor(variant)}
                onReady={onModelReady}
              />
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

function measureSections() {
  // The hero section uses id="overview" for the navigation anchor; the stage
  // treats it as the "hero" phase.
  const ids = ['overview', 'two-screens', 'colour', 'materials'] as const;
  const sections: typeof scrollState.sections = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      sections[id] = { top: rect.top + window.scrollY, height: rect.height };
    }
  }
  scrollState.sections = sections;
}

function updateScrollState() {
  const vh = window.innerHeight;
  const y = window.scrollY;
  scrollState.y = y;
  scrollState.vh = vh;
  scrollState.width = window.innerWidth;
  scrollState.mobile = window.innerWidth < 1024;
  scrollState.heroSplit =
    window.innerWidth >= 900 && window.innerWidth > window.innerHeight;

  const s = scrollState.sections;
  scrollState.heroProgress =
    s.overview && s.overview.height > 0
      ? clamp((y - s.overview.top) / s.overview.height, 0, 1)
      : 0;
  scrollState.scrollyProgress =
    s['two-screens'] && s['two-screens'].height > vh
      ? clamp((y - s['two-screens'].top) / (s['two-screens'].height - vh), 0, 1)
      : 0;
  scrollState.colourProgress =
    s.colour && s.colour.height > vh
      ? clamp((y - s.colour.top) / (s.colour.height - vh), 0, 1)
      : 0;
  scrollState.materialsProgress =
    s.materials && s.materials.height > vh
      ? clamp((y - s.materials.top) / (s.materials.height - vh), 0, 1)
      : 0;

  const mid = y + vh * 0.5;
  let active: StageName = 'hidden';
  if (s.overview && mid < s.overview.top + s.overview.height) {
    active = 'hero';
  } else if (s['two-screens'] && mid < s['two-screens'].top + s['two-screens'].height) {
    active = 'scrolly';
  } else if (s.colour && mid < s.colour.top + s.colour.height) {
    active = 'colour';
  } else if (s.materials && mid >= s.materials.top && mid < s.materials.top + s.materials.height) {
    active = 'materials';
  }

  const changed = scrollState.active !== active;
  scrollState.active = active;
  return changed;
}

export function ModelStage() {
  const { variant, meta, ready } = useVariant();
  const { progress } = useProgress();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [seen, setSeen] = useState<Variant[]>([]);
  const [readyMap, setReadyMap] = useState<Record<Variant, boolean>>({
    white: false,
    night: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [active, setActive] = useState<StageName>('hero');

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    setSeen((current) => (current.includes(variant) ? current : [...current, variant]));
  }, [ready, variant]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      scrollState.reducedMotion = media.matches;
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        measureSections();
        updateScrollState();
        setActive(scrollState.active);
      });
    };

    const onScroll = () => {
      const changed = updateScrollState();
      if (changed) setActive(scrollState.active);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const handleModelReady = useCallback((loaded: Variant) => {
    setReadyMap((current) => (current[loaded] ? current : { ...current, [loaded]: true }));
    setHasLoaded(true);
  }, []);

  const activeReady = readyMap[variant];
  const opacityFor = useCallback(
    (candidate: Variant) => {
      if (candidate === variant) return activeReady ? 1 : 0;
      return activeReady ? 0 : 1;
    },
    [variant, activeReady],
  );

  const loading = !hasLoaded || progress < 100;
  const poster = variant === 'night' ? '/duo-poster-night.png' : '/duo-poster-white.png';

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden={active === 'hidden'}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-apple ${
            hasLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={poster}
            alt={`iPhone Duo in ${meta.name}, closed, showing the cover display`}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {supported ? (
          <div
            role="img"
            aria-label={`Interactive 3D model of iPhone Duo in ${meta.name}. Drag to rotate the device.`}
            className={`absolute inset-0 transition-opacity duration-700 ease-apple ${
              active === 'hidden' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 32, near: 0.1, far: 80 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              frameloop={active === 'hidden' ? 'never' : 'always'}
              style={{ touchAction: 'pan-y' }}
            >
              <StageScene
                night={variant === 'night'}
                seen={seen}
                opacityFor={opacityFor}
                onModelReady={handleModelReady}
              />
            </Canvas>
          </div>
        ) : null}
      </div>

      <div
        className={`pointer-events-none fixed left-0 right-0 top-0 z-[70] h-[2px] transition-opacity duration-500 ${
          loading ? 'opacity-100' : 'opacity-0'
        }`}
        role="progressbar"
        aria-label="Loading iPhone Duo 3D model"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full bg-page-text transition-transform duration-200 ease-out"
          style={{
            width: '100%',
            transform: `scaleX(${Math.max(progress, 4) / 100})`,
            transformOrigin: 'left center',
            backgroundColor: 'var(--page-text)',
          }}
        />
      </div>
    </>
  );
}
