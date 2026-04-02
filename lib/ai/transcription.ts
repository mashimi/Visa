import OpenAI from 'openai';
import { File as NodeFile } from 'node:buffer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

/**
 * Convert Buffer to a File object compatible with OpenAI SDK
 */
function bufferToFile(buffer: Buffer, filename: string, mimeType: string): File {
  // Convert Node.js Buffer to a web-compatible Blob
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

/**
 * Transcribe audio file using OpenAI Whisper API
 * @param audioBuffer - Audio file as Buffer
 * @param filename - Original filename with extension
 * @returns Transcription result with text
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<TranscriptionResult> {
  try {
    const audioFile = bufferToFile(audioBuffer, filename, 'audio/webm');
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
      temperature: 0.0,
    });

    return {
      text: transcription.text,
      language: 'en',
      duration: 0,
    };
  } catch (error: any) {
    console.error('Whisper transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Transcribe with detailed information (timestamps, segments)
 */
export async function transcribeAudioVerbose(
  audioBuffer: Buffer,
  filename: string
): Promise<any> {
  try {
    const audioFile = bufferToFile(audioBuffer, filename, 'audio/webm');
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'verbose_json',
      temperature: 0.0,
    });

    return {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      segments: transcription.segments,
    };
  } catch (error: any) {
    console.error('Whisper verbose transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Translate non-English audio to English text
 */
export async function translateAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    const audioFile = bufferToFile(audioBuffer, filename, 'audio/webm');
    
    const translation = await openai.audio.translations.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
      temperature: 0.0,
    });

    return translation as unknown as string;
  } catch (error: any) {
    console.error('Whisper translation error:', error);
    throw new Error(`Failed to translate audio: ${error.message}`);
  }
}

/**
 * Validate audio file format and size
 */
export function validateAudioFile(fileSize: number, mimeType: string): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 25 * 1024 * 1024; // 25MB (Whisper limit)
  const allowedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/webm',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/flac',
  ];

  if (fileSize > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds 25MB limit (${(fileSize / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  if (!allowedTypes.includes(mimeType)) {
    return {
      isValid: false,
      error: `File type ${mimeType} not supported. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
}