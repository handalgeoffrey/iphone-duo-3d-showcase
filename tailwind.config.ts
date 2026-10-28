import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'var(--font-inter)',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      spacing: {
        section: 'clamp(96px, 12vw, 180px)',
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      transitionDuration: {
        600: '600ms',
      },
    },
  },
  plugins: [],
};

export default config;
