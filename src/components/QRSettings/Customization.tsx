import React, { useMemo } from 'react';
import type { QRDesignSettings, ErrorCorrectionLevel } from '../../types/qr';
import { Sliders, ShieldCheck, Box, RefreshCw, ArrowLeftRight, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/audio';
import { analyzeContrast } from '../../utils/contrast';

interface CustomizationProps {
  design: QRDesignSettings;
  onChangeDesign: (partial: Partial<QRDesignSettings>) => void;
}

const ERROR_LEVELS: { level: ErrorCorrectionLevel; label: string; desc: string; rate: string; recommendation: string }[] = [
  {
    level: 'L',
    label: 'LOW',
    desc: 'SPEED',
    rate: '7%',
    recommendation: 'Low overhead. Best for dense textual payloads and tiny displays.',
  },
  {
    level: 'M',
    label: 'MED',
    desc: 'BALANCED',
    rate: '15%',
    recommendation: 'Universal standard. Recommended for digital mobile displays & websites.',
  },
  {
    level: 'Q',
    label: 'HIGH',
    desc: 'ROBUST',
    rate: '25%',
    recommendation: 'Robust protection. Ideal for outdoor posters, business cards, and print.',
  },
  {
    level: 'H',
    label: 'MAX',
    desc: 'ARMORED',
    rate: '30%',
    recommendation: 'Armored matrix. Survives up to 30% surface occlusion, logos, tears, or stains.',
  },
];

const COLORWAY_PRESETS = [
  { name: 'Volt & Obsidian', fg: '#e4ff1a', bg: '#08090d' },
  { name: 'Matrix Neon', fg: '#00ff66', bg: '#050b07' },
  { name: 'Cyber Cyan', fg: '#00f0ff', bg: '#060d1a' },
  { name: 'Sunset Flare', fg: '#ff5e00', bg: '#120a05' },
  { name: 'Minimal Paper', fg: '#000000', bg: '#ffffff' },
  { name: 'Neon Velvet', fg: '#ff2a85', bg: '#0e0414' },
];

const SIZE_PRESETS = [
  { label: 'COMPACT', size: 180 },
  { label: 'STUDIO', size: 260 },
  { label: 'POSTER', size: 340 },
  { label: 'ULTRA', size: 420 },
];

export const Customization: React.FC<CustomizationProps> = ({ design, onChangeDesign }) => {
  const contrastAnalysis = useMemo(() => {
    return analyzeContrast(design.fgColor, design.bgColor);
  }, [design.fgColor, design.bgColor]);

  const activeLevelMeta = ERROR_LEVELS.find((e) => e.level === design.level) || ERROR_LEVELS[1];

  const handleSwapColors = () => {
    sound.playSwitch();
    onChangeDesign({
      fgColor: design.bgColor,
      bgColor: design.fgColor,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center font-mono text-[11px] font-bold dark:text-volt text-black uppercase tracking-widest">
          <Sliders className="w-3.5 h-3.5 mr-1 text-volt" />
          [ 03 // MATRIX GEOMETRY & COLOR CHASSIS ]
        </label>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onChangeDesign({ fgColor: '#e4ff1a', bgColor: '#08090d', size: 260, margin: 2, level: 'H' });
          }}
          className="flex items-center space-x-1 font-mono text-[10px] text-slate-400 hover:text-volt transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>RESET SPEC</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* ========================================================================= */}
        {/* 1. COLOR CHASSIS ENGINE */}
        {/* ========================================================================= */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b dark:border-obsidian-800 border-slate-200">
            <span className="font-mono text-[11px] font-bold uppercase dark:text-slate-200 text-slate-800 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-volt" />
              COLOR CHASSIS & OPTICAL SPECTRUM
            </span>
            <button
              type="button"
              onClick={handleSwapColors}
              title="Invert Foreground and Background Colors"
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold dark:bg-obsidian-800 bg-white border dark:border-obsidian-600 border-slate-300 text-slate-700 dark:text-slate-300 hover:border-volt hover:text-volt transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3 h-3 text-volt" />
              <span>SWAP CHASSIS</span>
            </button>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Foreground */}
            <div className="p-3 dark:bg-obsidian-850 bg-white rounded-lg border dark:border-obsidian-700 border-slate-200">
              <label htmlFor="color-fg" className="block font-mono text-[10px] font-bold uppercase dark:text-slate-300 text-slate-700 mb-1.5">
                MODULE COLOR (FG)
              </label>
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/30 shadow-inner flex-shrink-0 cursor-pointer">
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
                  className="w-full px-2.5 py-1.5 dark:bg-obsidian-900 bg-slate-50 border dark:border-obsidian-600 border-slate-300 rounded-lg font-mono text-xs font-bold dark:text-volt text-slate-900 focus:outline-none focus:border-volt"
                />
              </div>
            </div>

            {/* Background */}
            <div className="p-3 dark:bg-obsidian-850 bg-white rounded-lg border dark:border-obsidian-700 border-slate-200">
              <label htmlFor="color-bg" className="block font-mono text-[10px] font-bold uppercase dark:text-slate-300 text-slate-700 mb-1.5">
                CANVAS CHASSIS (BG)
              </label>
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/30 shadow-inner flex-shrink-0 cursor-pointer">
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
                  className="w-full px-2.5 py-1.5 dark:bg-obsidian-900 bg-slate-50 border dark:border-obsidian-600 border-slate-300 rounded-lg font-mono text-xs font-bold dark:text-white text-slate-900 focus:outline-none focus:border-volt"
                />
              </div>
            </div>
          </div>

          {/* Curated Colorway Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              CURATED CHASSIS PALETTES:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {COLORWAY_PRESETS.map((cw) => {
                const isActive = design.fgColor.toLowerCase() === cw.fg.toLowerCase() && design.bgColor.toLowerCase() === cw.bg.toLowerCase();
                return (
                  <button
                    key={cw.name}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onChangeDesign({ fgColor: cw.fg, bgColor: cw.bg });
                    }}
                    className={`flex items-center space-x-1.5 p-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'border-volt bg-volt/10 font-bold text-volt shadow-sm shadow-volt/20'
                        : 'dark:border-obsidian-700 border-slate-300 dark:bg-obsidian-800 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: cw.fg }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: cw.bg }} />
                    </div>
                    <span className="truncate">{cw.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Contrast Meter & Auto-Boost */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-2">
              {contrastAnalysis.score === 'poor' ? (
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              ) : contrastAnalysis.score === 'acceptable' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-matrix shrink-0" />
              )}
              <span className="font-bold">
                CONTRAST: {contrastAnalysis.ratio}:1
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                contrastAnalysis.score === 'poor'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : contrastAnalysis.score === 'acceptable'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-matrix/20 text-matrix border border-matrix/40'
              }`}>
                {contrastAnalysis.score === 'poor' ? 'FAILS WCAG' : contrastAnalysis.score === 'acceptable' ? 'WCAG AA' : 'WCAG AAA'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MATRIX GEOMETRY & RESOLUTION ENGINE */}
        {/* ========================================================================= */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="slider-size" className="font-mono text-[11px] font-bold uppercase dark:text-slate-200 text-slate-800 flex items-center">
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
            className="w-full h-2 bg-slate-300 dark:bg-obsidian-700 rounded-lg appearance-none cursor-pointer dark:accent-volt accent-slate-900"
          />

          {/* Quick Size Presets */}
          <div className="flex items-center justify-between gap-1.5">
            {SIZE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeDesign({ size: p.size });
                }}
                className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  design.size === p.size
                    ? 'bg-volt text-black border-volt font-black'
                    : 'dark:bg-obsidian-800 bg-white dark:border-obsidian-700 border-slate-300 text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {p.label} ({p.size})
              </button>
            ))}
          </div>

          {/* Quiet Zone Border Slider */}
          <div className="pt-3 border-t dark:border-obsidian-800 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-margin" className="font-mono text-[11px] font-bold uppercase dark:text-slate-300 text-slate-700">
                QUIET ZONE BORDER (ISO/IEC 18004)
              </label>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded dark:bg-obsidian-800 bg-slate-200 dark:text-white text-black">
                  {design.margin} BLOCKS
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-matrix/20 text-matrix font-bold">
                  {design.margin >= 4 ? 'ISO CERTIFIED' : design.margin >= 2 ? 'MODERN OPTICAL' : 'TIGHT BOUNDARY'}
                </span>
              </div>
            </div>

            <input
              id="slider-margin"
              type="range"
              min={0}
              max={6}
              step={1}
              value={design.margin}
              onChange={(e) => onChangeDesign({ margin: Number(e.target.value) })}
              className="w-full h-2 bg-slate-300 dark:bg-obsidian-700 rounded-lg appearance-none cursor-pointer dark:accent-volt accent-slate-900"
            />
            <p className="font-mono text-[10px] text-slate-400">
              ISO/IEC 18004 specifies a minimum 4-module quiet zone for hardware scanners; 2 modules is standard for smartphone cameras.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. REED-SOLOMON ERROR RECOVERY (ECC) ENGINE */}
        {/* ========================================================================= */}
        <div className="p-4 dark:bg-obsidian-900 bg-slate-50 rounded-xl border-2 dark:border-obsidian-700 border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] font-bold uppercase dark:text-slate-200 text-slate-800 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-volt" />
              REED-SOLOMON ERROR RECOVERY (ECC)
            </label>
            <span className="font-mono text-xs font-black text-matrix">
              {activeLevelMeta.rate} DAMAGE RESTORATION
            </span>
          </div>

          {/* Live Capacity Recovery Bar */}
          <div className="w-full bg-slate-200 dark:bg-obsidian-800 rounded-full h-2 overflow-hidden border dark:border-obsidian-700 border-slate-300">
            <div
              className="h-full bg-gradient-to-r from-matrix via-volt to-matrix transition-all duration-300"
              style={{
                width: design.level === 'L' ? '23%' : design.level === 'M' ? '50%' : design.level === 'Q' ? '83%' : '100%',
              }}
            />
          </div>

          {/* Level Switcher Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ERROR_LEVELS.map(({ level, label, rate, desc }) => (
              <button
                key={level}
                id={`btn-ecc-${level.toLowerCase()}`}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeDesign({ level });
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 font-mono transition-all cursor-pointer ${
                  design.level === level
                    ? 'bg-volt text-black border-volt shadow-md shadow-volt/20 scale-[1.02] font-black'
                    : 'dark:bg-obsidian-800 bg-white dark:border-obsidian-600 border-slate-300 dark:text-slate-300 text-slate-700 hover:border-volt'
                }`}
              >
                <span className="font-extrabold text-sm">{level}</span>
                <span className="text-[9px] font-bold">{label}</span>
                <span className="text-[8px] opacity-80">{rate} ({desc})</span>
              </button>
            ))}
          </div>

          {/* Contextual Recommendation Callout */}
          <div className="p-2.5 rounded-lg dark:bg-obsidian-800/80 bg-white border dark:border-obsidian-700 border-slate-200 text-[11px] font-mono text-slate-400">
            <span className="text-volt font-bold uppercase mr-1">LEVEL {design.level}:</span>
            <span>{activeLevelMeta.recommendation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
