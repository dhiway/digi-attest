import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToFile(base64: string, filename: string): File {
  // If it's already prefixed, just parse it
  const hasPrefix = base64.startsWith('data:');
  let mime = 'image/jpeg';
  let cleanBase64 = base64;

  if (!hasPrefix) {
    // Detect type by first few base64 chars
    if (base64.startsWith('/9j/')) mime = 'image/jpeg';
    else if (base64.startsWith('iVBOR')) mime = 'image/png';
    else if (base64.startsWith('R0lGOD')) mime = 'image/gif';
    else if (base64.startsWith('UklGR')) mime = 'image/webp';

    cleanBase64 = `data:${mime};base64,${base64}`;
  }

  const [header, data] = cleanBase64.split(',');
  if (!data) throw new Error('Invalid base64 string');

  mime = header.match(/:(.*?);/)?.[1] || mime;

  const binary = atob(data);
  const len = binary.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binary.charCodeAt(i);
  }

  const ext = mime.split('/')[1] || 'jpg';
  return new File([u8arr], `${filename}.${ext}`, { type: mime });
}
