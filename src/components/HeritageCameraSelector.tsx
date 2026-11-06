import React, { useState } from 'react';
import { CameraProfile, CameraCategory } from '../types/camera';
import { CAMERA_PROFILE_LIST } from '../utils/cameraProfiles';
import { Camera, Sparkles, Filter, Check } from 'lucide-react';

interface HeritageCameraSelectorProps {
  currentCameraId: string;
  onSelectCamera: (camera: CameraProfile) => void;
  onClose?: () => void;
}

export const HeritageCameraSelector: React.FC<HeritageCameraSelectorProps> = ({
  currentCameraId,
  onSelectCamera,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CameraCategory | 'all'>('all');

  const categories: { id: CameraCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Cameras' },
    { id: 'rangefinder', label: '35mm Rangefinders' },
    { id: 'slr', label: 'Classic SLRs' },
    { id: 'medium_format', label: 'Medium Format & TLR' },
    { id: 'digital_milestone', label: 'Digital Milestones' },
    { id: 'modern_pro', label: 'Cinema Pro' }
  ];

  const filteredCameras = selectedCategory === 'all'
    ? CAMERA_PROFILE_LIST
    : CAMERA_PROFILE_LIST.filter(c => c.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-l border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Nostalgia Camera Vault</h2>
            <p className="text-[11px] text-neutral-400">18 Iconic Historic Cameras (1954–Modern)</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close camera selector"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills (Interactive Filter Controls per frontend constitution §1.A) */}
      <div className="flex items-center gap-1 p-2.5 border-b border-neutral-800 bg-neutral-900/40 overflow-x-auto shrink-0">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Camera Grid / List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredCameras.map(cam => {
          const isSelected = cam.id === currentCameraId;

          return (
            <div
              key={cam.id}
              onClick={() => onSelectCamera(cam)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                      {cam.name}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ({cam.year})
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-800 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {cam.subtitle}
                  </p>
                  
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {cam.tagline}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <span
                    className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${cam.accentColor}20`,
                      color: cam.accentColor,
                      border: `1px solid ${cam.accentColor}40`
                    }}
                  >
                    {cam.nativeAspect}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {cam.housingStyle.material.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Technical Specifications bar */}
              <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="truncate max-w-[240px]">
                  <span className="text-neutral-500">Lens: </span>
                  <span className="text-neutral-300">{cam.signatureLens}</span>
                </div>
                <div className="font-mono text-[10px] text-neutral-500 shrink-0">
                  {cam.shutterSound.replace('_', ' ')}
                </div>
              </div>

              {/* Features badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {cam.features.slice(0, 3).map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-neutral-400 bg-neutral-800/60 px-1.5 py-0.5 rounded"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
