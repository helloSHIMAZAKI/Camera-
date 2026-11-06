import { CameraProfile } from '../types/camera';

export const CAMERA_PROFILES: Record<string, CameraProfile> = {
  // Iconic 35mm Rangefinders & Point-and-Shoots
  'leica_m3': {
    id: 'leica_m3',
    name: 'Leica M3',
    subtitle: '1954 Rangefinder Standard',
    year: 1954,
    category: 'rangefinder',
    tagline: 'Ultra-bright 0.91x optical rangefinder & whisper-quiet cloth shutter',
    description: 'Widely considered the gold standard of 35mm rangefinders. Dual-image split focusing patch, bright 50mm frame lines, and legendary tactile German engineering.',
    signatureLens: 'Leitz Summicron 50mm f/2 Rigid',
    nativeAspect: '3:2',
    defaultFilmId: 'tri_x_400',
    shutterSound: 'leica_cloth',
    accentColor: '#dc2626', // classic Leica red dot accent
    badgeText: 'LEICA DBP WETZLAR',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-zinc-300'
    },
    features: ['0.91x Optical Finder', 'Split-Image Coincidence Patch', 'Whisper Cloth Shutter', 'Parallax Correction']
  },
  'leica_m6': {
    id: 'leica_m6',
    name: 'Leica M6',
    subtitle: '1984 Street Photography Legend',
    year: 1984,
    category: 'rangefinder',
    tagline: 'Mechanical rangefinder with iconic LED meter arrows',
    description: 'The street photographer’s definitive tool. Built-in silicon photodiode through-the-lens (TTL) meter with red LED exposure arrows (> o <).',
    signatureLens: 'Leica Summicron-M 35mm f/2 ASPH',
    nativeAspect: '3:2',
    defaultFilmId: 'tri_x_400',
    shutterSound: 'leica_cloth',
    accentColor: '#ef4444',
    badgeText: 'LEICA M6 TTL',
    housingStyle: {
      material: 'textured_leather',
      accentBorder: 'border-neutral-700'
    },
    features: ['LED Arrow Light Meter (> o <)', '0.72x Multi-Frameline Finder', 'Quiet Rubberized Cloth Shutter', 'Rapid Advance Lever']
  },
  'olympus_trip_35': {
    id: 'olympus_trip_35',
    name: 'Olympus Trip 35',
    subtitle: '1967 Solar Selenium Point-and-Shoot',
    year: 1967,
    category: 'rangefinder',
    tagline: 'Battery-free selenium solar cell & pop-up red underexposure flag',
    description: 'Powered purely by light. Four click-stop zone focus symbols (head, couple, group, mountains) and the famous red warning flag that locks the shutter if light is too dim.',
    signatureLens: 'D.Zuiko 40mm f/2.8 (4 Elements in 3 Groups)',
    nativeAspect: '3:2',
    defaultFilmId: 'kodachrome_64',
    shutterSound: 'trip35_click',
    accentColor: '#f59e0b',
    badgeText: 'TRIP 35 · D.ZUIKO',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-amber-400'
    },
    features: ['Selenium Cell Meter', 'Pop-Up Red Underexposure Flag', '4 Zone-Focus Symbols', 'Automatic Program AE']
  },
  'contax_t2': {
    id: 'contax_t2',
    name: 'Contax T2',
    subtitle: '1990 Luxury Titanium Compact',
    year: 1990,
    category: 'rangefinder',
    tagline: 'Carl Zeiss Sonnar 38mm f/2.8 T* lens & titanium precision',
    description: 'The pinnacle of 1990s luxury compact cameras. Sharp Zeiss T* multi-coated optics, aperture priority wheel, motorized film advance whir, and punchy high-fashion contrast.',
    signatureLens: 'Carl Zeiss Sonnar 38mm f/2.8 T*',
    nativeAspect: '3:2',
    defaultFilmId: 'portra_400',
    shutterSound: 'contax_motor',
    accentColor: '#d97706',
    badgeText: 'CONTAX T2 · TITANIUM',
    housingStyle: {
      material: 'champagne_titanium',
      accentBorder: 'border-amber-600'
    },
    features: ['Carl Zeiss T* Coating', 'Aperture Priority Dial (f/2.8-16)', 'Motorized Auto-Wind Sound', 'High-Speed Shutter up to 1/500s']
  },

  // Classic 35mm & Pro SLRs
  'pentax_k1000': {
    id: 'pentax_k1000',
    name: 'Pentax K1000',
    subtitle: '1976 Mechanical Student Icon',
    year: 1976,
    category: 'slr',
    tagline: 'Unbreakable build, zero frills, & galvanometer needle meter',
    description: 'The camera that taught millions the craft of photography. Completely mechanical shutter requiring no battery to fire, with an analog needle meter in the viewfinder.',
    signatureLens: 'SMC Pentax-M 50mm f/2.0',
    nativeAspect: '3:2',
    defaultFilmId: 'superia_400',
    shutterSound: 'slr_mechanical',
    accentColor: '#10b981',
    badgeText: 'ASAHI PENTAX K1000',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-zinc-400'
    },
    features: ['Analog Galvanometer Needle (+/-)', 'Microprism Center Collar', 'Fully Mechanical 1/1000s Shutter', 'K-Mount Pentaprism']
  },
  'nikon_f3': {
    id: 'nikon_f3',
    name: 'Nikon F3',
    subtitle: '1980 Giugiaro Electronic Workhorse',
    year: 1980,
    category: 'slr',
    tagline: 'Designed by Giorgetto Giugiaro with the iconic red vertical stripe',
    description: 'Nikon’s flagship professional SLR for two decades. 80/20 heavy center-weighted metering, interchangeable viewfinders (HP High-Eyepoint), and supreme durability.',
    signatureLens: 'Nikkor 50mm f/1.4 AI-s',
    nativeAspect: '3:2',
    defaultFilmId: 'hp5_plus',
    shutterSound: 'slr_mechanical',
    accentColor: '#e11d48', // iconic Giugiaro red racing stripe
    badgeText: 'NIKON F3 HP',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-red-600'
    },
    features: ['Giugiaro Red Accent Stripe', '80/20 Center-Weighted Meter', 'High-Eyepoint Pentaprism', 'LCD Shutter Speed Display']
  },
  'canon_ae1': {
    id: 'canon_ae1',
    name: 'Canon AE-1',
    subtitle: '1976 Shutter-Priority Breakthrough',
    year: 1976,
    category: 'slr',
    tagline: 'The first microprocessor-controlled SLR with red LED aperture readouts',
    description: 'A watershed moment in photographic history. Shutter-priority AE, electromagnetic cloth focal plane shutter, and glowing red 7-segment LED aperture display inside the viewfinder.',
    signatureLens: 'Canon FD 50mm f/1.8 S.C.',
    nativeAspect: '3:2',
    defaultFilmId: 'portra_400',
    shutterSound: 'slr_mechanical',
    accentColor: '#dc2626',
    badgeText: 'CANON AE-1 PROGRAM',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-zinc-400'
    },
    features: ['Red 7-Segment LED Finder', 'Shutter-Priority Microprocessor', 'Electromagnetic Shutter Release', 'Canon FD Warmth']
  },
  'nikon_fm2': {
    id: 'nikon_fm2',
    name: 'Nikon FM2',
    subtitle: '1982 Mechanical Powerhouse',
    year: 1982,
    category: 'slr',
    tagline: 'Blistering 1/4000s shutter with titanium honeycomb curtains',
    description: 'Needs no battery to fire at all shutter speeds up to 1/4000s. 3-stage LED exposure display (+ o -), compact all-metal chassis, and legendary cold-weather reliability.',
    signatureLens: 'Nikkor 35mm f/2.0 AI',
    nativeAspect: '3:2',
    defaultFilmId: 'tri_x_400',
    shutterSound: 'slr_mechanical',
    accentColor: '#0284c7',
    badgeText: 'NIKON FM2n',
    housingStyle: {
      material: 'black_titanium',
      accentBorder: 'border-zinc-600'
    },
    features: ['1/4000s Honeycomb Shutter', '3-LED Triad (+ o -)', 'All-Mechanical Operation', 'Split-Image Rangefinder Screen']
  },
  'nikon_f': {
    id: 'nikon_f',
    name: 'Nikon F',
    subtitle: '1959 The Father of Pro 35mm',
    year: 1959,
    category: 'slr',
    tagline: 'The indestructible tank that dominated Vietnam war photojournalism',
    description: 'Nikon’s first SLR system that established 35mm as the photojournalism standard. Modular Photomic prism, titanium foil shutter, and 100% viewfinder coverage.',
    signatureLens: 'Nikkor-S Auto 50mm f/1.4 Non-AI',
    nativeAspect: '3:2',
    defaultFilmId: 'tri_x_400',
    shutterSound: 'slr_mechanical',
    accentColor: '#eab308',
    badgeText: 'NIKON F · NIPPON KOGAKU',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-zinc-400'
    },
    features: ['Titanium Foil Shutter', 'Photomic Prism Viewfinder', '100% Frame Coverage', 'Pure Mechanical Heavy Feel']
  },
  'olympus_om1': {
    id: 'olympus_om1',
    name: 'Olympus OM-1',
    subtitle: '1972 Ultra-Compact SLR Revolution',
    year: 1972,
    category: 'slr',
    tagline: 'Maitani’s masterwork: massive 0.92x viewfinder in a featherweight body',
    description: 'Yoshihisa Maitani proved professional SLRs could be compact, quiet, and vibration-damped. Oversized pentaprism with huge, bright magnification.',
    signatureLens: 'OM Zuiko Auto-S 50mm f/1.4',
    nativeAspect: '3:2',
    defaultFilmId: 'portra_160',
    shutterSound: 'slr_mechanical',
    accentColor: '#3b82f6',
    badgeText: 'OLYMPUS OM-SYSTEM OM-1',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-blue-400'
    },
    features: ['Huge 0.92x Viewfinder', 'Air Damper Mirror Shock System', 'Lens-Mount Shutter Speed Ring', 'Compact Featherweight Body']
  },

  // Medium Format & Twin-Lens Reflex (TLR)
  'hasselblad_500cm': {
    id: 'hasselblad_500cm',
    name: 'Hasselblad 500C/M',
    subtitle: '1957 Apollo Moon Landing 6x6',
    year: 1957,
    category: 'medium_format',
    tagline: 'Iconic modular 6x6 square format with waist-level pop-up magnifier',
    description: 'The camera that captured mankind’s first steps on the Moon. True 1:1 square aspect ratio, Carl Zeiss Planar 80mm creamy bokeh, leaf shutter sync at all speeds, and thunderous mirror slap.',
    signatureLens: 'Carl Zeiss Planar 80mm f/2.8 T* CFE',
    nativeAspect: '1:1',
    defaultFilmId: 'portra_400',
    shutterSound: 'hasselblad_slap',
    accentColor: '#0ea5e9',
    badgeText: 'HASSELBLAD 500 C/M',
    housingStyle: {
      material: 'silver_chrome',
      accentBorder: 'border-sky-500'
    },
    features: ['1:1 Square Format 6x6', 'Waist-Level Hood Finder with Loupe', 'Leaf Shutter + Auxiliary Rear Flaps', 'Crosshair Ground Glass Grid']
  },
  'rolleiflex_28f': {
    id: 'rolleiflex_28f',
    name: 'Rolleiflex 2.8F',
    subtitle: '1960 Definitive Twin-Lens Reflex',
    year: 1960,
    category: 'medium_format',
    tagline: 'Waist-level lateral mirror reflex with whisper Synchro-Compur leaf shutter',
    description: 'Prized by Vivian Maier and Irving Penn. Twin taking and viewing lenses, inverted left-right waist level perspective, and a silent leaf shutter that never disrupts street subjects.',
    signatureLens: 'Carl Zeiss Planar 80mm f/2.8 / Heidosmat 80mm f/2.8',
    nativeAspect: '1:1',
    defaultFilmId: 'hp5_plus',
    shutterSound: 'rolleiflex_leaf',
    accentColor: '#a855f7',
    badgeText: 'ROLLEIFLEX FRANKE & HEIDECKE',
    housingStyle: {
      material: 'textured_leather',
      accentBorder: 'border-neutral-800'
    },
    features: ['Twin-Lens Lateral Inversion View', 'Synchro-Compur Whispering Leaf Shutter', 'Coupled Exposure Meter Needle', 'Zero Mirror Slap Vibration']
  },
  'pentax_6x7': {
    id: 'pentax_6x7',
    name: 'Pentax 6x7',
    subtitle: '1969 Medium-Format Beast',
    year: 1969,
    category: 'medium_format',
    tagline: 'The "SLR on steroids" delivering massive 6x7cm negatives with razor-thin DOF',
    description: 'Giant medium-format camera that handles like a 35mm SLR. Famous for its seismic mirror slap, wooden left grip, and dreamy portrait rendering from the legendary Takumar 105mm f/2.4.',
    signatureLens: 'SMC Takumar 105mm f/2.4',
    nativeAspect: '6:7',
    defaultFilmId: 'portra_400',
    shutterSound: 'pentax67_cannon',
    accentColor: '#f97316',
    badgeText: 'ASAHI PENTAX 6×7',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-amber-700'
    },
    features: ['Massive 6x7 Ratio Negative', 'Legendary Cannon Mirror Slap', 'Takumar 105mm f/2.4 Bokeh Profile', 'Interchangeable Prism Finder']
  },

  // Groundbreaking Digital & Hybrid Cameras
  'kodak_dcs_100': {
    id: 'kodak_dcs_100',
    name: 'Kodak DCS 100',
    subtitle: '1991 First Commercial Digital SLR',
    year: 1991,
    category: 'digital_milestone',
    tagline: '1.3MP CCD sensor mated to a Nikon F3 body with vintage DSU shoulder pack',
    description: 'The birth of digital photojournalism. 1.3 megapixel monochrome/color CCD with raw vintage digital grain, 200MB hard drive tether, and green retro LCD diagnostics.',
    signatureLens: 'Nikkor 28mm f/2.8 AI-s',
    nativeAspect: '3:2',
    defaultFilmId: 'provia_100f',
    shutterSound: 'electronic_beep',
    accentColor: '#22c55e',
    badgeText: 'KODAK PROFESSIONAL DCS 100',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-emerald-600'
    },
    features: ['1.3MP CCD Sensor Aesthetic', 'Green Monochrome DSU LCD Readout', 'Early Digital Sensor Dither', 'Electronic Beep + Drive Spin']
  },
  'canon_5d_mark_ii': {
    id: 'canon_5d_mark_ii',
    name: 'Canon EOS 5D Mark II',
    subtitle: '2008 Indie Cinema Revolution',
    year: 2008,
    category: 'digital_milestone',
    tagline: 'Democratized 24fps full-frame cinema for House M.D. and indie filmmakers',
    description: 'The camera that started the HDSLR video revolution. 21.1MP full-frame sensor, cinematic 1080p 24fps look, Technicolor CineStyle curve, and 9-point diamond autofocus array.',
    signatureLens: 'Canon EF 50mm f/1.2L USM',
    nativeAspect: '3:2',
    defaultFilmId: 'cinestill_800t',
    shutterSound: 'modern_pro',
    accentColor: '#ef4444',
    badgeText: 'EOS 5D Mark II · FULL FRAME',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-zinc-700'
    },
    features: ['24fps 1080p Cinema Profile', '9-Point Diamond AF Array', 'Full Frame Depth Roll-Off', 'Quick Control Screen HUD']
  },
  'sony_a7_iii': {
    id: 'sony_a7_iii',
    name: 'Sony A7 III',
    subtitle: '2018 Mirrorless Watershed',
    year: 2018,
    category: 'digital_milestone',
    tagline: 'Real-time Eye-AF tracking, BSI CMOS sensor, & mirrorless EVF overlay',
    description: 'Redefined modern full-frame photography. 693-point phase-detection autofocus, real-time eye tracking boxes, digital EVF with live histogram, and clean dynamic range.',
    signatureLens: 'Sony FE 55mm f/1.8 ZA Sonnar T*',
    nativeAspect: '3:2',
    defaultFilmId: 'ektar_100',
    shutterSound: 'modern_pro',
    accentColor: '#f97316',
    badgeText: 'SONY α7 III · 4K HDR',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-orange-500'
    },
    features: ['Real-Time Eye-AF Green Tracking Box', 'Electronic Viewfinder (EVF)', 'Live Real-Time Histogram', 'Silent Electronic Shutter']
  },
  'nikon_d850': {
    id: 'nikon_d850',
    name: 'Nikon D850',
    subtitle: '2017 Pinnacle of DSLR Engineering',
    year: 2017,
    category: 'digital_milestone',
    tagline: '45.7MP BSI sensor, 153-point AF grid, & optical glass pentaprism clarity',
    description: 'Regarded as the greatest all-around DSLR ever built. Huge bright 0.75x optical finder, red illumination in low light, and unmatched dynamic range from base ISO 64.',
    signatureLens: 'AF-S Nikkor 70-200mm f/2.8E FL ED VR',
    nativeAspect: '3:2',
    defaultFilmId: 'velvia_50',
    shutterSound: 'slr_mechanical',
    accentColor: '#eab308',
    badgeText: 'NIKON D850 · FX 45.7MP',
    housingStyle: {
      material: 'matte_black',
      accentBorder: 'border-yellow-500'
    },
    features: ['153-Point Multi-CAM 20K AF Grid', 'Base ISO 64 Dynamic Range', 'Illuminated Viewfinder Overlay', 'High Speed Mirror Dampening']
  },
  'fujifilm_gfx_100': {
    id: 'fujifilm_gfx_100',
    name: 'Fujifilm GFX 100 / X-Series',
    subtitle: 'Modern Large Format & Physical Dials',
    year: 2021,
    category: 'digital_milestone',
    tagline: 'Medium format 102MP digital sensor with beloved physical analog dial aesthetic',
    description: 'Combines the immense tonal gradation of a 44x33mm sensor with tactile direct shutter/ISO dials and Fujifilm’s legendary color science (Classic Chrome, Velvia, ACROS).',
    signatureLens: 'Fujinon GF 110mm f/2 R LM WR',
    nativeAspect: '4:3',
    defaultFilmId: 'acros_100',
    shutterSound: 'modern_pro',
    accentColor: '#06b6d4',
    badgeText: 'FUJIFILM GFX 100 · 102MP',
    housingStyle: {
      material: 'textured_leather',
      accentBorder: 'border-cyan-500'
    },
    features: ['Large Format 44x33mm Rendering', 'Physical Analog Top Dials', 'Film Simulation Engine', 'Tonal Sub-Monitor LCD']
  },

  // Modern Cinema Pro Default
  'iphone_pro_max': {
    id: 'iphone_pro_max',
    name: 'iPhone 15 Pro Max ProRAW',
    subtitle: 'Cinematic Log & LiDAR Sensor Suite',
    year: 2024,
    category: 'modern_pro',
    tagline: '48MP Quad-Pixel sensor with ProRes Log & LiDAR Spatial Studio mapping',
    description: 'Professional cinema tool featuring Apple Log color workflow, 5x optical tetraprism lens, LiDAR 3D spatial depth mapping, focus peaking, zebra stripes, and audio VU monitoring.',
    signatureLens: 'Main 24mm f/1.78 (7-element lens, 100% Focus Pixels)',
    nativeAspect: '3:2',
    defaultFilmId: 'portra_400',
    shutterSound: 'modern_pro',
    accentColor: '#38bdf8',
    badgeText: 'APERTURE PRO · Li-DAR',
    housingStyle: {
      material: 'black_titanium',
      accentBorder: 'border-sky-400'
    },
    features: ['LiDAR Spatial Lighting Mapper', 'Focus Peaking & Zebra Stripes', 'ProRes Log / ProRAW Engine', 'RGB Waveform & Histogram']
  }
};

export const CAMERA_PROFILE_LIST = Object.values(CAMERA_PROFILES);

export function getCameraProfile(id: string): CameraProfile {
  return CAMERA_PROFILES[id] || CAMERA_PROFILES['iphone_pro_max'];
}
