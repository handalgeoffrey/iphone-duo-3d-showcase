'use client';

import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Uses GSAP ScrollTrigger for section reveals. Elements marked with
 * `data-reveal` fade up and settle as they enter the viewport. The hero
 * content reveals immediately on load.
 */
export function ScrollReveal() {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (!elements.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const context = gsap.context(() => {
      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 28, scale: 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  return null;
}
