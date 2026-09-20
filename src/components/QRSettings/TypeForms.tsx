import React, { useState } from 'react';
import type { QRType, AllFormData, FormErrors } from '../../types/qr';
import { AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TypeFormsProps {
  type: QRType;
  formData: AllFormData;
  errors: FormErrors;
  onChangeData: (type: QRType, key: string, value: any) => void;
}

export const TypeForms: React.FC<TypeFormsProps> = ({
  type,
  formData,
  errors,
  onChangeData,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  return (
    <div className="space-y-4 pt-2">
      {/* URL Form */}
      {type === 'url' && (
        <div className="space-y-2">
          <label htmlFor="input-url" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider">
            DESTINATION URL <span className="text-volt">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="input-url"
              type="text"
              placeholder="https://example.com"
              value={formData.url.url}
              onChange={(e) => onChangeData('url', 'url', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all ${
                errors.url
                  ? 'border-red-500 bg-red-950/20'
                  : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
              }`}
            />
          </div>
          {errors.url && (
            <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-red-400" />
              {errors.url}
            </p>
          )}
          <p className="font-mono text-[10px] text-slate-500">
            AUTO-HANDLES HTTP/HTTPS ENCODING SCHEME FOR WEBKIT OPTICS.
          </p>
        </div>
      )}

      {/* Plain Text Form */}
      {type === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-text" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider">
              PAYLOAD CONTENT <span className="text-volt">*</span>
            </label>
            <span className="font-mono text-[10px] text-slate-400">
              {formData.text.text.length} / 2500 CHARACTERS
            </span>
          </div>
          <div className="relative">
            <textarea
              id="input-text"
              rows={4}
              placeholder="Input alphanumeric plaintext payload..."
              value={formData.text.text}
              onChange={(e) => onChangeData('text', 'text', e.target.value)}
              className={`w-full p-3.5 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-xs dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all resize-y min-h-[110px] ${
                errors.text
                  ? 'border-red-500 bg-red-950/20'
                  : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
              }`}
            />
          </div>
          {errors.text && (
            <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              {errors.text}
            </p>
          )}
        </div>
      )}

      {/* Email Form */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-email-recipient" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
              RECIPIENT EMAIL <span className="text-volt">*</span>
            </label>
            <input
              id="input-email-recipient"
              type="email"
              placeholder="target@offbrand.io"
              value={formData.email.email}
              onChange={(e) => onChangeData('email', 'email', e.target.value)}
              className={`w-full px-3.5 py-3 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all ${
                errors.email
                  ? 'border-red-500 bg-red-950/20'
                  : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
              }`}
            />
            {errors.email && (
              <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-email-subject" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
              MESSAGE SUBJECT <span className="text-slate-500">(OPTIONAL)</span>
            </label>
            <input
              id="input-email-subject"
              type="text"
              placeholder="Project Collaboration"
              value={formData.email.subject}
              onChange={(e) => onChangeData('email', 'subject', e.target.value)}
              className="w-full px-3.5 py-3 dark:bg-obsidian-900 bg-white border-2 dark:border-obsidian-700 border-slate-300 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none focus:border-volt focus:ring-2 focus:ring-volt/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="input-email-body" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
              MESSAGE BODY <span className="text-slate-500">(OPTIONAL)</span>
            </label>
            <textarea
              id="input-email-body"
              rows={3}
              placeholder="Enter email dispatch draft..."
              value={formData.email.body}
              onChange={(e) => onChangeData('email', 'body', e.target.value)}
              className="w-full p-3.5 dark:bg-obsidian-900 bg-white border-2 dark:border-obsidian-700 border-slate-300 rounded-xl font-mono text-xs dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none focus:border-volt focus:ring-2 focus:ring-volt/20 transition-all"
            />
          </div>
        </div>
      )}

      {/* Phone Form */}
      {type === 'phone' && (
        <div className="space-y-2">
          <label htmlFor="input-phone" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider">
            INTERNATIONAL PHONE (E.164) <span className="text-volt">*</span>
          </label>
          <input
            id="input-phone"
            type="tel"
            placeholder="+1 555 234 5678"
            value={formData.phone.phone}
            onChange={(e) => onChangeData('phone', 'phone', e.target.value)}
            className={`w-full px-3.5 py-3 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all ${
              errors.phone
                ? 'border-red-500 bg-red-950/20'
                : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
            }`}
          />
          {errors.phone && (
            <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              {errors.phone}
            </p>
          )}
          <p className="font-mono text-[10px] text-slate-500">
            PROMPTS INSTANT NATIVE DIAL PAD INTERCEPT UPON OPTICAL SCAN.
          </p>
        </div>
      )}

      {/* Wi-Fi Form */}
      {type === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-wifi-ssid" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
              NETWORK ACCESS POINT (SSID) <span className="text-volt">*</span>
            </label>
            <input
              id="input-wifi-ssid"
              type="text"
              placeholder="e.g. STUDIO_WIFI_5G"
              value={formData.wifi.ssid}
              onChange={(e) => onChangeData('wifi', 'ssid', e.target.value)}
              className={`w-full px-3.5 py-3 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all ${
                errors.ssid
                  ? 'border-red-500 bg-red-950/20'
                  : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
              }`}
            />
            {errors.ssid && (
              <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                {errors.ssid}
              </p>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
              CIPHER PROTOCOL
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'WPA', label: 'WPA / WPA2' },
                { id: 'WEP', label: 'WEP' },
                { id: 'nopass', label: 'OPEN' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onChangeData('wifi', 'encryption', id);
                  }}
                  className={`py-2.5 px-3 rounded-lg font-mono text-xs font-bold border-2 transition-all ${
                    formData.wifi.encryption === id
                      ? 'bg-volt text-black border-volt shadow-sm shadow-volt/20'
                      : 'dark:border-obsidian-700 dark:bg-obsidian-900 border-slate-300 bg-white text-slate-600 hover:border-volt'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {formData.wifi.encryption !== 'nopass' && (
            <div>
              <label htmlFor="input-wifi-password" className="block font-mono text-[11px] font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-1">
                PRE-SHARED KEY (PASSWORD) <span className="text-volt">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-wifi-password"
                  type={showWifiPassword ? 'text' : 'password'}
                  placeholder="Enter pre-shared network key"
                  value={formData.wifi.password}
                  onChange={(e) => onChangeData('wifi', 'password', e.target.value)}
                  className={`w-full pl-3.5 pr-11 py-3 dark:bg-obsidian-900 bg-white border-2 rounded-xl font-mono text-sm dark:text-white text-slate-950 placeholder-slate-500 focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-500 bg-red-950/20'
                      : 'dark:border-obsidian-700 border-slate-300 focus:border-volt focus:ring-2 focus:ring-volt/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-volt"
                  aria-label="Toggle password visibility"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center font-mono text-xs text-red-400 mt-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>
          )}

          <div className="pt-1">
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                id="checkbox-wifi-hidden"
                type="checkbox"
                checked={formData.wifi.hidden}
                onChange={(e) => onChangeData('wifi', 'hidden', e.target.checked)}
                className="w-4 h-4 text-volt rounded bg-black border-slate-700 focus:ring-volt accent-volt"
              />
              <span className="font-mono text-[11px] font-bold dark:text-slate-300 text-slate-700">
                STEALTH SSID (HIDDEN BROADCAST)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
