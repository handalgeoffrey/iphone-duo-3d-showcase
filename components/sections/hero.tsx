'use client';

import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { BuyButton } from '@/components/buy-button';
import { HERO } from '@/lib/site-content';
import { viewerInput } from '@/lib/viewer-store';

function DragHint() {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-page-2">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.5v13M1.5 8h13M8 1.5 6 3.5M8 1.5l2 2M8 14.5l-2-2M8 14.5l2-2M1.5 8l2-2M1.5 8l2 2M14.5 8l-2-2M14.5 8l-2 2"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      Drag to rotate
    </span>
  );
}

export function Hero() {
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select')) return;

    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    viewerInput.dragging = true;
    viewerInput.lastInteraction = performance.now();
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;

    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;

    // Let vertical touch gestures continue to scroll the page naturally.
    if (event.pointerType === 'touch' && Math.abs(dx) <= Math.abs(dy)) return;

    viewerInput.userYaw += dx * 0.007;
    viewerInput.userPitch = Math.max(
      -0.32,
      Math.min(0.32, viewerInput.userPitch + dy * 0.0035),
    );
    viewerInput.lastInteraction = performance.now();

    state.x = event.clientX;
    state.y = event.clientY;
  };

  const endDrag = () => {
    drag.current = null;
    viewerInput.dragging = false;
    viewerInput.lastInteraction = performance.now();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const step = 0.14;
    let handled = true;

    if (event.key === 'ArrowLeft') viewerInput.userYaw -= step;
    else if (event.key === 'ArrowRight') viewerInput.userYaw += step;
    else if (event.key === 'ArrowUp') {
      viewerInput.userPitch = Math.max(-0.32, viewerInput.userPitch - step);
    } else if (event.key === 'ArrowDown') {
      viewerInput.userPitch = Math.min(0.32, viewerInput.userPitch + step);
    } else handled = false;

    if (handled) {
      event.preventDefault();
      viewerInput.lastInteraction = performance.now();
    }
  };

  return (
    <section
      id="overview"
      aria-labelledby="hero-title"
      tabIndex={0}
      role="region"
      aria-label="iPhone Duo introduction. Drag the model to rotate it, or use the arrow keys."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onKeyDown={handleKeyDown}
      className="relative flex min-h-[100svh] select-none flex-col overflow-hidden pb-8 pt-[128px] focus-visible:outline-offset-[-4px] sm:pt-[148px] lg:pb-10"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="mx-auto flex w-full max-w-content flex-1 flex-col px-5 sm:px-8">
        <div className="hero-copy flex max-w-[620px] flex-col">
          <p className="eyebrow" data-reveal>
            {HERO.eyebrow}
          </p>

          <h1 id="hero-title" className="display mt-4" data-reveal>
            {HERO.headline}
          </h1>

          <p className="mt-5 max-w-[520px] text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em] text-page sm:mt-6" data-reveal>
            {HERO.tagline}
          </p>

          <p className="body-copy hero-body mt-5 max-w-[430px]" data-reveal>
            {HERO.body}
          </p>

          <div className="hero-actions mt-8 flex flex-wrap items-center gap-3" data-reveal>
            <BuyButton className="pill-button" />
            <a href="#two-screens" className="pill-button-secondary">
              {HERO.secondaryCta}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v10M7 12l4-4M7 12 3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <p className="mt-4 text-[12px] text-page-2" data-reveal>
            {HERO.price} · Free delivery and free returns
          </p>
        </div>

        <div className="hero-hint mt-auto items-end justify-between gap-6 pt-12">
          <DragHint />
          <a
            href="#two-screens"
            className="nav-link inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-page-2"
          >
            Scroll to unfold
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
              <path d="M7 1v13M7 14l5-5M7 14l-5-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
