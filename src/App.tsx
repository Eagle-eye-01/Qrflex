import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { QRType, AllFormData, QRDesignSettings, Preset, HistoryItem } from './types/qr';
import { buildQRPayload, getPayloadDisplaySummary } from './utils/qrPayload';
import { validateForm } from './utils/validation';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { QRSettings } from './components/QRSettings/QRSettings';
import { QRPreview } from './components/QRPreview/QRPreview';
import { QRHistory } from './components/QRHistory/QRHistory';
import { Zap, ShieldCheck, Activity } from 'lucide-react';

const STORAGE_HISTORY_KEY = 'qrflex_history_v2';
const STORAGE_THEME_KEY = 'qrflex_theme_v2';

const INITIAL_FORM_DATA: AllFormData = {
  url: { url: 'https://landonorris.com' },
  text: { text: 'QRFLEX // HIGH-OCTANE VECTOR QR ENGINE // OFF-BRAND SPEC' },
  email: { email: 'contact@offbrand.io', subject: 'Collaboration Inquiry', body: 'Let us build something incredible.' },
  phone: { phone: '+1 555 019 2834' },
  wifi: { ssid: 'LANDO_PITLANE_5G', password: 'racingvoltpassword', encryption: 'WPA', hidden: false },
};

const DEFAULT_DESIGN: QRDesignSettings = {
  size: 260,
  fgColor: '#e4ff1a',
  bgColor: '#090a0f',
  level: 'H',
  margin: 2,
};

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return true; // Default to sleek Lando/Mana dark aesthetic
  });

  // App core state
  const [currentType, setCurrentType] = useState<QRType>('url');
  const [formData, setFormData] = useState<AllFormData>(INITIAL_FORM_DATA);
  const [design, setDesign] = useState<QRDesignSettings>(DEFAULT_DESIGN);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Synchronize history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to persist history to localStorage', err);
    }
  }, [history]);

  // Form validation
  const errors = useMemo(() => {
    return validateForm(currentType, formData);
  }, [currentType, formData]);

  const hasErrors = Object.keys(errors).length > 0;

  // Real-time payload generation
  const payload = useMemo(() => {
    if (hasErrors) return '';
    return buildQRPayload(currentType, formData);
  }, [currentType, formData, hasErrors]);

  // Auto-save debouncer for history
  const lastSavedPayloadRef = useRef<string>('');
  useEffect(() => {
    if (!payload || hasErrors) return;

    const timer = setTimeout(() => {
      if (lastSavedPayloadRef.current === payload) return;

      const title = getPayloadDisplaySummary(currentType, formData);
      const newItem: HistoryItem = {
        id: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        type: currentType,
        title,
        payload,
        formData: JSON.parse(JSON.stringify(formData[currentType])),
        design: { ...design },
      };

      lastSavedPayloadRef.current = payload;

      setHistory((prev) => {
        const filtered = prev.filter((p) => p.payload !== payload);
        return [newItem, ...filtered].slice(0, 20);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [payload, hasErrors, currentType, formData, design]);

  // Handlers
  const handleFormDataChange = (type: QRType, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  const handleDesignChange = (partial: Partial<QRDesignSettings>) => {
    setDesign((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleSelectPreset = (preset: Preset) => {
    setDesign((prev) => ({
      ...prev,
      fgColor: preset.fgColor,
      bgColor: preset.bgColor,
      level: preset.level,
      margin: preset.margin,
    }));
  };

  const handleRestoreHistoryItem = (item: HistoryItem) => {
    setCurrentType(item.type);
    setFormData((prev) => ({
      ...prev,
      [item.type]: {
        ...prev[item.type],
        ...item.formData,
      },
    }));
    setDesign(item.design);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-obsidian-900 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-200`}>
      {/* Studio Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />

      {/* Kinetic Marquee Ticker */}
      <MarqueeTicker />

      {/* Main Studio Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* High-Impact Editorial Hero Section */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-black uppercase tracking-widest bg-volt text-black">
              <Zap className="w-3 h-3 mr-1 fill-black" />
              OFF+BRAND ARCHITECTURE
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-widest dark:bg-obsidian-800 bg-white border dark:border-obsidian-700 border-slate-300 dark:text-slate-300 text-slate-700">
              <ShieldCheck className="w-3 h-3 mr-1 text-matrix" />
              ISO/IEC 18004 COMPLIANT
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-widest dark:bg-obsidian-800 bg-white border dark:border-obsidian-700 border-slate-300 dark:text-volt text-black">
              <Activity className="w-3 h-3 mr-1 animate-pulse text-volt" />
              ENGINE: ACTIVE
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-none dark:text-white text-slate-950">
            ENGINEERED <span className="text-volt">QR CODES</span><br className="hidden sm:inline" /> FOR MODERN BRANDS<span className="text-volt">.</span>
          </h1>

          <p className="mt-4 font-mono text-xs sm:text-sm tracking-wide dark:text-slate-400 text-slate-600 max-w-2xl leading-relaxed">
            Ultra-crisp real-time matrix rendering with interactive 3D perspective, laser optical verification, and vector SVG exports designed for creators, motorsport, and packaging.
          </p>
        </div>

        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Command & Configuration Deck */}
          <div className="lg:col-span-7 space-y-6">
            <QRSettings
              currentType={currentType}
              onChangeType={setCurrentType}
              formData={formData}
              errors={errors}
              onChangeFormData={handleFormDataChange}
              design={design}
              onChangeDesign={handleDesignChange}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right Column: 3D Live Matrix Stage & Telemetry */}
          <div className="lg:col-span-5">
            <QRPreview
              payload={payload}
              type={currentType}
              design={design}
              hasErrors={hasErrors}
            />
          </div>
        </div>
      </main>

      {/* Recents History Drawer */}
      <QRHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onRestoreItem={handleRestoreHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
};

export default App;
