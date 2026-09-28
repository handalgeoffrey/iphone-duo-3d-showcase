// ==========================================================================
// iPhone Duo - Official 3D WebGL Three.js Engine
// Calibrated to Apple Technical Specifications (DUO spec.pdf):
// - Dimensions: 117.8mm (H) x 164.6mm (Open W) / 84.1mm (Closed W) x 5.2mm (Open D)
// - Inner Display: 7.6" Nano-Texture OLED (1878x2670, 430 ppi, Apple Pencil USB-C support)
// - Outer Display: 5.4" Super Retina XDR (1398x2034, 460 ppi, Ceramic Shield 2)
// - Dynamic Island on both displays
// - Grade 5 Titanium Foldable Body (254g, IP68 rated)
// - Hardware: Side Button with Touch ID + Dedicated Camera Control button
// - 48MP Dual Fusion Camera System + Under-Display FaceTime camera (ƒ/1.8)
// - Apple A20 Pro chip (Dual 16-core Neural Engine) + Dual 5,400 mAh Battery Setup
// - Finishes: Night Sky & Star White
// ==========================================================================

export class DuoScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // 3D Objects
    this.phoneRoot = null;
    this.leftHalf = null;
    this.rightHalf = null;
    this.hingeGroup = null;
    this.internalsGroup = null;
    this.pencilMesh = null;

    // Materials
    this.titaniumMaterial = null;
    this.ceramicBackMaterial = null;
    this.innerScreenMatLeft = null;
    this.innerScreenMatRight = null;
    this.outerCoverMat = null;
    this.hingeMaterial = null;

    // Animation & State
    this.foldAngle = 180; // 0° closed to 180° flat open
    this.targetFoldAngle = 180;
    this.isExploded = false;
    this.explodeFactor = 0;
    this.autoRotate = true;
    this.currentColor = 'nightsky';
    this.showPencil = false;

    // Official Finishes
    this.colors = {
      nightsky: { 
        hex: 0x15161b, 
        titaniumHex: 0x22242c,
        roughness: 0.28, 
        metalness: 0.95, 
        clearcoat: 0.8,
        name: 'Night Sky'
      },
      starwhite: { 
        hex: 0xf5f6f8, 
        titaniumHex: 0xe0e2e8,
        roughness: 0.16, 
        metalness: 0.80, 
        clearcoat: 0.9,
        name: 'Star White'
      }
    };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.032);

    // 2. Camera setup
    const width = this.canvas.clientWidth || 1000;
    const height = this.canvas.clientHeight || 640;
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.8, 12.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. OrbitControls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 22;
      this.controls.minDistance = 4.5;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.12;
      this.controls.autoRotate = false;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Build the 3D iPhone Duo Model
    this.buildModel();

    // 7. Event listeners
    window.addEventListener('resize', () => this.onResize());

    // 8. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(6, 8, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    const blueRim = new THREE.DirectionalLight(0x2997ff, 2.4);
    blueRim.position.set(-8, 5, -6);
    this.scene.add(blueRim);

    const warmRim = new THREE.DirectionalLight(0xffecd1, 1.4);
    warmRim.position.set(8, -3, -6);
    this.scene.add(warmRim);

    // Reflective ground
    const planeGeo = new THREE.PlaneGeometry(32, 32);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x060609,
      roughness: 0.85,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(planeGeo, planeMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  buildModel() {
    this.phoneRoot = new THREE.Group();
    this.phoneRoot.position.set(0, 0, 0);

    // Exact geometric scaling:
    // Open: 117.8mm (Height: ~4.7 units) x 164.6mm (Total Width: ~6.6 units, 3.3 each half) x 5.2mm (Depth: ~0.21 units)
    const halfWidth = 3.25;
    const height = 4.70;
    const depth = 0.22;
    const cornerRadius = 0.26;

    const initialColor = this.colors[this.currentColor];

    // Grade 5 Titanium Foldable Frame
    this.titaniumMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor.titaniumHex,
      metalness: initialColor.metalness,
      roughness: initialColor.roughness,
      clearcoat: initialColor.clearcoat,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95
    });

    // Ceramic Shield Back Glass
    this.ceramicBackMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor.hex,
      metalness: 0.15,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    // Grade 5 Titanium Liquid Hinge Material
    this.hingeMaterial = new THREE.MeshStandardMaterial({
      color: initialColor.titaniumHex,
      metalness: 0.96,
      roughness: 0.2
    });

    // Textures for 7.6" Nano-Texture Inner and 5.4" Outer Cover Screen
    const leftInnerScreenTex = this.createInnerScreenTexture(true);
    const rightInnerScreenTex = this.createInnerScreenTexture(false);
    const outerCoverScreenTex = this.createOuterCoverScreenTexture();

    // 7.6" Inner Screen has Nano-Texture Matte finish
    this.innerScreenMatLeft = new THREE.MeshStandardMaterial({
      map: leftInnerScreenTex,
      roughness: 0.48, // Nano-texture matte dispersion
      metalness: 0.05
    });
    this.innerScreenMatRight = new THREE.MeshStandardMaterial({
      map: rightInnerScreenTex,
      roughness: 0.48,
      metalness: 0.05
    });

    // 5.4" Outer Cover Screen has Ceramic Shield 2 gloss
    this.outerCoverMat = new THREE.MeshPhysicalMaterial({
      map: outerCoverScreenTex,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0
    });

    // -------------------------------------------------------------
    // RIGHT HALF (Outer Cover Screen 5.4" on back, Right Inner 7.6" on front)
    // -------------------------------------------------------------
    this.rightHalf = new THREE.Group();
    this.rightHalf.position.set(0, 0, 0); // Pivot origin at X=0

    // Right body frame
    const rightBodyGeo = this.createPhoneHalfGeometry(halfWidth, height, depth, cornerRadius);
    const rightBody = new THREE.Mesh(rightBodyGeo, this.titaniumMaterial);
    rightBody.castShadow = true;
    rightBody.receiveShadow = true;
    rightBody.position.set(halfWidth / 2, 0, 0);
    this.rightHalf.add(rightBody);

    // Right Inner Screen (Part of the 7.6" foldable display)
    const screenGeo = new THREE.PlaneGeometry(halfWidth - 0.10, height - 0.14);
    const rightScreen = new THREE.Mesh(screenGeo, this.innerScreenMatRight);
    rightScreen.position.set(halfWidth / 2, 0, depth / 2 + 0.002);
    this.rightHalf.add(rightScreen);

    // Under-Display FaceTime Camera (ƒ/1.8 aperture)
    const faceTimeGeo = new THREE.CircleGeometry(0.045, 16);
    const faceTimeMat = new THREE.MeshBasicMaterial({ color: 0x112233, transparent: true, opacity: 0.65 });
    const faceTimeCamera = new THREE.Mesh(faceTimeGeo, faceTimeMat);
    faceTimeCamera.position.set(halfWidth / 2, 2.05, depth / 2 + 0.004);
    this.rightHalf.add(faceTimeCamera);

    // 5.4-inch Outer Cover Screen on the Back of Right Half
    const outerCoverGeo = new THREE.PlaneGeometry(halfWidth - 0.20, height - 0.28);
    const outerCoverMesh = new THREE.Mesh(outerCoverGeo, this.outerCoverMat);
    outerCoverMesh.rotation.y = Math.PI; // faces outward when folded
    outerCoverMesh.position.set(halfWidth / 2, 0, -depth / 2 - 0.003);
    this.rightHalf.add(outerCoverMesh);

    // Side Button with Integrated Touch ID Sensor on Right Edge
    const touchIdGeo = new THREE.BoxGeometry(0.08, 0.90, 0.08);
    const touchIdMat = new THREE.MeshStandardMaterial({
      color: 0x3a3c44,
      metalness: 0.98,
      roughness: 0.25
    });
    const touchIdButton = new THREE.Mesh(touchIdGeo, touchIdMat);
    touchIdButton.position.set(halfWidth + 0.03, 0.8, 0);
    this.rightHalf.add(touchIdButton);

    // Dedicated Camera Control Button on Right Edge (lower section)
    const cameraCtrlGeo = new THREE.BoxGeometry(0.08, 0.75, 0.08);
    const cameraCtrlMat = new THREE.MeshStandardMaterial({
      color: 0x24262c,
      metalness: 0.95,
      roughness: 0.3
    });
    const cameraCtrlButton = new THREE.Mesh(cameraCtrlGeo, cameraCtrlMat);
    cameraCtrlButton.position.set(halfWidth + 0.03, -0.9, 0);
    this.rightHalf.add(cameraCtrlButton);

    // USB-C Connector on Bottom of Right Half
    const usbcGeo = new THREE.BoxGeometry(0.55, 0.06, 0.12);
    const usbcMat = new THREE.MeshStandardMaterial({ color: 0x111116, metalness: 0.9 });
    const usbc = new THREE.Mesh(usbcGeo, usbcMat);
    usbc.position.set(halfWidth / 2, -height / 2 - 0.02, 0);
    this.rightHalf.add(usbc);

    // -------------------------------------------------------------
    // LEFT HALF (Articulating Hinge Wing)
    // -------------------------------------------------------------
    this.leftHalf = new THREE.Group();
    this.leftHalf.position.set(0, 0, 0);

    const leftContainer = new THREE.Group();
    leftContainer.position.set(-halfWidth / 2, 0, 0);

    const leftBodyGeo = this.createPhoneHalfGeometry(halfWidth, height, depth, cornerRadius);
    const leftBody = new THREE.Mesh(leftBodyGeo, this.titaniumMaterial);
    leftBody.castShadow = true;
    leftBody.receiveShadow = true;
    leftContainer.add(leftBody);

    // Left Inner Screen (Left side of 7.6" foldable display)
    const leftScreen = new THREE.Mesh(screenGeo, this.innerScreenMatLeft);
    leftScreen.position.set(0, 0, depth / 2 + 0.002);
    leftContainer.add(leftScreen);

    // Ceramic Shield Back Glass on Left Half
    const backGlassGeo = new THREE.PlaneGeometry(halfWidth - 0.12, height - 0.14);
    const leftBackGlass = new THREE.Mesh(backGlassGeo, this.ceramicBackMaterial);
    leftBackGlass.rotation.y = Math.PI;
    leftBackGlass.position.set(0, 0, -depth / 2 - 0.002);
    leftContainer.add(leftBackGlass);

    // Rear 48MP Dual Fusion Camera System (48MP Fusion + 48MP Ultra Wide + 12MP 2x Telephoto)
    const dualFusionCamera = this.createDualFusionCameraBump();
    dualFusionCamera.position.set(-0.75, 1.25, -depth / 2 - 0.08);
    leftContainer.add(dualFusionCamera);

    // Volume Buttons on left edge
    const volUpGeo = new THREE.BoxGeometry(0.06, 0.45, 0.06);
    const volMat = new THREE.MeshStandardMaterial({ color: 0x333338, metalness: 0.95 });
    const volUp = new THREE.Mesh(volUpGeo, volMat);
    volUp.position.set(-halfWidth / 2 - 0.03, 1.0, 0);
    leftContainer.add(volUp);

    const volDown = new THREE.Mesh(volUpGeo, volMat);
    volDown.position.set(-halfWidth / 2 - 0.03, 0.4, 0);
    leftContainer.add(volDown);

    this.leftHalf.add(leftContainer);

    // -------------------------------------------------------------
    // GRADE 5 TITANIUM ZERO-GAP LIQUID HINGE
    // -------------------------------------------------------------
    this.hingeGroup = new THREE.Group();
    const hingeCylinderGeo = new THREE.CylinderGeometry(depth / 2.08, depth / 2.08, height - 0.28, 32);
    const hingeCylinder = new THREE.Mesh(hingeCylinderGeo, this.hingeMaterial);
    hingeCylinder.castShadow = true;
    this.hingeGroup.add(hingeCylinder);

    for (let i = -2; i <= 2; i++) {
      const ringGeo = new THREE.CylinderGeometry(depth / 1.95, depth / 1.95, 0.14, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x4a4d58, metalness: 0.98, roughness: 0.15 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = i * 0.95;
      this.hingeGroup.add(ring);
    }

    // -------------------------------------------------------------
    // APPLE PENCIL (USB-C) 3D Model
    // -------------------------------------------------------------
    this.pencilMesh = this.createApplePencil();
    this.pencilMesh.position.set(0.5, 0.2, 0.4);
    this.pencilMesh.rotation.z = -Math.PI / 4;
    this.pencilMesh.visible = false;
    this.phoneRoot.add(this.pencilMesh);

    // -------------------------------------------------------------
    // INTERNAL X-RAY COMPONENTS: Apple A20 Pro & Dual 5,400 mAh Battery
    // -------------------------------------------------------------
    this.internalsGroup = new THREE.Group();
    this.internalsGroup.visible = false;

    // Apple A20 Pro Silicon Chip
    const a20Geo = new THREE.BoxGeometry(0.85, 0.85, 0.06);
    const a20Mat = new THREE.MeshStandardMaterial({
      color: 0x111118,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x2997ff,
      emissiveIntensity: 0.5
    });
    const a20Chip = new THREE.Mesh(a20Geo, a20Mat);
    a20Chip.position.set(halfWidth / 2, 0.6, 0);
    this.internalsGroup.add(a20Chip);

    // Dual 16-Core Neural Engine Box
    const nEngineGeo = new THREE.BoxGeometry(0.5, 0.7, 0.05);
    const nEngineMat = new THREE.MeshStandardMaterial({ color: 0x222, emissive: 0xaf52de, emissiveIntensity: 0.35 });
    const nEngine = new THREE.Mesh(nEngineGeo, nEngineMat);
    nEngine.position.set(halfWidth / 2 + 0.8, 0.6, 0);
    this.internalsGroup.add(nEngine);

    // Dual 5,400 mAh Battery Setup (Split cells across both halves)
    const batGeo = new THREE.BoxGeometry(halfWidth * 0.75, height * 0.44, 0.08);
    const batMat = new THREE.MeshStandardMaterial({
      color: 0x202228,
      metalness: 0.7,
      roughness: 0.35,
      emissive: 0x34c759,
      emissiveIntensity: 0.2
    });

    const batRight = new THREE.Mesh(batGeo, batMat);
    batRight.position.set(halfWidth / 2, -0.9, 0);
    this.internalsGroup.add(batRight);

    const batLeft = new THREE.Mesh(batGeo, batMat);
    batLeft.position.set(-halfWidth / 2, -0.5, 0);
    this.internalsGroup.add(batLeft);

    // MagSafe & Qi2 25W Induction Array
    const magSafeGeo = new THREE.TorusGeometry(0.68, 0.045, 16, 48);
    const magSafeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const magSafe = new THREE.Mesh(magSafeGeo, magSafeMat);
    magSafe.position.set(-halfWidth / 2, 0.6, -0.05);
    this.internalsGroup.add(magSafe);

    // Assemble into Root
    this.phoneRoot.add(this.rightHalf);
    this.phoneRoot.add(this.leftHalf);
    this.phoneRoot.add(this.hingeGroup);
    this.phoneRoot.add(this.internalsGroup);

    this.scene.add(this.phoneRoot);

    // Set initial fold angle
    this.updateFoldGeometry(this.foldAngle);
  }

  createApplePencil() {
    const group = new THREE.Group();
    // Pencil body
    const bodyGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Tip
    const tipGeo = new THREE.ConeGeometry(0.06, 0.25, 32);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e4, roughness: 0.4 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = -1.72;
    tip.rotation.x = Math.PI;
    group.add(tip);

    // Top cap band
    const capGeo = new THREE.CylinderGeometry(0.061, 0.061, 0.08, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.55;
    group.add(cap);

    return group;
  }

  createPhoneHalfGeometry(width, height, depth, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.032,
      bevelThickness: 0.032
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
  }

  createDualFusionCameraBump() {
    const group = new THREE.Group();

    // Island box
    const islandGeo = new THREE.BoxGeometry(1.2, 1.9, 0.12);
    const islandMat = new THREE.MeshPhysicalMaterial({
      color: 0x18191f,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    group.add(island);

    // Dual Fusion Lenses (48MP Fusion & 48MP Ultra Wide)
    const lenses = [
      { y: 0.45, label: "48MP Fusion (26mm)" },
      { y: -0.45, label: "48MP Ultra Wide (13mm)" }
    ];

    lenses.forEach(l => {
      const ringGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.1, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x4a4d58, metalness: 0.98, roughness: 0.15 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, l.y, -0.06);
      group.add(ring);

      const lensGeo = new THREE.SphereGeometry(0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x050814,
        roughness: 0.05,
        transmission: 0.92,
        thickness: 0.4
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = -Math.PI / 2;
      lens.position.set(0, l.y, -0.1);
      group.add(lens);
    });

    // 12MP 2x Telephoto Sensor + True Tone Flash
    const flashGeo = new THREE.CircleGeometry(0.1, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfffae8 });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.position.set(0.38, 0.0, -0.07);
    flash.rotation.y = Math.PI;
    group.add(flash);

    return group;
  }

  // 7.6" Inner Foldable Display with Nano-Texture Matte Canvas (1878x2670)
  createInnerScreenTexture(isLeft) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    if (isLeft) {
      grad.addColorStop(0, '#090a12');
      grad.addColorStop(0.5, '#161927');
      grad.addColorStop(1, '#05070c');
    } else {
      grad.addColorStop(0, '#0c101a');
      grad.addColorStop(0.5, '#192032');
      grad.addColorStop(1, '#05070c');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Nano-Texture matte grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 2048, 2, 2);
    }

    // Dynamic Island on Top of Right Inner Canvas
    if (!isLeft) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(412, 60, 200, 54, 27);
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#34c759';
      ctx.beginPath();
      ctx.arc(580, 87, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Status Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 44px -apple-system, sans-serif';
    if (isLeft) {
      ctx.fillText('9:41', 110, 110);
      ctx.font = '400 30px -apple-system, sans-serif';
      ctx.fillStyle = '#34c759';
      ctx.fillText('⚡ Touch ID Active', 280, 110);
    } else {
      ctx.textAlign = 'right';
      ctx.fillText('5G | 100% (5,400 mAh)', 914, 110);
    }

    if (isLeft) {
      // Left display: Final Cut Pro 4K Dolby Vision timeline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(80, 200, 864, 540, 32);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 46px -apple-system, sans-serif';
      ctx.fillText('7.6" Foldable OLED (1878x2670)', 130, 310);
      ctx.font = '400 32px -apple-system, sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('Apple A20 Pro • Dual 16-Core NPU • iOS 27', 130, 370);

      // Track waveforms
      ctx.fillStyle = '#2997ff';
      ctx.roundRect(130, 440, 764, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#34c759';
      ctx.roundRect(130, 510, 620, 48, 12);
      ctx.fill();

      // Apple Pencil Banner
      ctx.fillStyle = 'rgba(175, 82, 222, 0.15)';
      ctx.roundRect(130, 600, 764, 90, 20);
      ctx.fill();
      ctx.fillStyle = '#e4b5ff';
      ctx.font = '600 32px -apple-system, sans-serif';
      ctx.fillText('✏️ Apple Pencil (USB-C) Canvas Active', 170, 655);

      // App Icons
      const icons = ['#ff3b30', '#ff9500', '#34c759', '#007aff', '#af52de', '#5856d6'];
      for (let i = 0; i < 6; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        ctx.fillStyle = icons[i];
        ctx.beginPath();
        ctx.roundRect(130 + col * 280, 890 + row * 260, 180, 180, 40);
        ctx.fill();
      }
    } else {
      // Right display: Camera Control HUD & Freeform Continuity
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(80, 200, 864, 980, 32);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 46px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Dedicated Camera Control', 130, 310);
      ctx.font = '400 32px -apple-system, sans-serif';
      ctx.fillStyle = '#86868b';
      ctx.fillText('Exposure • Depth • Zoom • Styles • Tone', 130, 370);

      // Camera Control Virtual Dial
      ctx.strokeStyle = '#2997ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(512, 750, 240, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.roundRect(362, 1980, 300, 10, 5);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  // 5.4" Outer Cover Screen (1398x2034) with Dynamic Island & Ceramic Shield 2
  createOuterCoverScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.6, '#0f1420');
    grad.addColorStop(1, '#05070a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Dynamic Island on Outer 5.4" Cover Screen
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(412, 60, 200, 54, 27);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 12MP Center Stage Camera indicator
    ctx.fillStyle = '#34c759';
    ctx.beginPath();
    ctx.arc(580, 87, 4, 0, Math.PI * 2);
    ctx.fill();

    // Clock
    ctx.fillStyle = '#ffffff';
    ctx.font = '300 130px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('09:41', 512, 420);

    ctx.font = '600 38px -apple-system, sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Wednesday, September 16', 512, 490);

    // 5.4" Cover Screen Specs Banner
    ctx.fillStyle = 'rgba(41, 151, 255, 0.15)';
    ctx.roundRect(222, 600, 580, 75, 37);
    ctx.fill();
    ctx.fillStyle = '#2997ff';
    ctx.font = '600 32px -apple-system, sans-serif';
    ctx.fillText('5.4" Cover Screen • 44h Battery Life', 512, 648);

    // Widget grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(100, 780, 824, 350, 36);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 40px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Touch ID Power Key', 160, 870);
    ctx.font = '400 32px -apple-system, sans-serif';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Fingerprint sensor built into side button', 160, 930);
    ctx.fillText('Camera Control: Dedicated capacitive switch', 160, 990);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(220, 1820, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(804, 1820, 60, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  toggleApplePencil() {
    this.showPencil = !this.showPencil;
    if (this.pencilMesh) {
      this.pencilMesh.visible = this.showPencil;
    }
    return this.showPencil;
  }

  updateFoldGeometry(degrees) {
    this.foldAngle = degrees;
    const rad = ((180 - degrees) * Math.PI) / 180;

    if (this.leftHalf) {
      this.leftHalf.rotation.y = rad;
    }
  }

  setFoldAngle(degrees) {
    this.targetFoldAngle = Math.max(0, Math.min(180, degrees));
  }

  setColor(colorKey) {
    if (!this.colors[colorKey]) return;
    this.currentColor = colorKey;
    const c = this.colors[colorKey];

    if (this.titaniumMaterial) {
      this.titaniumMaterial.color.setHex(c.titaniumHex);
      this.titaniumMaterial.roughness = c.roughness;
      this.titaniumMaterial.metalness = c.metalness;
      this.titaniumMaterial.clearcoat = c.clearcoat;
    }

    if (this.ceramicBackMaterial) {
      this.ceramicBackMaterial.color.setHex(c.hex);
    }

    if (this.hingeMaterial) {
      this.hingeMaterial.color.setHex(c.titaniumHex);
    }
  }

  toggleExploded() {
    this.isExploded = !this.isExploded;
    if (this.internalsGroup) {
      this.internalsGroup.visible = true;
    }
    return this.isExploded;
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth fold angle lerp
    if (Math.abs(this.foldAngle - this.targetFoldAngle) > 0.1) {
      const step = (this.targetFoldAngle - this.foldAngle) * 0.1;
      this.updateFoldGeometry(this.foldAngle + step);
    }

    // Exploded view animation lerp
    const targetFactor = this.isExploded ? 1.0 : 0.0;
    this.explodeFactor += (targetFactor - this.explodeFactor) * 0.1;

    if (this.phoneRoot && this.internalsGroup) {
      if (this.explodeFactor > 0.01) {
        this.internalsGroup.visible = true;
        this.rightHalf.position.z = this.explodeFactor * 1.5;
        this.leftHalf.position.z = this.explodeFactor * 1.5;
        this.internalsGroup.position.z = -this.explodeFactor * 0.8;
      } else {
        this.internalsGroup.visible = false;
        this.rightHalf.position.z = 0;
        this.leftHalf.position.z = 0;
        this.internalsGroup.position.z = 0;
      }
    }

    // Floating breathing animation & auto-rotate
    const time = performance.now() * 0.001;
    if (this.phoneRoot) {
      this.phoneRoot.position.y = Math.sin(time * 1.5) * 0.08;

      if (this.autoRotate && (!this.controls || this.controls.state === -1)) {
        this.phoneRoot.rotation.y = Math.sin(time * 0.6) * 0.35;
        this.phoneRoot.rotation.x = Math.sin(time * 0.8) * 0.08;
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
