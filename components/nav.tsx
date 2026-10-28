import { DuoMark } from '@/components/duo-mark';

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="nav-material border-b hairline">
        <div className="mx-auto flex h-11 max-w-content items-center justify-between px-5 sm:px-8">
          <a
            href="#overview"
            aria-label="iPhone Duo, back to top"
            className="rounded-sm py-1 text-page transition-opacity duration-200 hover:opacity-60"
          >
            <DuoMark />
          </a>

          <div className="hidden items-center gap-7 text-[12px] text-page-2 md:flex">
            <a href="#overview" className="nav-link">
              Overview
            </a>
            <a href="#display" className="nav-link">
              Display
            </a>
            <a href="#tech-specs" className="nav-link">
              Tech Specs
            </a>
            <a href="#compare" className="nav-link">
              Compare
            </a>
            <a href="#buy" className="nav-link">
              Buy
            </a>
          </div>

          <a href="#buy" className="text-[12px] font-medium text-page md:hidden">
            Buy
          </a>
        </div>
      </nav>

      <nav aria-label="iPhone Duo" className="nav-material border-b hairline">
        <div className="mx-auto flex h-12 max-w-content items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#overview"
            className="shrink-0 text-[17px] font-semibold tracking-[-0.02em] text-page"
          >
            iPhone Duo
          </a>

          <div className="flex items-center gap-4 text-[12px] text-page-2 sm:gap-6">
            <a href="#two-screens" className="nav-link hidden sm:inline">
              Two screens
            </a>
            <a href="#tech-specs" className="nav-link">
              Tech Specs
            </a>
            <a href="#compare" className="nav-link">
              Compare
            </a>
            <a href="#buy" className="pill-button h-8 min-h-0 px-4 text-[12px]">
              Buy
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
