import React from 'react';
import type { Preset, QRDesignSettings } from '../../types/qr';
import { Sparkles, Check } from 'lucide-react';

export const PRESETS: Preset[] = [
  {
    id: 'classic-mono',
    name: 'Classic Mono',
    badge: '100% Reliable',
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    margin: 2,
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    badge: 'Fresh & Crisp',
    fgColor: '#047857',
    bgColor: '#f0fdf4',
    level: 'Q',
    margin: 2,
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    badge: 'Dark Modern',
    fgColor: '#a855f7',
    bgColor: '#0f172a',
    level: 'H',
    margin: 3,
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    badge: 'Corporate Tech',
    fgColor: '#3730a3',
    bgColor: '#f8fafc',
    level: 'M',
    margin: 2,
  },
];

interface PresetsProps {
  currentDesign: QRDesignSettings;
  onSelectPreset: (preset: Preset) => void;
}

export const Presets: React.FC<PresetsProps> = ({ currentDesign, onSelectPreset }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
          Style Presets
        </label>
        <span className="text-[11px] dark:text-slate-500 text-slate-400">Instant templates</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PRESETS.map((preset) => {
          const isSelected =
            currentDesign.fgColor.toLowerCase() === preset.fgColor.toLowerCase() &&
            currentDesign.bgColor.toLowerCase() === preset.bgColor.toLowerCase();

          return (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'dark:bg-purple-600/15 bg-purple-50 border-purple-500 shadow-sm shadow-purple-500/10'
                  : 'dark:bg-slate-900/60 bg-slate-50 dark:border-slate-800 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              {/* Color swatch pill preview */}
              <div className="flex items-center space-x-1.5 mb-2">
                <div
                  className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700/50 shadow-inner flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: preset.bgColor, color: preset.fgColor }}
                >
                  ■
                </div>
                <div
                  className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700/50 shadow-inner"
                  style={{ backgroundColor: preset.fgColor }}
                />
                {isSelected && (
                  <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-purple-600 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="font-semibold text-xs dark:text-slate-200 text-slate-800 group-hover:text-purple-600 dark:group-hover:text-white truncate">
                {preset.name}
              </div>
              <div className="text-[10px] dark:text-slate-400 text-slate-500 truncate">{preset.badge}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
