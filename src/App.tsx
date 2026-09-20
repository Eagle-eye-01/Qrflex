import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { QRType, AllFormData, QRDesignSettings, Preset, HistoryItem } from './types/qr';
import { buildQRPayload, getPayloadDisplaySummary } from './utils/qrPayload';
import { validateForm } from './utils/validation';
import { Header } from './components/Header';
import { QRSettings } from './components/QRSettings/QRSettings';
import { QRPreview } from './components/QRPreview/QRPreview';
import { QRHistory } from './components/QRHistory/QRHistory';

const STORAGE_HISTORY_KEY = 'qrflex_history_v1';
const STORAGE_THEME_KEY = 'qrflex_theme_v1';

const INITIAL_FORM_DATA: AllFormData = {
  url: { url: 'https://github.com' },
  text: { text: 'Welcome to QRFlex — High Fidelity QR Code Studio' },
  email: { email: 'hello@example.com', subject: 'Inquiry', body: 'Hello!' },
  phone: { phone: '+1 555 019 2834' },
  wifi: { ssid: 'Studio_Guest_WiFi', password: 'securepassword123', encryption: 'WPA', hidden: false },
};

const DEFAULT_DESIGN: QRDesignSettings = {
  size: 260,
  fgColor: '#000000',
  bgColor: '#ffffff',
  level: 'M',
  margin: 2,
};

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return true; // Default to sleek dark aesthetic
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
      // Don't duplicate if identical payload was just recorded
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
        // Keep up to 20 most recent unique entries
        const filtered = prev.filter((p) => p.payload !== payload);
        return [newItem, ...filtered].slice(0, 20);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [payload, hasErrors, currentType, formData, design]);

  // Form change handlers
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
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Sleek App Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center space-x-2">
            <span className={darkMode ? 'text-slate-100' : 'text-slate-900'}>QR Studio & Designer</span>
          </h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Generate, customize, and export scannable QR codes for web links, text, emails, phone numbers, and Wi-Fi networks.
          </p>
        </div>

        {/* Two-column layout: Left = Configuration, Right = Real-time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configuration Settings */}
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

          {/* Right Column: Real-time Live Preview & Scannability */}
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

      {/* History Drawer */}
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
