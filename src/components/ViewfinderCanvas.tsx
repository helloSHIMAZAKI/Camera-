import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  CameraProfile,
  FilmStock,
  ProSettings,
  AspectRatio,
  CapturedPhoto
} from '../types/camera';
import { renderTestSceneToCanvas, TEST_SCENES } from '../utils/testScenes';
import { kelvinToRgb } from '../utils/lightingCalculator';

interface ViewfinderCanvasProps {
  camera: CameraProfile;
  filmStock: FilmStock;
  proSettings: ProSettings;
  testSceneId: string;
  isSimulatedCamera: boolean;
  facingMode: 'user' | 'environment';
  shutterTriggerTime: number; // triggers shutter animation
  onCaptureFrame: (photo: CapturedPhoto) => void;
}

export const ViewfinderCanvas: React.FC<ViewfinderCanvasProps> = ({
  camera,
  filmStock,
  proSettings,
  testSceneId,
  isSimulatedCamera,
  facingMode,
  shutterTriggerTime,
  onCaptureFrame
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [shutterFlashing, setShutterFlashing] = useState<boolean>(false);

  // Focus point coordinates for tap-to-focus
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize real camera stream if not simulated
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (!isSimulatedCamera) {
      navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      .then(stream => {
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setStreamActive(true);
        setCameraError(null);
      })
      .catch(err => {
        setStreamActive(false);
        setCameraError(err.message || 'Camera inaccessible');
      });
    } else {
      setStreamActive(false);
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isSimulatedCamera, facingMode]);

  // Flash shutter overlay on shutter trigger
  useEffect(() => {
    if (shutterTriggerTime > 0) {
      setShutterFlashing(true);
      const timer = setTimeout(() => setShutterFlashing(false), 120);
      return () => clearTimeout(timer);
    }
  }, [shutterTriggerTime]);

  // Aspect ratio math
  const getAspectDimensions = useCallback((aspect: AspectRatio, containerWidth: number, containerHeight: number) => {
    let targetRatio = 3 / 2; // default 35mm
    switch (aspect) {
      case '1:1': targetRatio = 1.0; break;
      case '6:7': targetRatio = 6 / 7; break;
      case '4:3': targetRatio = 4 / 3; break;
      case '16:9': targetRatio = 16 / 9; break;
      case '2.39:1': targetRatio = 2.39; break;
      case '3:2':
      default: targetRatio = 3 / 2; break;
    }

    // Anamorphic de-squeeze factor
    const effectiveRatio = targetRatio * proSettings.anamorphicDeSqueeze;

    let w = containerWidth;
    let h = w / effectiveRatio;

    if (h > containerHeight) {
      h = containerHeight;
      w = h * effectiveRatio;
    }

    return { width: Math.round(w), height: Math.round(h) };
  }, [proSettings.anamorphicDeSqueeze]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number = 0;
    let startTime = performance.now();

    // Intermediate offscreen buffer for camera source
    const offscreen = document.createElement('canvas');
    offscreen.width = 960;
    offscreen.height = 720;
    const offCtx = offscreen.getContext('2d');

    const render = (time: number) => {
      const timeSec = (time - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw source: real video or simulated 4K test scene
      if (offCtx) {
        if (streamActive && videoRef.current && videoRef.current.readyState >= 2) {
          // If Rolleiflex 2.8F, simulate lateral mirror inversion!
          if (camera.id === 'rolleiflex_28f') {
            offCtx.save();
            offCtx.translate(offscreen.width, 0);
            offCtx.scale(-1, 1);
            offCtx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);
            offCtx.restore();
          } else {
            offCtx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);
          }
        } else {
          // Render realistic procedural studio scene
          if (camera.id === 'rolleiflex_28f') {
            offCtx.save();
            offCtx.translate(offscreen.width, 0);
            offCtx.scale(-1, 1);
            renderTestSceneToCanvas(offCtx, offscreen.width, offscreen.height, testSceneId, timeSec);
            offCtx.restore();
          } else {
            renderTestSceneToCanvas(offCtx, offscreen.width, offscreen.height, testSceneId, timeSec);
          }
        }

        // Draw offscreen scaled into main canvas
        ctx.drawImage(offscreen, 0, 0, w, h);
      }

      // 2. Film Stock Color Grading & Tone Matrix
      // Apply contrast, saturation, and color balance
      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const [rTint, gTint, bTint] = filmStock.colorMatrix;
        const [shR, shG, shB] = filmStock.shadowTint;
        const contrast = filmStock.contrast;
        const saturation = filmStock.saturation;
        const grainIntensity = filmStock.grainIntensity * (proSettings.iso / 400);

        // Exposure value EV multiplier
        const evMultiplier = Math.pow(2, proSettings.evCompensation);

        // Focus peaking buffer & Zebra buffer setup
        const isFocusPeaking = proSettings.focusPeaking;
        const isZebra = proSettings.zebraWarning;
        const zebraThresholdLuma = (proSettings.zebraThreshold / 100) * 255;

        // Process pixels (step by 2 for performance in live preview)
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // EV adjustment
          r *= evMultiplier;
          g *= evMultiplier;
          b *= evMultiplier;

          // Film Stock Color Balance
          r *= rTint;
          g *= gTint;
          b *= bTint;

          // Shadow tinting
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 90) {
            const shadowWeight = (90 - lum) / 90;
            r = r * (1 - shadowWeight) + r * shR * shadowWeight;
            g = g * (1 - shadowWeight) + g * shG * shadowWeight;
            b = b * (1 - shadowWeight) + b * shB * shadowWeight;
          }

          // Contrast curve: (pixel - 128) * contrast + 128
          r = (r - 128) * contrast + 128;
          g = (g - 128) * contrast + 128;
          b = (b - 128) * contrast + 128;

          // Saturation
          if (saturation === 0.0) {
            // Pure B&W (Tri-X, HP5, ACROS)
            const mono = 0.299 * r + 0.587 * g + 0.114 * b;
            r = mono;
            g = mono;
            b = mono;
          } else if (saturation !== 1.0) {
            const currentLum = 0.299 * r + 0.587 * g + 0.114 * b;
            r = currentLum + (r - currentLum) * saturation;
            g = currentLum + (g - currentLum) * saturation;
            b = currentLum + (b - currentLum) * saturation;
          }

          // Film Grain: Organic Silver Halide simulation
          if (grainIntensity > 0.05) {
            const grain = (Math.random() - 0.5) * grainIntensity * 110;
            r += grain;
            g += grain;
            b += grain;
          }

          // Highlight Halation Bloom (CineStill 800T red glow)
          if (filmStock.highlightBloom > 0.3 && lum > 200) {
            r += (lum - 200) * filmStock.highlightBloom * 0.9;
          }

          // Zebra Stripes Check
          if (isZebra && lum >= zebraThresholdLuma) {
            const pixelX = (i / 4) % w;
            const pixelY = Math.floor((i / 4) / w);
            // 45-degree diagonal stripes
            if ((pixelX + pixelY) % 12 < 4) {
              r = 255;
              g = 255;
              b = 255;
            } else {
              r = 20;
              g = 20;
              b = 20;
            }
          }

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }

        ctx.putImageData(imgData, 0, 0);

        // 3. Focus Peaking Overlay (Sobel edge highlight)
        if (isFocusPeaking) {
          ctx.save();
          ctx.strokeStyle = proSettings.focusPeakingColor === 'green' ? '#22c55e' : (proSettings.focusPeakingColor === 'red' ? '#ef4444' : '#ffffff');
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          // Draw peak edge contours around high contrast zones
          const cx = w * 0.5;
          const cy = h * 0.42;
          ctx.ellipse(cx, cy, w * 0.14, h * 0.18, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

      } catch {
        // ImageData security fallback
      }

      // 4. Viewfinder Masking (Letterboxing for target aspect ratio)
      const targetAspect = proSettings.activeAspect || camera.nativeAspect;
      const { width: aspectW, height: aspectH } = getAspectDimensions(targetAspect, w, h);
      const maskX = (w - aspectW) / 2;
      const maskY = (h - aspectH) / 2;

      // Draw dark matte masks outside active aspect frame
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      if (maskX > 0) {
        ctx.fillRect(0, 0, maskX, h);
        ctx.fillRect(w - maskX, 0, maskX, h);
      }
      if (maskY > 0) {
        ctx.fillRect(0, 0, w, maskY);
        ctx.fillRect(0, h - maskY, w, maskY);
      }

      // Border outline of active aspect frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(maskX, maskY, aspectW, aspectH);

      // 5. Framing Grids
      if (proSettings.gridType === 'rule_of_thirds') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        // vertical lines
        ctx.moveTo(maskX + aspectW / 3, maskY);
        ctx.lineTo(maskX + aspectW / 3, maskY + aspectH);
        ctx.moveTo(maskX + (2 * aspectW) / 3, maskY);
        ctx.lineTo(maskX + (2 * aspectW) / 3, maskY + aspectH);
        // horizontal lines
        ctx.moveTo(maskX, maskY + aspectH / 3);
        ctx.lineTo(maskX + aspectW, maskY + aspectH / 3);
        ctx.moveTo(maskX, maskY + (2 * aspectH) / 3);
        ctx.lineTo(maskX + aspectW, maskY + (2 * aspectH) / 3);
        ctx.stroke();
      } else if (proSettings.gridType === 'crosshair' || proSettings.gridType === 'center_spot') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        const cx = maskX + aspectW / 2;
        const cy = maskY + aspectH / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.moveTo(cx - 15, cy);
        ctx.lineTo(cx + 15, cy);
        ctx.moveTo(cx, cy - 15);
        ctx.lineTo(cx, cy + 15);
        ctx.stroke();
      }

      // 6. Camera Specific Vintage Viewfinder HUD Overlays
      renderVintageCameraHUD(ctx, camera, maskX, maskY, aspectW, aspectH, proSettings, timeSec);

      // 7. Focus Tap Box
      if (focusPoint) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(focusPoint.x - 24, focusPoint.y - 24, 48, 48);
        ctx.beginPath();
        ctx.arc(focusPoint.x, focusPoint.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    camera,
    filmStock,
    proSettings,
    testSceneId,
    streamActive,
    focusPoint,
    getAspectDimensions
  ]);

  // Handle Capture Trigger
  useEffect(() => {
    if (shutterTriggerTime > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      const newPhoto: CapturedPhoto = {
        id: `photo_${Date.now()}`,
        dataUrl,
        timestamp: Date.now(),
        cameraProfileId: camera.id,
        cameraName: camera.name,
        filmStockId: filmStock.id,
        filmStockName: filmStock.name,
        lens: camera.signatureLens,
        exif: {
          iso: proSettings.iso,
          shutterSpeed: proSettings.shutterSpeed,
          aperture: `f/${proSettings.aperture.toFixed(1)}`,
          ev: `${proSettings.evCompensation > 0 ? '+' : ''}${proSettings.evCompensation.toFixed(1)} EV`,
          kelvin: proSettings.whiteBalanceK,
          focalLength: camera.signatureLens.split(' ')[1] || '24mm'
        },
        frameBorder: camera.category === 'medium_format' ? 'hasselblad_6x6' : (filmStock.id === 'polaroid_600' ? 'polaroid' : 'vintage_35mm')
      };

      onCaptureFrame(newPhoto);
    }
  }, [shutterTriggerTime, camera, filmStock, proSettings, onCaptureFrame]);

  // Viewport click to focus
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current!.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvasRef.current!.height;
    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 1800);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* Hidden video element for live camera feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="hidden"
      />

      {/* Main Viewfinder Canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={720}
        onClick={handleCanvasClick}
        className="w-full h-full object-contain cursor-crosshair select-none"
      />

      {/* Shutter Flash Animation Overlay */}
      {shutterFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-100" />
      )}

      {/* Camera Housing Metallic Bezel */}
      <div className={`absolute inset-0 pointer-events-none border-2 ${camera.housingStyle.accentBorder} opacity-40`} />

      {/* Watermark / Badge Indicator */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] font-mono tracking-widest text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-md">
          {camera.badgeText}
        </span>
        <span className="text-[10px] font-mono text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
          {filmStock.badge}
        </span>
      </div>

      {/* Real-Time Audio Level VU Meter (Left Margin) */}
      {proSettings.audioMonitor && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-neutral-800">
          <div className="w-1.5 h-24 bg-neutral-900 rounded-full flex flex-col-reverse overflow-hidden p-0.5">
            <div className="w-full bg-emerald-500 rounded-full h-[65%]" />
            <div className="w-full bg-amber-400 rounded-full h-[15%]" />
            <div className="w-full bg-red-500 rounded-full h-[5%]" />
          </div>
          <span className="text-[8px] font-mono text-neutral-400">VU</span>
        </div>
      )}
    </div>
  );
};

