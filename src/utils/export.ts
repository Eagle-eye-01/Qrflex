/**
 * Downloads a canvas element as a PNG file.
 * If svgElement is provided instead, draws it to an offscreen canvas at the target size.
 */
export async function downloadQRCodePNG(
  containerId: string,
  filename: string = 'qrcode.png',
  targetSize?: number
): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) throw new Error('QR container not found');

  const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
  const svg = container.querySelector('svg') as SVGSVGElement | null;

  if (canvas) {
    if (targetSize && targetSize !== canvas.width) {
      // Scale canvas to target size
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = targetSize;
      exportCanvas.height = targetSize;
      const ctx = exportCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, targetSize, targetSize);
        triggerDownload(exportCanvas.toDataURL('image/png'), filename);
        return;
      }
    }
    triggerDownload(canvas.toDataURL('image/png'), filename);
    return;
  }

  if (svg) {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const exportCanvas = document.createElement('canvas');
      const size = targetSize || 1024;
      exportCanvas.width = size;
      exportCanvas.height = size;
      const ctx = exportCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0, size, size);
        triggerDownload(exportCanvas.toDataURL('image/png'), filename);
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  }
}

/**
 * Downloads the QR Code as a scalable vector SVG file.
 */
export function downloadQRCodeSVG(
  containerId: string,
  filename: string = 'qrcode.svg'
): void {
  const container = document.getElementById(containerId);
  if (!container) throw new Error('QR container not found');

  const svg = container.querySelector('svg') as SVGSVGElement | null;
  if (!svg) {
    throw new Error('SVG representation not available for vector export');
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Copies the QR code canvas directly to user's system clipboard as image/png.
 */
export async function copyQRCodeToClipboard(containerId: string): Promise<boolean> {
  const container = document.getElementById(containerId);
  if (!container) return false;

  const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        resolve(true);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
        resolve(false);
      }
    });
  });
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
