import React, { useState } from 'react';
import { CapturedPhoto } from '../types/camera';
import {
  Download,
  Trash2,
  Calendar,
  Camera,
  Film,
  Sparkles,
  Share2,
  Sliders,
  Check,
  ChevronLeft
} from 'lucide-react';

interface DarkroomLightboxProps {
  photos: CapturedPhoto[];
  onDeletePhoto: (id: string) => void;
  onClose?: () => void;
}

export const DarkroomLightbox: React.FC<DarkroomLightboxProps> = ({
  photos,
  onDeletePhoto,
  onClose
}) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(
    photos.length > 0 ? photos[0].id : null
  );

  const [activeBorder, setActiveBorder] = useState<'vintage_35mm' | 'hasselblad_6x6' | 'polaroid' | 'none'>('vintage_35mm');

  const selectedPhoto = photos.find(p => p.id === selectedPhotoId) || photos[0];

  const handleDownload = (photo: CapturedPhoto) => {
    // Create an export canvas with chosen vintage border
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.dataUrl;

    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (activeBorder === 'vintage_35mm') {
        // 35mm Film Strip with sprocket holes & DX codes
        const borderX = 80;
        const borderY = 120;
        canvas.width = img.width + borderX * 2;
        canvas.height = img.height + borderY * 2;

        // Film rebate (black film base)
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sprocket holes along top and bottom
        const holeW = 18;
        const holeH = 26;
        const holeSpacing = 36;
        ctx.fillStyle = '#ffffff';

        for (let x = 20; x < canvas.width - 20; x += holeSpacing) {
          // Top sprockets
          ctx.beginPath();
          ctx.roundRect(x, 24, holeW, holeH, 4);
          ctx.fill();
          // Bottom sprockets
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - 24 - holeH, holeW, holeH, 4);
          ctx.fill();
        }

        // Film edge markings
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`▶ ${photo.filmStockName.toUpperCase()} · DX ${photo.exif.iso} · FRAME 24A`, 80, 85);
        ctx.fillText(`SAFETY FILM · ${photo.cameraName.toUpperCase()} · ${photo.exif.shutterSpeed} ${photo.exif.aperture}`, 80, canvas.height - 65);

        // Image in center
        ctx.drawImage(img, borderX, borderY);

      } else if (activeBorder === 'hasselblad_6x6') {
        // Hasselblad 6x6 Medium Format notch frame
        const border = 100;
        canvas.width = img.width + border * 2;
        canvas.height = img.height + border * 2;

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Hasselblad signature twin V-notches on left frame edge
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(border - 2, canvas.height * 0.4);
        ctx.lineTo(border - 14, canvas.height * 0.42);
        ctx.lineTo(border - 2, canvas.height * 0.44);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(border - 2, canvas.height * 0.56);
        ctx.lineTo(border - 14, canvas.height * 0.58);
        ctx.lineTo(border - 2, canvas.height * 0.60);
        ctx.fill();

        // Hasselblad typography
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px monospace';
        ctx.fillText('HASSELBLAD 500 C/M · CARL ZEISS T*', border, 55);
        ctx.fillText(`${photo.filmStockName} · ISO ${photo.exif.iso}`, border, canvas.height - 40);

        ctx.drawImage(img, border, border);

      } else if (activeBorder === 'polaroid') {
        // Polaroid classic white frame
        const borderX = 60;
        const borderTop = 60;
        const borderBottom = 220;
        canvas.width = img.width + borderX * 2;
        canvas.height = img.height + borderTop + borderBottom;

        // White/cream cardstock
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Photo
        ctx.drawImage(img, borderX, borderTop);

        // Handwritten note style
        ctx.fillStyle = '#1e293b';
        ctx.font = 'italic 26px serif';
        ctx.fillText(`${photo.cameraName} — ${photo.filmStockName}`, borderX + 20, canvas.height - 110);
        ctx.font = '16px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(new Date(photo.timestamp).toLocaleDateString(), borderX + 20, canvas.height - 65);

      } else {
        // Clean
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      // Trigger download
      const link = document.createElement('a');
      link.download = `${photo.cameraName.toLowerCase().replace(/\s+/g, '_')}_${photo.id}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.96);
      link.click();
    };
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-l border-neutral-800">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Darkroom Lightbox</h2>
            <p className="text-[11px] text-neutral-400">{photos.length} Captured Negatives & Prints</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close darkroom"
          >
            ✕
          </button>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
          <Camera className="w-12 h-12 text-neutral-600 mb-3 stroke-[1.5]" />
          <h3 className="text-base font-semibold text-neutral-200">No Film Rolls Developed Yet</h3>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">
            Tap the shutter button in the viewfinder to shoot your first analog or pro cinema exposure!
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Photo Preview & Lightbox Stage */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-neutral-950 overflow-y-auto">
            {selectedPhoto && (
              <div className="max-w-lg w-full flex flex-col items-center">
                {/* Vintage Frame Wrapper */}
                <div
                  className={`relative transition-all duration-300 shadow-2xl ${
                    activeBorder === 'vintage_35mm'
                      ? 'bg-neutral-950 p-6 rounded-lg border border-neutral-800'
                      : activeBorder === 'hasselblad_6x6'
                      ? 'bg-neutral-950 p-6 border-2 border-neutral-800'
                      : activeBorder === 'polaroid'
                      ? 'bg-[#fdfbf7] p-4 pb-14 rounded shadow-xl text-neutral-900'
                      : 'rounded overflow-hidden'
                  }`}
                >
                  {/* Sprocket Holes on top */}
                  {activeBorder === 'vintage_35mm' && (
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-[9px] font-mono font-bold text-amber-400">
                        ▶ {selectedPhoto.filmStockName.toUpperCase()} · DX {selectedPhoto.exif.iso}
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="w-2.5 h-3.5 bg-neutral-800 rounded-xs" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo Canvas */}
                  <img
                    src={selectedPhoto.dataUrl}
                    alt={selectedPhoto.cameraName}
                    className="max-h-[340px] w-auto object-contain rounded-xs shadow"
                  />

                  {/* Sprocket Holes on bottom */}
                  {activeBorder === 'vintage_35mm' && (
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-[9px] font-mono text-neutral-500">
                        {selectedPhoto.cameraName.toUpperCase()} · {selectedPhoto.exif.shutterSpeed} {selectedPhoto.exif.aperture}
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="w-2.5 h-3.5 bg-neutral-800 rounded-xs" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Polaroid caption */}
                  {activeBorder === 'polaroid' && (
                    <div className="mt-3 px-1">
                      <div className="font-serif italic text-sm text-neutral-900">
                        {selectedPhoto.cameraName}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {selectedPhoto.filmStockName} · {new Date(selectedPhoto.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Frame Style Picker */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 p-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] font-medium text-neutral-400 px-1">Border:</span>
                  {(['vintage_35mm', 'hasselblad_6x6', 'polaroid', 'none'] as const).map(border => (
                    <button
                      key={border}
                      onClick={() => setActiveBorder(border)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize whitespace-nowrap cursor-pointer transition-colors ${
                        activeBorder === border
                          ? 'bg-amber-500 text-neutral-950 font-semibold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {border === 'vintage_35mm' ? '35mm Film' : (border === 'hasselblad_6x6' ? '6x6 Medium' : (border === 'polaroid' ? 'Polaroid' : 'Clean'))}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleDownload(selectedPhoto)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Film Print</span>
                  </button>
                  <button
                    onClick={() => onDeletePhoto(selectedPhoto.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-red-950/50 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Sheet Roll Strip & EXIF Inspector (Right Sidebar) */}
          <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900/40 p-3 flex flex-col shrink-0 overflow-y-auto">
            {/* EXIF Details */}
            {selectedPhoto && (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 mb-3 space-y-2 text-xs">
                <div className="font-semibold text-white border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                  <span>EXIF Optical Metadata</span>
                  <span className="text-[10px] font-mono text-amber-400">{selectedPhoto.filmStockName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">Camera:</span>
                    <span className="font-semibold text-white">{selectedPhoto.cameraName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Lens:</span>
                    <span>{selectedPhoto.lens}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">ISO:</span>
                    <span>{selectedPhoto.exif.iso}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Shutter:</span>
                    <span>{selectedPhoto.exif.shutterSpeed}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Aperture:</span>
                    <span>{selectedPhoto.exif.aperture}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">EV Comp:</span>
                    <span>{selectedPhoto.exif.ev}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Film Roll Thumbnails Strip */}
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Contact Sheet ({photos.length})
            </div>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-56 md:max-h-none">
              {photos.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPhotoId(p.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    p.id === selectedPhotoId
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-95'
                      : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={p.dataUrl}
                    alt={p.cameraName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5 text-[8px] font-mono text-amber-300 truncate text-center">
                    {p.cameraName.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
