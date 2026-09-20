import React from 'react';
import type { QRType } from '../../types/qr';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { LiquidGlassToggle } from '../LiquidGlassToggle';

interface TypeSelectorProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
}

const TYPE_OPTIONS: { id: QRType; label: string; badge: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', badge: '01', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'text', label: 'TEXT', badge: '02', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'email', label: 'EMAIL', badge: '03', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'phone', label: 'PHONE', badge: '04', icon: <Phone className="w-3.5 h-3.5" /> },
  { id: 'wifi', label: 'WI-FI', badge: '05', icon: <Wifi className="w-3.5 h-3.5" /> },
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

      <LiquidGlassToggle<QRType>
        options={TYPE_OPTIONS}
        value={currentType}
        onChange={onChangeType}
        className="w-full"
      />
    </div>
  );
};
