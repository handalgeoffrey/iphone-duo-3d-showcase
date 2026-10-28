import { CAMERA } from '@/lib/site-content';

function Lens({ small = false }: { small?: boolean }) {
  return (
    <div
      className="relative aspect-square w-full rounded-full bg-[#08080a]"
      style={{
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.08), 0 12px 30px rgba(0,0,0,0.22)',
      }}
    >
      <span className="absolute inset-[7%] rounded-full border border-white/10" />
      <span className="absolute inset-[16%] rounded-full border border-white/[0.06]" />
      <span
        className="absolute inset-[26%] rounded-full bg-[#050506]"
        style={{ boxShadow: 'inset 0 4px 18px rgba(0,0,0,0.9)' }}
      />
      {!small ? (
        <>
          <span className="absolute inset-[38%] rounded-full border border-white/10" />
          <span className="absolute left-[34%] top-[29%] h-[11%] w-[11%] rounded-full bg-white/10 blur-[1px]" />
        </>
      ) : null}
    </div>
  );
}

export function Camera() {
  return (
    <section id="camera" aria-labelledby="camera-title" className="bg-page-alt py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <div data-reveal>
              <p className="eyebrow">{CAMERA.eyebrow}</p>
              <h2 id="camera-title" className="headline mt-4 max-w-[560px]">
                {CAMERA.headline}
              </h2>
              <p className="body-copy mt-6 max-w-[490px]">{CAMERA.body}</p>
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2" data-reveal>
              {CAMERA.features.map((feature) => (
                <div key={feature.title} className="border-t hairline pt-4">
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-page">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-page-2">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[420px]" data-reveal>
            <div
              className="rounded-[2.5rem] border hairline p-6 sm:p-8"
              style={{
                backgroundColor: 'var(--page-bg)',
                boxShadow: '0 30px 70px var(--shadow-soft)',
              }}
            >
              <div className="flex aspect-[4/3] items-center gap-4 sm:gap-5">
                <div className="w-[62%]">
                  <Lens />
                </div>
                <div className="flex flex-1 flex-col items-center gap-4">
                  <div className="w-full">
                    <Lens small />
                  </div>
                  <div className="w-full">
                    <Lens small />
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80 ring-4 ring-white/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 border-t hairline pt-8 sm:gap-8" data-reveal>
          {CAMERA.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[clamp(1.75rem,3.2vw,2.6rem)] font-semibold tracking-[-0.035em] text-page">
                {stat.value}
                <span className="text-[0.55em] tracking-[-0.02em] text-page-2">{stat.suffix}</span>
              </p>
              <p className="mt-1 text-[12px] text-page-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
