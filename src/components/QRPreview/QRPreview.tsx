import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { QRDesignSettings, QRType } from '../../types/qr';
import { analyzeContrast } from '../../utils/contrast';
import { ReliabilityAlert } from './ReliabilityAlert';
import { ExportActions } from './ExportActions';
import { BeforeAfterSwipe } from './BeforeAfterSwipe';
import { DeviceMockup } from './DeviceMockup';
import { IPhoneMockup } from './IPhoneMockup';
import { Eye, Terminal, ScanLine, Crosshair, SplitSquareVertical, Laptop, Smartphone } from 'lucide-react';
import { sound } from '../../utils/audio';

import { useMotionValue, useSpring } from 'framer-motion';

type ViewMode = 'macbook' | 'iphone' | 'swipe';

interface QRPreviewProps {
  payload: string;
  type: QRType;
  design: QRDesignSettings;
  hasErrors: boolean;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  type,
  design,
  hasErrors,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('macbook');
  const [laserActive, setLaserActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 120Hz Fluid Motion Values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const springTiltX = useSpring(tiltX, springConfig);
  const springTiltY = useSpring(tiltY, springConfig);

  const contrastAnalysis = analyzeContrast(design.fgColor, design.bgColor);
  const isValid = Boolean(payload) && !hasErrors;

  // 3D Perspective Tilt tracking with fluid spring recovery
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === 'swipe' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    tiltX.set(-(y / (rect.height / 2)) * 12);
    tiltY.set((x / (rect.width / 2)) * 12);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const toggleLaser = () => {
    sound.playLaserSweep();
    setLaserActive(!laserActive);
  };

  return (
    <div className="space-y-5 sticky top-28">
      {/* Studio Stage Card with Jitter Motion Aesthetics */}
      <div className="relative p-6 sm:p-7 rounded-2xl dark:bg-obsidian-850 bg-white border-2 dark:border-obsidian-700 border-slate-200 shadow-2xl transition-all duration-300 spring-hover">
        {/* Decorative Technical Crosshairs */}
        <div className="absolute top-3 left-3 text-volt font-mono text-[10px] select-none opacity-80 flex items-center space-x-1">
          <Crosshair className="w-3 h-3" />
          <span>STAGE // 01</span>
        </div>
        <div className="absolute top-3 right-3 font-mono text-[10px] select-none dark:text-slate-400 text-slate-500 uppercase flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-matrix animate-ping inline-block" />
          <span>EVAL: {isValid ? 'ONLINE' : 'STANDBY'}</span>
        </div>

        {/* Card Header */}
        <div className="w-full flex items-center justify-between pb-3.5 border-b dark:border-obsidian-700 border-slate-200 mt-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-volt animate-ping" />
            <span className="font-display font-bold text-sm tracking-wider uppercase dark:text-white text-slate-900">
              REAL-TIME MATRIX
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded dark:bg-black dark:text-volt bg-slate-200 text-slate-900 border dark:border-volt/40 border-slate-300 uppercase">
            {type}
          </span>
        </div>

        {/* Jitter View Mode Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl dark:bg-obsidian-900 bg-slate-100 border dark:border-obsidian-700 border-slate-300 mb-5">
          {[
            { id: 'macbook', label: 'MACBOOK', icon: Laptop },
            { id: 'iphone', label: 'IPHONE', icon: Smartphone },
            { id: 'swipe', label: 'SWIPE A/B', icon: SplitSquareVertical },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                sound.playSwitch();
                setViewMode(id as ViewMode);
              }}
              className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                viewMode === id
                  ? 'bg-volt text-black shadow-md shadow-volt/20 scale-[1.02]'
                  : 'dark:text-slate-400 text-slate-600 hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Presentation Area depending on ViewMode */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full"
        >
          {/* Missing data placeholder */}
          {!isValid && viewMode !== 'swipe' && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 min-h-[300px]">
              <div className="w-16 h-16 rounded-xl dark:bg-obsidian-900 bg-slate-200 dark:border-obsidian-700 border-slate-300 border flex items-center justify-center text-volt">
                <Eye className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-sm dark:text-white text-slate-900 uppercase tracking-wider">
                  FEED MATRIX DATA
                </p>
                <p className="text-xs font-mono dark:text-slate-400 text-slate-500 max-w-xs">
                  Input valid content into the console on the left to activate instant device rendering.
                </p>
              </div>
            </div>
          )}

          {viewMode === 'macbook' && isValid && (
            <div className="py-2">
              <DeviceMockup payload={payload} design={design} tiltX={springTiltX} tiltY={springTiltY} laserActive={laserActive} />
            </div>
          )}

          {viewMode === 'iphone' && isValid && (
            <div className="py-2">
              <IPhoneMockup payload={payload} design={design} tiltX={springTiltX} tiltY={springTiltY} laserActive={laserActive} />
            </div>
          )}

          {/* Hidden SVG for Export */}
          {isValid && (
            <div className="hidden" id="qr-render-container">
               <QRCodeSVG
                 id="qrcode-svg"
                 value={payload}
                 size={design.size}
                 fgColor={design.fgColor}
                 bgColor={design.bgColor}
                 level={design.level}
                 marginSize={design.margin}
               />
            </div>
          )}

          {/* Laser Active Toggle Badge */}
          {isValid && viewMode !== 'swipe' && (
            <div className="mt-3 flex justify-center pb-4">
              <button
                type="button"
                onClick={toggleLaser}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 text-xs font-bold transition-all cursor-pointer ${
                  laserActive
                    ? 'bg-[#e4ff1a] text-black shadow-[0_0_20px_rgba(228,255,26,0.4)] scale-105'
                    : 'dark:border-obsidian-600 border-slate-300 dark:text-slate-400 text-slate-600 hover:border-volt border'
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>{laserActive ? 'LASER ACTIVE' : 'LASER MUTED'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ViewMode: Before/After Swipe Slider (Jitter Template Spec) */}
        {viewMode === 'swipe' && isValid && (
          <div className="py-2">
            <BeforeAfterSwipe payload={payload} design={design} />
          </div>
        )}

        {/* Live Scannability Engine & Telemetry */}
        {isValid && (
          <div className="w-full mt-2 space-y-3">
            <ReliabilityAlert analysis={contrastAnalysis} />

            {/* Quick Specs HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[10px] p-3 rounded-xl dark:bg-obsidian-900/90 bg-slate-100 border dark:border-obsidian-700 border-slate-200 shadow-inner">
              <div>
                <div className="text-slate-500 font-bold uppercase">GEOMETRY</div>
                <div className="font-extrabold text-volt dark:text-volt text-slate-900 text-xs mt-0.5">{design.size}&times;{design.size}PX</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold uppercase">ECC RECOVERY</div>
                <div className="font-extrabold text-matrix text-xs mt-0.5">LEVEL {design.level} ({design.level === 'L' ? '7%' : design.level === 'M' ? '15%' : design.level === 'Q' ? '25%' : '30%'})</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold uppercase">QUIET ZONE</div>
                <div className="font-extrabold dark:text-white text-slate-900 text-xs mt-0.5">{design.margin} BLOCKS</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold uppercase">CHASSIS RATIO</div>
                <div className={`font-extrabold text-xs mt-0.5 ${contrastAnalysis.score === 'poor' ? 'text-red-400' : contrastAnalysis.score === 'acceptable' ? 'text-amber-400' : 'text-matrix'}`}>
                  {contrastAnalysis.ratio}:1
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Controls */}
        <div className="w-full mt-5">
          <ExportActions
            containerId="qr-render-container"
            payload={payload}
            size={design.size}
            disabled={!isValid}
          />
        </div>
      </div>

      {/* Raw Payload Stream Inspector */}
      {isValid && (
        <div className="p-4 rounded-xl dark:bg-obsidian-850 bg-white border-2 dark:border-obsidian-700 border-slate-200 text-xs shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center font-mono font-bold text-[11px] uppercase tracking-wider dark:text-volt text-slate-900">
              <Terminal className="w-3.5 h-3.5 mr-1.5" />
              RAW PAYLOAD STRING
            </span>
            <span className="font-mono text-[10px] dark:text-slate-400 text-slate-500 font-semibold">
              {payload.length} BYTES
            </span>
          </div>
          <div className="p-3 rounded-lg dark:bg-black/90 bg-slate-100 border dark:border-obsidian-700 border-slate-300 font-mono text-[11px] dark:text-matrix text-emerald-800 break-all select-all leading-relaxed">
            {payload}
          </div>
        </div>
      )}
    </div>
  );
};
