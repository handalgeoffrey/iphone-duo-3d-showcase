import { ModelStage } from '@/components/model-stage';
import { Nav } from '@/components/nav';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Toast } from '@/components/toast';
import { Hero } from '@/components/sections/hero';
import { TwoScreens } from '@/components/sections/two-screens';
import { ColourPicker } from '@/components/sections/colour-picker';
import { Display } from '@/components/sections/display';
import { Camera } from '@/components/sections/camera';
import { Performance } from '@/components/sections/performance';
import { Materials } from '@/components/sections/materials';
import { TechSpecs } from '@/components/sections/tech-specs';
import { Compare } from '@/components/sections/compare';
import { Buy } from '@/components/sections/buy';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--page-text)] focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-semibold focus:text-[var(--page-bg)]"
      >
        Skip to content
      </a>

      <Nav />
      <ModelStage />

      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Hero />
        <TwoScreens />
        <ColourPicker />
        <Display />
        <Camera />
        <Performance />
        <Materials />
        <TechSpecs />
        <Compare />
        <Buy />
        <Footer />
      </main>

      <Toast />
      <ScrollReveal />
    </>
  );
}
