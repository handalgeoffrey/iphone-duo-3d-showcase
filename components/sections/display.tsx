import Image from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { DISPLAY } from '@/lib/site-content';

export function Display() {
  return (
    <section id="display" aria-labelledby="display-title" className="bg-page py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-16">
          <div data-reveal>
            <p className="eyebrow">{DISPLAY.eyebrow}</p>
            <h2 id="display-title" className="headline mt-4 max-w-[700px]">
              {DISPLAY.headline}
            </h2>
          </div>

          <p className="body-copy max-w-[440px] lg:justify-self-end" data-reveal>
            {DISPLAY.body}
          </p>
        </div>

        <div className="mt-14 lg:mt-20" data-reveal>
          <div
            className="mx-auto max-w-[1020px] rounded-[36px] p-[2px]"
            style={{
              backgroundColor: 'var(--display-frame)',
              boxShadow:
                '0 30px 80px var(--shadow-soft), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <div className="rounded-[34px] bg-[#0a0a0c] p-[6px] sm:p-[8px]">
              <div className="relative aspect-[1.42/1] overflow-hidden rounded-[28px] bg-black">
                <Image
                  src={assetPath('/textures/inner-display.jpg')}
                  alt={DISPLAY.imageAlt}
                  fill
                  sizes="(min-width: 1200px) 1000px, calc(100vw - 40px)"
                  className="object-cover"
                  priority={false}
                />

                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />

                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#08080a]">
                  <span className="absolute inset-y-0 -left-px w-px bg-white/10" />
                  <span className="absolute inset-y-0 -right-px w-px bg-white/10" />
                </div>

                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1020px] grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8">
            {DISPLAY.stats.map((stat) => (
              <div key={stat.label} className="border-t hairline pt-4">
                <p className="text-[clamp(1.75rem,3.2vw,2.6rem)] font-semibold tracking-[-0.035em] text-page">
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] text-page-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
