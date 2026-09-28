import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, X, QrCode } from 'lucide-react';
import { ProductVariantId, PRODUCT_VARIANTS, OFFICIAL_VARIANTS } from '../../data/productVariants';
import { DUO_SPECS } from '../../data/duoSpecs';
import { sounds } from './AudioHaptics';

interface ConfiguratorSectionProps {
  currentVariant?: ProductVariantId;
  onSelectVariant?: (variant: ProductVariantId) => void;
}

interface TradeInOption {
  id: string;
  name: string;
  credit: number;
}

const TRADE_IN_OPTIONS: TradeInOption[] = [
  { id: 'none', name: 'No smartphone to trade in ($0 credit)', credit: 0 },
  { id: '16pm', name: 'iPhone 16 Pro Max — Up to $650 credit', credit: 650 },
  { id: '16p', name: 'iPhone 16 Pro — Up to $550 credit', credit: 550 },
  { id: '15pm', name: 'iPhone 15 Pro Max — Up to $450 credit', credit: 450 },
  { id: '15p', name: 'iPhone 15 Pro — Up to $350 credit', credit: 350 },
  { id: 'other', name: 'Other Apple or Android smartphone — Up to $250 credit', credit: 250 },
];

export const ConfiguratorSection: React.FC<ConfiguratorSectionProps> = ({
  currentVariant = 'star-white'
}) => {
  const [selectedFinish, setSelectedFinish] = useState<ProductVariantId>(currentVariant);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState<number>(0);
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeInOption>(TRADE_IN_OPTIONS[0]);
  const [carrier, setCarrier] = useState<string>('unlocked');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedTier = DUO_SPECS.storageTiers[selectedStorageIndex];
  const finalPrice = Math.max(0, selectedTier.price - selectedTradeIn.credit);
  const finalMonthly = (finalPrice / 24).toFixed(2);
  const activeVariant = PRODUCT_VARIANTS[selectedFinish] || PRODUCT_VARIANTS['star-white'];

  const handleFinishChange = (variantId: ProductVariantId) => {
    sounds.playClick();
    setSelectedFinish(variantId);
  };

  const handleStorageChange = (index: number) => {
    sounds.playClick();
    setSelectedStorageIndex(index);
  };

  const handleTradeInChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sounds.playClick();
    const found = TRADE_IN_OPTIONS.find(t => t.id === e.target.value) || TRADE_IN_OPTIONS[0];
    setSelectedTradeIn(found);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;

    sounds.playClick();
    setIsSubmitting(true);

    const payload = {
      name: customerName || 'Apple Guest',
      email: customerEmail,
      color: selectedFinish === 'star-white' ? 'starwhite' : 'nightsky',
      storage: selectedTier.capacity,
      tradeIn: {
        device: selectedTradeIn.name,
        value: selectedTradeIn.credit
      },
      paymentType: 'full'
    };

    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        throw new Error('Fallback to local pass');
      }
    } catch {
      // Local fallback generation for standalone client
      const randomId = `DUO-${Math.floor(100000 + Math.random() * 900000)}-X`;
      setOrderData({
        orderId: randomId,
        customer: { name: customerName || 'Apple Guest', email: customerEmail },
        configuration: {
          model: 'iPhone Duo',
          finish: activeVariant.name,
          storage: selectedTier.capacity,
          ram: '12 GB Unified Memory',
          basePrice: selectedTier.price,
          tradeInCredit: selectedTradeIn.credit,
          finalPrice,
          monthlyPayment: finalMonthly
        },
        delivery: {
          estimatedDelivery: 'October 24, 2026',
          shippingMethod: 'Apple Express Priority (Signature Required)'
        }
      });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const resetModal = () => {
    sounds.playClick();
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  return (
    <section id="preorder" className="configurator-section" aria-label="iPhone Duo Studio and Pre-Order">
      <div className="configurator-container">
        {/* Section Header */}
        <div className="config-header">
          <div className="chapter-badge">
            <span>Apple Store Studio</span>
          </div>
          <h2 className="config-headline">Pre-Order iPhone Duo</h2>
          <p className="config-subhead">
            Reserve your launch allocation in Star White or Night Sky Titanium. Select storage capacity, configure connectivity, and apply instant Apple Trade In credit.
          </p>
        </div>

        {/* Studio Grid: Left Live Preview & Summary, Right Customization Steps */}
        <div className="config-grid">
          {/* Left: Summary & Live Configuration Display */}
          <div className="config-preview-panel">
            <div className="config-device-card">
              <div className="config-device-badge">
                <Sparkles size={14} style={{ color: '#0071e3' }} />
                <span>Grade 5 Titanium Architecture</span>
              </div>
              <div className="config-phone-visual">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '980px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="dot-white" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffffff', border: '1.5px solid rgba(255,255,255,0.8)' }} />
                  <span className="dot-night" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1c1f2e', border: '1.5px solid #3b82f6' }} />
                </div>
                <div className="config-visual-specs">
                  <h3 className="config-spec-name">iPhone Duo</h3>
                  <p className="config-spec-finish">{activeVariant.name} Titanium • {selectedTier.capacity}</p>
                  <p className="config-spec-micro">7.6" Inner + 5.4" Outer Super Retina XDR OLED</p>
                </div>
              </div>

              {/* Demand Status */}
              <div className="config-stock-status">
                <span className="stock-dot" />
                <span>Launch Day Delivery: Friday, October 24 with Free Express Shipping</span>
              </div>

              {/* Summary Breakdown */}
              <div className="config-summary-card">
                <div className="summary-line">
                  <span>Reserved Finish:</span>
                  <strong>{activeVariant.name} Titanium</strong>
                </div>
                <div className="summary-line">
                  <span>Storage:</span>
                  <strong>{selectedTier.capacity} (12 GB RAM)</strong>
                </div>
                {selectedTradeIn.credit > 0 && (
                  <div className="summary-line tradein-line">
                    <span>Trade-In Credit:</span>
                    <strong className="credit-val">-${selectedTradeIn.credit}</strong>
                  </div>
                )}
                <div className="summary-line">
                  <span>AppleCare+ Protection:</span>
                  <span>Included 1-Year Limited</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span className="free-shipping">FREE Express Priority</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total-row">
                  <div>
                    <div className="summary-total-label">Total Due Today:</div>
                    <div className="summary-total-price">${finalPrice.toLocaleString()}</div>
                  </div>
                  <div className="summary-monthly-pill">
                    or ${finalMonthly}/mo. for 24 mo. at 0% APR
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-apple-primary btn-reserve-action"
                  onClick={() => {
                    sounds.playClick();
                    setIsModalOpen(true);
                  }}
                >
                  Reserve iPhone Duo
                </button>
              </div>
            </div>
          </div>

          {/* Right: Customization Steps */}
          <div className="config-controls-panel">
            {/* Step 1: Finish Selector */}
            <div className="config-step-card">
              <div className="step-tag">Step 1</div>
              <h3 className="step-title">Select finish allocation.</h3>
              <p className="step-desc">
                Both Star White and Night Sky are crafted in Grade 5 aerospace titanium. Select the edition you are reserving for delivery.
              </p>

              <div className="finish-select-grid">
                {OFFICIAL_VARIANTS.map((variantKey) => {
                  const variant = PRODUCT_VARIANTS[variantKey];
                  const isSelected = selectedFinish === variantKey;

                  return (
                    <button
                      key={variantKey}
                      type="button"
                      className={`finish-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleFinishChange(variantKey)}
                    >
                      <span
                        className="option-swatch-circle"
                        style={{
                          backgroundColor: variant.swatchColor,
                          borderColor: variant.swatchBorder
                        }}
                      />
                      <div className="option-info">
                        <span className="option-name">{variant.name}</span>
                        <span className="option-sub">Titanium</span>
                      </div>
                      {isSelected && <Check size={16} className="option-check-icon" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Storage Selector */}
            <div className="config-step-card">
              <div className="step-tag">Step 2</div>
              <h3 className="step-title">Select storage capacity.</h3>
              <p className="step-desc">
                High-bandwidth NVMe storage with 12 GB unified memory on all configurations.
              </p>

              <div className="storage-select-grid">
                {DUO_SPECS.storageTiers.map((tier, idx) => {
                  const isSelected = selectedStorageIndex === idx;
                  const tierPrice = Math.max(0, tier.price - selectedTradeIn.credit);
                  const tierMonthly = (tierPrice / 24).toFixed(2);

                  return (
                    <button
                      key={tier.capacity}
                      type="button"
                      className={`storage-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleStorageChange(idx)}
                    >
                      <div className="storage-cap">{tier.capacity}</div>
                      <div className="storage-pricing">
                        <span className="storage-price-full">${tierPrice.toLocaleString()}</span>
                        <span className="storage-price-monthly">or ${tierMonthly}/mo.</span>
                      </div>
                      {isSelected && <Check size={16} className="option-check-icon" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Trade-In Calculator */}
            <div className="config-step-card">
              <div className="step-tag">Step 3</div>
              <h3 className="step-title">Apple Trade In.</h3>
              <p className="step-desc">
                Get $250 to $650 in instant credit toward your iPhone Duo when you trade in your eligible smartphone.
              </p>

              <div className="tradein-selector-box">
                <select
                  value={selectedTradeIn.id}
                  onChange={handleTradeInChange}
                  className="tradein-dropdown"
                  aria-label="Trade in device selection"
                >
                  {TRADE_IN_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                {selectedTradeIn.credit > 0 && (
                  <div className="tradein-success-pill">
                    <ShieldCheck size={14} color="#34c759" />
                    <span>Instant credit of ${selectedTradeIn.credit} applied to order</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Cellular & eSIM */}
            <div className="config-step-card">
              <div className="step-tag">Step 4</div>
              <h3 className="step-title">Connectivity.</h3>
              <p className="step-desc">
                Every iPhone Duo comes with Dual active eSIM and Apple C2 modem for global 5G Advanced & Wi-Fi 7.
              </p>

              <div className="carrier-grid">
                {[
                  { id: 'unlocked', label: 'SIM-Free / Unlocked', icon: '🌐' },
                  { id: 'att', label: 'AT&T eSIM', icon: '📶' },
                  { id: 'verizon', label: 'Verizon eSIM', icon: '⚡' },
                  { id: 'tmobile', label: 'T-Mobile eSIM', icon: '📡' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`carrier-card ${carrier === c.id ? 'selected' : ''}`}
                    onClick={() => {
                      sounds.playClick();
                      setCarrier(c.id);
                    }}
                  >
                    <span className="carrier-icon">{c.icon}</span>
                    <span className="carrier-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apple Store VIP Reservation & Pass Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Apple Store Reservation">
          <div className="modal-pass-card">
            <button
              type="button"
              className="modal-close-btn"
              onClick={resetModal}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {!isSubmitted ? (
              /* Reservation Input Form */
              <form onSubmit={handleSubmitReservation} className="reservation-form">
                <div className="modal-eyebrow">Apple Store VIP Priority Pass</div>
                <h3 className="modal-title">Complete Your Reservation</h3>
                <p className="modal-sub">
                  Lock in your launch allocation in {activeVariant.name} Titanium. No charges will be processed until your order prepares to ship.
                </p>

                {/* Configuration Summary Badge */}
                <div className="modal-config-summary">
                  <div className="summary-row-mini">
                    <span>Device:</span>
                    <strong>iPhone Duo ({activeVariant.name})</strong>
                  </div>
                  <div className="summary-row-mini">
                    <span>Capacity:</span>
                    <strong>{selectedTier.capacity} NVMe</strong>
                  </div>
                  <div className="summary-row-mini">
                    <span>Due at Shipment:</span>
                    <strong style={{ color: '#0071e3' }}>${finalPrice.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="form-inputs-group">
                  <div className="input-wrap">
                    <label htmlFor="customer-name" className="input-label">Full Name</label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="modal-text-input"
                    />
                  </div>

                  <div className="input-wrap">
                    <label htmlFor="customer-email" className="input-label">Apple ID / Email Address *</label>
                    <input
                      id="customer-email"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@icloud.com"
                      className="modal-text-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-apple-primary modal-submit-btn"
                >
                  {isSubmitting ? 'Confirming Priority Allocation...' : 'Generate Official Apple Store VIP Pass'}
                </button>
              </form>
            ) : (
              /* Success Screen: High Fidelity Apple Wallet VIP Pass */
              <div className="pass-success-view">
                <div className="success-icon-wrap">
                  <Check size={28} color="#34c759" />
                </div>
                <h3 className="modal-title">Reservation Confirmed</h3>
                <p className="modal-sub">
                  Your iPhone Duo is reserved for Launch Day. A copy of this pass and receipt has been sent to {customerEmail}.
                </p>

                {/* Apple Wallet Style Digital Pass */}
                <div className="digital-apple-pass">
                  <div className="pass-top-bar">
                    <span className="pass-brand">APPLE STORE VIP PASS</span>
                    <span className="pass-tag">BATCH 1 ALLOCATION</span>
                  </div>

                  <div className="pass-body">
                    <div className="pass-detail-col">
                      <span className="pass-lbl">Product</span>
                      <strong className="pass-val">iPhone Duo</strong>
                      <span className="pass-micro">{activeVariant.name} • {selectedTier.capacity}</span>
                    </div>

                    <div className="pass-detail-col" style={{ textAlign: 'right' }}>
                      <span className="pass-lbl">Reservation Code</span>
                      <strong className="pass-val code-val">{orderData?.orderId || 'DUO-882104-X'}</strong>
                      <span className="pass-micro pass-green">● Priority Confirmed</span>
                    </div>
                  </div>

                  <div className="pass-barcode-area">
                    <div className="simulated-barcode" />
                    <div className="barcode-number">{orderData?.orderId || 'DUO-882104-X'} • APPLE PAY VERIFIED</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-apple-secondary pass-done-btn"
                  onClick={resetModal}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
