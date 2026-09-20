import React from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import type { QRDesignSettings, QRType } from '../../types/qr';
import { analyzeContrast } from '../../utils/contrast';
import { ReliabilityAlert } from './ReliabilityAlert';
import { ExportActions } from './ExportActions';
import { Eye, Terminal } from 'lucide-react';

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
  const contrastAnalysis = analyzeContrast(design.fgColor, design.bgColor);
  const isValid = Boolean(payload) && !hasErrors;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Main Preview Card */}
      <div className="p-6 rounded-3xl dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200/80 backdrop-blur-md shadow-xl flex flex-col items-center">
        {/* Card Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b dark:border-slate-800/70 border-slate-200 mb-6">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
              Real-time Preview
            </span>
          </div>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-950/70 dark:border-purple-500/30 dark:text-purple-300 bg-purple-50 border border-purple-200 text-purple-700 uppercase">
            {type}
          </span>
        </div>

        {/* QR Code Presentation Stage */}
        <div
          id="qr-render-container"
          className="relative p-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl border dark:border-white/5 border-slate-200"
          style={{
            backgroundColor: isValid ? design.bgColor : '#0f172a',
            minHeight: '280px',
            minWidth: '280px',
          }}
        >
          {isValid ? (
            <div className="relative group flex items-center justify-center">
              {/* Canvas rendered for raster download & crisp screen display */}
              <QRCodeCanvas
                id="qrcode-canvas"
                value={payload}
                size={design.size}
                fgColor={design.fgColor}
                bgColor={design.bgColor}
                level={design.level}
                marginSize={design.margin}
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
              {/* Hidden SVG element specifically used for clean SVG vector export */}
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
              <div className="w-14 h-14 rounded-2xl dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700/50 border-slate-200 flex items-center justify-center text-slate-400">
                <Eye className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold dark:text-slate-300 text-slate-700">Ready to Generate</p>
                <p className="text-xs dark:text-slate-500 text-slate-500 max-w-xs">
                  Fill in the input fields on the left with valid information to render your custom QR code.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Scan Reliability Alert */}
        {isValid && (
          <div className="w-full mt-6">
            <ReliabilityAlert analysis={contrastAnalysis} />
          </div>
        )}

        {/* Export Action Controls */}
        <div className="w-full mt-6">
          <ExportActions
            containerId="qr-render-container"
            payload={payload}
            size={design.size}
            disabled={!isValid}
          />
        </div>
      </div>

      {/* Encoded Payload Inspector */}
      {isValid && (
        <div className="p-4 rounded-2xl dark:bg-slate-900/40 bg-white border dark:border-slate-800/60 border-slate-200 text-xs shadow-sm">
          <div className="flex items-center justify-between mb-2 dark:text-slate-400 text-slate-600">
            <span className="flex items-center font-medium">
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
              Encoded Payload Data
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {payload.length} bytes
            </span>
          </div>
          <div className="p-2.5 rounded-lg dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 font-mono text-[11px] dark:text-slate-300 text-slate-800 break-all select-all leading-relaxed">
            {payload}
          </div>
        </div>
      )}
    </div>
  );
};
