import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { QRDesignSettings } from '../../types/qr';

interface DeviceMockupProps {
  payload: string;
  design: QRDesignSettings;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({ payload, design }) => {
  return (
    <div className="w-full flex flex-col items-center py-2 select-none">
      {/* 3D MacBook Aluminum Body */}
      <div className="relative w-full max-w-[340px] sm:max-w-[370px] flex flex-col items-center">
        {/* Screen Lid Frame */}
        <div className="relative w-full bg-[#1c1d22] dark:bg-[#0c0d12] rounded-t-xl p-2.5 sm:p-3 border-2 border-[#333745] shadow-2xl">
          {/* Top Notch / Webcam */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-black/80 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500/60 animate-pulse" />
          </div>

          {/* Retina Display Canvas */}
          <div
            className="relative w-full h-[180px] sm:h-[195px] rounded-md overflow-hidden flex flex-col items-center justify-center shadow-inner"
            style={{ backgroundColor: design.bgColor }}
          >
            {/* Screen Glass Glare Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />

            {/* Rendered QR Code on screen */}
            <div className="relative z-10 p-2 rounded">
              <QRCodeCanvas
                value={payload}
                size={135}
                fgColor={design.fgColor}
                bgColor={design.bgColor}
                level={design.level}
                marginSize={1}
              />
            </div>

            {/* Display status footer */}
            <div className="absolute bottom-1 inset-x-2 flex items-center justify-between text-[8px] font-mono text-slate-500 opacity-80">
              <span>QRFLEX LIVE OS</span>
              <span>120Hz PROMOTION</span>
            </div>
          </div>
        </div>

        {/* MacBook Hinge & Base Deck */}
        <div className="relative w-[108%] h-3.5 bg-gradient-to-b from-[#2a2d38] to-[#1a1c24] rounded-b-lg border-t border-[#444959] shadow-2xl flex items-center justify-center">
          {/* Trackpad notch */}
          <div className="w-14 h-1 bg-[#121318] rounded-full opacity-75" />
        </div>
      </div>
    </div>
  );
};
