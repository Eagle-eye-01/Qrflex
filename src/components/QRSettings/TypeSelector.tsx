import React from 'react';
import type { QRType } from '../../types/qr';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';

interface TypeSelectorProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onChangeType }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">
        Select QR Code Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 dark:bg-slate-900/90 bg-slate-100 rounded-2xl border dark:border-slate-800/80 border-slate-200">
        {TYPES.map(({ id, label, icon: Icon }) => {
          const isActive = currentType === id;
          return (
            <button
              key={id}
              id={`tab-qr-type-${id}`}
              type="button"
              onClick={() => onChangeType(id)}
              className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
