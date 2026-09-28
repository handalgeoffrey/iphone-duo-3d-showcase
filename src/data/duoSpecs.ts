export interface DuoSpecSheet {
  productName: string;
  tagline: string;
  finish: {
    name: string;
    material: string;
    hex: string;
    description: string;
  };
  dimensions: {
    open: {
      height: string;
      width: string;
      depth: string;
    };
    closed: {
      height: string;
      width: string;
      depth: string;
    };
    weight: string;
  };
  displays: {
    inner: {
      title: string;
      size: string;
      panel: string;
      resolution: string;
      ppi: number;
      refreshRate: string;
      features: string[];
      peakBrightness: string;
    };
    outer: {
      title: string;
      size: string;
      panel: string;
      resolution: string;
      ppi: number;
      refreshRate: string;
      features: string[];
      peakBrightness: string;
    };
    common: string[];
  };
  durability: {
    frame: string;
    glass: string;
    rating: string;
    hinge: string;
  };
  cameraSystem: {
    title: string;
    lenses: {
      name: string;
      resolution: string;
      focalLength: string;
      aperture: string;
      stabilization: string;
      features: string[];
    }[];
    features: string[];
    videoRecording: string[];
  };
  duoPreview: {
    headline: string;
    subhead: string;
    capabilities: string[];
  };
  performance: {
    chip: string;
    architecture: string;
    cpu: string;
    gpu: string;
    neuralEngine: string;
    memory: string;
    features: string[];
  };
  intelligence: {
    title: string;
    subtitle: string;
    features: string[];
    os: string;
  };
  battery: {
    capacity: string;
    typicalUse: string;
    videoOuter: string;
    videoInner: string;
    streamedOuter: string;
    streamedInner: string;
    charging: {
      wired: string;
      wireless: string;
    };
  };
  connectivity: {
    controls: string[];
    ports: string[];
    wireless: string[];
    sim: string;
  };
  storageTiers: {
    capacity: string;
    price: number;
    monthly: number;
  }[];
}

