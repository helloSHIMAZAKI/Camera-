/**
 * Type definitions for Aperture Pro & Heritage Camera
 */

export type CameraCategory = 
  | 'rangefinder' 
  | 'slr' 
  | 'medium_format' 
  | 'digital_milestone' 
  | 'modern_pro';

export type AspectRatio = '3:2' | '1:1' | '6:7' | '4:3' | '16:9' | '2.39:1';

export type ShutterSoundType = 
  | 'leica_cloth' 
  | 'hasselblad_slap' 
  | 'rolleiflex_leaf' 
  | 'pentax67_cannon' 
  | 'slr_mechanical' 
  | 'electronic_beep' 
  | 'contax_motor' 
  | 'trip35_click' 
  | 'modern_pro';

export interface CameraProfile {
  id: string;
  name: string;
  subtitle: string;
  year: number;
  category: CameraCategory;
  tagline: string;
  description: string;
  signatureLens: string;
  nativeAspect: AspectRatio;
  defaultFilmId: string;
  shutterSound: ShutterSoundType;
  accentColor: string;
  badgeText: string;
  housingStyle: {
    material: 'silver_chrome' | 'black_titanium' | 'textured_leather' | 'matte_black' | 'champagne_titanium';
    accentBorder: string;
  };
  features: string[];
}

export type FilmCategory = 'color_negative' | 'color_reversal_slide' | 'black_and_white' | 'instant';

export interface FilmStock {
  id: string;
  name: string;
  brand: string;
  iso: number;
  category: FilmCategory;
  tagline: string;
  description: string;
  grainIntensity: number; // 0.0 to 1.0
  contrast: number; // 0.8 to 1.5
  saturation: number; // 0.0 to 1.6
  colorMatrix: [number, number, number]; // [R, G, B] tint balance
  shadowTint: [number, number, number]; // [R, G, B]
  highlightBloom: number; // halation intensity (e.g. CineStill red bloom)
  dxCode: string;
  badge: string;
}

export type LightType = 'key' | 'fill' | 'rim' | 'background' | 'kicker';
export type LightModifier = 'softbox' | 'beauty_dish' | 'reflector' | 'fresnel' | 'bare_bulb' | 'umbrella';

export interface StudioLight {
  id: string;
  name: string;
  type: LightType;
  x: number; // meters from subject (-3 to +3)
  y: number; // meters height (0.5 to 3.0)
  z: number; // meters depth (-3 to +3)
  intensityLux: number; // 100 to 5000 lux
  colorTempK: number; // 2700K to 8000K
  modifier: LightModifier;
  gelColor?: string; // hex or CSS color
  enabled: boolean;
}

export interface LightingSetupPreset {
  id: string;
  name: string;
  portraitGenre: string;
  description: string;
  keyToFillRatio: string;
  lights: StudioLight[];
  proTip: string;
}

export interface ProSettings {
  iso: number;
  shutterSpeed: string;
  shutterSpeedFraction: number; // seconds (e.g. 1/125 = 0.008)
  aperture: number; // f-stop (e.g. 1.4, 2.0, 2.8, etc.)
  evCompensation: number; // -3 to +3
  whiteBalanceK: number; // 2500K - 10000K
  tint: number; // -50 to +50
  focusPeaking: boolean;
  focusPeakingColor: 'green' | 'red' | 'white';
  zebraWarning: boolean;
  zebraThreshold: number; // 70 to 100%
  gridType: 'none' | 'rule_of_thirds' | 'golden_ratio' | 'crosshair' | 'center_spot';
  anamorphicDeSqueeze: 1.0 | 1.33 | 1.5;
  activeAspect: AspectRatio;
  histogramVisible: boolean;
  waveformVisible: boolean;
  audioMonitor: boolean;
  timerSeconds: 0 | 3 | 10;
  flashMode: 'off' | 'auto' | 'on' | 'torch';
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  cameraProfileId: string;
  cameraName: string;
  filmStockId: string;
  filmStockName: string;
  lens: string;
  exif: {
    iso: number;
    shutterSpeed: string;
    aperture: string;
    ev: string;
    kelvin: number;
    focalLength: string;
    lidarDistanceM?: number;
  };
  frameBorder: 'vintage_35mm' | 'hasselblad_6x6' | 'polaroid' | 'contact_sheet' | 'none';
}
