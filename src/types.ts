export type QrSize = 200 | 300 | 400;

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrHistoryItem {
  id: string;
  text: string;
  title: string;
  size: QrSize;
  createdAt: number;
}

export interface QrOptions {
  size: QrSize;
  title: string;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
}
