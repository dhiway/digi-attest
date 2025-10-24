import scribe from 'scribe.js-ocr';
import { base64ToFile } from '../utils';
import { generateFormData } from './ocr-matcher';

type photo = {
  base64: string;
  dataUrl: string;
};

export async function runOcr(photo: photo, body: any, profileId: string) {
  try {
    const file = base64ToFile(photo?.base64!, `${profileId}-${Date.now()}`);

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    await scribe.init({ ocr: true, font: true });
    const text = await scribe.extractText([file]);
    const output = generateFormData(text as string, body);
    return output;
  } catch (err) {
    console.error('Error extracting text:', err);
  }
}
