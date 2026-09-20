import React from 'react';
import type { Preset, QRDesignSettings } from '../../types/qr';
import { Check, Zap } from 'lucide-react';
import { sound } from '../../utils/audio';

export const PRESETS: Preset[] = [
  {
    id: 'lando-volt',
    name: 'LANDO VOLT',
    badge: 'RACING NEON',
    fgColor: '#e4ff1a',
    bgColor: '#090a0f',
    level: 'H',
    margin: 3,
  },
  {
    id: 'mana-mate',
    name: 'MANA MATÉ',
    badge: 'ORGANIC CRAFT',
    fgColor: '#0f381e',
    bgColor: '#f5f6e8',
    level: 'Q',
    margin: 2,
  },
  {
    id: 'cyber-matrix',
    name: 'CYBER MATRIX',
    badge: 'MATRIX GREEN',
    fgColor: '#00ff88',
    bgColor: '#04080e',
    level: 'H',
    margin: 3,
  },
  {
    id: 'editorial-mono',
    name: 'EDITORIAL MONO',
    badge: '100% RELIABLE',
    fgColor: '#000000',
    bgColor: '#ffffff',
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
        <label className="flex items-center font-mono text-[11px] font-bold dark:text-volt text-black uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 mr-1 text-volt fill-volt" />
          [ 02 // CURATED STYLE DNA ]
        </label>
        <span className="font-mono text-[10px] text-slate-400">AWWWARDS GRADE</span>
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
              onClick={() => {
                sound.playClick();
                onSelectPreset(preset);
              }}
              className={`group relative p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? 'dark:bg-obsidian-900 bg-volt/10 border-volt shadow-lg shadow-volt/15 scale-[1.02]'
                  : 'dark:bg-obsidian-900/70 bg-slate-50 dark:border-obsidian-700 border-slate-300 hover:border-volt hover:scale-[1.01]'
              }`}
            >
              {/* Color swatch pill preview */}
              <div className="flex items-center space-x-1.5 mb-2.5">
                <div
                  className="w-5 h-5 rounded border border-black/20 shadow-inner flex items-center justify-center text-[9px] font-black"
                  style={{ backgroundColor: preset.bgColor, color: preset.fgColor }}
                >
                  ■
                </div>
                <div
                  className="w-5 h-5 rounded border border-black/20 shadow-inner"
                  style={{ backgroundColor: preset.fgColor }}
                />
                {isSelected && (
                  <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-volt text-black font-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="font-display font-extrabold text-xs dark:text-white text-slate-950 group-hover:text-volt truncate">
                {preset.name}
              </div>
              <div className="font-mono text-[9px] font-bold text-slate-400 tracking-wider mt-0.5 truncate">
                {preset.badge}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
