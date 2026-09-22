import type { QRType, AllFormData, FormErrors } from '../types/qr';

export function validateForm(type: QRType, data: AllFormData): FormErrors {
  const errors: FormErrors = {};

  switch (type) {
    case 'url': {
      const val = data.url.url.trim();
      if (!val) {
        errors.url = 'URL cannot be empty';
      } else {
        const urlPattern = /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i;
        const localhostPattern = /^(https?:\/\/)?localhost(:\d+)?(\/.*)?$/i;
        const ipPattern = /^(https?:\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;

        if (!urlPattern.test(val) && !localhostPattern.test(val) && !ipPattern.test(val)) {
          errors.url = 'Please enter a valid website URL (e.g. https://example.com)';
        }
      }
      break;
    }

    case 'text': {
      const val = data.text.text.trim();
      if (!val) {
        errors.text = 'Plain text cannot be empty';
      } else if (val.length > 2500) {
        errors.text = `Text is too long (${val.length}/2500 characters)`;
      }
      break;
    }

    case 'email': {
      const email = data.email.email.trim();
      if (!email) {
        errors.email = 'Recipient email address is required';
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          errors.email = 'Please enter a valid email address (e.g. name@domain.com)';
        }
      }
      break;
    }

    case 'phone': {
      const phone = data.phone.phone.trim();
      if (!phone) {
        errors.phone = 'Phone number is required';
      } else {
        const phoneDigits = phone.replace(/\D/g, '');
        const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
        if (!phonePattern.test(phone) || phoneDigits.length < 5) {
          errors.phone = 'Please enter a valid phone number (at least 5 digits)';
        }
      }
      break;
    }

    case 'sms': {
      const phone = data.sms?.phone.trim() || '';
      if (!phone) {
        errors.phone = 'Recipient phone number is required';
      } else {
        const phoneDigits = phone.replace(/\D/g, '');
        const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
        if (!phonePattern.test(phone) || phoneDigits.length < 5) {
          errors.phone = 'Please enter a valid phone number';
        }
      }
      break;
    }

    case 'wifi': {
      const { ssid, password, encryption } = data.wifi;
      if (!ssid.trim()) {
        errors.ssid = 'Network SSID (Name) is required';
      }

      if (encryption === 'WPA') {
        if (!password) {
          errors.password = 'WPA/WPA2 networks require a password';
        } else if (password.length < 8) {
          errors.password = 'WPA passwords must be at least 8 characters';
        } else if (password.length > 63) {
          errors.password = 'WPA passwords cannot exceed 63 characters';
        }
      } else if (encryption === 'WEP') {
        if (!password) {
          errors.password = 'WEP networks require a password';
        } else if (password.length < 5) {
          errors.password = 'WEP key must be at least 5 characters';
        }
      }
      break;
    }
  }

  return errors;
}
