import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { VariantProvider } from '@/components/variant-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'iPhone Duo — Two screens. One device.',
  description:
    'A dual-screen phone with a precision hinge, two vivid displays, and a calm titanium finish. Explore iPhone Duo in Starry White and Night Sky.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-variant="white" className={inter.variable} suppressHydrationWarning>
      <body>
        <VariantProvider>{children}</VariantProvider>
      </body>
    </html>
  );
}
