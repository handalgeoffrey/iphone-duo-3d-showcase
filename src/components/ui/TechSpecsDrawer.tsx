import React, { useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { DUO_SPECS } from '../../data/duoSpecs';
import { sounds } from './AudioHaptics';

interface TechSpecsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechSpecsDrawer: React.FC<TechSpecsDrawerProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Technical Specifications">
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary, #1c1c1e)',
          color: 'var(--text-primary, #f5f5f7)',
          borderRadius: '24px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.08))'
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary, #f5f5f7)' }}>
              iPhone Duo — Technical Specifications
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #86868b)' }}>
              Titanium Foldable Architecture • iOS 27
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            aria-label="Close specifications"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable specs table */}
        <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Finish & Dimensions */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Finish & Dimensions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="spec-card">
                <div className="spec-card-title">Finish</div>
                <div className="spec-card-value" style={{ fontSize: '18px' }}>Star White &amp; Night Sky</div>
                <div className="spec-card-desc">{DUO_SPECS.finish.material} • Grade 5 Titanium with Ceramic Shield</div>
              </div>
              <div className="spec-card">
                <div className="spec-card-title">Unfolded Dimensions</div>
                <div className="spec-card-value" style={{ fontSize: '18px' }}>117.8 × 164.6 × 5.2 mm</div>
                <div className="spec-card-desc">Ultrathin 5.2 mm profile</div>
              </div>
              <div className="spec-card">
                <div className="spec-card-title">Folded Dimensions</div>
                <div className="spec-card-value" style={{ fontSize: '18px' }}>117.8 × 84.1 × 11.3 mm</div>
                <div className="spec-card-desc">Mass: 254 grams</div>
              </div>
            </div>
          </div>

          {/* Displays */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Displays
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="spec-card">
                <div className="spec-card-title">Inner 7.6" Display</div>
                <div className="spec-card-value" style={{ fontSize: '18px' }}>1878 × 2670 at 430 ppi</div>
                <div className="spec-card-desc">Super Retina XDR OLED, nano-texture flexible glass, ProMotion 1-120Hz.</div>
              </div>
              <div className="spec-card">
                <div className="spec-card-title">Outer 5.4" Display</div>
                <div className="spec-card-value" style={{ fontSize: '18px' }}>1398 × 2034 at 460 ppi</div>
                <div className="spec-card-desc">Super Retina XDR OLED, Ceramic Shield 2, 3,000 nits peak outdoor brightness.</div>
              </div>
            </div>
          </div>

          {/* Chip & Performance */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Chip & Processing
            </h3>
            <div className="spec-card">
              <div className="spec-card-title">Apple A20 Pro</div>
              <div className="spec-card-value" style={{ fontSize: '18px' }}>6-Core CPU & 7-Core GPU</div>
              <div className="spec-card-desc" style={{ marginTop: '8px' }}>
                Dual 16-core Neural Engine, Hardware-accelerated ray tracing, 12GB Unified Memory with 200GB/s bandwidth.
              </div>
            </div>
          </div>

          {/* Camera System */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Camera System
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {DUO_SPECS.cameraSystem.lenses.map((lens) => (
                <div key={lens.name} className="spec-card">
                  <div className="spec-card-title">{lens.name}</div>
                  <div className="spec-card-value" style={{ fontSize: '18px' }}>{lens.focalLength} • {lens.aperture}</div>
                  <div className="spec-card-desc">{lens.stabilization}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Battery & Power */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Battery & Charging
            </h3>
            <div className="spec-card">
              <div className="spec-card-title">Dual Rechargeable Cells</div>
              <div className="spec-card-value" style={{ fontSize: '18px' }}>Up to 44 hours playback</div>
              <div className="spec-card-desc" style={{ marginTop: '6px' }}>
                {DUO_SPECS.battery.charging.wired} • {DUO_SPECS.battery.charging.wireless}
              </div>
            </div>
          </div>

          {/* Connectivity */}
          <div>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#0071e3', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '12px' }}>
              Buttons & Connectivity
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--text-secondary, #a1a1a6)' }}>
              {DUO_SPECS.connectivity.controls.map((ctrl, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0071e3" />
                  <span>{ctrl}</span>
                </li>
              ))}
              {DUO_SPECS.connectivity.wireless.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#0071e3" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
