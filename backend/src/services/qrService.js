import QRCode from 'qrcode';

/** Returns a DataURL PNG for given payload (string or object). */
export async function generateQrDataUrl(payload) {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'M', margin: 1, width: 256 });
}
