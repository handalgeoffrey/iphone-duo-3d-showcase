import { DuoMark } from '@/components/duo-mark';
import { FOOTER_COLUMNS } from '@/lib/site-content';

const HREFS: Record<string, string> = {
  'iPhone Duo': '#overview',
  Accessories: '#display',
  'Trade In': '#buy',
  Financing: '#buy',
  Overview: '#overview',
  'Two screens': '#two-screens',
  'Tech Specs': '#tech-specs',
  Compare: '#compare',
  Contact: '#tech-specs',
  Warranty: '#tech-specs',
  Repairs: '#tech-specs',
  'Setup guide': '#tech-specs',
  'Design story': '#materials',
  Newsroom: '#overview',
  Careers: '#overview',
  Environment: '#materials',
};

export function Footer() {
  return (
    <footer className="border-t hairline bg-page-alt">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          <div className="max-w-[300px]">
            <a
              href="#overview"
              aria-label="iPhone Duo, back to top"
              className="inline-flex text-page transition-opacity duration-200 hover:opacity-60"
            >
              <DuoMark />
            </a>
            <p className="mt-4 text-[12px] leading-relaxed text-page-2">
              A dual-screen phone concept, designed around the way you move between moments.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:gap-x-14">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[12px] font-semibold text-page">{column.title}</h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href={HREFS[link] ?? '#overview'}
                        className="text-[12px] text-page-2 transition-colors duration-200 hover:text-page"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t hairline pt-6">
          <p className="max-w-[900px] text-[11px] leading-relaxed text-page-2">
            iPhone Duo is a fictional product concept created for design demonstration. Not
            affiliated with Apple Inc. All product names, copy, specifications, and prices are
            placeholders. No Apple logos or copyrighted marketing images are used.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-page-2">
            <span>© 2026 Duo Concept Studio</span>
            <span aria-hidden="true">·</span>
            <span>Designed for the space between screens</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
