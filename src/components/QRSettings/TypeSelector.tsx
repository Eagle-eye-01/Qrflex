import React from 'react';
import type { QRType } from '../../types/qr';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TypeSelectorProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; code: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'URL', code: '01', icon: Globe },
  { id: 'text', label: 'TEXT', code: '02', icon: FileText },
  { id: 'email', label: 'EMAIL', code: '03', icon: Mail },
  { id: 'phone', label: 'PHONE', code: '04', icon: Phone },
  { id: 'wifi', label: 'WI-FI', code: '05', icon: Wifi },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onChangeType }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center font-mono text-[11px] font-bold dark:text-volt text-black uppercase tracking-widest">
          [ 01 // SELECT PROTOCOL TYPE ]
        </label>
        <span className="font-mono text-[10px] text-slate-400">RFC STANDARDS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 dark:bg-obsidian-900 bg-slate-100 rounded-xl border-2 dark:border-obsidian-700 border-slate-300">
        {TYPES.map(({ id, label, code, icon: Icon }) => {
          const isActive = currentType === id;
          return (
            <button
              key={id}
              id={`tab-qr-type-${id}`}
              type="button"
              onClick={() => {
                sound.playSwitch();
                onChangeType(id);
              }}
              className={`relative flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 py-2.5 px-3 rounded-lg font-mono text-xs font-bold tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-volt text-black shadow-lg shadow-volt/20 scale-[1.02]'
                  : 'dark:text-slate-400 text-slate-600 hover:text-black dark:hover:text-white dark:hover:bg-obsidian-700 hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{label}</span>
              <span className={`text-[9px] font-black opacity-60 ml-0.5 ${isActive ? 'text-black' : 'dark:text-volt text-slate-500'}`}>
                {code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
