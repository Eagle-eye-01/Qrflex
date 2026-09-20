import React, { useState } from 'react';
import { Download, FileCode, Copy, Check, Share2 } from 'lucide-react';
import { downloadQRCodePNG, downloadQRCodeSVG, copyQRCodeToClipboard } from '../../utils/export';
import { sound } from '../../utils/audio';

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
      sound.playSuccess();
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
      sound.playSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyImage = async () => {
    if (disabled) return;
    const success = await copyQRCodeToClipboard(containerId);
    if (success) {
      sound.playSuccess();
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    }
  };

  const handleCopyPayload = async () => {
    if (disabled || !payload) return;
    await navigator.clipboard.writeText(payload);
    sound.playSuccess();
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
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-volt hover:bg-volt-light active:bg-volt-dark text-black font-display font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-volt/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>DOWNLOAD PNG</span>
        </button>

        <button
          id="btn-download-svg"
          type="button"
          disabled={disabled}
          onClick={handleDownloadSVG}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl dark:bg-black bg-slate-900 border-2 border-volt hover:border-volt-light text-volt font-display font-extrabold text-sm tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg shadow-black/40"
        >
          <FileCode className="w-4 h-4 stroke-[2.5]" />
          <span>DOWNLOAD SVG</span>
        </button>
      </div>

      {/* Secondary Quick-Copy Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          id="btn-copy-image"
          type="button"
          disabled={disabled}
          onClick={handleCopyImage}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg dark:bg-obsidian-900 bg-slate-100 border dark:border-obsidian-700 border-slate-300 font-mono text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-800 hover:border-volt hover:text-black dark:hover:text-volt transition-colors disabled:opacity-30"
        >
          {copiedImage ? (
            <>
              <Check className="w-3.5 h-3.5 text-matrix" />
              <span className="text-matrix">COPIED PNG!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-volt" />
              <span>COPY IMAGE</span>
            </>
          )}
        </button>

        <button
          id="btn-copy-payload"
          type="button"
          disabled={disabled || !payload}
          onClick={handleCopyPayload}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg dark:bg-obsidian-900 bg-slate-100 border dark:border-obsidian-700 border-slate-300 font-mono text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-800 hover:border-volt hover:text-black dark:hover:text-volt transition-colors disabled:opacity-30"
        >
          {copiedPayload ? (
            <>
              <Check className="w-3.5 h-3.5 text-matrix" />
              <span className="text-matrix">COPIED TEXT!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-volt" />
              <span>COPY TEXT</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
