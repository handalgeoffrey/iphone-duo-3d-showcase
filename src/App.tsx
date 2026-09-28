import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGLTF } from '@react-three/drei';
import { DuoCanvas } from './components/3d/DuoCanvas';
import { ChapterOverlays } from './components/ui/ChapterOverlays';
import { Navigation } from './components/ui/Navigation';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ModelViewerModal } from './components/ui/ModelViewerModal';
import { TechSpecsDrawer } from './components/ui/TechSpecsDrawer';
import { StaticFallback } from './components/ui/StaticFallback';
import { CHAPTERS } from './data/chapters';
import { useLenisScroll } from './hooks/useLenisScroll';

gsap.registerPlugin(ScrollTrigger);

// Preload both hero assets immediately
useGLTF.preload('/models/main-starwhite.glb');
useGLTF.preload('/models/main-starrynight.glb');

export const App: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const previewChapter = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('preview')
    : null;

  const initialIndex = previewChapter === 'preorder'
    ? 7
    : (previewChapter ? Math.max(0, CHAPTERS.findIndex((c) => c.id === previewChapter)) : 0);

  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(initialIndex);
  const [chapterProgress, setChapterProgress] = useState<number>(0);
  const [foldProgress, setFoldProgress] = useState<number>(0);
  const [introSweep, setIntroSweep] = useState<number>(0);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0);

  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Initialize Lenis smooth scroll
  useLenisScroll(reducedMotion);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Lock persistent dark titanium studio theme across whole experience
  useEffect(() => {
    document.body.className = `theme-dark ${reducedMotion ? 'reduced-motion' : ''}`;
    document.body.style.backgroundColor = '#06070a';
  }, [reducedMotion]);

  // Support direct chapter and modal deep linking via query params (e.g. ?chapter=design or ?modal=3d)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('nomotion') === '1') {
      setReducedMotion(true);
    }
    const chap = params.get('chapter');
    if (chap) {
      const idx = CHAPTERS.findIndex((c) => c.id === chap);
      if (idx !== -1) {
        setCurrentChapterIndex(idx);
      }
      setTimeout(() => {
        const el = document.getElementById(chap);
        if (el) {
          window.scrollTo(0, el.offsetTop);
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(el, { immediate: true });
          }
        }
      }, 100);
    }
    if (params.get('modal') === '3d') {
      setTimeout(() => setIsViewerOpen(true), 600);
    }
    if (params.get('modal') === 'specs') {
      setTimeout(() => setIsSpecsOpen(true), 600);
    }
  }, []);

  // Set up GSAP ScrollTriggers for the 8 chapters
  useEffect(() => {
    const chaptersElements = document.querySelectorAll('.story-chapter');
    if (!chaptersElements.length) return;

    const triggers: ScrollTrigger[] = [];

    chaptersElements.forEach((el, index) => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateChapter(index),
        onEnterBack: () => updateChapter(index),
        onUpdate: (self) => {
          setChapterProgress(self.progress);

          // Hero intro lighting sweep
          if (index === 0) {
            setIntroSweep(self.progress);
          }

          // Calculate fold progress interpolation
          const curTarget = CHAPTERS[index]?.foldRatio ?? 0;
          const nextTarget = CHAPTERS[Math.min(index + 1, CHAPTERS.length - 1)]?.foldRatio ?? 0;
          const interpolatedFold = curTarget + (nextTarget - curTarget) * self.progress;
          setFoldProgress(interpolatedFold);

          setScrollSpeed(self.getVelocity() / 1000);
        }
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const updateChapter = useCallback((index: number) => {
    setCurrentChapterIndex(index);
  }, []);

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      document.body.classList.toggle('reduced-motion', next);
      return next;
    });
  };

  const exploreBtnRef = useRef<HTMLButtonElement>(null);
  const activeChapterId = CHAPTERS[currentChapterIndex]?.id || 'hero';

  return (
    <div className="app-container">
      {/* Fixed Global Navigation */}
      <Navigation
        onOpenViewer={() => setIsViewerOpen(true)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        activeChapterId={activeChapterId}
        exploreBtnRef={exploreBtnRef}
      />

      {/* 3D WebGL Canvas Layer or Static Fallback */}
      {webglSupported ? (
        <DuoCanvas
          currentChapterIndex={currentChapterIndex}
          chapterProgress={chapterProgress}
          foldProgress={foldProgress}
          theme="dark"
          introSweep={introSweep}
          scrollSpeed={scrollSpeed}
        />
      ) : (
        <StaticFallback />
      )}

      {/* 8 Scroll Chapters Content Overlays */}
      <ChapterOverlays
        onOpenViewer={() => setIsViewerOpen(true)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        previewChapter={previewChapter}
      />

      {/* Manual 3D Model Explorer Modal - Showcases both finishes simultaneously */}
      <ModelViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        triggerRef={exploreBtnRef}
      />

      {/* Technical Specifications Drawer */}
      <TechSpecsDrawer
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* 3D Fold Animation Loading Screen */}
      <LoadingScreen reducedMotion={reducedMotion} />
    </div>
  );
};

export default App;
