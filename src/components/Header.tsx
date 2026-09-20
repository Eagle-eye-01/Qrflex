import React from 'react';
import { QrCode, History, Sun, Moon, Sparkles } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md border-b dark:border-slate-800/80 border-slate-200/80 dark:bg-slate-950/75 bg-white/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="h-full w-full dark:bg-slate-950 bg-white rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 dark:from-purple-400 dark:via-purple-200 dark:to-emerald-400 bg-clip-text text-transparent">
                QRFlex
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 bg-purple-50 border border-purple-200 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1 text-emerald-500" /> Pro Studio
              </span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-500 hidden sm:block">
              Professional QR Code Generator & Designer
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* History Drawer Button */}
          <button
            id="btn-toggle-history"
            onClick={onToggleHistory}
            className={`relative inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              isHistoryOpen
                ? 'dark:bg-purple-600/20 dark:border-purple-500 dark:text-purple-300 bg-purple-50 border-purple-400 text-purple-700 shadow-sm shadow-purple-500/10'
                : 'dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Recent QR Codes"
          >
            <History className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="hidden md:inline">Recent</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 bg-emerald-50 text-emerald-700 border border-emerald-300">
                {historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600 transition-transform -rotate-12 hover:rotate-0 duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
