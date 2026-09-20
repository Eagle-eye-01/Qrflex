import React, { useState } from 'react';
import { Download, FileCode, Copy, Check, Share2 } from 'lucide-react';
import { downloadQRCodePNG, downloadQRCodeSVG, copyQRCodeToClipboard } from '../../utils/export';

interface ExportActionsProps {
  containerId: string;
  payload: string;
  size: number;
  disabled: boolean;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  containerId,
  payload,
  size,
  disabled,
}) => {
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    if (disabled || downloading) return;
    try {
      setDownloading(true);
      await downloadQRCodePNG(containerId, `qrcode-${Date.now()}.png`, size);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSVG = () => {
    if (disabled) return;
    try {
      downloadQRCodeSVG(containerId, `qrcode-${Date.now()}.svg`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyImage = async () => {
    if (disabled) return;
    const success = await copyQRCodeToClipboard(containerId);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    }
  };

  const handleCopyPayload = async () => {
    if (disabled || !payload) return;
    await navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Primary Downloads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          id="btn-download-png"
          type="button"
          disabled={disabled}
          onClick={handleDownloadPNG}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-purple-600/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>

        <button
          id="btn-download-svg"
          type="button"
          disabled={disabled}
          onClick={handleDownloadSVG}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-700 border-slate-300 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-100 text-slate-800 font-semibold text-sm active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileCode className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Download SVG</span>
        </button>
      </div>

      {/* Secondary Copy Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          id="btn-copy-image"
          type="button"
          disabled={disabled}
          onClick={handleCopyImage}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg dark:bg-slate-900/60 bg-slate-100 dark:border-slate-800 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copiedImage ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied Image!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>Copy Image</span>
            </>
          )}
        </button>

        <button
          id="btn-copy-payload"
          type="button"
          disabled={disabled || !payload}
          onClick={handleCopyPayload}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg dark:bg-slate-900/60 bg-slate-100 dark:border-slate-800 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copiedPayload ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied Text!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Copy Payload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
