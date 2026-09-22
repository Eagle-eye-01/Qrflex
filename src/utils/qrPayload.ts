import type { QRType, AllFormData } from '../types/qr';

/**
 * Escapes special characters for Wi-Fi QR strings (standard MEBKM / ZXing format):
 * \ -> \\, ; -> \;, , -> \,, : -> \:
 */
function escapeWifiString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/:/g, '\\:');
}

export function buildQRPayload(type: QRType, data: AllFormData): string {
  switch (type) {
    case 'url': {
      const url = data.url.url.trim();
      if (!url) return '';
      // Ensure protocol if missing for pure web navigation
      if (!/^https?:\/\//i.test(url) && !/^ftp:\/\//i.test(url)) {
        return `https://${url}`;
      }
      return url;
    }
    case 'text': {
      return data.text.text;
    }
    case 'email': {
      const { email, subject, body } = data.email;
      if (!email.trim()) return '';
      const params = new URLSearchParams();
      if (subject.trim()) params.append('subject', subject.trim());
      if (body.trim()) params.append('body', body.trim());
      const queryString = params.toString();
      return `mailto:${email.trim()}${queryString ? `?${queryString}` : ''}`;
    }
    case 'phone': {
      const phone = data.phone.phone.trim();
      if (!phone) return '';
      return `tel:${phone.replace(/\s+/g, '')}`;
    }
    case 'wifi': {
      const { ssid, password, encryption, hidden } = data.wifi;
      if (!ssid.trim()) return '';
      const encType = encryption === 'nopass' ? 'nopass' : encryption;
      const passPart = encryption !== 'nopass' && password ? `P:${escapeWifiString(password)};` : '';
      const hiddenPart = hidden ? 'H:true;' : '';
      return `WIFI:T:${encType};S:${escapeWifiString(ssid.trim())};${passPart}${hiddenPart};`;
    }
    case 'sms': {
      const { phone, message } = data.sms;
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      if (!cleanPhone) return '';
      return message.trim() ? `SMSTO:${cleanPhone}:${message.trim()}` : `SMSTO:${cleanPhone}`;
    }
    default:
      return '';
  }
}

export function getPayloadDisplaySummary(type: QRType, data: AllFormData): string {
  switch (type) {
    case 'url':
      return data.url.url || 'Empty URL';
    case 'text':
      return data.text.text ? `${data.text.text.slice(0, 30)}${data.text.text.length > 30 ? '...' : ''}` : 'Empty text';
    case 'email':
      return data.email.email || 'Empty email';
    case 'phone':
      return data.phone.phone || 'Empty phone';
    case 'sms':
      return data.sms.phone ? `SMS: ${data.sms.phone}` : 'Empty SMS';
    case 'wifi':
      return data.wifi.ssid ? `Wi-Fi: ${data.wifi.ssid}` : 'Empty Wi-Fi';
    default:
      return 'QR Code';
  }
}
