import { CountUp } from '@/components/count-up';
import { PERFORMANCE } from '@/lib/site-content';

export function Performance() {
  return (
    <section id="performance" aria-labelledby="performance-title" className="bg-page py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <div data-reveal>
              <p className="eyebrow">{PERFORMANCE.eyebrow}</p>
              <h2 id="performance-title" className="headline mt-4">
                {PERFORMANCE.headline}
              </h2>
              <p className="body-copy mt-6 max-w-[500px]">{PERFORMANCE.body}</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3" data-reveal>
              {PERFORMANCE.stats.map((stat) => (
                <div key={stat.label} className="border-t hairline pt-4">
                  <p className="text-[clamp(2.5rem,4.2vw,3.75rem)] font-semibold leading-none tracking-[-0.045em] text-page">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-[13px] font-medium text-page">{stat.label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-page-2">{stat.note}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[12px] text-page-2" data-reveal>
              Storage: <span className="text-page">{PERFORMANCE.storage}</span>
            </p>
          </div>

          <div className="mx-auto w-full max-w-[400px]" data-reveal>
            <div
              className="relative aspect-square rounded-[2.5rem] border hairline p-6 sm:p-8"
              style={{
                backgroundColor: 'var(--page-bg-alt)',
                boxShadow: '0 30px 70px var(--shadow-soft)',
              }}
            >
              <div
                className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#08080b] text-white"
                style={{ boxShadow: 'inset 0 0 60px rgba(255,255,255,0.025)' }}
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">Duo</span>
                <span className="mt-1 text-[clamp(2.75rem,5vw,3.75rem)] font-semibold tracking-[-0.05em]">
                  A1
                </span>
                <span className="mt-2 text-[12px] tracking-[0.02em] text-white/45">
                  {PERFORMANCE.process} · 12GB
                </span>

                <span aria-hidden="true" className="absolute left-6 top-6 h-px w-8 bg-white/15" />
                <span aria-hidden="true" className="absolute right-6 top-6 h-px w-8 bg-white/15" />
                <span aria-hidden="true" className="absolute bottom-6 left-6 h-px w-8 bg-white/15" />
                <span aria-hidden="true" className="absolute bottom-6 right-6 h-px w-8 bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
