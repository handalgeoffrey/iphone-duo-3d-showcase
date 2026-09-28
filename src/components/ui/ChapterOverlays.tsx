import React from 'react';
import { CHAPTERS } from '../../data/chapters';
import { sounds } from './AudioHaptics';
import { ConfiguratorSection } from './ConfiguratorSection';
import { Sparkles, ArrowDown } from 'lucide-react';

interface ChapterOverlaysProps {
  onOpenViewer: () => void;
  onOpenSpecs: () => void;
  previewChapter?: string | null;
}

export const ChapterOverlays: React.FC<ChapterOverlaysProps> = ({
  onOpenViewer,
  onOpenSpecs,
  previewChapter
}) => {
  const chaptersToRender = previewChapter === 'preorder'
    ? []
    : (previewChapter ? CHAPTERS.filter(c => c.id === previewChapter) : CHAPTERS);

  return (
    <main className="content-stage-container" aria-label="iPhone Duo Story">
      {chaptersToRender.map((chapter) => {
        const isHero = chapter.id === 'hero';
        const isFinish = chapter.id === 'finish-reveal';
        const isCamera = chapter.id === 'camera';
        const isDesign = chapter.id === 'design';
        const isDisplays = chapter.id === 'displays';
        const isChip = chapter.id === 'performance';
        const isBattery = chapter.id === 'battery';

        return (
          <section
            key={chapter.id}
            id={chapter.id}
            className={`story-chapter chapter-${chapter.id} ${
              isHero ? 'hero-chapter' : ''
            } ${isFinish ? 'finish-chapter' : ''}`}
            data-chapter-id={chapter.id}
            data-theme={chapter.theme}
          >
            <div className="chapter-inner">
              <div className="chapter-content-zone">
                {/* Chapter Eyebrow Badge */}
                <div className="chapter-badge">
                  <Sparkles size={13} style={{ color: '#0071e3', marginRight: 6 }} />
                  <span>{chapter.title}</span>
                </div>

                {/* Hero Monument Headline */}
                <h1 className="chapter-headline">{chapter.headline}</h1>

                {/* Supporting Subhead */}
                {chapter.subhead && (
                  <p className="chapter-subhead">{chapter.subhead}</p>
                )}

                {/* Technical Micro-label */}
                {chapter.techLabel && (
                  <div className="chapter-tech-label">
                    <span>{chapter.techLabel}</span>
                  </div>
                )}

                {/* Hero Dual-Finish Callout Pill (No Switch, Pure Celebration of Both) */}
                {isHero && (
                  <div className="hero-duo-callout interactive-element">
                    <div className="hero-finishes-badge">
                      <div className="duo-dot-pair">
                        <span className="dot-white" title="Star White" />
                        <span className="dot-night" title="Night Sky" />
                      </div>
                      <span className="duo-badge-text">
                        Two finishes co-starring: <strong>Star White</strong> &amp; <strong>Night Sky</strong> Grade 5 Titanium
                      </span>
                    </div>

                    <div className="hero-stat-pills-row">
                      <span className="hero-stat-pill">7.6" Inner OLED</span>
                      <span className="hero-stat-pill">5.4" Cover Screen</span>
                      <span className="hero-stat-pill">5.2 mm Ultrathin</span>
                      <span className="hero-stat-pill">A20 Pro Silicon</span>
                    </div>

                    <div className="scroll-cue" aria-hidden="true">
                      <span className="scroll-cue-text">Scroll to unfold the experience</span>
                      <ArrowDown size={14} className="scroll-arrow-anim" />
                    </div>
                  </div>
                )}

                {/* Design Chapter: Dual Finishes Spec Highlights */}
                {isDesign && (
                  <div className="design-duo-callout interactive-element">
                    <div className="finish-compare-strip">
                      <div className="finish-item-highlight">
                        <span className="finish-dot dot-white" />
                        <div>
                          <strong>Star White Titanium</strong>
                          <p>Satin-brushed Grade 5 titanium with pearlescent PVD finish and frosted ceramic glass back.</p>
                        </div>
                      </div>
                      <div className="finish-item-highlight">
                        <span className="finish-dot dot-night" />
                        <div>
                          <strong>Night Sky Titanium</strong>
                          <p>Deep midnight obsidian Grade 5 titanium with cool indigo undertones and dark ceramic back.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Displays Chapter: Dual Screen Big Metrics */}
                {isDisplays && (
                  <div className="displays-metric-hero interactive-element">
                    <div className="metric-col">
                      <span className="metric-large">7.6"</span>
                      <strong className="metric-heading">Inner Folding Canvas</strong>
                      <p className="metric-sub">Super Retina XDR OLED • 1878×2670 at 430 ppi • ProMotion 120Hz • Apple Pencil support</p>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-col">
                      <span className="metric-large">5.4"</span>
                      <strong className="metric-heading">Outer Cover Screen</strong>
                      <p className="metric-sub">Super Retina XDR OLED • 1398×2034 at 460 ppi • Ceramic Shield 2 • 3,000 nits outdoor peak</p>
                    </div>
                  </div>
                )}

                {/* Structured Specification Cards for other chapters */}
                {!isDisplays && !isHero && chapter.specs && (
                  <div className="feature-spec-grid interactive-element">
                    {chapter.specs.map((spec, i) => (
                      <div key={i} className="spec-card">
                        <div className="spec-card-title">{spec.label}</div>
                        <div className="spec-card-value">{spec.value}</div>
                        <div className="spec-card-desc">{spec.desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Camera Chapter: 3 Precise Lens Callouts */}
                {isCamera && chapter.cameraHotspots && (
                  <div className="camera-lens-callouts interactive-element">
                    {chapter.cameraHotspots.map((lens) => (
                      <div key={lens.id} className="lens-callout-item">
                        <div className="lens-callout-indicator" />
                        <div className="lens-callout-info">
                          <span className="lens-callout-name">{lens.label}</span>
                          <span className="lens-callout-detail">{lens.spec}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Chapter: Direct CTAs */}
                {isFinish && (
                  <div className="finish-reveal-cta interactive-element">
                    <div className="finish-duo-statement">
                      <p>
                        Crafted as an indivisible duality. The luminescence of <strong>Star White</strong> meets the cosmic depth of <strong>Night Sky</strong>. Both precision-machined from solid aerospace Grade 5 titanium billet.
                      </p>
                    </div>
                    <div className="finish-cta-actions">
                      <a
                        href="#preorder"
                        className="btn-apple-primary"
                        onClick={() => sounds.playClick()}
                      >
                        Configure &amp; Pre-Order
                      </a>
                      <button
                        type="button"
                        className="btn-apple-secondary"
                        onClick={() => {
                          sounds.playClick();
                          onOpenSpecs();
                        }}
                      >
                        Technical Specifications
                      </button>
                      <button
                        type="button"
                        className="btn-apple-secondary"
                        onClick={() => {
                          sounds.playClick();
                          onOpenViewer();
                        }}
                      >
                        Explore in 3D
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Pre-Order Studio Configurator Section */}
      {(!previewChapter || previewChapter === 'preorder') && <ConfiguratorSection />}

      {/* Official Footnotes & Legal Footer */}
      <footer className="apple-legal-footer" role="contentinfo">
        <div className="legal-inner">
          <ol className="legal-notes-list">
            <li>iPhone Duo is splash, water, and dust resistant and was tested under controlled laboratory conditions with a rating of IP68 under IEC standard 60529 (maximum depth of 6 metres up to 30 minutes). Resistance is not permanent and may decrease as a result of normal wear.</li>
            <li>Dimensions: Open: 117.8 × 164.6 × 5.2 mm. Closed: 117.8 × 84.1 × 11.3 mm. Weight: 254 grams. Actual size and weight may vary by configuration and manufacturing process.</li>
            <li>Displays: Inner display measures 19.26 cm (7.6 inches) diagonally; outer display measures 13.62 cm (5.4 inches) diagonally. Actual viewable area is slightly less due to rounded corners and Dynamic Island. Supports Apple Pencil (USB-C).</li>
            <li>Fast-charge testing conducted with Apple 60W USB-C Power Adapter (up to 50% charge in ~20 minutes) and 35W MagSafe Charger (up to 50% in ~30 minutes). Charge time varies with environmental factors.</li>
            <li>Dual eSIM: Requires a wireless service plan that supports eSIM. No physical SIM cards are supported. Available from supported carriers globally.</li>
          </ol>
          <div className="legal-copyright-bar">
            <span>Copyright © 2026 Apple Inc. All rights reserved.</span>
            <div className="legal-links-row">
              <a href="#hero">Privacy Policy</a>
              <span>•</span>
              <a href="#hero">Terms of Sale</a>
              <span>•</span>
              <a href="#hero">Legal Notices</a>
              <span>•</span>
              <a href="#hero">Site Map</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};
