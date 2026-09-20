import React from 'react';
import type { ContrastAnalysis } from '../../utils/contrast';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReliabilityAlertProps {
  analysis: ContrastAnalysis;
}

export const ReliabilityAlert: React.FC<ReliabilityAlertProps> = ({ analysis }) => {
  const { ratio, score, warningMessage } = analysis;

  if (score === 'poor') {
    return (
      <div
        id="scan-reliability-warning"
        className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3 transition-all animate-pulse-subtle"
      >
        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="font-semibold text-red-300 flex items-center space-x-2">
            <span>Scan Reliability Warning</span>
            <span className="font-mono bg-red-900/60 px-1.5 py-0.2 rounded text-[10px]">
              Contrast: {ratio}:1
            </span>
          </div>
          <p className="text-red-200/90 leading-relaxed">{warningMessage}</p>
        </div>
      </div>
    );
  }

  if (score === 'acceptable') {
    return (
      <div
        id="scan-reliability-notice"
        className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start space-x-3 transition-all"
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300 flex items-center space-x-2">
            <span>Scan Reliability Notice</span>
            <span className="font-mono bg-amber-900/60 px-1.5 py-0.2 rounded text-[10px]">
              Contrast: {ratio}:1
            </span>
          </div>
          <p className="text-amber-200/90 leading-relaxed">{warningMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scan-reliability-optimal"
      className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="font-medium">High Scan Reliability</span>
      </div>
      <span className="font-mono text-[11px] text-emerald-400/80 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
        Contrast {ratio}:1 • Optimal
      </span>
    </div>
  );
};