export const DUO_SPECS: DuoSpecSheet = {
  productName: "iPhone Duo",
  tagline: "The next dimension of iPhone.",
  finish: {
    name: "Star White & Night Sky",
    material: "Grade 5 Titanium with PVD Star White pearlescent or Night Sky obsidian finish",
    hex: "#f5f6f8",
    description: "Available in Star White and Night Sky. Aerospace Grade 5 titanium with micro-bead-blasted texture and refined chamfered rails."
  },
  dimensions: {
    open: {
      height: "117.8 mm",
      width: "164.6 mm",
      depth: "5.2 mm"
    },
    closed: {
      height: "117.8 mm",
      width: "84.1 mm",
      depth: "11.3 mm"
    },
    weight: "254 g"
  },
  displays: {
    inner: {
      title: "Inner Foldable Display",
      size: "7.6-inch",
      panel: "Super Retina XDR OLED",
      resolution: "1878 × 2670",
      ppi: 430,
      refreshRate: "ProMotion 1-120Hz",
      features: [
        "Ultra-thin nano-texture flexible glass",
        "Continuous seamless folding seam",
        "Dynamic Island",
        "Always-On Display",
        "P3 Wide Colour & True Tone"
      ],
      peakBrightness: "3,000 nits peak outdoor"
    },
    outer: {
      title: "Cover Screen",
      size: "5.4-inch",
      panel: "Super Retina XDR OLED",
      resolution: "1398 × 2034",
      ppi: 460,
      refreshRate: "ProMotion 1-120Hz",
      features: [
        "Ceramic Shield 2 cover glass",
        "Dynamic Island",
        "Always-On Display",
        "P3 Wide Colour & True Tone"
      ],
      peakBrightness: "3,000 nits peak outdoor"
    },
    common: [
      "OLED with 2,000,000:1 contrast ratio",
      "Dynamic Island on both displays",
      "Always-On technology",
      "ProMotion adaptive refresh up to 120Hz",
      "HDR10 and Dolby Vision",
      "True Tone & Wide colour (P3)",
      "1 nit minimum brightness for dark viewing"
    ]
  },
  durability: {
    frame: "Aerospace-grade Grade 5 Titanium precision frame",
    glass: "Ceramic Shield 2 front and back - 50% tougher formulation",
    rating: "IP68 water and dust resistance (IEC standard 60529, up to 6 metres for 30 minutes)",
    hinge: "Zero-gap dual-pivot titanium gear hinge with laser-welded structural plates"
  },
  cameraSystem: {
    title: "48MP Dual Fusion Camera System",
    lenses: [
      {
        name: "48MP Fusion Main",
        resolution: "48MP",
        focalLength: "26 mm",
        aperture: "ƒ/1.6",
        stabilization: "Sensor-shift optical image stabilisation (2nd gen)",
        features: ["100% Focus Pixels", "24MP & 48MP super-high-resolution default", "Zero shutter lag"]
      },
      {
        name: "12MP Optical 2x Telephoto",
        resolution: "12MP",
        focalLength: "52 mm",
        aperture: "ƒ/1.6",
        stabilization: "Sensor-shift optical image stabilisation",
        features: ["Enabled by quad-pixel sensor crop", "True optical quality", "Portrait depth map"]
      },
      {
        name: "48MP Fusion Ultra Wide",
        resolution: "48MP",
        focalLength: "13 mm",
        aperture: "ƒ/2.2",
        stabilization: "Electronic image stabilisation & Hybrid Focus Pixels",
        features: ["120° field of view", "48MP Macro photography", "Lens distortion correction"]
      }
    ],
    features: [
      "4x optical-quality zoom range, digital zoom up to 10x",
      "48MP macro photography down to 2cm",
      "Photonic Engine & Deep Fusion image processing",
      "Smart HDR 5 with individual skin tone balancing",
      "Next-generation portraits with Focus and Depth Control",
      "Night mode portraits with LiDAR Scanner integration"
    ],
    videoRecording: [
      "4K Dolby Vision video recording at 24, 25, 30, or 60 fps",
      "Cinematic mode up to 4K Dolby Vision at 60 fps",
      "Action mode up to 2.8K Dolby Vision at 60 fps",
      "Dual Capture recording up to 4K at 30 fps",
      "Spatial Audio recording with Audio Mix studio processing",
      "Wind noise reduction and studio microphones"
    ]
  },
  duoPreview: {
    headline: "Duo Preview. Frame it together.",
    subhead: "Unfold halfway or fully open to turn the external display into an interactive live subject viewfinder while composing on the expansive internal canvas.",
    capabilities: [
      "Live dual-screen preview for subjects and director",
      "Hands-free tabletop tripod capture at any 75°–120° angle",
      "4K Dolby Vision simultaneous dual-angle recording",
      "Instant review and timeline trimming on the 7.6\" display"
    ]
  },
  performance: {
    chip: "A20 Pro",
    architecture: "Next-generation 3-nanometer architecture",
    cpu: "6-core CPU (2 performance cores and 4 efficiency cores)",
    gpu: "7-core GPU with dedicated Neural Accelerators",
    neuralEngine: "Dual 16-core Neural Engine",
    memory: "12GB Unified Memory",
    features: [
      "Hardware-accelerated ray tracing with mesh shading",
      "Dynamic Caching 2nd generation",
      "Hardware AV1 decode engine",
      "On-device neural inference acceleration"
    ]
  },
  intelligence: {
    title: "Intelligence that fits your life.",
    subtitle: "Apple Intelligence and Siri AI, built with privacy at the core. Contextual actions that fluidly bridge the compact cover screen and expansive inner canvas.",
    features: [
      "On-device privacy architecture with Private Cloud Compute",
      "Generative image composition across dual windows",
      "Smart Priority notifications curated across screens",
      "Systemwide writing tools and real-time audio transcript summarization"
    ],
    os: "iOS 27"
  },
  battery: {
    capacity: "Dual built-in rechargeable lithium-ion batteries",
    typicalUse: "Up to 24 hours typical use",
    videoOuter: "Up to 44 hours video playback using the outer display",
    videoInner: "Up to 31 hours video playback using the inner display",
    streamedOuter: "Up to 37 hours streamed video (outer display)",
    streamedInner: "Up to 26 hours streamed video (inner display)",
    charging: {
      wired: "Fast charge up to 50% in around 20 minutes with 60W USB-C adapter",
      wireless: "MagSafe and Qi2 wireless charging up to 25W"
    }
  },
  connectivity: {
    controls: [
      "Camera Control sensor: Exposure, Depth, Zoom, Cameras, Styles, Tone",
      "Side Button with integrated Touch ID biometric reader",
      "Volume up/down precision mechanical switches"
    ],
    ports: [
      "USB-C connector with charging and DisplayPort",
      "USB 3 transfer speeds up to 10 Gbps"
    ],
    wireless: [
      "5G Sub-6 GHz and mmWave with 4x4 MIMO",
      "Wi-Fi 7 (802.11be) with 2x2 MIMO",
      "Bluetooth 6 with ultra-low latency LE Audio",
      "Second-generation Ultra Wideband (UWB) chip",
      "Thread mesh networking protocol",
      "NFC with reader mode and Express Cards"
    ],
    sim: "Dual eSIM (stores 8+ profiles, 2 active simultaneously; no physical tray)"
  },
  storageTiers: [
    { capacity: "256GB", price: 1799, monthly: 74.95 },
    { capacity: "512GB", price: 1999, monthly: 83.29 },
    { capacity: "1TB", price: 2299, monthly: 95.79 },
    { capacity: "2TB", price: 2599, monthly: 108.29 }
  ]
};
