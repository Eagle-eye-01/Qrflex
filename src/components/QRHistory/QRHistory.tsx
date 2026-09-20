import React from 'react';
import type { HistoryItem } from '../../types/qr';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Trash2, Clock, RotateCcw } from 'lucide-react';
import { sound } from '../../utils/audio';

interface QRHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onRestoreItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const QRHistory: React.FC<QRHistoryProps> = ({
  isOpen,
  onClose,
  items,
  onRestoreItem,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md dark:bg-obsidian-900 bg-white border-l-2 dark:border-obsidian-700 border-black shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b-2 dark:border-obsidian-700 border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-5 h-5 text-volt" />
              <h2 className="font-display font-extrabold text-base tracking-wider uppercase dark:text-white text-slate-950">
                RECENT DISPATCHES
              </h2>
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-volt text-black">
                {items.length}
              </span>
            </div>
            <button
              id="btn-close-history"
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white dark:hover:bg-obsidian-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2 font-mono">
                <Clock className="w-8 h-8 opacity-30 text-volt" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NO ARCHIVED CODES</p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Generated codes are automatically serialized and cached in client storage.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3.5 rounded-xl dark:bg-obsidian-800/90 bg-slate-50 border-2 dark:border-obsidian-700 border-slate-200 hover:border-volt transition-all flex items-start space-x-3.5 shadow-md"
                >
                  {/* Miniature QR canvas */}
                  <div
                    className="p-1.5 rounded border border-black/20 shadow-sm flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: item.design.bgColor }}
                    onClick={() => {
                      sound.playSuccess();
                      onRestoreItem(item);
                      onClose();
                    }}
                  >
                    <QRCodeCanvas
                      value={item.payload}
                      size={54}
                      fgColor={item.design.fgColor}
                      bgColor={item.design.bgColor}
                      level={item.design.level}
                      marginSize={1}
                    />
                  </div>

                  {/* Metadata */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      sound.playSuccess();
                      onRestoreItem(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] font-black px-1.5 py-0.2 rounded bg-black text-volt border border-volt/40 uppercase">
                        {item.type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xs dark:text-white text-slate-950 mt-1 truncate group-hover:text-volt transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                      {item.payload}
                    </p>
                  </div>

                  {/* Individual Actions */}
                  <div className="flex flex-col items-end space-y-1">
                    <button
                      type="button"
                      title="Restore configuration"
                      onClick={() => {
                        sound.playSuccess();
                        onRestoreItem(item);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-volt hover:bg-volt/10 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Purge record"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t-2 dark:border-obsidian-700 border-slate-200 dark:bg-obsidian-900 bg-slate-50 flex items-center justify-between font-mono">
              <span className="text-[11px] text-slate-400 font-bold uppercase">PERSISTENT STORAGE</span>
              <button
                id="btn-clear-all-history"
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClearAll();
                }}
                className="flex items-center space-x-1.5 text-xs text-red-500 hover:text-red-400 font-bold uppercase px-2.5 py-1.5 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>PURGE ALL</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
