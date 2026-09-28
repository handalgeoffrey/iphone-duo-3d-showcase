import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for orders and VIP list
const preorders = [];
const subscribers = new Set();

// Official Apple iPhone Duo Specifications (from official Apple Technical Specifications)
const DUO_SPECS = {
  name: "iPhone Duo",
  tagline: "Unfold the Future.",
  year: "2026",
  os: "iOS 27",
  colors: [
    { id: "nightsky", name: "Night Sky", hex: "#15161b", rgb: [0.08, 0.09, 0.11] },
    { id: "starwhite", name: "Star White", hex: "#f5f6f8", rgb: [0.96, 0.96, 0.97] }
  ],
  storageTiers: [
    { size: "256GB", price: 1799, monthly: 74.95 },
    { size: "512GB", price: 1999, monthly: 83.29 },
    { size: "1TB", price: 2299, monthly: 95.79 },
    { size: "2TB", price: 2599, monthly: 108.29 }
  ],
  dimensions: {
    open: {
      height: "117.8 mm (4.64 in)",
      width: "164.6 mm (6.48 in)",
      depth: "5.2 mm (0.21 in)"
    },
    closed: {
      height: "117.8 mm (4.64 in)",
      width: "84.1 mm (3.31 in)",
      depth: "11.3 mm (0.44 in)"
    },
    weight: "254 g (8.96 oz)"
  },
  display: {
    inner: {
      type: "Super Retina XDR all-screen OLED folding display",
      size: "19.26 cm / 7.6\" (diagonal)",
      resolution: "1878 x 2670-pixel resolution at 430 ppi",
      finish: "Nano-texture finish, Wide-angle OLEDs",
      pencilSupport: "Supports Apple Pencil (USB-C)"
    },
    outer: {
      type: "Super Retina XDR all-screen OLED display",
      size: "13.62 cm / 5.4\" (diagonal)",
      resolution: "1398 x 2034-pixel resolution at 460 ppi",
      glass: "Ceramic Shield 2"
    },
    both: {
      features: "Dynamic Island on both displays, Always-On display, ProMotion technology up to 120Hz, True Tone, Wide colour (P3), Haptic Touch",
      contrastRatio: "2,000,000:1 contrast ratio",
      brightness: "1,000 nits max (typical), 1,600 nits peak (HDR), 3,000 nits peak (outdoor), 1 nit minimum"
    }
  },
  durability: {
    chassis: "Grade 5 Titanium foldable design with Ceramic Shield 2 front and Ceramic Shield back",
    waterResistance: "Rated IP68 (maximum depth of 6 metres up to 30 minutes) under IEC standard 60529"
  },
  chip: {
    name: "Apple A20 Pro chip",
    cpu: "6-core CPU with 2 super cores and 4 efficiency cores",
    gpu: "7-core GPU with Neural Accelerators and hardware-accelerated ray tracing",
    neuralEngine: "Dual 16-core Neural Engine",
    memory: "12 GB Unified Memory",
    ai: "Apple Intelligence & Siri AI integrated with privacy"
  },
  camera: {
    rearSystem: "48MP Dual Fusion camera system",
    main: "48MP Fusion: 26 mm, ƒ/1.6 aperture, sensor-shift optical image stabilisation, Hybrid Focus Pixels, 24MP & 48MP super-high-resolution",
    ultraWide: "48MP Fusion Ultra Wide: 13 mm, ƒ/2.2 aperture, 120° field of view, Hybrid Focus Pixels, 48MP Macro photography",
    telephoto: "12MP optical-quality 2x Telephoto: 52 mm, ƒ/1.6 aperture, sensor-shift optical image stabilisation",
    cameraControl: "Camera Control (Exposure, Depth, Zoom, Cameras, Styles, Tone)",
    video: "4K Dolby Vision at 24, 25, 30, 60, 100, or 120 fps (Fusion Main), Cinematic mode up to 4K Dolby Vision at 60 fps, Action mode up to 2.8K at 60 fps, Dual Capture up to 4K at 30 fps, Spatial Audio and stereo recording, Audio Mix",
    outerFront: "12MP Center Stage camera, ƒ/2.2 aperture, 4K Dolby Vision up to 60 fps",
    innerFront: "Under-display FaceTime camera, ƒ/1.8 aperture, Center Stage for video calls"
  },
  battery: {
    setup: "Dual built-in rechargeable lithium-ion batteries (5,400 mAh)",
    typicalUse: "Up to 24 hours typical use",
    videoPlayback: "Up to 44 hours using outer display, up to 31 hours using inner display",
    streamedVideo: "Up to 37 hours using outer display, up to 26 hours using inner display",
    charging: "Up to 50% charge in ~20 minutes with 60W adapter; up to 50% in ~30 minutes with 35W MagSafe; Qi2 wireless charging up to 25W"
  },
  biometrics: "Touch ID fingerprint sensor built into the side button",
  sim: "Dual eSIM (two active eSIMs; stores 8 or more eSIMs; no physical SIM slot)",
  connectivity: "Apple C2 cellular modem, Apple N1 wireless chip, Wi-Fi 7 (802.11be) with 2x2 MIMO, Bluetooth 6, Thread, 2nd-gen Ultra Wideband (UWB), NFC with reader mode, USB-C (USB 3 up to 10 Gbps, DisplayPort)"
};

