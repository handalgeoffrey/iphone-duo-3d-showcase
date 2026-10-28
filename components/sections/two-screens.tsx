'use client';

import clsx from 'clsx';
import { useScrollPhases } from '@/lib/use-scroll-phases';
import { TWO_SCREENS } from '@/lib/site-content';

const THRESHOLDS = [0, 0.26, 0.5, 0.75];

export function TwoScreens() {
  const phase = useScrollPhases('two-screens', THRESHOLDS);
  const active = TWO_SCREENS.phases[phase];

  return (
    <section
      id="two-screens"
      aria-labelledby="two-screens-title"
      className="relative min-h-[300vh] lg:min-h-[380vh]"
    >
      <div className="sticky top-[92px] h-[calc(100svh-92px)] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-content flex-col justify-end px-5 pb-8 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:pb-0">
          <div className="card-material rounded-3xl border hairline p-5 sm:p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <p className="eyebrow">{TWO_SCREENS.eyebrow}</p>

            <h2
              id="two-screens-title"
              className="headline mt-3 max-w-[560px] text-[clamp(2rem,4.4vw,4rem)] sm:mt-4"
            >
              {TWO_SCREENS.headline}
            </h2>

            <p className="body-copy mt-4 hidden max-w-[420px] text-[15px] sm:block sm:text-[16px]">
              {TWO_SCREENS.intro}
            </p>

            <ol className="sr-only">
              {TWO_SCREENS.phases.map((item) => (
                <li key={item.index}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="relative mt-5 h-[142px] sm:mt-7 sm:h-[156px]" aria-hidden="true">
              {TWO_SCREENS.phases.map((item, index) => (
                <div
                  key={item.index}
                  className={clsx(
                    'absolute inset-0 transition-all duration-700 ease-apple motion-reduce:transition-none',
                    index === phase
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-2 opacity-0',
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] font-medium tabular-nums tracking-[0.14em] text-page-2">
                      {item.index}
                    </span>
                    <h3 className="text-[21px] font-semibold tracking-[-0.02em] sm:text-[26px]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-[400px] text-[14px] leading-relaxed text-page-2 sm:mt-3 sm:text-[16px]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 sm:mt-5" aria-hidden="true">
              <span className="w-10 text-[11px] tabular-nums text-page-2">
                0{phase + 1}
              </span>
              <div className="flex flex-1 items-center gap-1.5">
                {TWO_SCREENS.phases.map((item, index) => (
                  <span
                    key={item.index}
                    className={clsx(
                      'h-1 rounded-full transition-all duration-500 ease-apple motion-reduce:transition-none',
                      index === phase ? 'w-8 bg-[var(--page-text)]' : 'w-1.5 bg-[var(--hairline)]',
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] tabular-nums text-page-2">04</span>
            </div>

            <p className="sr-only" aria-live="polite">
              {`Screen ${phase + 1} of 4: ${active.title}`}
            </p>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
