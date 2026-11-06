import React, { useState, useCallback } from 'react';
import {
  CameraProfile,
  FilmStock,
  ProSettings,
  CapturedPhoto,
  StudioLight
} from './types/camera';
import { CAMERA_PROFILES, CAMERA_PROFILE_LIST, getCameraProfile } from './utils/cameraProfiles';
import { FILM_STOCKS, getFilmStock } from './utils/filmProfiles';
import { cameraAudio } from './utils/cameraAudio';
import { TEST_SCENES } from './utils/testScenes';
import { ViewfinderCanvas } from './components/ViewfinderCanvas';
import { LidarLightingStudio } from './components/LidarLightingStudio';
import { HeritageCameraSelector } from './components/HeritageCameraSelector';
import { FilmStockSelector } from './components/FilmStockSelector';
import { ProManualControls } from './components/ProManualControls';
import { DarkroomLightbox } from './components/DarkroomLightbox';
import { InstallAndHostModal } from './components/InstallAndHostModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  Camera,
  Film,
  Sun,
  Sliders,
  RotateCcw,
  Sparkles,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  Smartphone,
  Github
} from 'lucide-react';

export default function App() {
  // Active Camera & Film Stock
  const [activeCamera, setActiveCamera] = useState<CameraProfile>(CAMERA_PROFILES['leica_m3']);
  const [activeFilmStock, setActiveFilmStock] = useState<FilmStock>(FILM_STOCKS['portra_400']);

  // Pro Manual Photography Settings
  const [proSettings, setProSettings] = useState<ProSettings>({
    iso: 400,
    shutterSpeed: '1/125s',
    shutterSpeedFraction: 1 / 125,
    aperture: 2.0,
    evCompensation: 0.0,
    whiteBalanceK: 5600,
    tint: 0,
    focusPeaking: false,
    focusPeakingColor: 'green',
    zebraWarning: false,
    zebraThreshold: 90,
    gridType: 'rule_of_thirds',
    anamorphicDeSqueeze: 1.0,
    activeAspect: '3:2',
    histogramVisible: false,
    waveformVisible: false,
    audioMonitor: true,
    timerSeconds: 0,
    flashMode: 'off'
  });

  // Active View / Drawer Mode
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'heritage_cameras' | 'film_stocks' | 'lidar_studio' | 'pro_controls' | 'darkroom'>('none');

  // Camera Source & Lens
  const [isSimulatedCamera, setIsSimulatedCamera] = useState<boolean>(true);
  const [testSceneId, setTestSceneId] = useState<string>('studio_portrait');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [activeLensZoom, setActiveLensZoom] = useState<'0.5x' | '1x' | '2x' | '5x'>('1x');

  // Shutter & Captures
  const [shutterTriggerTime, setShutterTriggerTime] = useState<number>(0);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);

  // PWA Install & GitHub Hosting Modal State
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const { isInstalled, isInstallable, install } = usePWAInstall();

  // Switch Heritage Camera
  const handleSelectCamera = useCallback((camera: CameraProfile) => {
    setActiveCamera(camera);
    // Automatically apply camera's default aspect ratio and paired film stock!
    setProSettings(prev => ({
      ...prev,
      activeAspect: camera.nativeAspect
    }));
    if (FILM_STOCKS[camera.defaultFilmId]) {
      setActiveFilmStock(FILM_STOCKS[camera.defaultFilmId]);
    }
  }, []);

  // Switch Film Stock
  const handleSelectFilmStock = useCallback((filmStock: FilmStock) => {
    setActiveFilmStock(filmStock);
    // Sync ISO to film stock rating
    setProSettings(prev => ({
      ...prev,
      iso: filmStock.iso
    }));
  }, []);

  // Trigger Shutter Exposure
  const handleShutterPress = useCallback(() => {
    // 1. Play authentic camera shutter sound
    cameraAudio.playShutterSound(activeCamera.shutterSound);

    // 2. Trigger viewfinder capture timestamp
    setShutterTriggerTime(Date.now());
  }, [activeCamera.shutterSound]);

  // Photo captured callback
  const handlePhotoCaptured = useCallback((photo: CapturedPhoto) => {
    setCapturedPhotos(prev => [photo, ...prev]);
  }, []);

  // Delete photo
  const handleDeletePhoto = useCallback((id: string) => {
    setCapturedPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  // Apply LiDAR Lighting to camera
  const handleApplyLightingToCamera = useCallback((lights: StudioLight[], ratio: string) => {
    // Apply key light Kelvin to camera White Balance
    const keyLight = lights.find(l => l.type === 'key' && l.enabled);
    if (keyLight) {
      setProSettings(prev => ({
        ...prev,
        whiteBalanceK: keyLight.colorTempK
      }));
    }
    setActiveDrawer('none');
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 font-sans select-none overflow-hidden">
      {/* Top Bar (Strict 3-Zone Contract per frontend-design constitution §2) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md shrink-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-base font-bold tracking-tight text-white font-mono whitespace-nowrap">
            APERTURE PRO · LiDAR
          </span>
        </div>

        {/* Zone 2: Clean single-line navigation tabs */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveDrawer('none')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeDrawer === 'none' ? 'text-white font-semibold underline underline-offset-4 decoration-sky-500' : ''
            }`}
          >
            Live Viewfinder
          </button>
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'heritage_cameras' ? 'none' : 'heritage_cameras')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeDrawer === 'heritage_cameras' ? 'text-white font-semibold underline underline-offset-4 decoration-red-500' : ''
            }`}
          >
            Nostalgia Cameras ({CAMERA_PROFILE_LIST.length})
          </button>
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'film_stocks' ? 'none' : 'film_stocks')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeDrawer === 'film_stocks' ? 'text-white font-semibold underline underline-offset-4 decoration-amber-500' : ''
            }`}
          >
            Film Stock Emulations
          </button>
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'lidar_studio' ? 'none' : 'lidar_studio')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeDrawer === 'lidar_studio' ? 'text-white font-semibold underline underline-offset-4 decoration-sky-400' : ''
            }`}
          >
            LiDAR Lighting Studio
          </button>
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'darkroom' ? 'none' : 'darkroom')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeDrawer === 'darkroom' ? 'text-white font-semibold underline underline-offset-4 decoration-amber-400' : ''
            }`}
          >
            Darkroom Roll ({capturedPhotos.length})
          </button>
        </nav>

        {/* Zone 3: Actions & iPhone Install */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                setIsInstallModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-600/50 text-sky-300 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            title="Install on iPhone / Host on GitHub"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isInstalled ? 'iPhone App Installed' : 'Install on iPhone'}</span>
            <span className="sm:hidden">Install</span>
          </button>
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'lidar_studio' ? 'none' : 'lidar_studio')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>LiDAR</span>
          </button>
          <button
            onClick={handleShutterPress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Shoot</span>
          </button>
        </div>
      </header>

      {/* Main Studio Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Viewfinder Workspace */}
        <main className="flex-1 flex flex-col items-center justify-between bg-black relative p-2 md:p-4 overflow-hidden">
          {/* Quick HUD Strip on Top of Viewfinder */}
          <div className="w-full max-w-4xl flex items-center justify-between px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 text-xs z-20 shrink-0">
            {/* Active Camera Pill */}
            <button
              onClick={() => setActiveDrawer('heritage_cameras')}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              title="Change camera model"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeCamera.accentColor }} />
              <span className="font-bold text-white tracking-wide">{activeCamera.name}</span>
              <span className="text-[10px] font-mono text-neutral-400">({activeCamera.year})</span>
            </button>

            {/* Exposure Readouts (ISO · Shutter · Aperture · EV) */}
            <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-neutral-300">
              <span>ISO <strong className="text-amber-400">{proSettings.iso}</strong></span>
              <span>·</span>
              <span><strong className="text-sky-400">{proSettings.shutterSpeed}</strong></span>
              <span>·</span>
              <span><strong className="text-emerald-400">f/{proSettings.aperture.toFixed(1)}</strong></span>
              <span>·</span>
              <span><strong className="text-white">{proSettings.evCompensation > 0 ? `+${proSettings.evCompensation.toFixed(1)}` : proSettings.evCompensation.toFixed(1)} EV</strong></span>
              <span>·</span>
              <span><strong className="text-amber-300">{proSettings.whiteBalanceK}K</strong></span>
            </div>

            {/* Active Film Stock Badge */}
            <button
              onClick={() => setActiveDrawer('film_stocks')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 text-amber-300 transition-colors cursor-pointer"
              title="Change analog film stock"
            >
              <Film className="w-3.5 h-3.5" />
              <span className="font-bold text-xs">{activeFilmStock.badge}</span>
            </button>
          </div>

          {/* Viewfinder Canvas Stage */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center my-2 relative">
            <ViewfinderCanvas
              camera={activeCamera}
              filmStock={activeFilmStock}
              proSettings={proSettings}
              testSceneId={testSceneId}
              isSimulatedCamera={isSimulatedCamera}
              facingMode={facingMode}
              shutterTriggerTime={shutterTriggerTime}
              onCaptureFrame={handlePhotoCaptured}
            />

            {/* iPhone 15 Pro Max Focal Zoom Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-neutral-700 z-20">
              {(['0.5x', '1x', '2x', '5x'] as const).map(zoom => (
                <button
                  key={zoom}
                  onClick={() => setActiveLensZoom(zoom)}
                  className={`w-8 h-8 rounded-full text-[11px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    activeLensZoom === zoom
                      ? 'bg-amber-400 text-neutral-950 scale-105 shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {zoom}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Photographer Command Bar (iPhone 15 Pro Max Shutter Deck) */}
          <div className="w-full max-w-4xl flex items-center justify-between px-4 py-3 rounded-2xl bg-neutral-950/90 backdrop-blur-lg border border-neutral-800 shrink-0 z-20">
            {/* Left Slot: Darkroom Roll Preview Thumbnail */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveDrawer('darkroom')}
                className="relative w-12 h-12 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden flex items-center justify-center group cursor-pointer shadow-inner"
                title="View captured film roll"
              >
                {capturedPhotos.length > 0 ? (
                  <img
                    src={capturedPhotos[0].dataUrl}
                    alt="Latest shot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <FolderOpen className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                )}
                {capturedPhotos.length > 0 && (
                  <span className="absolute bottom-0.5 right-0.5 px-1 bg-amber-500 text-neutral-950 text-[9px] font-mono font-bold rounded-xs">
                    {capturedPhotos.length}
                  </span>
                )}
              </button>

              {/* Scene Simulator Switcher */}
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-neutral-500 font-mono">SIMULATION FEED</span>
                <select
                  value={testSceneId}
                  onChange={e => {
                    setTestSceneId(e.target.value);
                    setIsSimulatedCamera(true);
                  }}
                  className="bg-neutral-900 text-neutral-300 text-xs rounded border border-neutral-800 px-2 py-1 cursor-pointer"
                >
                  {TEST_SCENES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Center Slot: Tactical Mechanical Shutter Button */}
            <div className="flex items-center gap-4">
              {/* Camera Flip / Hardware feed toggle */}
              <button
                onClick={() => {
                  if (isSimulatedCamera) {
                    setIsSimulatedCamera(false);
                  } else {
                    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
                  }
                }}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  !isSimulatedCamera
                    ? 'bg-sky-950 border-sky-500 text-sky-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={isSimulatedCamera ? 'Switch to live device camera' : 'Flip front/rear camera'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Main Physical Shutter Trigger Ring */}
              <button
                onClick={handleShutterPress}
                className="relative w-18 h-18 rounded-full border-4 border-neutral-300 flex items-center justify-center p-1 bg-neutral-900 hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                aria-label="Capture photo"
              >
                <div
                  className="w-full h-full rounded-full transition-colors flex items-center justify-center"
                  style={{
                    backgroundColor: activeCamera.accentColor
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-white/40" />
                </div>
              </button>

              {/* Pro Controls Toggle */}
              <button
                onClick={() => setActiveDrawer(activeDrawer === 'pro_controls' ? 'none' : 'pro_controls')}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  activeDrawer === 'pro_controls'
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="Toggle manual exposure controls"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Right Slot: Quick Presets Drawer Switches */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveDrawer(activeDrawer === 'heritage_cameras' ? 'none' : 'heritage_cameras')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Nostalgia Camera Vault"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[10px] font-medium mt-0.5">Cameras</span>
              </button>

              <button
                onClick={() => setActiveDrawer(activeDrawer === 'film_stocks' ? 'none' : 'film_stocks')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Film Stocks"
              >
                <Film className="w-4 h-4" />
                <span className="text-[10px] font-medium mt-0.5">Films</span>
              </button>
            </div>
          </div>
        </main>

        {/* Slide-in Side Drawer for Heritage Cameras, Film Stocks, LiDAR, Pro Controls, or Darkroom */}
        {activeDrawer !== 'none' && (
          <aside className="w-full md:w-[420px] lg:w-[480px] h-full z-40 shadow-2xl shrink-0 transition-transform animate-in slide-in-from-right duration-200">
            {activeDrawer === 'heritage_cameras' && (
              <HeritageCameraSelector
                currentCameraId={activeCamera.id}
                onSelectCamera={cam => {
                  handleSelectCamera(cam);
                  setActiveDrawer('none');
                }}
                onClose={() => setActiveDrawer('none')}
              />
            )}

            {activeDrawer === 'film_stocks' && (
              <FilmStockSelector
                currentFilmStockId={activeFilmStock.id}
                onSelectFilmStock={stock => {
                  handleSelectFilmStock(stock);
                  setActiveDrawer('none');
                }}
                onClose={() => setActiveDrawer('none')}
              />
            )}

            {activeDrawer === 'lidar_studio' && (
              <LidarLightingStudio
                onApplyLightingToViewfinder={handleApplyLightingToCamera}
                onClose={() => setActiveDrawer('none')}
              />
            )}

            {activeDrawer === 'pro_controls' && (
              <ProManualControls
                settings={proSettings}
                onChange={patch => setProSettings(prev => ({ ...prev, ...patch }))}
                onClose={() => setActiveDrawer('none')}
              />
            )}

            {activeDrawer === 'darkroom' && (
              <DarkroomLightbox
                photos={capturedPhotos}
                onDeletePhoto={handleDeletePhoto}
                onClose={() => setActiveDrawer('none')}
              />
            )}
          </aside>
        )}
      </div>

      {/* iPhone PWA Install & GitHub Hosting Guide Modal */}
      <InstallAndHostModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        appUrl="https://ais-pre-demqzhh626izxirwzdmwii-554650489894.asia-east1.run.app"
      />
    </div>
  );
}
