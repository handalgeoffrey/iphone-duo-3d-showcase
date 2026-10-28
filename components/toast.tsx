'use client';

import { useEffect, useRef, useState } from 'react';
import { registerToast } from '@/lib/toast-store';

export function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    const unregister = registerToast((next) => {
      setMessage(next);
      setVisible(true);
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setVisible(false), 4500);
    });

    return () => {
      unregister();
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-5"
    >
      <div
        className={`card-material max-w-md rounded-2xl border hairline px-5 py-4 text-center text-[13px] leading-relaxed text-page transition-all duration-500 ease-apple motion-reduce:transition-none ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
        style={{ boxShadow: '0 12px 40px var(--shadow-soft)' }}
      >
        {visible ? message : ''}
      </div>
    </div>
  );
}
