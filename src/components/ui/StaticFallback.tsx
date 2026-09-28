import React from 'react';
import { DUO_SPECS } from '../../data/duoSpecs';

export const StaticFallback: React.FC = () => {
  return (
    <div style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        iPhone Duo
      </h1>
      <p style={{ fontSize: '20px', color: '#6e6e73', marginBottom: '32px' }}>
        {DUO_SPECS.tagline} {DUO_SPECS.finish.name} titanium foldable architecture.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left' }}>
        <div className="spec-card">
          <div className="spec-card-title">Displays</div>
          <div className="spec-card-value">7.6" & 5.4"</div>
          <div className="spec-card-desc">Super Retina XDR OLED with ProMotion up to 120Hz.</div>
        </div>
        <div className="spec-card">
          <div className="spec-card-title">Dimensions</div>
          <div className="spec-card-value">5.2 mm open</div>
          <div className="spec-card-desc">11.3 mm closed. Total weight 254 grams.</div>
        </div>
        <div className="spec-card">
          <div className="spec-card-title">Performance</div>
          <div className="spec-card-value">A20 Pro</div>
          <div className="spec-card-desc">Dual 16-core Neural Engine and hardware ray tracing.</div>
        </div>
      </div>
    </div>
  );
};
