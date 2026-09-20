import React from 'react';
import type { QRDesignSettings, ErrorCorrectionLevel } from '../../types/qr';
import { Sliders, Palette, ShieldCheck, Box } from 'lucide-react';

interface CustomizationProps {
  design: QRDesignSettings;
  onChangeDesign: (partial: Partial<QRDesignSettings>) => void;
}

const ERROR_LEVELS: { level: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { level: 'L', label: 'L', desc: '7% recovery' },
  { level: 'M', label: 'M', desc: '15% recovery' },
  { level: 'Q', label: 'Q', desc: '25% recovery' },
  { level: 'H', label: 'H', desc: '30% recovery' },
];

export const Customization: React.FC<CustomizationProps> = ({ design, onChangeDesign }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-2">
        <Sliders className="w-4 h-4 text-purple-500 dark:text-purple-400" />
        <h3 className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
          Design & Output Controls
        </h3>
      </div>

      <div className="space-y-4">
        {/* Colors (Foreground and Background) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium dark:text-slate-300 text-slate-700 flex items-center">
              <Palette className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
              Colors
            </span>
            <button
              type="button"
              onClick={() => onChangeDesign({ fgColor: '#000000', bgColor: '#ffffff' })}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
            >
              Reset to default
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Foreground */}
            <div className="p-3 dark:bg-slate-900/80 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
              <label htmlFor="color-fg" className="block text-xs dark:text-slate-400 text-slate-600 mb-1.5 font-medium">
                Foreground (QR Modules)
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner flex-shrink-0">
                  <input
                    id="color-fg"
                    type="color"
                    value={design.fgColor}
                    onChange={(e) => onChangeDesign({ fgColor: e.target.value })}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-100"
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
                  className="w-full px-2.5 py-1.5 dark:bg-slate-950/80 bg-white border dark:border-slate-800 border-slate-200 rounded-lg text-xs font-mono dark:text-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Background */}
            <div className="p-3 dark:bg-slate-900/80 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
              <label htmlFor="color-bg" className="block text-xs dark:text-slate-400 text-slate-600 mb-1.5 font-medium">
                Background Canvas
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner flex-shrink-0">
                  <input
                    id="color-bg"
                    type="color"
                    value={design.bgColor}
                    onChange={(e) => onChangeDesign({ bgColor: e.target.value })}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-100"
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
                  className="w-full px-2.5 py-1.5 dark:bg-slate-950/80 bg-white border dark:border-slate-800 border-slate-200 rounded-lg text-xs font-mono dark:text-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size Slider */}
        <div className="p-3.5 dark:bg-slate-900/80 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="slider-size" className="text-sm font-medium dark:text-slate-300 text-slate-700 flex items-center">
              <Box className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
              Dimensions / Size
            </label>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded dark:bg-purple-950/60 dark:border-purple-500/30 dark:text-purple-300 bg-purple-100 border border-purple-200 text-purple-700">
              {design.size}px × {design.size}px
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
            className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Compact (160px)</span>
            <span>Standard (260px)</span>
            <span>Poster (420px)</span>
          </div>
        </div>

        {/* Margin / Quiet Zone */}
        <div className="p-3.5 dark:bg-slate-900/80 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="slider-margin" className="text-sm font-medium dark:text-slate-300 text-slate-700">
              Quiet Zone Margin
            </label>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700">
              {design.margin} blocks
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
            className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-[11px] text-slate-500">
            ISO standard recommends at least 2 blocks of quiet margin around the QR code.
          </p>
        </div>

        {/* Error Correction Level */}
        <div className="p-3.5 dark:bg-slate-900/80 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium dark:text-slate-300 text-slate-700 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
              Error Correction Level
            </label>
            <span className="text-[11px] text-slate-500">
              {ERROR_LEVELS.find((e) => e.level === design.level)?.desc}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ERROR_LEVELS.map(({ level, label, desc }) => (
              <button
                key={level}
                id={`btn-ecc-${level.toLowerCase()}`}
                type="button"
                onClick={() => onChangeDesign({ level })}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                  design.level === level
                    ? 'dark:bg-purple-600/30 dark:border-purple-500 text-purple-700 dark:text-white bg-purple-50 border-purple-400 shadow-sm'
                    : 'dark:bg-slate-950/60 dark:border-slate-800 bg-white border-slate-200 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-sm">{label}</span>
                <span className="text-[9px] opacity-70">{desc.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Higher levels allow scanning even if partially obscured, soiled, or printed on textured surfaces.
          </p>
        </div>
      </div>
    </div>
  );
};
