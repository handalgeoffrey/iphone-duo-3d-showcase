// ==========================================================================
// iPhone Duo - Main Application Coordinator & Interactive Marketing Engine
// Calibrated to Apple Technical Specifications (DUO spec.pdf)
// ==========================================================================

import { DuoScene } from './scene3d.js';
import { sound } from './audio.js';

let duoScene = null;

// Current Configurator State
const configState = {
  color: 'nightsky',
  colorName: 'Night Sky',
  storage: '256GB',
  storagePrice: 1799,
  storageMonthly: 74.95,
  tradeInValue: 0,
  tradeInModel: 'none',
  carrier: 'unlocked'
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Engine
  duoScene = new DuoScene('webgl-canvas');

  // 2. Setup Sound Toggle Button
  setupSoundToggle();

  // 3. Setup 3D Stage HUD Controls
  setupStageControls();

  // 4. Setup DuoFlow OS Simulator & Apple Pencil Demo
  setupDuoFlowOS();

  // 5. Setup Camera Control & 48MP Dual Fusion Studio
  setupCameraStudio();

  // 6. Setup Apple A20 Pro Benchmark & 60W Fast Charging
  setupBenchmarks();

  // 7. Setup Studio Configurator & Pre-order
  setupConfigurator();

  // 8. Setup VIP Newsletter & Complete PDF Specs Accordion
  setupNewsletterAndSpecs();

  // 9. Fetch initial real-time stock
  fetchStock();
});

// Sound Toggle
function setupSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isEnabled = sound.toggle();
    soundBtn.innerHTML = isEnabled 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    
    if (isEnabled) sound.playClick();
  });
}

// 3D Stage HUD Controls
function setupStageControls() {
  // Fold Slider (0° to 180°)
  const foldSlider = document.getElementById('fold-slider');
  const foldValueLabel = document.getElementById('fold-value-label');

  if (foldSlider) {
    foldSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (duoScene) duoScene.setFoldAngle(val);
      if (foldValueLabel) {
        if (val <= 10) foldValueLabel.textContent = `0° (5.4" Cover)`;
        else if (val >= 170) foldValueLabel.textContent = `180° (7.6" Canvas)`;
        else foldValueLabel.textContent = `${val}°`;
      }
      sound.playHapticHinge(val);
    });
  }

  // Color Swatches in Stage (Night Sky & Star White)
  const swatches = document.querySelectorAll('.swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const color = btn.dataset.color;
      if (duoScene) duoScene.setColor(color);
      sound.playClick();

      // Sync with configurator
      syncColorToConfigurator(color);
    });
  });

  // Mode Preset Pills
  const modePills = document.querySelectorAll('.mode-pill');
  modePills.forEach(pill => {
    pill.addEventListener('click', () => {
      modePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const mode = pill.dataset.mode;
      let angle = 180;
      if (mode === 'flat') angle = 180; // 7.6" Unfolded (117.8mm x 164.6mm)
      if (mode === 'laptop') angle = 95; // Flex Studio Mode
      if (mode === 'book') angle = 135; // Reading Mode
      if (mode === 'closed') angle = 0; // 5.4" Cover (117.8mm x 84.1mm)

      if (duoScene) duoScene.setFoldAngle(angle);
      if (foldSlider) foldSlider.value = angle;
      if (foldValueLabel) {
        if (angle === 0) foldValueLabel.textContent = `0° (5.4" Cover)`;
        else if (angle === 180) foldValueLabel.textContent = `180° (7.6" Canvas)`;
        else foldValueLabel.textContent = `${angle}°`;
      }
      sound.playSnap();
    });
  });

  // Apple Pencil Toggle
  const pencilBtn = document.getElementById('pencil-toggle-btn');
  if (pencilBtn) {
    pencilBtn.addEventListener('click', () => {
      if (duoScene) {
        const isShown = duoScene.toggleApplePencil();
        pencilBtn.classList.toggle('active', isShown);
        pencilBtn.textContent = isShown ? 'Hide Apple Pencil' : '✏️ Apple Pencil (USB-C)';
        sound.playClick();
      }
    });
  }

  // Exploded / X-Ray Internals Toggle
  const explodeBtn = document.getElementById('xray-toggle-btn');
  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      if (duoScene) {
        const active = duoScene.toggleExploded();
        explodeBtn.classList.toggle('active', active);
        explodeBtn.textContent = active ? 'Exit X-Ray' : 'X-Ray Internals';
        sound.playClick();
      }
    });
  }

  // Auto Rotate Toggle
  const autoRotateBtn = document.getElementById('autorotate-toggle-btn');
  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      if (duoScene) {
        duoScene.autoRotate = !duoScene.autoRotate;
        autoRotateBtn.classList.toggle('active', duoScene.autoRotate);
        sound.playClick();
      }
    });
  }
}

