import React, { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRDesignSettings } from '../../types/qr';
import { sound } from '../../utils/audio';

interface BeforeAfterSwipeProps {
  payload: string;
  design: QRDesignSettings;
}

export const BeforeAfterSwipe: React.FC<BeforeAfterSwipeProps> = ({ payload, design }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clampedPercent);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
    sound.playClick();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3 select-none">
      {/* Container stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden border-2 dark:border-obsidian-600 border-slate-300 shadow-2xl cursor-ew-resize touch-none"
      >
        {/* Layer 1: Left - RAW STANDARD B&W QR */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-white"
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
        >
          <div className="flex flex-col items-center justify-center p-4">
            <QRCodeCanvas
              value={payload}
              size={Math.min(design.size, 260)}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
              marginSize={1}
            />
            <span className="absolute top-2.5 left-2.5 font-mono text-[9px] font-black px-2 py-0.5 rounded bg-black text-white uppercase tracking-wider shadow">
              RAW MATRIX
            </span>
          </div>
        </div>

        {/* Layer 2: Right - CUSTOM DESIGNED QR */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: design.bgColor,
            clipPath: `inset(0 0 0 ${sliderPos}%)`,
          }}
        >
          <div className="flex flex-col items-center justify-center p-4">
            <QRCodeCanvas
              value={payload}
              size={Math.min(design.size, 260)}
              fgColor={design.fgColor}
              bgColor={design.bgColor}
              level={design.level}
              marginSize={design.margin}
            />
            <span className="absolute top-2.5 right-2.5 font-mono text-[9px] font-black px-2 py-0.5 rounded bg-volt text-black uppercase tracking-wider shadow-lg shadow-volt/30">
              CUSTOM DESIGN
            </span>
          </div>
        </div>

        {/* Interactive Vertical Divider Line & Draggable Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-volt shadow-[0_0_12px_#e4ff1a] cursor-ew-resize z-30"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Glowing Center Handle Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-volt border-2 border-black flex items-center justify-center text-black shadow-2xl transition-transform active:scale-110">
            <span className="font-mono text-[10px] font-black tracking-tighter">◀ ▶</span>
          </div>
        </div>
      </div>

      {/* Helper text / range slider control */}
      <div className="w-full max-w-[320px] flex items-center space-x-3">
        <span className="font-mono text-[10px] font-bold text-slate-400">RAW</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => {
            sound.playClick();
            setSliderPos(Number(e.target.value));
          }}
          className="flex-1 h-1.5 bg-slate-300 dark:bg-obsidian-700 rounded-lg appearance-none cursor-pointer dark:accent-volt accent-slate-900"
        />
        <span className="font-mono text-[10px] font-bold text-volt">STYLED</span>
      </div>
    </div>
  );
};
