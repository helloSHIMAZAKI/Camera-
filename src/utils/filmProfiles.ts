import { FilmStock } from '../types/camera';

export const FILM_STOCKS: Record<string, FilmStock> = {
  'portra_400': {
    id: 'portra_400',
    name: 'Kodak Portra 400',
    brand: 'Kodak',
    iso: 400,
    category: 'color_negative',
    tagline: 'The gold standard for portraiture & skin tones',
    description: 'Smooth, natural warmth with creamy highlight roll-off, subtle pastels, and gentle micro-grain.',
    grainIntensity: 0.28,
    contrast: 0.96,
    saturation: 1.05,
    colorMatrix: [1.08, 1.02, 0.94], // subtle golden/peach bias
    shadowTint: [0.95, 0.98, 1.02], // slight cool breath in shadows
    highlightBloom: 0.15,
    dxCode: '115-36',
    badge: 'PORTRA 400'
  },
  'portra_160': {
    id: 'portra_160',
    name: 'Kodak Portra 160',
    brand: 'Kodak',
    iso: 160,
    category: 'color_negative',
    tagline: 'Ultra-fine grain & delicate tonal transitions',
    description: 'Extremely soft contrast, ideal for high-key studio fashion and bright outdoor sunlight.',
    grainIntensity: 0.14,
    contrast: 0.92,
    saturation: 0.98,
    colorMatrix: [1.05, 1.01, 0.96],
    shadowTint: [1.0, 1.0, 1.0],
    highlightBloom: 0.08,
    dxCode: '112-36',
    badge: 'PORTRA 160'
  },
  'tri_x_400': {
    id: 'tri_x_400',
    name: 'Kodak Tri-X 400',
    brand: 'Kodak',
    iso: 400,
    category: 'black_and_white',
    tagline: 'Legendary photojournalism & silver halide punch',
    description: 'Iconic gritty street photography look with deep blacks, crisp highlights, and distinctive organic grain.',
    grainIntensity: 0.48,
    contrast: 1.25,
    saturation: 0.0, // pure B&W
    colorMatrix: [1.0, 1.0, 1.0],
    shadowTint: [0.98, 0.98, 0.98],
    highlightBloom: 0.1,
    dxCode: '400TX-36',
    badge: 'TRI-X 400'
  },
  'ektar_100': {
    id: 'ektar_100',
    name: 'Kodak Ektar 100',
    brand: 'Kodak',
    iso: 100,
    category: 'color_negative',
    tagline: 'Ultra-vivid colors & micro-detail resolution',
    description: 'The finest grain color negative film in the world. High saturation, punchy reds, and rich blues.',
    grainIntensity: 0.12,
    contrast: 1.15,
    saturation: 1.35,
    colorMatrix: [1.06, 0.98, 1.08],
    shadowTint: [0.92, 0.95, 1.04],
    highlightBloom: 0.05,
    dxCode: '100-36',
    badge: 'EKTAR 100'
  },
  'kodachrome_64': {
    id: 'kodachrome_64',
    name: 'Kodak Kodachrome 64',
    brand: 'Kodak',
    iso: 64,
    category: 'color_reversal_slide',
    tagline: 'Historic National Geographic color reversal slide',
    description: 'Paul Simon immortalized it. Saturated crimson reds, deep ochre yellows, and rich nostalgic contrast.',
    grainIntensity: 0.22,
    contrast: 1.22,
    saturation: 1.28,
    colorMatrix: [1.14, 0.98, 0.88], // strong warm historic yellow-red bias
    shadowTint: [0.9, 0.92, 1.05],
    highlightBloom: 0.18,
    dxCode: 'K-64',
    badge: 'KODACHROME'
  },
  'velvia_50': {
    id: 'velvia_50',
    name: 'Fujifilm Velvia 50',
    brand: 'Fujifilm',
    iso: 50,
    category: 'color_reversal_slide',
    tagline: 'The landscape photographer’s dream slide film',
    description: 'Electric emerald greens, deep cobalt blues, and dramatic punchy contrast for jaw-dropping landscapes.',
    grainIntensity: 0.10,
    contrast: 1.35,
    saturation: 1.45,
    colorMatrix: [0.94, 1.12, 1.16], // vibrant greens & vivid blues
    shadowTint: [0.88, 0.94, 1.12],
    highlightBloom: 0.08,
    dxCode: 'RVP-50',
    badge: 'VELVIA 50'
  },
  'provia_100f': {
    id: 'provia_100f',
    name: 'Fujifilm Provia 100F',
    brand: 'Fujifilm',
    iso: 100,
    category: 'color_reversal_slide',
    tagline: 'Reference color fidelity & neutral slide clarity',
    description: 'Commercial studio standard for commercial still life, fashion, and documentary precision.',
    grainIntensity: 0.12,
    contrast: 1.10,
    saturation: 1.10,
    colorMatrix: [1.0, 1.02, 1.02],
    shadowTint: [0.98, 0.99, 1.02],
    highlightBloom: 0.05,
    dxCode: 'RDPIII',
    badge: 'PROVIA 100F'
  },
  'superia_400': {
    id: 'superia_400',
    name: 'Fujifilm Superia 400',
    brand: 'Fujifilm',
    iso: 400,
    category: 'color_negative',
    tagline: 'Everyday Japanese snapshot with cyan-green shadows',
    description: '4th color layer technology delivering distinctive cool green undertones and vibrant pop.',
    grainIntensity: 0.32,
    contrast: 1.08,
    saturation: 1.12,
    colorMatrix: [0.96, 1.08, 1.04], // cool Japanese tone
    shadowTint: [0.92, 1.05, 1.02], // greenish cyan shadow
    highlightBloom: 0.12,
    dxCode: 'CH-400',
    badge: 'SUPERIA 400'
  },
  'acros_100': {
    id: 'acros_100',
    name: 'Fujifilm Neopan ACROS 100',
    brand: 'Fujifilm',
    iso: 100,
    category: 'black_and_white',
    tagline: 'Super fine sigma grain & rich velvety midtones',
    description: 'Silky smooth tonal gradation with virtually no reciprocity failure in low light photography.',
    grainIntensity: 0.18,
    contrast: 1.12,
    saturation: 0.0,
    colorMatrix: [1.0, 1.0, 1.0],
    shadowTint: [1.0, 1.0, 1.0],
    highlightBloom: 0.04,
    dxCode: 'ACROS-100',
    badge: 'ACROS 100'
  },
  'hp5_plus': {
    id: 'hp5_plus',
    name: 'Ilford HP5 Plus 400',
    brand: 'Ilford',
    iso: 400,
    category: 'black_and_white',
    tagline: 'Forgiving exposure latitude & rich British grit',
    description: 'The quintessential darkroom student and photojournalist film. Soft midtones with organic silver grain.',
    grainIntensity: 0.42,
    contrast: 1.05,
    saturation: 0.0,
    colorMatrix: [1.0, 1.0, 1.0],
    shadowTint: [0.96, 0.96, 0.97],
    highlightBloom: 0.12,
    dxCode: 'HP5-400',
    badge: 'HP5 PLUS'
  },
  'delta_3200': {
    id: 'delta_3200',
    name: 'Ilford Delta 3200',
    brand: 'Ilford',
    iso: 3200,
    category: 'black_and_white',
    tagline: 'Atmospheric high-speed grain for nocturnal jazz & gigs',
    description: 'Extreme sensitivity with huge expressive film crystals, dramatic contrast, and moody shadows.',
    grainIntensity: 0.78,
    contrast: 1.30,
    saturation: 0.0,
    colorMatrix: [1.0, 1.0, 1.0],
    shadowTint: [0.94, 0.94, 0.94],
    highlightBloom: 0.25,
    dxCode: 'DELTA-3200',
    badge: 'DELTA 3200'
  },
  'cinestill_800t': {
    id: 'cinestill_800t',
    name: 'CineStill 800Tungsten',
    brand: 'CineStill',
    iso: 800,
    category: 'color_negative',
    tagline: 'Hollywood 35mm motion picture film with red halation',
    description: 'Remjet-free cinema stock balanced for tungsten neon lights with signature glowing crimson halations around lights.',
    grainIntensity: 0.40,
    contrast: 1.14,
    saturation: 1.15,
    colorMatrix: [0.92, 0.98, 1.15], // tungsten cool blue shift
    shadowTint: [0.85, 0.92, 1.10],
    highlightBloom: 0.65, // huge red halation bloom!
    dxCode: '800T-36',
    badge: '800T CINEMA'
  },
  'agfa_vista_200': {
    id: 'agfa_vista_200',
    name: 'Agfa Vista Plus 200',
    brand: 'AgfaPhoto',
    iso: 200,
    category: 'color_negative',
    tagline: 'Warm European holiday colors with nostalgic magenta',
    description: 'Affectionately known as "Poundland film", prized for poppy warm reds, golden skin, and nostalgic ease.',
    grainIntensity: 0.25,
    contrast: 1.08,
    saturation: 1.20,
    colorMatrix: [1.12, 0.98, 0.96],
    shadowTint: [1.02, 0.96, 1.02],
    highlightBloom: 0.10,
    dxCode: 'AV-200',
    badge: 'AGFA VISTA'
  },
  'polaroid_600': {
    id: 'polaroid_600',
    name: 'Polaroid 600 Instant',
    brand: 'Polaroid',
    iso: 640,
    category: 'instant',
    tagline: 'Instant analog chemistry with milky cyan shadows',
    description: 'Instant film nostalgia: soft organic focus, pastel dreaminess, raised blacks, and distinctive chemical character.',
    grainIntensity: 0.35,
    contrast: 0.90,
    saturation: 0.88,
    colorMatrix: [1.02, 1.04, 0.98],
    shadowTint: [0.88, 1.02, 1.06], // lifted cyan-blue blacks
    highlightBloom: 0.28,
    dxCode: 'POLA-600',
    badge: 'POLAROID'
  }
};

export const FILM_STOCK_LIST = Object.values(FILM_STOCKS);

export function getFilmStock(id: string): FilmStock {
  return FILM_STOCKS[id] || FILM_STOCKS['portra_400'];
}