// Stock counter simulation
const STOCK_STATUS = {
  nightsky: 14,
  starwhite: 9,
  batchShipDate: "Delivers October 24 with Free Express Shipping"
};

// API: Specifications
app.get('/api/specs', (req, res) => {
  res.json({ success: true, data: DUO_SPECS });
});

// API: Stock Availability
app.get('/api/stock', (req, res) => {
  res.json({ success: true, data: STOCK_STATUS });
});

// API: Pre-order Submission
app.post('/api/preorder', (req, res) => {
  const { name, email, color, storage, tradeIn, paymentType } = req.body;

  if (!email || !color || !storage) {
    return res.status(400).json({ success: false, message: "Missing required order fields." });
  }

  const orderId = `DUO-${Math.floor(100000 + Math.random() * 900000)}-X`;
  const storageTier = DUO_SPECS.storageTiers.find(s => s.size === storage) || DUO_SPECS.storageTiers[0];
  const colorObj = DUO_SPECS.colors.find(c => c.id === color) || DUO_SPECS.colors[0];

  const tradeInDiscount = tradeIn ? Number(tradeIn.value || 0) : 0;
  const finalPrice = Math.max(0, storageTier.price - tradeInDiscount);
  const finalMonthly = (finalPrice / 24).toFixed(2);

  const order = {
    orderId,
    timestamp: new Date().toISOString(),
    customer: { name: name || "Apple Guest", email },
    configuration: {
      model: "iPhone Duo",
      os: "iOS 27",
      finish: colorObj.name,
      storage: storageTier.size,
      ram: "12 GB",
      chip: "Apple A20 Pro (Dual 16-Core Neural Engine)",
      innerScreen: "7.6-inch Nano-Texture Matte Foldable OLED (1878x2670)",
      outerScreen: "5.4-inch Ceramic Shield 2 Cover Screen (1398x2034)",
      pencilSupport: "Apple Pencil (USB-C) Compatible",
      biometrics: "Side Button Touch ID",
      cameraControl: "Dedicated Hardware Camera Control",
      dualEsim: "Dual eSIM (100% Physical SIM Free)",
      basePrice: storageTier.price,
      tradeInCredit: tradeInDiscount,
      finalPrice,
      paymentType: paymentType || "full",
      monthlyPayment: finalMonthly
    },
    delivery: {
      estimatedDelivery: "October 24, 2026",
      shippingMethod: "Apple Express Priority (Signature Required)"
    }
  };

  preorders.push(order);

  if (STOCK_STATUS[color] && STOCK_STATUS[color] > 1) {
    STOCK_STATUS[color] -= 1;
  }

  res.json({
    success: true,
    message: "Official Apple Store VIP Reservation Confirmed!",
    order
  });
});

// API: Newsletter / VIP Launch Access
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }

  subscribers.add(email);
  res.json({
    success: true,
    message: "You're on the official VIP Keynote list. Confirmation sent!"
  });
});

// Fallback handler (Express 5 compatible: prefer built React production bundle if available)
app.use((req, res) => {
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`[iPhone Duo Showcase] Server running on http://localhost:${PORT}`);
});
