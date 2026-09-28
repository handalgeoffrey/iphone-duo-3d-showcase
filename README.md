# iPhone Duo — Titanium Foldable 3D Product Launch Website

A cinematic, immersive 3D product launch showcase for **iPhone Duo**, a titanium foldable iPhone concept. Built with modern web standards, photorealistic lighting, tactile materials, and smooth scroll-driven storytelling.

---

## Two Official Product Finishes

iPhone Duo is crafted in two aerospace-grade titanium finishes:
1. **Star White**:
   - Model: `/models/main-starwhite.glb`
   - Finish: Satin-brushed Grade 5 Star White titanium with pearlescent PVD finish and frosted ceramic glass back.
   - Lighting: Warm pearlescent daylight studio softboxes with pristine highlight rolls.
2. **Night Sky**:
   - Model: `/models/main-starrynight.glb`
   - Finish: Deep midnight obsidian Grade 5 titanium with cool indigo undertones and dark ceramic back.
   - Lighting: High-contrast studio rim lighting with cool starlight indigo edge reflections.

---

## All-In-One Unified Showcase Features

- **Single Unified Page**: Both finishes are showcased on a single webpage with real-time transition, dual-finish hero composition, dynamic lighting temperature sweeps, and live color switching.
- **Apple Store Pre-Order Studio**:
  - Live finish selector with tactile feedback.
  - Storage selection (256GB, 512GB, 1TB, 2TB) with full price ($1,799–$2,599) and 24-month 0% APR installment calculations.
  - Apple Trade In calculator with instant credit up to $650.
  - Official Apple Store VIP Priority Launch Pass generation with verified order IDs and simulated wallet barcode.
- **60/120fps Kinetic Motion**:
  - Direct Three.js Group transforms driven inside `useFrame` for buttery smooth idle breathing, turntable rotations, and unfold sequences.
  - 4 specialized 3D modules: `DimensionLines3D` (precision millimeter callouts), `DurabilityParticles` (IP68 water resistance), `CameraFocusRings` (48MP Fusion exploded optics), and `ChipLightPaths` (Apple A20 Pro neural light trails).
- **Technical Specifications**: Complete specifications modal strictly verified against the official Apple technical specification documentation (`DUO spec.pdf`).

---

## Running Locally

### Development Server (Vite React 19)
```bash
npm run dev
```
Opens the live development server on [http://localhost:5173](http://localhost:5173).

### Production Server (Express + API Endpoints)
```bash
# 1. Build the production bundle
npm run build

# 2. Start the Express API server (serves dist/ and handles /api/preorder)
node server.js
```
Opens the server on [http://localhost:3000](http://localhost:3000).