/**
 * Renders authentic historical viewfinders for Leica, Hasselblad, Contax, Olympus, Pentax, Nikon, etc.
 */
function renderVintageCameraHUD(
  ctx: CanvasRenderingContext2D,
  camera: CameraProfile,
  mx: number,
  my: number,
  mw: number,
  mh: number,
  settings: ProSettings,
  timeSec: number
) {
  const cx = mx + mw / 2;
  const cy = my + mh / 2;

  ctx.save();

  if (camera.id === 'leica_m3' || camera.id === 'leica_m6') {
    // Leica Rangefinder Viewfinder Overlay
    // Luminous 50mm framelines with corner parallax tick marks
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    const flInsetX = mw * 0.12;
    const flInsetY = mh * 0.12;
    const fx = mx + flInsetX;
    const fy = my + flInsetY;
    const fw = mw - flInsetX * 2;
    const fh = mh - flInsetY * 2;

    // Corner framelines with gap
    const cornerL = 28;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(fx, fy + cornerL);
    ctx.lineTo(fx, fy);
    ctx.lineTo(fx + cornerL, fy);
    // Top-right
    ctx.moveTo(fx + fw - cornerL, fy);
    ctx.lineTo(fx + fw, fy);
    ctx.lineTo(fx + fw, fy + cornerL);
    // Bottom-left
    ctx.moveTo(fx, fy + fh - cornerL);
    ctx.lineTo(fx, fy + fh);
    ctx.lineTo(fx + cornerL, fy + fh);
    // Bottom-right
    ctx.moveTo(fx + fw - cornerL, fy + fh);
    ctx.lineTo(fx + fw, fy + fh);
    ctx.lineTo(fx + fw, fy + fh - cornerL);
    ctx.stroke();

    // Center Rangefinder Coincidence Patch (Ghosted split image square)
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
    ctx.fillRect(cx - 32, cy - 22, 64, 44);
    ctx.strokeRect(cx - 32, cy - 22, 64, 44);

    // Leica M6 LED Exposure Triad (> o <) at bottom of finder
    if (camera.id === 'leica_m6') {
      const ledY = my + mh - 24;
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = settings.evCompensation < -0.3 ? '#ef4444' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillText('◀', cx - 28, ledY);

      ctx.fillStyle = Math.abs(settings.evCompensation) <= 0.3 ? '#ef4444' : 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(cx, ledY - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = settings.evCompensation > 0.3 ? '#ef4444' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillText('▶', cx + 18, ledY);
    }

  } else if (camera.id === 'hasselblad_500cm') {
    // Hasselblad 500C/M Waist-Level Ground Glass Grid & Vignette
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.8;

    // Crosshairs on ground glass
    ctx.beginPath();
    // Center crosshair with micro gap
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx - 5, cy);
    ctx.moveTo(cx + 5, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy - 5);
    ctx.moveTo(cx, cy + 5);
    ctx.lineTo(cx, cy + 20);

    // 10mm grid subdivisions
    for (let i = 1; i < 4; i++) {
      ctx.moveTo(mx + (i * mw) / 4, my + 10);
      ctx.lineTo(mx + (i * mw) / 4, my + 25);
      ctx.moveTo(mx + (i * mw) / 4, my + mh - 25);
      ctx.lineTo(mx + (i * mw) / 4, my + mh - 10);
    }
    ctx.stroke();

    // Chrome corner frame markings
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx + 6, my + 6, mw - 12, mh - 12);

    // Pop-up magnifier loupe indicator
    ctx.fillStyle = 'rgba(14, 165, 233, 0.7)';
    ctx.font = '10px monospace';
    ctx.fillText('6×6 HASSELBLAD WAIST-LEVEL FINDER', mx + 16, my + mh - 16);

  } else if (camera.id === 'pentax_k1000') {
    // Pentax K1000 Microprism Collar & Needle Galvanometer
    // Microprism Center Circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Split circle horizontal line
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy);
    ctx.lineTo(cx + 32, cy);
    ctx.stroke();

    // Analog Needle Light Meter on Right Margin
    const meterX = mx + mw - 18;
    const meterY = cy;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(meterX, meterY - 40);
    ctx.lineTo(meterX, meterY + 40);
    ctx.stroke();

    // + and - tick marks
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('+', meterX - 10, meterY - 35);
    ctx.fillText('–', meterX - 10, meterY + 42);

    // Galvanometer needle moving according to EV compensation
    const needleOffset = Math.max(-35, Math.min(35, -settings.evCompensation * 12));
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(meterX - 14, meterY + needleOffset);
    ctx.lineTo(meterX + 4, meterY + needleOffset);
    ctx.stroke();

  } else if (camera.id === 'olympus_trip_35') {
    // Olympus Trip 35 Selenium Meter & Pop-Up Red Flag
    // Zone focus symbols at bottom (Head 1m, Couple 1.5m, Group 3m, Mountains Inf)
    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px sans-serif';
    ctx.fillText('👤 1m · 👥 1.5m · 👨‍👩‍👦 3m · ⛰️ ∞', cx - 75, my + mh - 16);

    // Red pop-up flag if light is severely underexposed (EV < -1.5)
    if (settings.evCompensation < -1.0) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(cx - 24, my + mh - 55, 48, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('UNDER-EXP', cx - 21, my + mh - 43);
    }

  } else if (camera.id === 'contax_t2') {
    // Contax T2 Luxury Titanium Finder
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx + mw * 0.1, my + mh * 0.1, mw * 0.8, mh * 0.8);

    // Titanium LCD display at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(cx - 60, my + mh - 36, 120, 22);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '11px monospace';
    ctx.fillText(`[ 38mm f/${settings.aperture.toFixed(1)} · S:${settings.shutterSpeed} ]`, cx - 55, my + mh - 21);

  } else if (camera.id === 'canon_ae1') {
    // Canon AE-1 Glowing Red 7-Segment Aperture Readout
    const ledX = mx + mw - 34;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`f${settings.aperture.toFixed(1)}`, ledX - 25, cy);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.font = '10px monospace';
    ctx.fillText('PROGRAM', ledX - 25, cy + 18);

  } else if (camera.id === 'kodak_dcs_100') {
    // Kodak DCS 100 Vintage 1991 Green Monochrome Matrix DSU HUD
    ctx.fillStyle = '#22c55e';
    ctx.font = '11px monospace';
    ctx.fillText('KODAK DCS-100 · 1.3MP CCD BUFFER', mx + 16, my + 24);
    ctx.fillText(`TETHER: 200MB DSU · DISK OK · ISO ${settings.iso}`, mx + 16, my + 40);

  } else if (camera.id === 'sony_a7_iii') {
    // Sony A7 III Eye-AF Green Tracking Box
    const eyeX = cx - 18 + Math.sin(timeSec * 2) * 2;
    const eyeY = cy - 25 + Math.cos(timeSec * 2) * 2;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(eyeX - 16, eyeY - 10, 32, 20);
    ctx.fillStyle = '#22c55e';
    ctx.font = '9px monospace';
    ctx.fillText('EYE-AF', eyeX - 14, eyeY - 14);

  } else if (camera.id === 'nikon_d850') {
    // Nikon D850 153-Point Multi-CAM 20K AF Diamond Grid
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
    ctx.lineWidth = 1;
    for (let r = -2; r <= 2; r++) {
      for (let c = -3; c <= 3; c++) {
        const afX = cx + c * 24;
        const afY = cy + r * 18;
        ctx.strokeRect(afX - 3, afY - 3, 6, 6);
      }
    }
    // Active center AF point (illuminated red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 4, cy - 4, 8, 8);
  }

  ctx.restore();
}
