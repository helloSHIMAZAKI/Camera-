import { StudioLight, LightingSetupPreset } from '../types/camera';

/**
 * Subject reference position in 3D studio coordinates (meters):
 * Subject head/chest is at [0, 1.2, 0] (x=0, y=1.2m height, z=0 depth).
 */
export const SUBJECT_POSITION: [number, number, number] = [0, 1.2, 0];

/**
 * Calculates Euclidean 3D distance between light and subject (in meters).
 */
export function calculateLightDistance(light: { x: number; y: number; z: number }): number {
  const dx = light.x - SUBJECT_POSITION[0];
  const dy = light.y - SUBJECT_POSITION[1];
  const dz = light.z - SUBJECT_POSITION[2];
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return Math.max(0.2, dist); // clamp minimum distance to 0.2m
}

/**
 * Calculates incident lux at the subject according to the Inverse Square Law:
 * E = Intensity / (distance ^ 2)
 * Modifier attenuation:
 * - softbox: ~0.75x (diffused)
 * - beauty_dish: ~0.85x
 * - reflector: ~0.45x (bounce)
 * - fresnel: ~1.2x (focused beam)
 * - bare_bulb: 1.0x
 */
export function calculateIncidentLux(light: StudioLight): number {
  if (!light.enabled) return 0;
  const dist = calculateLightDistance(light);
  let modifierFactor = 1.0;
  switch (light.modifier) {
    case 'softbox': modifierFactor = 0.75; break;
    case 'beauty_dish': modifierFactor = 0.85; break;
    case 'reflector': modifierFactor = 0.45; break;
    case 'fresnel': modifierFactor = 1.25; break;
    case 'bare_bulb': modifierFactor = 1.0; break;
    case 'umbrella': modifierFactor = 0.70; break;
  }
  return (light.intensityLux * modifierFactor) / (dist * dist);
}

/**
 * Calculates lighting ratio between Key and Fill lights.
 * Returns ratio e.g. "3:1" or "4:1".
 */
export function calculateKeyToFillRatio(lights: StudioLight[]): { ratioString: string; ratioNumeric: number } {
  const keyLight = lights.find(l => l.type === 'key' && l.enabled);
  const fillLight = lights.find(l => l.type === 'fill' && l.enabled);

  if (!keyLight) {
    return { ratioString: 'No Key', ratioNumeric: 1 };
  }
  const keyLux = calculateIncidentLux(keyLight);

  if (!fillLight || calculateIncidentLux(fillLight) <= 1) {
    return { ratioString: '> 16:1 (Solo Key)', ratioNumeric: 16 };
  }

  const fillLux = calculateIncidentLux(fillLight);
  const numericRatio = Math.max(1, keyLux / fillLux);
  const rounded = Math.round(numericRatio * 10) / 10;
  return {
    ratioString: `${rounded.toFixed(1)}:1`,
    ratioNumeric: numericRatio
  };
}

/**
 * Converts color temperature (Kelvin) to RGB for studio visualization.
 * Uses Tanner Helland's algorithm (Planckian locus approximation).
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = Math.max(1000, Math.min(40000, kelvin)) / 100;
  let r: number, g: number, b: number;

  // Red
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(0, Math.min(255, r));
  }

  // Green
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    g = Math.max(0, Math.min(255, g));
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
    g = Math.max(0, Math.min(255, g));
  }

  // Blue
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(0, Math.min(255, b));
  }

  return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * Standard Studio Presets for Professional Portrait & Cinema Lighting
 */