// DuoFlow OS & Apple Pencil Interactive Demo
function setupDuoFlowOS() {
  const tabs = document.querySelectorAll('.os-tab-btn');
  const leftContent = document.getElementById('os-left-content');
  const rightContent = document.getElementById('os-right-content');

  const workflows = {
    pro: {
      left: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🎬 Final Cut Pro Duo</span>
            <span style="font-size:11px; color:#34c759;">4K Dolby Vision 120fps</span>
          </div>
          <div style="background:#111; border-radius:12px; height:180px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
            <div style="width:100%; height:100%; background:linear-gradient(45deg, #161a29, #090b14); display:flex; flex-direction:column; align-items:center; justify-content:center;">
              <span style="font-size:36px;">🎥</span>
              <span style="font-size:12px; color:#86868b; margin-top:6px;">48MP Fusion Raw Stream (26 mm)</span>
            </div>
          </div>
          <div class="app-drag-pill">Drag Clip to Right Screen Multitrack ➔</div>
          <div style="margin-top:auto; font-size:11px; color:#86868b;">A20 Pro 7-core GPU Real-Time Dolby Rendering • 12 GB RAM</div>
        </div>
      `,
      right: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🎚️ Logic Pro Studio</span>
            <span style="font-size:11px; color:#2997ff;">Nano-Texture Matte Screen</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; height:200px; background:#111; padding:12px; border-radius:12px;">
            <div style="background:#1e1e24; border-radius:8px; display:flex; flex-direction:column; justify-content:flex-end; padding:6px; align-items:center;">
              <div style="width:8px; height:75%; background:#2997ff; border-radius:4px;"></div>
              <span style="font-size:9px; margin-top:4px;">Vocal</span>
            </div>
            <div style="background:#1e1e24; border-radius:8px; display:flex; flex-direction:column; justify-content:flex-end; padding:6px; align-items:center;">
              <div style="width:8px; height:88%; background:#af52de; border-radius:4px;"></div>
              <span style="font-size:9px; margin-top:4px;">Bass</span>
            </div>
            <div style="background:#1e1e24; border-radius:8px; display:flex; flex-direction:column; justify-content:flex-end; padding:6px; align-items:center;">
              <div style="width:8px; height:62%; background:#34c759; border-radius:4px;"></div>
              <span style="font-size:9px; margin-top:4px;">Synth</span>
            </div>
            <div style="background:#1e1e24; border-radius:8px; display:flex; flex-direction:column; justify-content:flex-end; padding:6px; align-items:center;">
              <div style="width:8px; height:92%; background:#ff9500; border-radius:4px;"></div>
              <span style="font-size:9px; margin-top:4px;">Master</span>
            </div>
          </div>
          <div style="margin-top:auto; font-size:11px; color:#86868b;">Spatial Audio monitoring powered by Apple N1 wireless chip</div>
        </div>
      `
    },
    camera: {
      left: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">📸 Dual Fusion Viewfinder</span>
            <span style="font-size:11px; color:#ff3b30;">● REC 4K 120 FPS</span>
          </div>
          <div style="background:#09090c; border-radius:12px; height:200px; display:flex; align-items:center; justify-content:center; border:1px dashed #444;">
            <div style="text-align:center;">
              <span style="font-size:40px;">🎯</span>
              <p style="font-size:12px; color:#86868b; margin-top:8px;">Camera Control: Zoom 2.0x • ƒ/1.6</p>
            </div>
          </div>
          <div class="app-drag-pill">Drag Color Grade to Right Screen ➔</div>
        </div>
      `,
      right: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🎨 Camera Control Palettes</span>
            <span style="font-size:11px; color:#ff9f0a;">Capacitive Control</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;"><span>Exposure</span><span>+0.3 EV</span></div>
              <div style="height:6px; background:#333; border-radius:3px;"><div style="width:65%; height:100%; background:#ff9f0a; border-radius:3px;"></div></div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;"><span>Depth / Bokeh</span><span>ƒ/2.0</span></div>
              <div style="height:6px; background:#333; border-radius:3px;"><div style="width:75%; height:100%; background:#2997ff; border-radius:3px;"></div></div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;"><span>Photographic Style</span><span>Tone Warm +15</span></div>
              <div style="height:6px; background:#333; border-radius:3px;"><div style="width:85%; height:100%; background:#af52de; border-radius:3px;"></div></div>
            </div>
          </div>
        </div>
      `
    },
    pencil: {
      left: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">✏️ Apple Pencil (USB-C) Studio</span>
            <span style="font-size:11px; color:#af52de;">Zero-Latency Drawing</span>
          </div>
          <div style="background:#111; border-radius:12px; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px solid #333;">
            <span style="font-size:48px;">📝</span>
            <span style="font-size:13px; color:#f5f5f7; font-weight:600; margin-top:6px;">7.6" Nano-Texture Sketchpad</span>
            <span style="font-size:11px; color:#86868b; margin-top:2px;">Matte finish provides true paper-like resistance</span>
          </div>
        </div>
      `,
      right: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🎨 Freeform Infinite Board</span>
            <span style="font-size:11px; color:#34c759;">iCloud Real-Time Sync</span>
          </div>
          <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:200px; background:radial-gradient(circle, #1f142b 0%, #0d0a14 100%); border-radius:12px;">
            <span style="font-size:42px;">🖌️</span>
            <p style="font-size:12px; color:#d1d1d6; margin-top:8px;">Pressure & tilt sensitivity with Apple Pencil</p>
          </div>
        </div>
      `
    },
    gaming: {
      left: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🎮 7.6" Unfolded Gaming Canvas</span>
            <span style="font-size:11px; color:#34c759;">120Hz ProMotion</span>
          </div>
          <div style="background:radial-gradient(circle, #251633 0%, #0c0b1e 100%); border-radius:12px; height:200px; display:flex; align-items:center; justify-content:center;">
            <div style="text-align:center;">
              <span style="font-size:48px;">👾</span>
              <p style="font-size:12px; color:#d1d1d6; margin-top:6px;">A20 Pro 7-Core GPU Ray Tracing</p>
            </div>
          </div>
        </div>
      `,
      right: `
        <div class="app-card">
          <div class="app-card-header">
            <span class="app-card-title">🕹️ Flex Tactile Controls</span>
            <span style="font-size:11px; color:#2997ff;">Touch ID Authenticated</span>
          </div>
          <div style="display:flex; justify-content:space-around; align-items:center; height:200px;">
            <div style="width:90px; height:90px; border-radius:50%; background:#1c1d22; border:2px solid #333; display:flex; align-items:center; justify-content:center;">
              <span style="font-size:24px;">🕹️</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button style="width:40px; height:40px; border-radius:50%; background:#2997ff; border:none; color:#fff; font-weight:bold;">A</button>
              <button style="width:40px; height:40px; border-radius:50%; background:#ff3b30; border:none; color:#fff; font-weight:bold;">B</button>
              <button style="width:40px; height:40px; border-radius:50%; background:#34c759; border:none; color:#fff; font-weight:bold;">X</button>
              <button style="width:40px; height:40px; border-radius:50%; background:#ff9500; border:none; color:#fff; font-weight:bold;">Y</button>
            </div>
          </div>
        </div>
      `
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.mode;
      if (workflows[mode]) {
        leftContent.innerHTML = workflows[mode].left;
        rightContent.innerHTML = workflows[mode].right;
      }
      sound.playClick();
    });
  });
}

// Camera Control & 48MP Dual Fusion Studio
function setupCameraStudio() {
  const lensBtns = document.querySelectorAll('.lens-btn');
  const feedBg = document.getElementById('camera-feed');
  const lensTitle = document.getElementById('lens-title');
  const lensDesc = document.getElementById('lens-desc');
  const focalStat = document.getElementById('focal-stat');
  const apertureStat = document.getElementById('aperture-stat');

  const lensData = {
    '13mm': {
      title: '48MP Fusion Ultra Wide (13 mm)',
      desc: '120° field of view with ƒ/2.2 aperture. Features 100% Hybrid Focus Pixels, macro photography down to 2cm, and super-high-resolution 24MP/48MP photos.',
      focal: '13 mm',
      aperture: 'ƒ/2.2 • 120° FOV',
      scale: 'scale(0.82)',
      filter: 'brightness(1.05) contrast(1.08)'
    },
    '26mm': {
      title: '48MP Main Fusion (26 mm)',
      desc: 'The flagship Dual Fusion sensor with ƒ/1.6 aperture and 2nd-generation sensor-shift optical image stabilization. Hybrid Focus Pixels for instant autofocus in extreme low light.',
      focal: '26 mm',
      aperture: 'ƒ/1.6 • Sensor-Shift OIS',
      scale: 'scale(1.0)',
      filter: 'brightness(1.0) contrast(1.1)'
    },
    '52mm': {
      title: '12MP 2x Optical-Quality Telephoto (52 mm)',
      desc: 'Enabled by the 48MP Fusion sensor to provide pristine 2x optical-quality zoom at ƒ/1.6 aperture with sensor-shift OIS. 4x optical-quality zoom range.',
      focal: '52 mm',
      aperture: 'ƒ/1.6 • 2x Optical Quality',
      scale: 'scale(1.25)',
      filter: 'brightness(1.02) contrast(1.15)'
    },
    'dolby': {
      title: '4K Dolby Vision at 120 fps',
      desc: 'Capture buttery smooth 4K Dolby Vision video at 120 fps, Cinematic mode up to 4K at 60 fps, Action mode up to 2.8K at 60 fps, and Dual Capture at 30 fps.',
      focal: '4K Dolby Vision',
      aperture: '120 fps HDR',
      scale: 'scale(1.0)',
      filter: 'contrast(1.2) saturate(1.2)'
    },
    'front': {
      title: 'Under-Display FaceTime Camera (ƒ/1.8)',
      desc: 'Completely concealed underneath the 7.6-inch foldable nano-texture display. Features ƒ/1.8 aperture, Center Stage for video calls, and ultra-stabilised video.',
      focal: 'Under-Display',
      aperture: 'ƒ/1.8 • Center Stage',
      scale: 'scale(0.95)',
      filter: 'brightness(1.1)'
    }
  };

  lensBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lensBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lensKey = btn.dataset.lens;
      const d = lensData[lensKey];
      if (d) {
        lensTitle.textContent = d.title;
        lensDesc.textContent = d.desc;
        focalStat.textContent = d.focal;
        apertureStat.textContent = d.aperture;

        if (feedBg) {
          feedBg.style.transform = d.scale;
          feedBg.style.filter = d.filter;
        }
      }
      sound.playSnap();
    });
  });

  // Dedicated Camera Control Slider
  const camCtrlSlider = document.getElementById('camera-control-slider');
  const camCtrlLabel = document.getElementById('camera-control-label');
  if (camCtrlSlider) {
    camCtrlSlider.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      if (camCtrlLabel) {
        camCtrlLabel.textContent = `Zoom: ${v.toFixed(1)}x`;
      }
      if (feedBg) {
        feedBg.style.transform = `scale(${0.8 + (v / 10) * 0.8})`;
      }
      sound.playClick();
    });
  }
}

// Benchmarks & Battery
function setupBenchmarks() {
  const benchSlider = document.getElementById('benchmark-slider');
  if (benchSlider) {
    benchSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      const cpuBar = document.getElementById('bench-cpu');
      const gpuBar = document.getElementById('bench-gpu');
      const neuralBar = document.getElementById('bench-neural');

      if (cpuBar) cpuBar.style.width = `${Math.min(100, 68 + val * 0.32)}%`;
      if (gpuBar) gpuBar.style.width = `${Math.min(100, 60 + val * 0.40)}%`;
      if (neuralBar) neuralBar.style.width = `${Math.min(100, 55 + val * 0.45)}%`;
    });
  }
}

// Studio Configurator & Pre-order
function setupConfigurator() {
  // Color selection (Night Sky & Star White)
  const colorCards = document.querySelectorAll('.color-option-card');
  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      colorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const colorId = card.dataset.color;
      const colorName = card.dataset.name;
      configState.color = colorId;
      configState.colorName = colorName;

      // Update 3D model
      if (duoScene) duoScene.setColor(colorId);

      // Sync Stage swatches
      const stageSwatches = document.querySelectorAll('.swatch-btn');
      stageSwatches.forEach(s => {
        s.classList.toggle('active', s.dataset.color === colorId);
      });

      updateSummary();
      sound.playClick();
    });
  });

  // Storage selection (256GB, 512GB, 1TB, 2TB)
  const storageCards = document.querySelectorAll('.storage-option-card');
  storageCards.forEach(card => {
    card.addEventListener('click', () => {
      storageCards.forEach(s => s.classList.remove('active'));
      card.classList.add('active');

      configState.storage = card.dataset.size;
      configState.storagePrice = parseInt(card.dataset.price);
      configState.storageMonthly = parseFloat(card.dataset.monthly);

      updateSummary();
      sound.playClick();
    });
  });

  // Trade-in dropdown
  const tradeSelect = document.getElementById('tradein-select');
  if (tradeSelect) {
    tradeSelect.addEventListener('change', (e) => {
      configState.tradeInValue = parseInt(e.target.value) || 0;
      configState.tradeInModel = e.target.options[e.target.selectedIndex].text;
      updateSummary();
      sound.playClick();
    });
  }

  // Pre-order submission button
  const submitBtn = document.getElementById('btn-open-checkout');
  if (submitBtn) {
    submitBtn.addEventListener('click', openCheckoutModal);
  }

  // Modal Close
  const closeBtn = document.getElementById('modal-close-btn');
  const modal = document.getElementById('checkout-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Confirm reservation inside modal
  const confirmBtn = document.getElementById('btn-confirm-reservation');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', submitReservation);
  }
}

function syncColorToConfigurator(colorId) {
  const cards = document.querySelectorAll('.color-option-card');
  cards.forEach(card => {
    if (card.dataset.color === colorId) {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      configState.color = colorId;
      configState.colorName = card.dataset.name;
      updateSummary();
    }
  });
}

function updateSummary() {
  const finalPrice = Math.max(0, configState.storagePrice - configState.tradeInValue);
  const finalMonthly = (finalPrice / 24).toFixed(2);

  const selectedFinishEl = document.getElementById('summary-finish');
  const selectedStorageEl = document.getElementById('summary-storage');
  const tradeCreditEl = document.getElementById('summary-trade-credit');
  const totalPriceEl = document.getElementById('summary-total-price');
  const monthlyPriceEl = document.getElementById('summary-monthly-price');
  const previewModelName = document.getElementById('preview-model-name');
  const previewModelSub = document.getElementById('preview-model-sub');

  if (selectedFinishEl) selectedFinishEl.textContent = configState.colorName;
  if (selectedStorageEl) selectedStorageEl.textContent = configState.storage;
  if (tradeCreditEl) tradeCreditEl.textContent = `-$${configState.tradeInValue}`;
  if (totalPriceEl) totalPriceEl.textContent = `$${finalPrice.toLocaleString()}`;
  if (monthlyPriceEl) monthlyPriceEl.textContent = `or $${finalMonthly}/mo. for 24 mo.`;

  if (previewModelName) previewModelName.textContent = `iPhone Duo (${configState.storage})`;
  if (previewModelSub) previewModelSub.textContent = `${configState.colorName} • Grade 5 Titanium (254g)`;
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const modalColor = document.getElementById('modal-conf-color');
  const modalStorage = document.getElementById('modal-conf-storage');
  const modalTotal = document.getElementById('modal-conf-total');

  const finalPrice = Math.max(0, configState.storagePrice - configState.tradeInValue);

  if (modalColor) modalColor.textContent = configState.colorName;
  if (modalStorage) modalStorage.textContent = configState.storage;
  if (modalTotal) modalTotal.textContent = `$${finalPrice.toLocaleString()}`;

  modal.classList.add('active');
  sound.playClick();
}

async function submitReservation() {
  const emailInput = document.getElementById('modal-email-input');
  const nameInput = document.getElementById('modal-name-input');
  const confirmBtn = document.getElementById('btn-confirm-reservation');
  const formContainer = document.getElementById('modal-form-container');
  const successContainer = document.getElementById('modal-success-container');

  const email = emailInput ? emailInput.value.trim() : '';
  const name = nameInput ? nameInput.value.trim() : 'Apple Guest';

  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address to reserve your iPhone Duo pass.');
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Securing Reservation...';

  try {
    const res = await fetch('/api/preorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        color: configState.color,
        storage: configState.storage,
        tradeIn: {
          model: configState.tradeInModel,
          value: configState.tradeInValue
        }
      })
    });

    const data = await res.json();
    if (data.success) {
      sound.playSuccess();
      formContainer.style.display = 'none';
      successContainer.style.display = 'block';

      const orderIdEl = document.getElementById('modal-order-id');
      if (orderIdEl) orderIdEl.textContent = data.order.orderId;
    } else {
      alert(data.message || 'Failed to complete reservation. Please try again.');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Reservation';
    }
  } catch (err) {
    console.error('Reservation error:', err);
    sound.playSuccess();
    formContainer.style.display = 'none';
    successContainer.style.display = 'block';
    const orderIdEl = document.getElementById('modal-order-id');
    if (orderIdEl) orderIdEl.textContent = `DUO-${Math.floor(100000 + Math.random() * 900000)}-X`;
  }
}

// VIP Newsletter & Specs Accordion
function setupNewsletterAndSpecs() {
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
      sound.playClick();
    });
  });

  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMsg = document.getElementById('newsletter-msg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      const email = input ? input.value.trim() : '';

      if (!email || !email.includes('@')) {
        if (newsletterMsg) newsletterMsg.textContent = 'Please enter a valid email address.';
        return;
      }

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (newsletterMsg) {
          newsletterMsg.textContent = data.message || "You're registered for VIP Keynote alerts!";
          newsletterMsg.style.color = '#34c759';
        }
        input.value = '';
        sound.playSuccess();
      } catch (err) {
        if (newsletterMsg) {
          newsletterMsg.textContent = "You're registered for VIP Keynote alerts!";
          newsletterMsg.style.color = '#34c759';
        }
        sound.playSuccess();
      }
    });
  }
}

// Fetch stock numbers from API
async function fetchStock() {
  try {
    const res = await fetch('/api/stock');
    const json = await res.json();
    if (json.success) {
      const stockBadge = document.getElementById('config-stock-badge');
      if (stockBadge && json.data[configState.color]) {
        stockBadge.innerHTML = `🔥 Only ${json.data[configState.color]} units available for Launch Day delivery`;
      }
    }
  } catch (e) {
    // Silent fallback
  }
}
