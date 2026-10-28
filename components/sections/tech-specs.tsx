import { SpecAccordion } from '@/components/spec-accordion';
import { SPEC_GROUPS } from '@/lib/site-content';

export function TechSpecs() {
  return (
    <section id="tech-specs" aria-labelledby="specs-title" className="bg-page py-section">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
          <div className="lg:sticky lg:top-[120px] lg:self-start" data-reveal>
            <p className="eyebrow">Tech Specs</p>
            <h2 id="specs-title" className="headline mt-4 max-w-[380px]">
              Every detail, considered.
            </h2>
            <p className="body-copy mt-5 max-w-[340px]">
              Two displays. One architecture. Explore the full specification of iPhone Duo.
            </p>
            <p className="mt-6 text-[12px] text-page-2">
              All specifications are placeholders for this design concept.
            </p>
          </div>

          <div data-reveal>
            <SpecAccordion groups={SPEC_GROUPS} />
          </div>
        </div>
      </div>
    </section>
  );
}
