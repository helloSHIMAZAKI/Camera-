import React, { useState } from 'react';
import { FilmStock, FilmCategory } from '../types/camera';
import { FILM_STOCK_LIST } from '../utils/filmProfiles';
import { Film, Check, Eye } from 'lucide-react';

interface FilmStockSelectorProps {
  currentFilmStockId: string;
  onSelectFilmStock: (filmStock: FilmStock) => void;
  onClose?: () => void;
}

export const FilmStockSelector: React.FC<FilmStockSelectorProps> = ({
  currentFilmStockId,
  onSelectFilmStock,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilmCategory | 'all'>('all');

  const categories: { id: FilmCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Film Stocks' },
    { id: 'color_negative', label: 'Color Negative' },
    { id: 'color_reversal_slide', label: 'Slide / E-6' },
    { id: 'black_and_white', label: 'Monochrome B&W' },
    { id: 'instant', label: 'Cinema & Instant' }
  ];

  const filteredStocks = selectedCategory === 'all'
    ? FILM_STOCK_LIST
    : FILM_STOCK_LIST.filter(s => s.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-l border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-600/20 text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Analog Film Emulation</h2>
            <p className="text-[11px] text-neutral-400">Chemical Color Grading, Grain & Halation</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close film selector"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-2.5 border-b border-neutral-800 bg-neutral-900/40 overflow-x-auto shrink-0">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Film Stocks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredStocks.map(stock => {
          const isSelected = stock.id === currentFilmStockId;
          const [r, g, b] = stock.colorMatrix.map(v => Math.round(v * 128));

          return (
            <div
              key={stock.id}
              onClick={() => onSelectFilmStock(stock)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                      {stock.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                      ISO {stock.iso}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> LOADED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {stock.tagline}
                  </p>

                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {stock.description}
                  </p>
                </div>

                {/* Film Strip Swatch & DX Code */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  <div
                    className="w-12 h-8 rounded border border-neutral-700 flex items-center justify-center overflow-hidden shadow-inner"
                    style={{
                      background: stock.saturation === 0
                        ? 'linear-gradient(135deg, #222, #777, #fff)'
                        : `linear-gradient(135deg, rgb(${r},${g},${b}), #222)`
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold text-white/90 drop-shadow">
                      {stock.brand.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-neutral-500">
                    DX: {stock.dxCode}
                  </span>
                </div>
              </div>

              {/* Film Characteristics Metrics */}
              <div className="mt-2.5 pt-2 border-t border-neutral-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-neutral-400">
                <div>
                  <span className="text-neutral-500">Grain: </span>
                  <span className="text-neutral-300">
                    {stock.grainIntensity < 0.2 ? 'Ultra-Fine' : (stock.grainIntensity < 0.4 ? 'Organic' : 'Pronounced')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">Contrast: </span>
                  <span className="text-neutral-300">
                    {stock.contrast > 1.2 ? 'Punchy' : (stock.contrast < 1.0 ? 'Soft' : 'Balanced')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">Halation: </span>
                  <span className={stock.highlightBloom > 0.4 ? 'text-red-400 font-semibold' : 'text-neutral-300'}>
                    {stock.highlightBloom > 0.4 ? 'Crimson Glow' : (stock.highlightBloom > 0.15 ? 'Subtle Bloom' : 'Crisp')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
