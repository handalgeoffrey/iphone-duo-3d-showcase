import type { Variant } from '@/lib/variants';

export const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Two screens', href: '#two-screens' },
  { label: 'Tech Specs', href: '#tech-specs' },
  { label: 'Compare', href: '#compare' },
] as const;

export const HERO = {
  eyebrow: 'Introducing iPhone Duo',
  headline: 'iPhone Duo.',
  tagline: 'Two screens. One seamless thought.',
  body: 'A dual-screen phone with a precision hinge, a vivid inner canvas, and a cover display that keeps up. In two considered finishes.',
  primaryCta: 'Buy',
  secondaryCta: 'Explore the design',
  price: 'From $1,299',
} as const;

export const TWO_SCREENS = {
  eyebrow: 'The fold',
  headline: 'Two screens, one device.',
  intro: 'A familiar phone that opens into something more. Scroll to unfold it.',
  phases: [
    {
      index: '01',
      title: 'A familiar front.',
      body: 'The cover display keeps messages, maps, and quick moments within reach. No unfolding required.',
    },
    {
      index: '02',
      title: 'A hinge with intent.',
      body: 'A precision spine, tuned to hold its angle and disappear into the silhouette when closed.',
    },
    {
      index: '03',
      title: 'A different side.',
      body: 'The back is finished with the same care as the front. Every surface earns its place.',
    },
    {
      index: '04',
      title: 'Open to more.',
      body: 'Unfold a single canvas that adapts to reading, working, watching — together. The crease is felt, not seen.',
    },
  ],
} as const;

export const COLOUR = {
  eyebrow: 'Two finishes',
  headline: 'Pick your atmosphere.',
  note: 'Both finishes share the same titanium frame, ceramic back, and dual-screen glass.',
} as const;

export const DISPLAY = {
  eyebrow: 'Displays',
  headline: 'Two canvases. Zero compromise.',
  body: 'A 7.9-inch inner display unfolds into a wide, calm canvas. The 6.3-inch cover display handles everything you need before you open it. Both adapt from 1Hz to 120Hz, so the screen keeps pace with the moment — and the battery keeps up with the day.',
  stats: [
    { value: '7.9″', label: 'Inner display' },
    { value: '6.3″', label: 'Cover display' },
    { value: '120Hz', label: 'Adaptive refresh' },
    { value: '2,600', label: 'Peak nits' },
  ],
  imageAlt:
    'Abstract desert wallpaper flowing across the two inner displays of iPhone Duo',
} as const;

export const CAMERA = {
  eyebrow: 'Camera',
  headline: 'See more of what matters.',
  body: 'A 48MP main sensor captures light the way you remember it. The ultra wide takes in the room. The 3× telephoto finds the moment inside the moment. All three work together, whether the phone is closed or wide open.',
  features: [
    { title: '48MP Main', body: 'F/1.6, sensor-shift stabilisation, 2µm quad pixels.' },
    { title: '12MP Ultra Wide', body: '120° field of view with autofocus for close-ups.' },
    { title: '12MP Telephoto', body: '3× optical zoom, 30× digital, portrait-ready.' },
    { title: '4K 120', body: 'Dolby-grade detail at 120 frames per second.' },
  ],
  stats: [
    { value: '48', suffix: 'MP', label: 'Main sensor' },
    { value: '3', suffix: '×', label: 'Optical zoom' },
    { value: '4K', suffix: '120', label: 'Video' },
  ],
  lensAlt: 'Illustration of the iPhone Duo triple camera array',
} as const;

export const PERFORMANCE = {
  eyebrow: 'Performance',
  headline: 'Quietly powerful.',
  body: 'The Duo A1 chip pairs a 2nm architecture with a dedicated display engine, so two screens feel like one. Apps open instantly. Games hold their frame rate. The battery keeps its composure.',
  stats: [
    { value: 2, suffix: '×', label: 'Faster graphics', note: 'than the previous generation' },
    { value: 18, suffix: 'h', label: 'Video playback', note: 'with both displays active' },
    { value: 45, suffix: 'W', label: 'Fast charge', note: '50% in around 30 minutes' },
  ],
  chip: 'Duo A1',
  process: '2nm',
  storage: '256GB · 512GB · 1TB',
} as const;