export const STUDIO_LIGHTING_PRESETS: LightingSetupPreset[] = [
  {
    id: 'rembrandt',
    name: 'Rembrandt Classical',
    portraitGenre: 'Fine Art & Dramatic Character',
    description: 'Key light at 45° azimuth and 35° elevation creates the iconic luminous triangle on the shadowed cheek.',
    keyToFillRatio: '3:1',
    proTip: 'Position the key light so the nose shadow points down towards the corner of the lip, closing the triangle under the opposite eye.',
    lights: [
      {
        id: 'rem_key',
        name: 'Key Light (45° Octabox)',
        type: 'key',
        x: -1.2,
        y: 1.8,
        z: -1.2,
        intensityLux: 1600,
        colorTempK: 5600,
        modifier: 'softbox',
        enabled: true
      },
      {
        id: 'rem_fill',
        name: 'Fill Light (Reflector/Soft)',
        type: 'fill',
        x: 1.4,
        y: 1.2,
        z: -1.0,
        intensityLux: 550,
        colorTempK: 5600,
        modifier: 'reflector',
        enabled: true
      },
      {
        id: 'rem_rim',
        name: 'Hair / Rim Light',
        type: 'rim',
        x: 0.8,
        y: 2.1,
        z: 1.2,
        intensityLux: 700,
        colorTempK: 4800,
        modifier: 'fresnel',
        enabled: true
      }
    ]
  },
  {
    id: 'butterfly',
    name: 'Paramount / Butterfly',
    portraitGenre: 'High-Fashion & Glamour',
    description: 'Key light high directly in front above camera axis, creating a symmetrical butterfly shadow beneath the nose.',
    keyToFillRatio: '2:1',
    proTip: 'Prized in 1930s Hollywood glamour photography. Emphasizes high cheekbones and clean jawlines.',
    lights: [
      {
        id: 'but_key',
        name: 'Key Beauty Dish',
        type: 'key',
        x: 0.0,
        y: 2.2,
        z: -1.3,
        intensityLux: 1800,
        colorTempK: 5600,
        modifier: 'beauty_dish',
        enabled: true
      },
      {
        id: 'but_fill',
        name: 'Chin Reflector Bounce',
        type: 'fill',
        x: 0.0,
        y: 0.7,
        z: -0.9,
        intensityLux: 900,
        colorTempK: 5600,
        modifier: 'reflector',
        enabled: true
      },
      {
        id: 'but_rim',
        name: 'Dual Hair Kicker',
        type: 'rim',
        x: 1.2,
        y: 2.2,
        z: 1.0,
        intensityLux: 600,
        colorTempK: 5600,
        modifier: 'fresnel',
        enabled: true
      }
    ]
  },
  {
    id: 'split',
    name: 'Split Lighting',
    portraitGenre: 'Cinematic Drama & Intense Profile',
    description: 'Key placed at a strict 90° angle, lighting exactly half the face and leaving the other in deep expressive shadow.',
    keyToFillRatio: '8:1',
    proTip: 'Narrows wide facial structures. Excellent for dramatic rock musicians, athletes, or film noir characters.',
    lights: [
      {
        id: 'spl_key',
        name: 'Key Fresnel Spot',
        type: 'key',
        x: -1.8,
        y: 1.3,
        z: 0.0,
        intensityLux: 2100,
        colorTempK: 4300,
        modifier: 'fresnel',
        enabled: true
      },
      {
        id: 'spl_fill',
        name: 'Negative Fill (Black Flag)',
        type: 'fill',
        x: 1.8,
        y: 1.3,
        z: 0.0,
        intensityLux: 150,
        colorTempK: 5600,
        modifier: 'reflector',
        enabled: false // turned off for pure dramatic shadow
      },
      {
        id: 'spl_rim',
        name: 'Rim Edge Separation',
        type: 'rim',
        x: 1.2,
        y: 1.7,
        z: 1.4,
        intensityLux: 850,
        colorTempK: 3200,
        modifier: 'fresnel',
        enabled: true
      }
    ]
  },
  {
    id: 'loop',
    name: 'Loop Lighting',
    portraitGenre: 'Universal Portrait & Commercial Editorial',
    description: 'Key at 30° creates a delicate teardrop loop shadow that does not touch the lip shadow.',
    keyToFillRatio: '3:1',
    proTip: 'The most universally flattering lighting pattern for all face shapes.',
    lights: [
      {
        id: 'loop_key',
        name: 'Key Softbox',
        type: 'key',
        x: -1.1,
        y: 1.7,
        z: -1.5,
        intensityLux: 1500,
        colorTempK: 5600,
        modifier: 'softbox',
        enabled: true
      },
      {
        id: 'loop_fill',
        name: 'Fill Umbrella',
        type: 'fill',
        x: 1.3,
        y: 1.3,
        z: -1.3,
        intensityLux: 500,
        colorTempK: 5600,
        modifier: 'umbrella',
        enabled: true
      },
      {
        id: 'loop_bg',
        name: 'Background Wash',
        type: 'background',
        x: 0.0,
        y: 1.4,
        z: 2.0,
        intensityLux: 650,
        colorTempK: 5600,
        modifier: 'bare_bulb',
        enabled: true
      }
    ]
  },
  {
    id: 'film_noir',
    name: 'Tungsten Film Noir & Venetian Blind',
    portraitGenre: 'Moody Cinema & Detective Atmosphere',
    description: 'Harsh 3200K tungsten key with sharp shadows, high contrast, and warm Venetian slit highlights.',
    keyToFillRatio: '6:1',
    proTip: 'Pair with Kodak Tri-X 400 or CineStill 800T for rich nocturnal silver halide grain and halation.',
    lights: [
      {
        id: 'noir_key',
        name: 'Tungsten Fresnel 1kW',
        type: 'key',
        x: -1.5,
        y: 1.9,
        z: -0.8,
        intensityLux: 2400,
        colorTempK: 3200,
        modifier: 'fresnel',
        enabled: true
      },
      {
        id: 'noir_fill',
        name: 'Ambient Fill (Dim)',
        type: 'fill',
        x: 1.6,
        y: 1.1,
        z: -1.1,
        intensityLux: 350,
        colorTempK: 3200,
        modifier: 'reflector',
        enabled: true
      },
      {
        id: 'noir_rim',
        name: 'Cine Hair Light',
        type: 'rim',
        x: 0.9,
        y: 2.3,
        z: 1.5,
        intensityLux: 1100,
        colorTempK: 3200,
        modifier: 'fresnel',
        enabled: true
      }
    ]
  }
];
