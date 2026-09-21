import React from 'react';
import { sound } from '../utils/audio';

interface Option<T> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface LiquidGlassToggleProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function LiquidGlassToggle<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: LiquidGlassToggleProps<T>) {
  const activeIndex = options.findIndex((opt) => opt.id === value);
  const widthPercent = 100 / options.length;

  return (
    <div
      className={`relative p-1 rounded-2xl dark:bg-obsidian-900/80 bg-slate-200/80 border-2 dark:border-obsidian-700 border-slate-300 backdrop-blur-xl flex items-center shadow-inner ${className}`}
    >
      {/* Gliding Liquid Glass Spring Indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-xl bg-volt text-black shadow-lg shadow-volt/20 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: `calc(${widthPercent}% - 4px)`,
          left: `calc(${activeIndex * widthPercent}% + 2px)`,
        }}
      >
        {/* Internal liquid glass shine */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 via-transparent to-white/40 opacity-80" />
      </div>

      {/* Options */}
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              sound.playSwitch();
              onChange(option.id);
            }}
            className={`relative z-10 flex-1 py-2 px-3 flex items-center justify-center space-x-1.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-colors duration-150 select-none cursor-pointer ${
              isActive
                ? 'text-black font-extrabold'
                : 'dark:text-slate-400 text-slate-600 hover:text-black dark:hover:text-white'
            }`}
          >
            {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded ml-1 ${
                  isActive ? 'dark:bg-black dark:text-volt bg-white text-slate-900 shadow-sm border border-slate-300 dark:border-transparent' : 'dark:bg-obsidian-700 bg-slate-300 dark:text-slate-300 text-slate-700'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
