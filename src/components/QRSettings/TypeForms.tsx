import React, { useState } from 'react';
import type { QRType, AllFormData, FormErrors } from '../../types/qr';
import { AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';

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
    <div className="space-y-4">
      {/* URL Form */}
      {type === 'url' && (
        <div className="space-y-2">
          <label htmlFor="input-url" className="block text-sm font-medium dark:text-slate-200 text-slate-700">
            Target Website URL <span className="text-purple-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="input-url"
              type="text"
              placeholder="https://example.com/mypage"
              value={formData.url.url}
              onChange={(e) => onChangeData('url', 'url', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.url
                  ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                  : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
          </div>
          {errors.url && (
            <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              {errors.url}
            </p>
          )}
          <p className="text-xs dark:text-slate-500 text-slate-500">
            Enter a destination website or link. If protocol is omitted, https:// will be prepended.
          </p>
        </div>
      )}

      {/* Plain Text Form */}
      {type === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-text" className="block text-sm font-medium dark:text-slate-200 text-slate-700">
              Text Content <span className="text-purple-500">*</span>
            </label>
            <span className="text-xs dark:text-slate-500 text-slate-400">
              {formData.text.text.length} / 2500 chars
            </span>
          </div>
          <div className="relative">
            <textarea
              id="input-text"
              rows={4}
              placeholder="Type or paste arbitrary plain text, notes, or instructions here..."
              value={formData.text.text}
              onChange={(e) => onChangeData('text', 'text', e.target.value)}
              className={`w-full p-3 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors resize-y min-h-[100px] ${
                errors.text
                  ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                  : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
          </div>
          {errors.text && (
            <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              {errors.text}
            </p>
          )}
        </div>
      )}

      {/* Email Form */}
      {type === 'email' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-email-recipient" className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
              Recipient Email <span className="text-purple-500">*</span>
            </label>
            <input
              id="input-email-recipient"
              type="email"
              placeholder="recipient@example.com"
              value={formData.email.email}
              onChange={(e) => onChangeData('email', 'email', e.target.value)}
              className={`w-full px-3.5 py-2.5 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                  : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
            {errors.email && (
              <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-email-subject" className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
              Subject <span className="text-xs dark:text-slate-500 text-slate-400">(Optional)</span>
            </label>
            <input
              id="input-email-subject"
              type="text"
              placeholder="Inquiry regarding services..."
              value={formData.email.subject}
              onChange={(e) => onChangeData('email', 'subject', e.target.value)}
              className="w-full px-3.5 py-2.5 dark:bg-slate-900/90 bg-white border dark:border-slate-800 border-slate-200 rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="input-email-body" className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
              Message Body <span className="text-xs dark:text-slate-500 text-slate-400">(Optional)</span>
            </label>
            <textarea
              id="input-email-body"
              rows={3}
              placeholder="Hi there, I'd like to get in touch about..."
              value={formData.email.body}
              onChange={(e) => onChangeData('email', 'body', e.target.value)}
              className="w-full p-3 dark:bg-slate-900/90 bg-white border dark:border-slate-800 border-slate-200 rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Phone Form */}
      {type === 'phone' && (
        <div className="space-y-2">
          <label htmlFor="input-phone" className="block text-sm font-medium dark:text-slate-200 text-slate-700">
            Phone Number <span className="text-purple-500">*</span>
          </label>
          <input
            id="input-phone"
            type="tel"
            placeholder="+1 (555) 000-1234"
            value={formData.phone.phone}
            onChange={(e) => onChangeData('phone', 'phone', e.target.value)}
            className={`w-full px-3.5 py-2.5 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
          />
          {errors.phone && (
            <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              {errors.phone}
            </p>
          )}
          <p className="text-xs dark:text-slate-500 text-slate-500">
            Scanning this code triggers an instant dial prompt on smartphones.
          </p>
        </div>
      )}

      {/* Wi-Fi Form */}
      {type === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-wifi-ssid" className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
              Network Name (SSID) <span className="text-purple-500">*</span>
            </label>
            <input
              id="input-wifi-ssid"
              type="text"
              placeholder="e.g. Home_WiFi_5G"
              value={formData.wifi.ssid}
              onChange={(e) => onChangeData('wifi', 'ssid', e.target.value)}
              className={`w-full px-3.5 py-2.5 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.ssid
                  ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                  : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
            {errors.ssid && (
              <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                {errors.ssid}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
              Security Encryption
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'WPA', label: 'WPA / WPA2' },
                { id: 'WEP', label: 'WEP' },
                { id: 'nopass', label: 'None (Open)' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeData('wifi', 'encryption', id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    formData.wifi.encryption === id
                      ? 'dark:bg-purple-600/30 dark:border-purple-500 dark:text-purple-200 bg-purple-50 border-purple-400 text-purple-700'
                      : 'dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {formData.wifi.encryption !== 'nopass' && (
            <div>
              <label htmlFor="input-wifi-password" className="block text-sm font-medium dark:text-slate-200 text-slate-700 mb-1">
                Network Password <span className="text-purple-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-wifi-password"
                  type={showWifiPassword ? 'text' : 'password'}
                  placeholder="Enter Wi-Fi password"
                  value={formData.wifi.password}
                  onChange={(e) => onChangeData('wifi', 'password', e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2.5 dark:bg-slate-900/90 bg-white border rounded-xl text-sm dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/30 dark:bg-red-950/10 bg-red-50/50'
                      : 'dark:border-slate-800 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center text-xs text-red-500 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
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
                className="w-4 h-4 text-purple-600 rounded dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
              />
              <span className="text-xs dark:text-slate-300 text-slate-600 font-medium">
                Hidden SSID (Network does not broadcast name)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
