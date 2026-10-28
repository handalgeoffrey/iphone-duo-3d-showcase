'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the active phase index for a tall scroll section. The thresholds are
 * progress values (0–1) at which each phase begins. Only re-renders when the
 * phase actually changes.
 */
export function useScrollPhases(id: string, thresholds: number[]) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const element = document.getElementById(id);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / total));

      let next = 0;
      for (let index = 0; index < thresholds.length; index += 1) {
        if (progress >= thresholds[index]) next = index;
      }

      setPhase((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [id, thresholds]);

  return phase;
}
