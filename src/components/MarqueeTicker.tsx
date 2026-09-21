import React from 'react';
import { Zap, Radio } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'QRFLEX VECTOR ENGINE',
    'ISO/IEC 18004 STANDARD',
    'WCAG CONTRAST TELEMETRY',
    'OFF+BRAND STUDIO SPEC',
    'REALTIME SVG & ULTRA-HD PNG',
    'CLIENT-SIDE PRIVACY GUARANTEED',
    'ACTIVE SCANNER SAFEGUARD',
  ];

  return (
    <div className="w-full overflow-hidden bg-volt text-black border-y border-black font-mono text-[11px] font-bold tracking-widest uppercase select-none py-1.5 flex items-center relative z-20 shadow-sm">
      <div className="relative z-10 flex items-center space-x-2 px-3 flex-shrink-0 dark:bg-black dark:text-volt bg-white text-black py-0.5 rounded mr-4 ml-2 border border-transparent dark:border-transparent shadow-sm">
        <Radio className="w-3 h-3 animate-pulse dark:text-matrix text-slate-900" />
        <span className="text-[10px] tracking-normal font-sans font-bold whitespace-nowrap">LIVE TELEMETRY</span>
      </div>

      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="inline-flex items-center mx-4">
            <span>{item}</span>
            <Zap className="w-3 h-3 ml-4 fill-black text-black" />
          </span>
        ))}
      </div>
    </div>
  );
};
