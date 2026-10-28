'use client';

import clsx from 'clsx';
import { useScrollPhases } from '@/lib/use-scroll-phases';
import { MATERIALS } from '@/lib/site-content';

const THRESHOLDS = [0, 0.28, 0.52, 0.78];

export function Materials() {
  const phase = useScrollPhases('materials', THRESHOLDS);
  const active = MATERIALS.phases[phase];

  return (
    <section
      id="materials"
      aria-labelledby="materials-title"
      className="relative min-h-[240vh]"
    >
      <div className="sticky top-[92px] h-[calc(100svh-92px)] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-content flex-col justify-end px-5 pb-8 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:pb-0">
          <div className="card-material rounded-3xl border hairline p-5 sm:p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <p className="eyebrow">{MATERIALS.eyebrow}</p>

            <h2
              id="materials-title"
              className="headline mt-3 max-w-[540px] text-[clamp(2rem,4.2vw,3.6rem)]"
            >
              {MATERIALS.headline}
            </h2>

            <ol className="sr-only">
              {MATERIALS.phases.map((item) => (
                <li key={item.index}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="relative mt-5 h-[150px] sm:mt-7 sm:h-[160px]" aria-hidden="true">
              {MATERIALS.phases.map((item, index) => (
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
                  <p className="mt-2.5 max-w-[430px] text-[14px] leading-relaxed text-page-2 sm:mt-3 sm:text-[16px]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3" aria-hidden="true">
              <span className="w-10 text-[11px] tabular-nums text-page-2">0{phase + 1}</span>
              <div className="flex flex-1 items-center gap-1.5">
                {MATERIALS.phases.map((item, index) => (
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

            <dl className="mt-7 hidden grid-cols-2 gap-x-6 gap-y-3 sm:grid">
              {MATERIALS.details.map((detail) => (
                <div key={detail.label} className="border-t hairline pt-2">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-page-2">
                    {detail.label}
                  </dt>
                  <dd className="mt-0.5 text-[12px] text-page">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <p className="sr-only" aria-live="polite">
              {`Material ${phase + 1} of 4: ${active.title}`}
            </p>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
