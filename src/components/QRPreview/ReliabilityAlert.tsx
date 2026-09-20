import React from 'react';
import type { ContrastAnalysis } from '../../utils/contrast';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReliabilityAlertProps {
  analysis: ContrastAnalysis;
}

export const ReliabilityAlert: React.FC<ReliabilityAlertProps> = ({ analysis }) => {
  const { ratio, score, warningMessage } = analysis;

  if (score === 'poor') {
    return (
      <div
        id="scan-reliability-warning"
        className="p-4 rounded-xl bg-red-950/70 border-2 border-red-500 text-red-100 text-xs flex items-start space-x-3 transition-all animate-pulse-fast shadow-lg shadow-red-950/50"
      >
        <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="font-mono font-bold text-red-300 flex items-center space-x-2">
            <span>[CRITICAL] SCAN FAILURE RISK</span>
            <span className="font-mono bg-red-900 px-1.5 py-0.5 rounded text-[10px] text-white">
              {ratio}:1 CONTRAST
            </span>
          </div>
          <p className="font-mono text-[11px] text-red-200 leading-relaxed">{warningMessage}</p>
        </div>
      </div>
    );
  }

  if (score === 'acceptable') {
    return (
      <div
        id="scan-reliability-notice"
        className="p-4 rounded-xl dark:bg-obsidian-900 bg-amber-50 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-3 transition-all"
      >
        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="font-mono font-bold dark:text-amber-300 text-amber-900 flex items-center space-x-2">
            <span>[CAUTION] SUB-OPTIMAL POLARITY / CONTRAST</span>
            <span className="font-mono bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black">
              {ratio}:1
            </span>
          </div>
          <p className="font-mono text-[11px] leading-relaxed dark:text-amber-200/90 text-amber-800">
            {warningMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scan-reliability-optimal"
      className="p-3.5 rounded-xl dark:bg-obsidian-900 bg-matrix/10 border-2 border-matrix dark:text-matrix text-emerald-900 text-xs flex items-center justify-between font-mono"
    >
      <div className="flex items-center space-x-2.5">
        <CheckCircle2 className="w-4 h-4 text-matrix flex-shrink-0" />
        <span className="font-bold tracking-wider">[100% SCAN RELIABILITY]</span>
      </div>
      <span className="font-mono text-[11px] font-black bg-matrix text-black px-2 py-0.5 rounded">
        {ratio}:1 RATIO &bull; OPTIMAL
      </span>
    </div>
  );
};
