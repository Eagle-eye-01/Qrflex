import React, { useState } from 'react';
import { QrCode, History, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  historyCount: number;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  historyCount,
  onToggleHistory,
  isHistoryOpen,
}) => {
  const [sfxEnabled, setSfxEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sfxEnabled;
    setSfxEnabled(!sfxEnabled);
    if (!sfxEnabled) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b dark:border-obsidian-700/80 border-slate-200/90 dark:bg-obsidian-900/90 bg-white/90 backdrop-blur-2xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group cursor-pointer">
            <div className="h-11 w-11 rounded-lg bg-volt p-0.5 shadow-lg shadow-volt/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="h-full w-full bg-black rounded-[6px] flex items-center justify-center">
                <QrCode className="w-6 h-6 text-volt transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-matrix"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tight dark:text-white text-slate-950 uppercase">
                QRFLEX<span className="text-volt">.</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase dark:bg-obsidian-700 dark:text-volt bg-slate-900 text-volt border dark:border-obsidian-600 border-black shadow-sm">
                STUDIO v2.5
              </span>
            </div>
            <p className="text-[11px] font-mono tracking-wider uppercase dark:text-slate-400 text-slate-500 hidden sm:block">
              HIGH-OCTANE VECTOR QR ENGINE &bull; OFF-BRAND SPEC
            </p>
          </div>
        </div>

        {/* Right: Studio Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* SFX Audio Toggle with Dancing Waveform */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
              sfxEnabled
                ? 'dark:border-volt/40 border-volt dark:bg-volt/10 bg-volt/20 text-slate-900 dark:text-volt shadow-sm shadow-volt/10'
                : 'dark:border-obsidian-700 border-slate-300 dark:text-slate-500 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={sfxEnabled ? 'Tactile Sound: Active' : 'Tactile Sound: Muted'}
          >
            {sfxEnabled ? (
              <div className="flex items-center space-x-1">
                <Volume2 className="w-3.5 h-3.5 text-volt" />
                {/* Dancing Equalizer Audio Bars */}
                <div className="flex items-end space-x-0.5 h-3.5 px-0.5">
                  <span className="w-0.5 bg-volt rounded-full animate-sound-bar-1 inline-block" />
                  <span className="w-0.5 bg-matrix rounded-full animate-sound-bar-2 inline-block" />
                  <span className="w-0.5 bg-volt rounded-full animate-sound-bar-3 inline-block" />
                </div>
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline font-mono text-[11px] font-bold">{sfxEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          {/* History Drawer Button */}
          <button
            id="btn-toggle-history"
            onClick={() => {
              sound.playSwitch();
              onToggleHistory();
            }}
            className={`relative inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all duration-200 ${
              isHistoryOpen
                ? 'bg-volt text-black border-volt shadow-lg shadow-volt/20 font-extrabold scale-[1.02]'
                : 'dark:border-obsidian-700 dark:text-slate-300 dark:hover:bg-obsidian-800 border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RECENTS</span>
            {historyCount > 0 && (
              <span className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[10px] font-mono font-black ${
                isHistoryOpen ? 'bg-black text-volt' : 'bg-volt text-black'
              }`}>
                {historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={() => {
              sound.playClick();
              onToggleDarkMode();
            }}
            className="p-2.5 rounded-lg border dark:border-obsidian-700 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:bg-obsidian-800 hover:bg-slate-200 transition-all focus:outline-none cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-volt transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-900 transition-transform -rotate-12 hover:rotate-0 duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
