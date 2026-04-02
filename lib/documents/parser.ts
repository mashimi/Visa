// @ts-ignore
import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';

export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      // If we got text, return it immediately to avoid slow OCR
      if (data.text && data.text.trim().length > 10) {
        return data.text;
      }
      // If it's a scanned PDF, we'd need OCR (currently limited to image direct upload for speed)
      return '[Scanned PDF - No text layer detected]';
    } else if (mimeType.startsWith('image/')) {
      // Create worker in-line but keep it minimal
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(buffer);
      await worker.terminate();
      return text;
    } else {
      return buffer.toString('utf-8');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
}