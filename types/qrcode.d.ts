declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    margin?: number;
    width?: number;
    scale?: number;
    color?: { dark?: string; light?: string };
  }
  export function toDataURL(text: string, opts?: QRCodeToDataURLOptions): Promise<string>;
}
