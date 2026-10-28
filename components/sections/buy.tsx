'use client';

import { BuyButton } from '@/components/buy-button';
import { VariantSwitcher } from '@/components/variant-switcher';
import { useVariant } from '@/components/variant-provider';
import { BUY } from '@/lib/site-content';

export function Buy() {
  const { meta } = useVariant();

  return (
    <section id="buy" aria-labelledby="buy-title" className="bg-page py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="mx-auto max-w-[760px] text-center" data-reveal>
          <p className="eyebrow">{BUY.eyebrow}</p>
          <h2
            id="buy-title"
            className="display mt-4 text-[clamp(2.75rem,6.5vw,6rem)]"
          >
            {BUY.headline}
          </h2>
          <p className="body-copy mx-auto mt-5 max-w-[480px]">{BUY.body}</p>
        </div>

        <div
          className="card-material mx-auto mt-10 max-w-[560px] rounded-3xl border hairline p-6 sm:p-8"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-page-2">Your finish</p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-page">
                {meta.name}
              </p>
            </div>
            <VariantSwitcher size="md" />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-t hairline pt-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-page-2">From</p>
              <p className="mt-1 text-[32px] font-semibold tracking-[-0.04em] text-page">
                {meta.price}
              </p>
            </div>
            <p className="pb-1 text-right text-[11px] leading-relaxed text-page-2">
              {meta.monthly}
              <br />
              before trade-in
            </p>
          </div>

          <BuyButton className="pill-button mt-6 w-full" />

          <p className="mt-4 text-center text-[11px] text-page-2">
            Free delivery and free returns. Trade-in credit available.
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-[460px] text-center text-[11px] leading-relaxed text-page-2">
          {BUY.finePrint}
        </p>
      </div>
    </section>
  );
}
