import React from 'react';
import type { QRDesignSettings, ErrorCorrectionLevel } from '../../types/qr';
import { Sliders, ShieldCheck, Box, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CustomizationProps {
  design: QRDesignSettings;
  onChangeDesign: (partial: Partial<QRDesignSettings>) => void;
}

const ERROR_LEVELS: { level: ErrorCorrectionLevel; label: string; desc: string; rate: string }[] = [
  { level: 'L', label: 'LOW', desc: 'SPEED', rate: '7%' },
  { level: 'M', label: 'MED', desc: 'BALANCED', rate: '15%' },
  { level: 'Q', label: 'HIGH', desc: 'ROBUST', rate: '25%' },
  { level: 'H', label: 'MAX', desc: 'ARMORED', rate: '30%' },
];

export const Customization: React.FC<CustomizationProps> = ({ design, onChangeDesign }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="flex items-center font-mono text-[11px] font-bold dark:text-volt text-black uppercase tracking-widest">
          <Sliders className="w-3.5 h-3.5 mr-1 text-volt" />
          [ 03 // MATRIX GEOMETRY & COLOR CHASSIS ]
        </label>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onChangeDesign({ fgColor: '#000000', bgColor: '#ffffff', size: 260, margin: 2, level: 'M' });
          }}
          className="flex items-center space-x-1 font-mono text-[10px] text-slate-400 hover:text-volt transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>RESET SPEC</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Colors (Foreground and Background) */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {/* Foreground */}
            <div className="p-3.5 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300">
              <label htmlFor="color-fg" className="block font-mono text-[10px] font-bold uppercase dark:text-slate-300 text-slate-700 mb-1.5">
                MODULE COLOR (FG)
              </label>
              <div className="flex items-center space-x-2.5">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-black/30 shadow-inner flex-shrink-0 cursor-pointer">
                  <input
                    id="color-fg"
                    type="color"
                    value={design.fgColor}
                    onChange={(e) => onChangeDesign({ fgColor: e.target.value })}
                    className="absolute -inset-2 w-14 h-14 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={design.fgColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                    onChangeDesign({ fgColor: val });
                  }}
                  maxLength={7}
                  className="w-full px-2.5 py-2 dark:bg-obsidian-800 bg-white border dark:border-obsidian-600 border-slate-300 rounded-lg font-mono text-xs font-bold dark:text-volt text-slate-900 focus:outline-none focus:border-volt"
                />
              </div>
            </div>

            {/* Background */}
            <div className="p-3.5 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300">
              <label htmlFor="color-bg" className="block font-mono text-[10px] font-bold uppercase dark:text-slate-300 text-slate-700 mb-1.5">
                CANVAS CHASSIS (BG)
              </label>
              <div className="flex items-center space-x-2.5">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-black/30 shadow-inner flex-shrink-0 cursor-pointer">
                  <input
                    id="color-bg"
                    type="color"
                    value={design.bgColor}
                    onChange={(e) => onChangeDesign({ bgColor: e.target.value })}
                    className="absolute -inset-2 w-14 h-14 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={design.bgColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                    onChangeDesign({ bgColor: val });
                  }}
                  maxLength={7}
                  className="w-full px-2.5 py-2 dark:bg-obsidian-800 bg-white border dark:border-obsidian-600 border-slate-300 rounded-lg font-mono text-xs font-bold dark:text-white text-slate-900 focus:outline-none focus:border-volt"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size Slider */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="slider-size" className="font-mono text-[11px] font-bold uppercase dark:text-slate-300 text-slate-700 flex items-center">
              <Box className="w-3.5 h-3.5 mr-1.5 text-volt" />
              MATRIX DIMENSIONS (PIXELS)
            </label>
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-black text-volt border border-volt/40">
              {design.size} &times; {design.size} PX
            </span>
          </div>
          <input
            id="slider-size"
            type="range"
            min={160}
            max={420}
            step={10}
            value={design.size}
            onChange={(e) => onChangeDesign({ size: Number(e.target.value) })}
            className="w-full h-2 bg-slate-300 dark:bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-volt"
          />
          <div className="flex justify-between font-mono text-[10px] text-slate-400">
            <span>COMPACT (160)</span>
            <span>STANDARD (260)</span>
            <span>ULTRA-HD (420)</span>
          </div>
        </div>

        {/* Margin / Quiet Zone */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="slider-margin" className="font-mono text-[11px] font-bold uppercase dark:text-slate-300 text-slate-700">
              QUIET ZONE BORDER (ISO STANDARD)
            </label>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded dark:bg-obsidian-800 bg-slate-200 dark:text-white text-black">
              {design.margin} BLOCKS
            </span>
          </div>
          <input
            id="slider-margin"
            type="range"
            min={0}
            max={6}
            step={1}
            value={design.margin}
            onChange={(e) => onChangeDesign({ margin: Number(e.target.value) })}
            className="w-full h-2 bg-slate-300 dark:bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-volt"
          />
          <p className="font-mono text-[10px] text-slate-400">
            Standard barcode reader optics mandate a minimum 2-block clear quiet boundary.
          </p>
        </div>

        {/* Error Correction Level */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] font-bold uppercase dark:text-slate-300 text-slate-700 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-volt" />
              REED-SOLOMON ERROR RECOVERY (ECC)
            </label>
            <span className="font-mono text-[10px] font-bold text-matrix">
              {ERROR_LEVELS.find((e) => e.level === design.level)?.rate} RESTORATION
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ERROR_LEVELS.map(({ level, label, rate }) => (
              <button
                key={level}
                id={`btn-ecc-${level.toLowerCase()}`}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeDesign({ level });
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 font-mono transition-all ${
                  design.level === level
                    ? 'bg-volt text-black border-volt shadow-md shadow-volt/20 scale-[1.02] font-black'
                    : 'dark:bg-obsidian-800 bg-white dark:border-obsidian-600 border-slate-300 dark:text-slate-300 text-slate-700 hover:border-volt'
                }`}
              >
                <span className="font-extrabold text-sm">{level}</span>
                <span className="text-[9px] font-bold">{label}</span>
                <span className="text-[8px] opacity-75">{rate}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
