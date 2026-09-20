export interface ContrastAnalysis {
  ratio: number;
  isInverted: boolean;
  score: 'excellent' | 'acceptable' | 'poor';
  warningMessage: string | null;
  fgLuminance: number;
  bgLuminance: number;
}

/**
 * Parses hex color to [r, g, b] (0-255)
 */
function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleaned.length !== 6) {
    return [0, 0, 0];
  }
  const r = parseInt(cleaned.slice(0, 2), 16) || 0;
  const g = parseInt(cleaned.slice(2, 4), 16) || 0;
  const b = parseInt(cleaned.slice(4, 6), 16) || 0;
  return [r, g, b];
}

/**
 * Calculates WCAG relative luminance of an sRGB color (0 to 1)
 */
function getRelativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function analyzeContrast(fgColor: string, bgColor: string): ContrastAnalysis {
  const fgRgb = hexToRgb(fgColor);
  const bgRgb = hexToRgb(bgColor);

  const lFg = getRelativeLuminance(fgRgb);
  const lBg = getRelativeLuminance(bgRgb);

  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  const isInverted = lBg < lFg; // background is darker than foreground

  let score: 'excellent' | 'acceptable' | 'poor';
  let warningMessage: string | null = null;

  if (isInverted && ratio < 4.5) {
    score = 'poor';
    warningMessage =
      'High Scannability Risk: The background is darker than the foreground and contrast is low. Many mobile cameras and barcode scanners will fail to decode this code.';
  } else if (isInverted) {
    score = 'acceptable';
    warningMessage =
      'Inverted Polarity Detected: Background is darker than the QR code. While modern smartphones may scan it, many legacy and hardware scanners require dark-on-light codes.';
  } else if (ratio < 3.0) {
    score = 'poor';
    warningMessage =
      `Critically Low Contrast (${ratio.toFixed(2)}:1): Standard scanners require at least 3.0:1 contrast to reliably separate modules from the background.`;
  } else if (ratio < 4.5) {
    score = 'acceptable';
    warningMessage =
      `Sub-optimal Contrast (${ratio.toFixed(2)}:1): May struggle in low-light or glare conditions. A contrast ratio of 4.5:1 or higher is recommended.`;
  } else {
    score = 'excellent';
    warningMessage = null;
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    isInverted,
    score,
    warningMessage,
    fgLuminance: lFg,
    bgLuminance: lBg,
  };
}
