export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface UrlFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export type AllFormData = {
  url: UrlFormData;
  text: TextFormData;
  email: EmailFormData;
  phone: PhoneFormData;
  wifi: WifiFormData;
};

export interface QRDesignSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  level: ErrorCorrectionLevel;
  margin: number;
}

export interface Preset {
  id: string;
  name: string;
  badge: string;
  fgColor: string;
  bgColor: string;
  level: ErrorCorrectionLevel;
  margin: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: QRType;
  title: string;
  payload: string;
  formData: any;
  design: QRDesignSettings;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
