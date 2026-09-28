export interface ChapterData {
  id: string;
  number: number;
  navLabel: string;
  theme: 'dark' | 'light';
  title: string;
  headline: string;
  subhead?: string;
  caption?: string;
  techLabel?: string;
  details?: string[];
  foldRatio: number; // 0 = closed, 1 = open
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  specs?: { label: string; value: string; desc: string }[];
  cameraHotspots?: { id: string; label: string; spec: string; position: [number, number, number] }[];
}

export const CHAPTERS: ChapterData[] = [
  {
    id: "hero",
    number: 1,
    navLabel: "iPhone Duo",
    theme: "dark",
    title: "iPhone Duo",
    headline: "Unfold the impossible.",
    subhead: "Two iconic finishes. One revolutionary dual-screen architecture.",
    caption: "The next dimension of iPhone.",
    techLabel: "Grade 5 Titanium • Dual-Pivot Architecture",
    foldRatio: 0.0,
    cameraPosition: [0, 0, 0.44],
    cameraTarget: [0, 0.01, 0]
  },
  {
    id: "unfold",
    number: 2,
    navLabel: "Unfold",
    theme: "dark",
    title: "The Unfold Moment",
    headline: "One iPhone. Two ways to see more.",
    subhead: "From a compact 5.4-inch cover screen to an expansive 7.6-inch canvas in one fluid motion.",
    techLabel: "5.2 mm open • 11.3 mm closed",
    foldRatio: 1.0,
    cameraPosition: [0, 0.02, 0.38],
    cameraTarget: [0, 0.01, 0]
  },
  {
    id: "design",
    number: 3,
    navLabel: "Design",
    theme: "dark",
    title: "Precision Design",
    headline: "Engineered to the tenth of a millimeter.",
    subhead: "Enclosed in laser-welded Grade 5 titanium, balancing two halves in 50:50 equilibrium.",
    techLabel: "Grade 5 Titanium • Ceramic Shield 2 • IP68",
    foldRatio: 0.75,
    cameraPosition: [-0.03, 0.04, 0.34],
    cameraTarget: [0.03, 0.01, 0],
    specs: [
      {
        label: "Thickness",
        value: "5.2 mm",
        desc: "Thinnest iPhone profile ever unfolded."
      },
      {
        label: "Chassis",
        value: "Grade 5 Titanium",
        desc: "Laser-welded internal frame with micro-bead finish."
      },
      {
        label: "Total Mass",
        value: "254 g",
        desc: "Equally distributed 50:50 across dual titanium halves."
      }
    ]
  },
  {
    id: "displays",
    number: 4,
    navLabel: "Displays",
    theme: "dark",
    title: "Dual Displays",
    headline: "Brilliance inside and out.",
    subhead: "Two Super Retina XDR OLED displays. Both with Dynamic Island, ProMotion up to 120Hz, and 3,000 nits peak outdoor brightness.",
    techLabel: "3,000 nits peak • ProMotion 120Hz",
    foldRatio: 1.0,
    cameraPosition: [-0.04, 0.03, 0.32],
    cameraTarget: [0.02, 0.01, 0],
    specs: [
      {
        label: "Inner Display",
        value: "7.6\" OLED",
        desc: "1878 × 2670 at 430 ppi with nano-texture anti-reflective coating."
      },
      {
        label: "Outer Display",
        value: "5.4\" OLED",
        desc: "1398 × 2034 at 460 ppi with Ceramic Shield 2 protection."
      }
    ]
  },
  {
    id: "camera",
    number: 5,
    navLabel: "Camera",
    theme: "dark",
    title: "Pro Camera System",
    headline: "See more from every angle.",
    subhead: "A pro dual Fusion system with second-generation sensor-shift optical image stabilisation.",
    techLabel: "48MP Dual Fusion Camera System",
    foldRatio: 0.0,
    cameraPosition: [0.016, 0.039, 0.18],
    cameraTarget: [0.016, 0.039, 0],
    cameraHotspots: [
      {
        id: "main",
        label: "48MP Fusion Main",
        spec: "26 mm ƒ/1.6 • 2nd-gen sensor-shift OIS",
        position: [0.028, 0.088, 0.01]
      },
      {
        id: "ultra",
        label: "48MP Ultra Wide",
        spec: "13 mm ƒ/2.2 • 120° FOV • Macro",
        position: [0.042, 0.088, 0.01]
      },
      {
        id: "telephoto",
        label: "12MP 2x Telephoto",
        spec: "52 mm ƒ/1.6 • Quad-pixel sensor",
        position: [0.035, 0.068, 0.01]
      }
    ]
  },
  {
    id: "performance",
    number: 6,
    navLabel: "Performance",
    theme: "dark",
    title: "A20 Pro Chip",
    headline: "Power that opens up.",
    subhead: "Architected exclusively for dual-display computing, real-time ray tracing, and next-generation on-device intelligence.",
    techLabel: "3-nanometer architecture • 12GB Unified Memory",
    foldRatio: 0.85,
    cameraPosition: [-0.03, 0.04, 0.32],
    cameraTarget: [0.02, 0.01, 0],
    specs: [
      {
        label: "CPU",
        value: "6-core",
        desc: "2 performance cores and 4 efficiency cores."
      },
      {
        label: "GPU",
        value: "7-core",
        desc: "Hardware-accelerated ray tracing with mesh shading."
      },
      {
        label: "Neural Engine",
        value: "Dual 16-core",
        desc: "Runs Apple Intelligence models directly on-device."
      }
    ]
  },
  {
    id: "battery",
    number: 7,
    navLabel: "Battery",
    theme: "dark",
    title: "Battery & Power",
    headline: "All-day endurance. Twice the power.",
    subhead: "Dual high-density lithium-ion cells balanced across both titanium halves for all-day freedom.",
    techLabel: "Dual built-in cells • 60W USB-C Fast Charge",
    foldRatio: 0.3,
    cameraPosition: [-0.05, 0.02, 0.30],
    cameraTarget: [0.04, 0.01, 0],
    specs: [
      {
        label: "Video Playback",
        value: "Up to 44 hrs",
        desc: "Up to 44 hours outer display / 31 hours inner display."
      },
      {
        label: "Fast Charging",
        value: "50% in 20 min",
        desc: "With 60W USB-C adapter and braided USB-C cable."
      },
      {
        label: "Wireless",
        value: "MagSafe & Qi2",
        desc: "Wireless charging up to 25W with active alignment."
      }
    ]
  },
  {
    id: "finish-reveal",
    number: 8,
    navLabel: "Finish",
    theme: "dark",
    title: "Finishes",
    headline: "Open to more.",
    subhead: "Available in Star White and Night Sky. 256GB, 512GB, 1TB, or 2TB.",
    techLabel: "Titanium Foldable Concept",
    foldRatio: 1.0,
    cameraPosition: [0, 0.02, 0.38],
    cameraTarget: [0, 0.01, 0]
  }
];
