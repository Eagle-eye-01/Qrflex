import React, { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import type { QRDesignSettings, QRType } from '../../types/qr';
import { analyzeContrast } from '../../utils/contrast';
import { ReliabilityAlert } from './ReliabilityAlert';
import { ExportActions } from './ExportActions';
import { Eye, Terminal, ScanLine, Crosshair } from 'lucide-react';
import { sound } from '../../utils/audio';

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
  const [laserActive, setLaserActive] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const contrastAnalysis = analyzeContrast(design.fgColor, design.bgColor);
  const isValid = Boolean(payload) && !hasErrors;

  // 3D Perspective Tilt tracking with fluid spring recovery
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 10;
    const tiltY = (x / (rect.width / 2)) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleLaser = () => {
    sound.playClick();
    setLaserActive(!laserActive);
  };

  return (
    <div className="space-y-5 sticky top-28">
      {/* Studio Stage Card with Jitter Motion Aesthetics */}
      <div className="relative p-6 sm:p-7 rounded-2xl dark:bg-obsidian-850 bg-white border-2 dark:border-obsidian-700 border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 spring-hover">
        {/* Decorative Technical Crosshairs */}
        <div className="absolute top-3 left-3 text-volt font-mono text-[10px] select-none opacity-80 flex items-center space-x-1">
          <Crosshair className="w-3 h-3" />
          <span>STAGE // 01</span>
        </div>
        <div className="absolute top-3 right-3 font-mono text-[10px] select-none dark:text-slate-400 text-slate-500 uppercase flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-matrix animate-ping inline-block" />
          <span>EVAL: {isValid ? 'ONLINE' : 'STANDBY'}</span>
        </div>

        {/* Card Header & Laser Toggle */}
        <div className="w-full flex items-center justify-between pb-3.5 border-b dark:border-obsidian-700 border-slate-200 mt-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-volt animate-ping" />
            <span className="font-display font-bold text-sm tracking-wider uppercase dark:text-white text-slate-900">
              REAL-TIME MATRIX
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleLaser}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                laserActive
                  ? 'border-volt bg-volt text-black shadow-md shadow-volt/20'
                  : 'dark:border-obsidian-600 border-slate-300 dark:text-slate-400 text-slate-600 hover:border-volt'
              }`}
            >
              <ScanLine className="w-3 h-3" />
              <span>{laserActive ? 'LASER ON' : 'LASER OFF'}</span>
            </button>
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-black text-volt border border-volt/40 uppercase">
              {type}
            </span>
          </div>
        </div>

        {/* 3D Perspective Stage Pedestal with Jitter Rotating Animated Glow Border */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
          className="w-full flex justify-center py-2"
        >
          {/* Animated Glow Border Wrapper */}
          <div className={`relative p-[3px] rounded-2xl transition-all duration-300 ${
            isValid ? 'jitter-animated-border shadow-2xl' : ''
          }`}>
            <div
              id="qr-render-container"
              className="relative z-10 p-6 sm:p-7 rounded-[13px] flex items-center justify-center transition-transform duration-150 ease-out shadow-2xl overflow-hidden"
              style={{
                backgroundColor: isValid ? design.bgColor : (document.documentElement.classList.contains('dark') ? '#050608' : '#f1f5f9'),
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                minHeight: '290px',
                minWidth: '290px',
              }}
            >
              {/* Fluid Animated Laser Scanner Sweep Line */}
              {isValid && laserActive && (
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-volt to-transparent shadow-[0_0_18px_#e4ff1a] animate-laser-sweep pointer-events-none z-20 opacity-90" />
              )}

              {isValid ? (
                <div className="relative group flex items-center justify-center">
                  <QRCodeCanvas
                    id="qrcode-canvas"
                    value={payload}
                    size={design.size}
                    fgColor={design.fgColor}
                    bgColor={design.bgColor}
                    level={design.level}
                    marginSize={design.margin}
                    className="max-w-full h-auto rounded shadow-sm select-none"
                  />
                  <div className="hidden">
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-xl dark:bg-obsidian-900 bg-slate-200 dark:border-obsidian-700 border-slate-300 border flex items-center justify-center text-volt">
                    <Eye className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-sm dark:text-white text-slate-900 uppercase tracking-wider">
                      FEED MATRIX DATA
                    </p>
                    <p className="text-xs font-mono dark:text-slate-400 text-slate-500 max-w-xs">
                      Input valid content into the console on the left to activate instant laser rendering.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Scannability Engine & Telemetry */}
        {isValid && (
          <div className="w-full mt-6 space-y-3">
            <ReliabilityAlert analysis={contrastAnalysis} />

            {/* Quick Specs HUD */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] p-3 rounded-xl dark:bg-obsidian-900/90 bg-slate-100 border dark:border-obsidian-700 border-slate-200 shadow-inner">
              <div>
                <div className="text-slate-500 font-bold">RESOLUTION</div>
                <div className="font-extrabold text-volt dark:text-volt text-slate-900 text-xs mt-0.5">{design.size} &times; {design.size} PX</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold">ECC CAPACITY</div>
                <div className="font-extrabold text-matrix text-xs mt-0.5">LEVEL {design.level}</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold">QUIET ZONE</div>
                <div className="font-extrabold dark:text-white text-slate-900 text-xs mt-0.5">{design.margin} BLOCKS</div>
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
