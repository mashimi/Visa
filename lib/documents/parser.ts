import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';

export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimeType.startsWith('image/')) {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(buffer);
      await worker.terminate();
      return text;
    } else {
      // For other text files
      return buffer.toString('utf-8');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
}