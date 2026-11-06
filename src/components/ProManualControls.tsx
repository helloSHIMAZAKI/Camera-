import React from 'react';
import { ProSettings, AspectRatio } from '../types/camera';
import {
  Sliders,
  Eye,
  Grid,
  Sun,
  Camera,
  Activity,
  Maximize2,
  Clock,
  RotateCcw
} from 'lucide-react';

interface ProManualControlsProps {
  settings: ProSettings;
  onChange: (patch: Partial<ProSettings>) => void;
  onClose?: () => void;
}

export const ProManualControls: React.FC<ProManualControlsProps> = ({
  settings,
  onChange,
  onClose
}) => {
  const shutterSpeeds = [
    '1/8000s', '1/4000s', '1/2000s', '1/1000s', '1/500s', 
    '1/250s', '1/125s', '1/60s', '1/30s', '1/15s', '1/4s', '1s'
  ];

  const isoValues = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800];
  const apertures = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0];

  const aspectRatios: { id: AspectRatio; label: string }[] = [
    { id: '3:2', label: '3:2 (35mm)' },
    { id: '1:1', label: '1:1 (6×6 Sq)' },
    { id: '6:7', label: '6:7 (Medium)' },
    { id: '4:3', label: '4:3 (Compact)' },
    { id: '16:9', label: '16:9 (Cinema)' },
    { id: '2.39:1', label: '2.39:1 (Scope)' }
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-l border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Pro Manual Deck</h2>
            <p className="text-[11px] text-neutral-400">Full Photographer Exposure & Cinematography Tools</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close pro controls"
          >
            ✕
          </button>
        )}
      </div>

      {/* Control Panels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Shutter Speed Dial */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-neutral-300">Shutter Speed</span>
            <span className="font-mono text-sky-400 font-bold">{settings.shutterSpeed}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {shutterSpeeds.map(speed => (
              <button
                key={speed}
                onClick={() => onChange({ shutterSpeed: speed })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                  settings.shutterSpeed === speed
                    ? 'bg-sky-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* ISO Sensitivity Selector */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-neutral-300">ISO Sensitivity</span>
            <span className="font-mono text-amber-400 font-bold">{settings.iso}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {isoValues.map(iso => (
              <button
                key={iso}
                onClick={() => onChange({ iso })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                  settings.iso === iso
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {iso}
              </button>
            ))}
          </div>
        </div>

        {/* EV Exposure Compensation */}
        <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-neutral-300">EV Compensation</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">
                {settings.evCompensation > 0 ? `+${settings.evCompensation.toFixed(1)}` : settings.evCompensation.toFixed(1)} EV
              </span>
              <button
                onClick={() => onChange({ evCompensation: 0.0 })}
                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Reset EV to zero"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
          <input
            type="range"
            min="-3.0"
            max="3.0"
            step="0.3"
            value={settings.evCompensation}
            onChange={e => onChange({ evCompensation: Number(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
            <span>-3.0 EV (Dark)</span>
            <span>0.0 (Neutral)</span>
            <span>+3.0 EV (High-Key)</span>
          </div>
        </div>

        {/* Aperture (f-stop) */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-neutral-300">Aperture</span>
            <span className="font-mono text-emerald-400 font-bold">f/{settings.aperture.toFixed(1)}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {apertures.map(f => (
              <button
                key={f}
                onClick={() => onChange({ aperture: f })}
                className={`py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                  settings.aperture === f
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                f/{f.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        {/* White Balance (Kelvin) */}
        <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-neutral-300">White Balance (Kelvin)</span>
            <span className="font-mono text-amber-300 font-bold">{settings.whiteBalanceK}K</span>
          </div>
          <input
            type="range"
            min="2500"
            max="10000"
            step="100"
            value={settings.whiteBalanceK}
            onChange={e => onChange({ whiteBalanceK: Number(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto">
            {[
              { k: 3200, label: 'Tungsten' },
              { k: 4300, label: 'Fluorescent' },
              { k: 5600, label: 'Daylight' },
              { k: 6500, label: 'Cloudy' },
              { k: 7500, label: 'Shade' }
            ].map(preset => (
              <button
                key={preset.k}
                onClick={() => onChange({ whiteBalanceK: preset.k })}
                className={`px-2 py-1 rounded text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                  settings.whiteBalanceK === preset.k
                    ? 'bg-neutral-200 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Assist Suite (Focus Peaking, Zebra, Aspect, Grids) */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="text-xs font-semibold text-white">Cinematography Assist Tools</div>

          {/* Focus Peaking */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-200 font-medium">Focus Peaking</div>
              <div className="text-[10px] text-neutral-400">Highlights in-focus edges</div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1 bg-neutral-800 p-0.5 rounded">
                {(['green', 'red', 'white'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => onChange({ focusPeaking: true, focusPeakingColor: color })}
                    className={`w-5 h-5 rounded-sm flex items-center justify-center cursor-pointer ${
                      settings.focusPeakingColor === color && settings.focusPeaking
                        ? 'ring-2 ring-white'
                        : 'opacity-50'
                    }`}
                    style={{ backgroundColor: color === 'green' ? '#22c55e' : (color === 'red' ? '#ef4444' : '#ffffff') }}
                  />
                ))}
              </div>
              <button
                onClick={() => onChange({ focusPeaking: !settings.focusPeaking })}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  settings.focusPeaking
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {settings.focusPeaking ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Zebra Stripes */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div>
              <div className="text-xs text-neutral-200 font-medium">Zebra Highlight Warning</div>
              <div className="text-[10px] text-neutral-400">Overexposure stripe threshold ({settings.zebraThreshold}%)</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={settings.zebraThreshold}
                onChange={e => onChange({ zebraThreshold: Number(e.target.value) })}
                className="bg-neutral-800 text-xs text-neutral-200 rounded px-2 py-1 border border-neutral-700 cursor-pointer"
              >
                <option value={70}>70% Skin</option>
                <option value={90}>90% High</option>
                <option value={100}>100% Clip</option>
              </select>
              <button
                onClick={() => onChange({ zebraWarning: !settings.zebraWarning })}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  settings.zebraWarning
                    ? 'bg-sky-600 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {settings.zebraWarning ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-xs text-neutral-300 block mb-1.5 font-medium">Framing Aspect Ratio</span>
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              {aspectRatios.map(aspect => (
                <button
                  key={aspect.id}
                  onClick={() => onChange({ activeAspect: aspect.id })}
                  className={`px-2 py-1.5 rounded text-center cursor-pointer transition-colors ${
                    settings.activeAspect === aspect.id
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {aspect.label}
                </button>
              ))}
            </div>
          </div>

          {/* Framing Guides */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-xs text-neutral-300 block mb-1.5 font-medium">Framing Grid Guides</span>
            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {[
                { id: 'none', label: 'Off' },
                { id: 'rule_of_thirds', label: 'Thirds' },
                { id: 'crosshair', label: 'Cross' },
                { id: 'center_spot', label: 'Spot' }
              ].map(grid => (
                <button
                  key={grid.id}
                  onClick={() => onChange({ gridType: grid.id as any })}
                  className={`px-2 py-1.5 rounded text-center cursor-pointer transition-colors ${
                    settings.gridType === grid.id
                      ? 'bg-neutral-200 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {grid.label}
                </button>
              ))}
            </div>
          </div>

          {/* Anamorphic De-squeeze */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-200 font-medium">Anamorphic Lens De-Squeeze</div>
              <div className="text-[10px] text-neutral-400">Horizontal optical expansion</div>
            </div>
            <div className="flex gap-1">
              {[1.0, 1.33, 1.5].map(scale => (
                <button
                  key={scale}
                  onClick={() => onChange({ anamorphicDeSqueeze: scale as any })}
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                    settings.anamorphicDeSqueeze === scale
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {scale === 1.0 ? '1.0x (Spherical)' : `${scale}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Audio VU Monitor */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <div className="text-xs text-neutral-200 font-medium">Audio VU Level Meter</div>
            <button
              onClick={() => onChange({ audioMonitor: !settings.audioMonitor })}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                settings.audioMonitor
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {settings.audioMonitor ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
