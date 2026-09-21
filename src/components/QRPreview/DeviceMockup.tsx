import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRDesignSettings } from '../../types/qr';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface DeviceMockupProps {
  payload: string;
  design: QRDesignSettings;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  laserActive?: boolean;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({ payload, design, tiltX, tiltY, laserActive = false }) => {
  // Base rotation is exactly 0 when not tilted, ensuring screen is perfectly upright
  const rotateX = useTransform(tiltX, (v) => v);

  // Dynamic matrix geometry scaling (proportional to design.size: 160 -> 135px, 420 -> 195px)
  const qrDisplaySize = Math.round(135 + ((Math.min(420, Math.max(160, design.size)) - 160) / (420 - 160)) * (195 - 135));

  return (
    <div 
      className="w-full flex flex-col items-center py-6 select-none cursor-pointer hover:cursor-grab active:cursor-grabbing will-change-transform"
      style={{ 
        perspective: '1100px', 
        perspectiveOrigin: '50% 18%' // Virtual camera elevated slightly above looking down at keyboard
      }}
    >
      {/* 3D MacBook Assembly */}
      <motion.div 
        className="relative w-full max-w-[340px] sm:max-w-[460px] flex flex-col items-center mt-2"
        style={{ 
          rotateX, 
          rotateY: tiltY,
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Ambient Floor Shadow under laptop */}
        <div 
          className="absolute -bottom-10 w-[115%] h-[55px] bg-black/65 blur-2xl rounded-[100%] pointer-events-none"
          style={{ transform: 'translateZ(-140px)' }}
        />

        {/* Screen Lid (Upright Display, Against Wall) - BACK LAYER */}
        <div 
          className="relative w-full bg-[#18191e] dark:bg-[#0c0d12] rounded-t-3xl p-3 sm:p-4 border-t-2 border-l-2 border-r-2 border-[#505463]/40 shadow-2xl z-[10]"
          style={{ 
            transformOrigin: 'bottom center',
            transform: 'rotateX(0deg)', // Upright against wall
            transformStyle: 'preserve-3d' 
          }}
        >
          {/* Top Notch / Webcam */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 rounded-b-[4px] bg-black flex items-center justify-center z-[20] shadow-sm border-b border-white/5">
            <div className="w-1 h-1 rounded-full bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
               <div className="w-0.5 h-0.5 rounded-full bg-emerald-500/80 animate-pulse shadow-[0_0_4px_#10b981]" />
            </div>
          </div>

          {/* Retina Display Canvas with Matrix Color Chassis */}
          <div
            className="relative w-full h-[220px] sm:h-[280px] rounded-lg overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-black/50 z-[20] transition-colors duration-300"
            style={{ 
              backgroundColor: design.bgColor,
              backgroundImage: `radial-gradient(circle at 50% 50%, ${design.fgColor}14 0%, transparent 75%)`
            }}
          >
            {/* Screen Glass Glare Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-[30]" />

            {/* Rendered QR Code on screen with dynamic Matrix Geometry */}
            <div className="relative z-[40] p-3 rounded-xl backdrop-blur-md bg-black/10 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 overflow-hidden flex items-center justify-center">
              <QRCodeCanvas
                value={payload}
                size={qrDisplaySize}
                fgColor={design.fgColor}
                bgColor={design.bgColor}
                level={design.level}
                marginSize={design.margin}
                className="rounded block"
              />

              {/* Laser Optical Scan Beam - Contained strictly within QR Card */}
              {laserActive && (
                <motion.div
                  className="absolute inset-x-0 pointer-events-none z-20 flex items-center justify-center"
                  initial={{ top: '6%' }}
                  animate={{
                    top: ['6%', '94%', '6%'],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    duration: 2.6,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                >
                  {/* Center optical flare orb */}
                  <div className="absolute w-3.5 h-3.5 bg-white rounded-full blur-[2px] opacity-95 shadow-[0_0_8px_#ffffff]" />
                  {/* Glowing beam with soft falloff */}
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#e4ff1a] to-transparent shadow-[0_0_12px_#e4ff1a]" />
                  {/* Laser aura band */}
                  <div className="absolute w-full h-4 bg-gradient-to-b from-transparent via-[#e4ff1a]/15 to-transparent pointer-events-none" />
                </motion.div>
              )}
            </div>

            {/* Display status footer */}
            <div className="absolute bottom-1.5 inset-x-3 flex items-center justify-between text-[9px] font-mono font-bold text-white/60 z-[40] mix-blend-difference opacity-60">
              <span>QRFLEX LIVE OS // {design.size}&times;{design.size}PX</span>
              <span>120Hz PROMOTION</span>
            </div>
          </div>
        </div>

        {/* MacBook Hinge Area - Pivot Junction */}
        <div 
          className="relative w-[98%] h-3 bg-gradient-to-b from-[#16171c] to-[#08080a] border-t border-[#3b3d45] border-b border-[#000] z-[25] rounded-sm shadow-md"
          style={{ transform: 'translateZ(1px)' }}
        />

        {/* SINGLE CONTINUOUS UNIBODY KEYBOARD BASE DECK - Continuous rigid plane from Hinge to Front Lip */}
        <div 
          className="relative w-[102%] sm:w-[103%] h-[260px] bg-gradient-to-b from-[#32343d] via-[#262830] to-[#1c1d23] rounded-b-[18px] flex flex-col items-center pt-2.5 sm:pt-3 px-3 sm:px-4 border-l border-r border-b border-[#555968]/50 shadow-[0_30px_45px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] z-[35] overflow-hidden"
          style={{ 
            transformOrigin: 'top center',
            transform: 'rotateX(68deg)', // 22° above horizontal, continuous single rigid plane
            transformStyle: 'preserve-3d',
            marginTop: '-1px'
          }}
        >
          {/* Speaker Grilles Left & Right */}
          <div className="absolute left-2.5 sm:left-3 top-3 bottom-28 w-4 sm:w-5 bg-[radial-gradient(#111_1px,transparent_1px)] bg-[size:3px_3px] opacity-45 pointer-events-none" />
          <div className="absolute right-2.5 sm:right-3 top-3 bottom-28 w-4 sm:w-5 bg-[radial-gradient(#111_1px,transparent_1px)] bg-[size:3px_3px] opacity-45 pointer-events-none" />

          {/* Precision Machined Keyboard Well - Recessed on the unibody deck */}
          <div 
            className="w-[88%] h-[134px] bg-[#0c0d11] rounded-[5px] shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.06)] flex flex-col p-1.5 justify-between relative z-[40] border border-black/80"
          >
            {/* Row 0: Function Row (Esc, F1-F12, Touch ID) */}
            <div className="flex w-full h-[12%] gap-[2.5px]">
              <div className="flex-[1.4] bg-[#22242b] rounded-[1.5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_1px_rgba(0,0,0,0.8)] border border-black/50" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#22242b] rounded-[1.5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_1px_rgba(0,0,0,0.8)] border border-black/50" />
              ))}
              <div className="flex-[1.4] bg-[#111217] rounded-[1.5px] shadow-inner border border-black/80 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full border border-[#444]" />
              </div>
            </div>

            {/* Row 1: Number Row (~, 1-0, -, =, Delete) */}
            <div className="flex w-full h-[15%] gap-[2.5px]">
              <div className="flex-1 bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              ))}
              <div className="flex-[1.6] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
            </div>

            {/* Row 2: QWERTY Row (Tab, Q-P, [, ], \) */}
            <div className="flex w-full h-[15%] gap-[2.5px]">
              <div className="flex-[1.5] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              ))}
              <div className="flex-[1.1] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
            </div>

            {/* Row 3: ASDF Row (Caps Lock, A-L, ;, ', Return) */}
            <div className="flex w-full h-[15%] gap-[2.5px]">
              <div className="flex-[1.8] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              ))}
              <div className="flex-[1.8] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
            </div>

            {/* Row 4: ZXCV Row (Shift, Z-/, Shift) */}
            <div className="flex w-full h-[15%] gap-[2.5px]">
              <div className="flex-[2.3] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
              ))}
              <div className="flex-[2.3] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60" />
            </div>

            {/* Row 5: Modifier & Spacebar Row with Inverted-T Arrows */}
            <div className="flex w-full h-[16%] gap-[2.5px]">
              <div className="flex-[1] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              <div className="flex-[1] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              <div className="flex-[1.2] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              <div className="flex-[1.4] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              
              {/* Spacebar */}
              <div className="flex-[6.2] bg-[#22242b] rounded-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.8)] border border-black/60 flex items-center justify-center">
                 <div className="w-[60%] h-[15%] bg-white/5 rounded-full blur-[0.5px]" />
              </div>

              <div className="flex-[1.4] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              <div className="flex-[1.2] bg-[#22242b] rounded-[2px] shadow-sm border border-black/50" />
              
              {/* Inverted-T Arrow Keys */}
              <div className="flex-[2.5] flex flex-col justify-end">
                 <div className="h-[48%] w-[48%] bg-[#22242b] rounded-[1px] shadow-sm mx-auto mb-[2%] border border-black/50" />
                 <div className="flex justify-between h-[48%] w-full">
                    <div className="h-full w-[31%] bg-[#22242b] rounded-[1px] shadow-sm border border-black/50" />
                    <div className="h-full w-[31%] bg-[#22242b] rounded-[1px] shadow-sm border border-black/50" />
                    <div className="h-full w-[31%] bg-[#22242b] rounded-[1px] shadow-sm border border-black/50" />
                 </div>
              </div>
            </div>
          </div>

          {/* Integrated Precision Glass Trackpad - Part of the EXACT SAME unibody surface */}
          <div 
            className="w-[43%] h-[78px] mt-3 rounded-[6px] bg-gradient-to-b from-[#22242c] to-[#191a21] shadow-[inset_0_2px_4px_rgba(0,0,0,0.65),inset_0_-1px_1px_rgba(255,255,255,0.05),0_1px_0_rgba(255,255,255,0.12)] border border-black/50 relative z-[45]"
          />

          {/* Precision Thumb Scoop at the bottom edge */}
          <div className="absolute bottom-0 w-20 h-1 bg-[#090a0d] rounded-t-full shadow-inner border-t border-black/80 z-[50]" />
        </div>
      </motion.div>
    </div>
  );
};


