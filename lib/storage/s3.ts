import { storage } from '@/lib/firebase-admin';

export async function uploadToFirebaseStorage(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not properly initialized. Check environment variables.');
    }
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error);
    throw error;
  }
}

export async function deleteFromFirebaseStorage(fileName: string): Promise<void> {
  try {
    if (!storage) {
      throw new Error('Firebase Storage not properly initialized. Check environment variables.');
    }
    const bucket = storage.bucket();
    const file = bucket.file(fileName);
    await file.delete();
  } catch (error) {
    console.error('Error deleting from Firebase Storage:', error);
    throw error;
  }
}