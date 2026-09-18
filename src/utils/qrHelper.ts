import QRCode from 'qrcode';

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'qr-code'
  );
}

export async function generateQrDataUrl(
  text: string,
  options: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<string> {
  return await QRCode.toDataURL(text, {
    width: options.width || 300,
    margin: options.margin ?? 2,
    color: options.color || { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  });
}

export async function generateQrSvg(
  text: string,
  options: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<string> {
  return await QRCode.toString(text, {
    type: 'svg',
    width: options.width || 300,
    margin: options.margin ?? 2,
    color: options.color || { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  });
}

export async function downloadQrCode(
  dataUrl: string,
  title: string,
  size: number
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const padding = 24;
      const titleHeight = title ? 44 : 0;
      const canvas = document.createElement('canvas');
      
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2 + titleHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve();
        return;
      }

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Optional title
      if (title) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, canvas.width / 2, padding + titleHeight / 2 - 4, canvas.width - padding * 2);
      }

      // Draw QR Code
      ctx.drawImage(img, padding, padding + titleHeight);

      // Download
      const link = document.createElement('a');
      link.download = `${slugify(title || 'codigo-qr')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      resolve();
    };
    img.src = dataUrl;
  });
}

export async function copyQrToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
