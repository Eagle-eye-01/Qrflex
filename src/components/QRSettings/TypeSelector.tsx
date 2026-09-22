import React from 'react';
import type { QRType } from '../../types/qr';
import { Globe, FileText, Mail, Phone, MessageSquare, Wifi } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TypeSelectorProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
}

const TYPE_OPTIONS: { id: QRType; label: string; badge: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', badge: '01', icon: <Globe className="w-4 h-4" /> },
  { id: 'text', label: 'TEXT', badge: '02', icon: <FileText className="w-4 h-4" /> },
  { id: 'email', label: 'EMAIL', badge: '03', icon: <Mail className="w-4 h-4" /> },
  { id: 'phone', label: 'PHONE', badge: '04', icon: <Phone className="w-4 h-4" /> },
  { id: 'sms', label: 'SMS', badge: '05', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'wifi', label: 'WI-FI', badge: '06', icon: <Wifi className="w-4 h-4" /> },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onChangeType }) => {
  return (
    <div className="w-full">
      {/* Header Label */}
      <div className="flex items-center justify-between mb-2.5">
        <label className="flex items-center font-mono text-[11px] font-bold dark:text-volt text-black uppercase tracking-widest">
          [ 01 // SELECT PROTOCOL TYPE ]
        </label>
        <span className="font-mono text-[10px] text-slate-400">6 CORE RFC & ZXING PROTOCOLS</span>
      </div>

      {/* 6-Protocol High-Legibility Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl dark:bg-obsidian-900/90 bg-slate-100 border-2 dark:border-obsidian-700 border-slate-300 shadow-inner">
        {TYPE_OPTIONS.map((option) => {
          const isActive = option.id === currentType;
          return (
            <button
              key={option.id}
              id={`btn-type-${option.id}`}
              type="button"
              onClick={() => {
                sound.playSwitch();
                onChangeType(option.id);
              }}
              className={`relative py-3 px-2 flex items-center justify-center space-x-2 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 select-none cursor-pointer border ${
                isActive
                  ? 'bg-volt text-black border-volt shadow-lg shadow-volt/30 scale-[1.03] font-black'
                  : 'dark:bg-obsidian-850 bg-white dark:border-obsidian-700/80 border-slate-200/90 dark:text-slate-300 text-slate-700 hover:border-slate-400 dark:hover:border-obsidian-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-black' : 'text-volt'}`}>
                {option.icon}
              </span>
              <span className="font-extrabold tracking-wide">{option.label}</span>
              <span
                className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'bg-black text-volt'
                    : 'dark:bg-obsidian-750 bg-slate-200 dark:text-slate-400 text-slate-500'
                }`}
              >
                {option.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
