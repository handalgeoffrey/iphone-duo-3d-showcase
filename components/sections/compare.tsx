'use client';

import Image from 'next/image';
import { useVariant } from '@/components/variant-provider';
import { COMPARE } from '@/lib/site-content';
import type { Variant } from '@/lib/variants';

interface CardTheme {
  background: string;
  foreground: string;
  secondary: string;
  border: string;
  frame: string;
  buttonBackground: string;
  buttonForeground: string;
}

const THEMES: Record<Variant, CardTheme> = {
  white: {
    background: '#f5f5f7',
    foreground: '#1d1d1f',
    secondary: '#6e6e73',
    border: 'rgba(0,0,0,0.12)',
    frame: '#d4cfc6',
    buttonBackground: '#1d1d1f',
    buttonForeground: '#f5f5f7',
  },
  night: {
    background: '#08090d',
    foreground: '#f5f5f7',
    secondary: '#a1a1a6',
    border: 'rgba(255,255,255,0.16)',
    frame: '#1a1c24',
    buttonBackground: '#f5f5f7',
    buttonForeground: '#1d1d1f',
  },
};

export function Compare() {
  const { setVariant } = useVariant();

  return (
    <section id="compare" aria-labelledby="compare-title" className="bg-page-alt py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="max-w-[680px]" data-reveal>
          <p className="eyebrow">{COMPARE.eyebrow}</p>
          <h2 id="compare-title" className="headline mt-4">
            {COMPARE.headline}
          </h2>
          <p className="body-copy mt-5 max-w-[520px]">{COMPARE.body}</p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
          {COMPARE.cards.map((card, index) => {
            const theme = THEMES[card.variant];

            return (
              <article
                key={card.variant}
                aria-labelledby={`compare-${card.variant}`}
                className="flex flex-col rounded-3xl border p-6 sm:p-8"
                style={{
                  backgroundColor: theme.background,
                  color: theme.foreground,
                  borderColor: theme.border,
                  boxShadow: '0 24px 60px var(--shadow-soft)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: theme.secondary }}
                  >
                    Finish 0{index + 1}
                  </p>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: card.variant === 'white' ? '#e9e6e1' : '#14161d',
                      borderColor: card.variant === 'white' ? '#c9c3ba' : '#3b4050',
                    }}
                  />
                </div>

                <div className="mt-8 flex justify-center">
                  <div
                    className="w-[168px] rounded-[2.35rem] p-[4px] sm:w-[190px]"
                    style={{
                      backgroundColor: theme.frame,
                      boxShadow: '0 18px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    <div className="relative aspect-[0.7/1] overflow-hidden rounded-[2rem] bg-black">
                      <Image
                        src="/textures/outer-display.jpg"
                        alt={`${card.name} cover display showing an abstract wallpaper`}
                        fill
                        sizes="190px"
                        className="object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-black/80 ring-2 ring-white/15"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <h3
                    id={`compare-${card.variant}`}
                    className="text-[26px] font-semibold tracking-[-0.03em]"
                  >
                    {card.name}
                  </h3>

                  <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed" style={{ color: theme.secondary }}>
                    {card.finish}
                  </p>

                  <dl className="mt-6 text-[12px]">
                    <div
                      className="flex items-center justify-between border-t py-2.5"
                      style={{ borderColor: theme.border }}
                    >
                      <dt style={{ color: theme.secondary }}>Colour</dt>
                      <dd>{card.colour}</dd>
                    </div>
                    <div
                      className="flex items-center justify-between border-t py-2.5"
                      style={{ borderColor: theme.border }}
                    >
                      <dt style={{ color: theme.secondary }}>From</dt>
                      <dd>{card.price}</dd>
                    </div>
                  </dl>

                  <a
                    href="#buy"
                    onClick={() => setVariant(card.variant)}
                    className="mt-6 flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold transition-opacity duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: theme.buttonBackground,
                      color: theme.buttonForeground,
                    }}
                  >
                    {card.cta}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
