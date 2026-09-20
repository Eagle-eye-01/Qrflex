import React from 'react';
import type { HistoryItem } from '../../types/qr';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Trash2, Clock, RotateCcw } from 'lucide-react';

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
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md dark:bg-slate-900 bg-white dark:border-l dark:border-slate-800 border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="text-base font-semibold dark:text-slate-100 text-slate-900">Recent QR Codes</h2>
              <span className="text-xs px-2 py-0.5 rounded-full dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/30 bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                {items.length}
              </span>
            </div>
            <button
              id="btn-close-history"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 opacity-40" />
                <p className="text-sm font-medium dark:text-slate-400 text-slate-600">No recent codes saved</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Generate valid QR codes to automatically record them in your persistent history.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3.5 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-white dark:hover:bg-slate-950/90 shadow-sm transition-all flex items-start space-x-3.5"
                >
                  {/* Miniature QR canvas */}
                  <div
                    className="p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/50 flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: item.design.bgColor }}
                    onClick={() => {
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
                      onRestoreItem(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded dark:bg-purple-950/80 dark:border-purple-500/30 dark:text-purple-300 bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold dark:text-slate-200 text-slate-800 mt-1 truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {item.payload}
                    </p>
                  </div>

                  {/* Individual Actions */}
                  <div className="flex flex-col items-end space-y-1">
                    <button
                      type="button"
                      title="Restore this configuration"
                      onClick={() => {
                        onRestoreItem(item);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Remove from history"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 opacity-0 group-hover:opacity-100 transition-all"
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
            <div className="p-4 border-t dark:border-slate-800 border-slate-200 dark:bg-slate-900/80 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Saved in browser storage</span>
              <button
                id="btn-clear-all-history"
                type="button"
                onClick={onClearAll}
                className="flex items-center space-x-1.5 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