export const MATERIALS = {
  eyebrow: 'Design and materials',
  headline: 'Built to disappear in your hand.',
  phases: [
    {
      index: '01',
      title: 'Aerospace titanium.',
      body: 'A frame machined to a fraction of a millimetre, then brushed to a satin finish. Strong enough to hold its shape. Soft enough to forget it is there.',
    },
    {
      index: '02',
      title: 'Ceramic glass.',
      body: 'A warm, resilient surface that resists fingerprints and catches the light softly. Two finishes, each with its own relationship to the room.',
    },
    {
      index: '03',
      title: 'A hinge you feel, not see.',
      body: 'The fold disappears into the silhouette, holding its angle with quiet resistance. No rattle. No play. Just intent.',
    },
    {
      index: '04',
      title: 'Finished by hand.',
      body: 'Every edge is softened. Every seam is considered. The result is a device that feels inevitable from the first touch.',
    },
  ],
  details: [
    { label: 'Frame', value: 'Grade 5 titanium' },
    { label: 'Back', value: 'Ceramic glass' },
    { label: 'Weight', value: '219g' },
    { label: 'Water resistance', value: 'IP68' },
  ],
} as const;

export interface SpecGroup {
  title: string;
  rows: { label: string; value: string }[];
}

export const SPEC_GROUPS: SpecGroup[] = [
  {
    title: 'Display',
    rows: [
      { label: 'Inner display', value: '7.9-inch LTPO OLED, 2400 × 2200, 1–120Hz' },
      { label: 'Cover display', value: '6.3-inch OLED, 2400 × 1080, 1–120Hz' },
      { label: 'Brightness', value: '1,600 nits typical, 2,600 nits peak' },
      { label: 'Glass', value: 'Ceramic glass, anti-reflective coating' },
    ],
  },
  {
    title: 'Design',
    rows: [
      { label: 'Frame', value: 'Grade 5 titanium, satin brushed' },
      { label: 'Back', value: 'Ceramic glass' },
      { label: 'Dimensions', value: 'Unfolded 166 × 118 × 5.6 mm · Folded 83 × 118 × 11.2 mm' },
      { label: 'Weight', value: '219g' },
      { label: 'Water resistance', value: 'IP68' },
    ],
  },
  {
    title: 'Camera',
    rows: [
      { label: 'Main', value: '48MP, f/1.6, sensor-shift stabilisation' },
      { label: 'Ultra Wide', value: '12MP, f/2.2, 120° field of view' },
      { label: 'Telephoto', value: '12MP, f/2.8, 3× optical zoom' },
      { label: 'Video', value: '4K at 120 fps, 1080p at 240 fps' },
    ],
  },
  {
    title: 'Performance',
    rows: [
      { label: 'Chip', value: 'Duo A1, 2nm' },
      { label: 'Memory', value: '12GB' },
      { label: 'Storage', value: '256GB, 512GB, or 1TB' },
      { label: 'Display engine', value: 'Dual-screen compositor with adaptive frame pacing' },
    ],
  },
  {
    title: 'Battery and power',
    rows: [
      { label: 'Capacity', value: '4,800mAh' },
      { label: 'Video playback', value: 'Up to 18 hours' },
      { label: 'Fast charge', value: '45W wired, 15W MagSafe-compatible wireless' },
      { label: 'Port', value: 'USB-C, USB 3.2 Gen 2' },
    ],
  },
  {
    title: 'Connectivity',
    rows: [
      { label: 'Cellular', value: '5G sub-6GHz and mmWave' },
      { label: 'Wi-Fi', value: 'Wi-Fi 7, tri-band' },
      { label: 'Bluetooth', value: 'Bluetooth 5.4' },
      { label: 'Other', value: 'NFC, UWB, dual-frequency GPS' },
    ],
  },
];

export const COMPARE = {
  eyebrow: 'Compare',
  headline: 'Two finishes. One decision.',
  body: 'Same architecture. Same screens. Same quiet confidence. Choose the one that feels like you.',
  cards: [
    {
      variant: 'white' as Variant,
      name: 'Starry White',
      finish: 'Warm ceramic glass, satin titanium frame',
      colour: 'Soft off-white',
      price: '$1,299',
      cta: 'Choose Starry White',
    },
    {
      variant: 'night' as Variant,
      name: 'Night Sky',
      finish: 'Deep blue-black ceramic, brushed titanium frame',
      colour: 'Blue-black',
      price: '$1,299',
      cta: 'Choose Night Sky',
    },
  ],
} as const;

export const BUY = {
  eyebrow: 'iPhone Duo',
  headline: 'Two sides of you.',
  body: 'Two displays. One considered object. Choose a finish and make it yours.',
  finePrint: 'Trade-in credit and carrier offers are placeholders in this concept.',
} as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: ['iPhone Duo', 'Accessories', 'Trade In', 'Financing'],
  },
  {
    title: 'Learn',
    links: ['Overview', 'Two screens', 'Tech Specs', 'Compare'],
  },
  {
    title: 'Support',
    links: ['Contact', 'Warranty', 'Repairs', 'Setup guide'],
  },
  {
    title: 'About',
    links: ['Design story', 'Newsroom', 'Careers', 'Environment'],
  },
] as const;
