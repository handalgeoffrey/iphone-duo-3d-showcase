'use client';

import { useVariant } from '@/components/variant-provider';
import { VariantSwitcher } from '@/components/variant-switcher';
import { COLOUR } from '@/lib/site-content';

export function ColourPicker() {
  const { meta } = useVariant();

  return (
    <section
      id="colour"
      aria-labelledby="colour-title"
      className="relative min-h-[108svh] lg:min-h-[100svh]"
    >
      <div className="mx-auto flex min-h-[108svh] w-full max-w-content flex-col px-5 pb-8 pt-[124px] sm:px-8 lg:min-h-screen lg:pb-12 lg:pt-[148px]">
        <div className="mx-auto max-w-[720px] text-center" data-reveal>
          <p className="eyebrow">{COLOUR.eyebrow}</p>
          <h2 id="colour-title" className="headline mt-4">
            {COLOUR.headline}
          </h2>
        </div>

        <div className="flex-1" aria-hidden="true" />

        <div
          className="card-material mx-auto w-full max-w-[760px] rounded-3xl border hairline p-5 sm:p-6"
          data-reveal
        >
          <div className="flex items-center justify-between gap-4">
            <VariantSwitcher size="lg" showTaglines />

            <div className="hidden max-w-[300px] text-right sm:block">
              <p className="text-[20px] font-semibold tracking-[-0.02em] text-page">
                {meta.name}
              </p>
              <p className="mt-1 text-[14px] text-page-2">{meta.tagline}</p>
              <p className="mt-2 hidden text-[12px] leading-relaxed text-page-2 lg:block">
                {meta.finish}
              </p>
            </div>
          </div>

          <p className="mt-5 hidden border-t hairline pt-4 text-[11px] leading-relaxed text-page-2 lg:block">
            {COLOUR.note}
          </p>
        </div>
      </div>
    </section>
  );
}
