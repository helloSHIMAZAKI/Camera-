import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StudioLight,
  LightModifier,
  LightingSetupPreset
} from '../types/camera';
import {
  STUDIO_LIGHTING_PRESETS,
  calculateIncidentLux,
  calculateKeyToFillRatio,
  calculateLightDistance,
  kelvinToRgb,
  SUBJECT_POSITION
} from '../utils/lightingCalculator';
import {
  Sun,
  Maximize2,
  Compass,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface LidarLightingStudioProps {
  onApplyLightingToViewfinder?: (lights: StudioLight[], ratio: string) => void;
  onClose?: () => void;
}

export const LidarLightingStudio: React.FC<LidarLightingStudioProps> = ({
  onApplyLightingToViewfinder,
  onClose
}) => {
  const [selectedPreset, setSelectedPreset] = useState<LightingSetupPreset>(STUDIO_LIGHTING_PRESETS[0]);
  const [lights, setLights] = useState<StudioLight[]>(STUDIO_LIGHTING_PRESETS[0].lights);
  const [activeLightId, setActiveLightId] = useState<string>(STUDIO_LIGHTING_PRESETS[0].lights[0].id);
  const [viewMode, setViewMode] = useState<'3d_lidar' | 'overhead_diagram' | 'depth_map'>('3d_lidar');
  const [lidarDistanceM, setLidarDistanceM] = useState<number>(1.45); // simulated iPhone LiDAR sensor reading
  const [rotationAngle, setRotationAngle] = useState<number>(30); // 3D turntable orbit angle

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync lights when preset changes
  const handleSelectPreset = (preset: LightingSetupPreset) => {
    setSelectedPreset(preset);
    // Deep clone lights so edits don't mutate template
    setLights(preset.lights.map(l => ({ ...l })));
    setActiveLightId(preset.lights[0].id);
  };

  const activeLight = useMemo(() => {
    return lights.find(l => l.id === activeLightId) || lights[0];
  }, [lights, activeLightId]);

  const { ratioString, ratioNumeric } = useMemo(() => {
    return calculateKeyToFillRatio(lights);
  }, [lights]);

  // Total incident illumination
  const totalIncidentLux = useMemo(() => {
    return Math.round(lights.reduce((acc, l) => acc + calculateIncidentLux(l), 0));
  }, [lights]);

  // Recommended exposure for studio setup
  const recommendedCameraSettings = useMemo(() => {
    // Standard rule: 1000 lux at ISO 100 ~ 1/125s f/4.0
    const lux = Math.max(100, totalIncidentLux);
    const ev = Math.log2((lux * 100) / 1250);
    let fStop = 'f/4.0';
    let shutter = '1/125s';
    let iso = 100;

    if (ev >= 11) {
      fStop = 'f/8.0';
      shutter = '1/250s';
    } else if (ev >= 9) {
      fStop = 'f/5.6';
      shutter = '1/160s';
    } else if (ev >= 7) {
      fStop = 'f/4.0';
      shutter = '1/125s';
    } else if (ev >= 5) {
      fStop = 'f/2.8';
      shutter = '1/60s';
      iso = 200;
    } else {
      fStop = 'f/1.8';
      shutter = '1/30s';
      iso = 400;
    }

    return { fStop, shutter, iso, ev: ev.toFixed(1) };
  }, [totalIncidentLux]);

  // Update single light property
  const updateActiveLight = (patch: Partial<StudioLight>) => {
    setLights(prev => prev.map(l => l.id === activeLightId ? { ...l, ...patch } : l));
  };

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;
      const scale = Math.min(w, h) * 0.16; // pixels per meter

      if (viewMode === '3d_lidar') {
        // Dark futuristic spatial background with LiDAR grid
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);

        // Ground 3D Perspective Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;

        const rad = (rotationAngle * Math.PI) / 180;
        const cosR = Math.cos(rad);
        const sinR = Math.sin(rad);

        // Draw ground mesh
        const gridSize = 3;
        for (let gx = -gridSize; gx <= gridSize; gx += 0.5) {
          ctx.beginPath();
          for (let gz = -gridSize; gz <= gridSize; gz += 0.5) {
            // Project 3D (gx, 0, gz) to 2D screen
            const rx = gx * cosR - gz * sinR;
            const rz = gx * sinR + gz * cosR + 4.5;
            const projX = cx + (rx * scale * 3.5) / rz;
            const projY = cy + 60 + (0.8 * scale * 3.5) / rz;
            if (gz === -gridSize) ctx.moveTo(projX, projY);
            else ctx.lineTo(projX, projY);
          }
          ctx.stroke();
        }

        // LiDAR Simulated Subject Mesh (Wireframe Bust at center)
        ctx.save();
        ctx.translate(cx, cy - 20);
        // Subject head wireframe
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, -35, 24, 32, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Nose reference indicator
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(0, -28);
        ctx.lineTo(6, -26);
        ctx.stroke();
        // Shoulders
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-50, 15);
        ctx.quadraticCurveTo(0, -5, 50, 15);
        ctx.stroke();
        ctx.restore();

        // Render Lights in 3D
        lights.forEach(light => {
          if (!light.enabled) return;
          const rx = light.x * cosR - light.z * sinR;
          const rz = light.z * cosR + light.x * sinR + 4.5;
          const projX = cx + (rx * scale * 3.5) / rz;
          const projY = cy - 20 - ((light.y - 1.2) * scale * 3.5) / rz;

          const isSelected = light.id === activeLightId;
          const [r, g, b] = kelvinToRgb(light.colorTempK);

          // Ray beam to subject
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${isSelected ? 0.65 : 0.25})`;
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(projX, projY);
          ctx.lineTo(cx, cy - 40);
          ctx.stroke();
          ctx.setLineDash([]);

          // Light fixture node
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.beginPath();
          ctx.arc(projX, projY, isSelected ? 9 : 6, 0, Math.PI * 2);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(projX, projY, 13, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Light label
          ctx.fillStyle = '#f1f5f9';
          ctx.font = '10px monospace';
          ctx.fillText(light.name.split(' ')[0], projX - 12, projY - 16);
        });

      } else if (viewMode === 'overhead_diagram') {
        // Clean 2D Studio Floor Overhead Blueprint
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Distance range rings (1m, 2m, 3m)
        [1, 2, 3].forEach(m => {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.beginPath();
          ctx.arc(cx, cy, m * scale, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.font = '10px monospace';
          ctx.fillText(`${m}m`, cx + m * scale + 4, cy + 4);
        });

        // Subject at center
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        // Nose pointer (Subject faces down towards camera at bottom)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 12);
        ctx.lineTo(cx + 5, cy + 12);
        ctx.lineTo(cx, cy + 24);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText('SUBJECT', cx - 22, cy - 20);

        // iPhone 15 Pro Max Camera at Bottom
        const camY = cy + lidarDistanceM * scale;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 20, camY - 8, 40, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, camY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`LiDAR: ${lidarDistanceM.toFixed(2)}m`, cx - 32, camY + 22);

        // Lights
        lights.forEach(light => {
          if (!light.enabled) return;
          const lx = cx + light.x * scale;
          const lz = cy + light.z * scale;
          const isSelected = light.id === activeLightId;
          const [r, g, b] = kelvinToRgb(light.colorTempK);

          // Cone of light beam to subject
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isSelected ? 0.25 : 0.12})`;
          ctx.beginPath();
          ctx.moveTo(lx, lz);
          ctx.lineTo(cx - 15, cy);
          ctx.lineTo(cx + 15, cy);
          ctx.closePath();
          ctx.fill();

          // Light Icon / Disk
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.beginPath();
          ctx.arc(lx, lz, isSelected ? 12 : 8, 0, Math.PI * 2);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText(light.name, lx + 14, lz + 4);
        });

      } else {
        // Depth Heatmap Mode (Simulated TrueDepth / LiDAR false-color gradient)
        ctx.fillStyle = '#05050a';
        ctx.fillRect(0, 0, w, h);

        const radial = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.45);
        radial.addColorStop(0, '#ef4444'); // 0.5m close (Red)
        radial.addColorStop(0.3, '#f59e0b'); // 1.0m (Yellow)
        radial.addColorStop(0.6, '#10b981'); // 1.8m (Green)
        radial.addColorStop(0.85, '#06b6d4'); // 2.5m (Cyan)
        radial.addColorStop(1, '#1e1b4b'); // 4.0m+ (Deep Blue)
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, w, h);

        // Grid lines overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < w; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.stroke();
        }
        for (let j = 0; j < h; j += 30) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(w, j);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.fillText(`LiDAR DEPTH MAP: ${lidarDistanceM.toFixed(2)}m (Accuracy: ±2mm)`, 16, 26);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, lights, activeLightId, rotationAngle, lidarDistanceM]);

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-l border-neutral-800">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 shrink-0 bg-neutral-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">LiDAR Lighting Studio</h2>
            <p className="text-[11px] text-neutral-400">iPhone 15 Pro Max Spatial Mapper</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyLightingToViewfinder && (
            <button
              onClick={() => onApplyLightingToViewfinder(lights, ratioString)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Setup</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close studio"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Preset Selector Bar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Lighting Presets</span>
            <span className="text-[11px] font-mono text-sky-400">{ratioString} Ratio</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {STUDIO_LIGHTING_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 border border-transparent'
                }`}
              >
                <div className="font-medium truncate">{preset.name}</div>
                <div className="text-[10px] text-neutral-400 truncate">{preset.keyToFillRatio}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Visualizer & Depth Map Canvas */}
        <div className="relative p-3 border-b border-neutral-800 bg-black">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
              <button
                onClick={() => setViewMode('3d_lidar')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === '3d_lidar' ? 'bg-sky-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                3D LiDAR Mesh
              </button>
              <button
                onClick={() => setViewMode('overhead_diagram')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'overhead_diagram' ? 'bg-sky-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Overhead Blueprint
              </button>
              <button
                onClick={() => setViewMode('depth_map')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'depth_map' ? 'bg-sky-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Depth Heatmap
              </button>
            </div>

            {viewMode === '3d_lidar' && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Compass className="w-3.5 h-3.5" />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={e => setRotationAngle(Number(e.target.value))}
                  className="w-16 accent-sky-500"
                  title="Rotate 3D camera"
                />
              </div>
            )}
          </div>

          <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-neutral-800">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full object-cover"
            />
            
            {/* Live LiDAR Distance HUD badge */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-neutral-700/80 text-[10px] font-mono text-sky-400">
              <span>LiDAR Distance: </span>
              <span className="text-white font-semibold">{lidarDistanceM.toFixed(2)} m / {(lidarDistanceM * 3.28084).toFixed(1)} ft</span>
            </div>

            {/* Quick Distance Slider */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-neutral-800 text-[10px] text-neutral-300">
              <span>Subject Dist:</span>
              <input
                type="range"
                min="0.8"
                max="3.5"
                step="0.05"
                value={lidarDistanceM}
                onChange={e => setLidarDistanceM(Number(e.target.value))}
                className="w-14 accent-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Master Photometric & Camera Calculations */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/40">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-2">
            Photometric Metrics & Exposure Guide
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Ratio (Key:Fill)</div>
              <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">{ratioString}</div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Total Lux</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{totalIncidentLux} lx</div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Suggested f-Stop</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{recommendedCameraSettings.fStop}</div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Shutter / ISO</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{recommendedCameraSettings.shutter}</div>
            </div>
          </div>

          {/* Setup Pro-Tip */}
          <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800/80 text-xs text-neutral-300">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">{selectedPreset.portraitGenre}: </span>
              <span>{selectedPreset.proTip}</span>
            </div>
          </div>
        </div>

        {/* Active Light Fixture Inspector */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
              Studio Fixtures ({lights.length})
            </span>
          </div>

          {/* Fixture Selector Tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {lights.map(light => (
              <button
                key={light.id}
                onClick={() => setActiveLightId(light.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  light.id === activeLightId
                    ? 'bg-neutral-100 text-neutral-950 font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `rgb(${kelvinToRgb(light.colorTempK).join(',')})`
                  }}
                />
                <span>{light.name}</span>
              </button>
            ))}
          </div>

          {/* Active Light Property Controls */}
          {activeLight && (
            <div className="space-y-3 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{activeLight.name}</div>
                  <div className="text-[11px] text-neutral-400">
                    Distance: {calculateLightDistance(activeLight).toFixed(2)}m · Incident: {Math.round(calculateIncidentLux(activeLight))} lx
                  </div>
                </div>
                <button
                  onClick={() => updateActiveLight({ enabled: !activeLight.enabled })}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                    activeLight.enabled
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {activeLight.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Intensity Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Fixture Output Intensity</span>
                  <span className="font-mono text-white">{activeLight.intensityLux} lux</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="4000"
                  step="50"
                  value={activeLight.intensityLux}
                  onChange={e => updateActiveLight({ intensityLux: Number(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Color Temperature Kelvin Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Color Temp (Kelvin)</span>
                  <span className="font-mono text-amber-300">{activeLight.colorTempK}K</span>
                </div>
                <input
                  type="range"
                  min="2800"
                  max="6500"
                  step="100"
                  value={activeLight.colorTempK}
                  onChange={e => updateActiveLight({ colorTempK: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Position Coordinates: X (Azimuth) & Z (Depth) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Lateral X (m)</span>
                    <span className="font-mono text-white">{activeLight.x.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-2.5"
                    max="2.5"
                    step="0.1"
                    value={activeLight.x}
                    onChange={e => updateActiveLight({ x: Number(e.target.value) })}
                    className="w-full accent-sky-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Height Y (m)</span>
                    <span className="font-mono text-white">{activeLight.y.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.8"
                    step="0.1"
                    value={activeLight.y}
                    onChange={e => updateActiveLight({ y: Number(e.target.value) })}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              {/* Modifier Type */}
              <div>
                <span className="text-[11px] text-neutral-400 block mb-1.5">Light Modifier</span>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {(['softbox', 'beauty_dish', 'reflector', 'fresnel', 'bare_bulb', 'umbrella'] as LightModifier[]).map(mod => (
                    <button
                      key={mod}
                      onClick={() => updateActiveLight({ modifier: mod })}
                      className={`px-2 py-1.5 rounded text-center capitalize cursor-pointer transition-colors ${
                        activeLight.modifier === mod
                          ? 'bg-neutral-200 text-neutral-900 font-medium'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mod.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
