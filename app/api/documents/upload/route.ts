import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { doc, updateDoc, arrayUnion, addDoc, collection } from 'firebase/firestore';
import { uploadToFirebaseStorage } from '@/lib/storage/s3';
import { extractTextFromFile } from '@/lib/documents/parser';
import { validateDocument } from '@/lib/documents/validator';

export async function POST(req: NextRequest) {
  if (!isAdminInitialized()) {
    return NextResponse.json(
      { 
        error: 'Firebase Admin not configured',
        message: 'Please configure Firebase Admin credentials in .env.local to use this feature.',
        setupGuide: 'https://firebase.google.com/docs/admin/setup'
      },
      { status: 503 }
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await req.formData();
    const files = formData.getAll('documents') as File[];

    const results = [];

    for (const file of files) {
      try {
        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Firebase Storage
        const fileName = `users/${userId}/documents/${Date.now()}_${file.name}`;
        const fileUrl = await uploadToFirebaseStorage(buffer, fileName, file.type);

        // Extract text from document
        const extractedText = await extractTextFromFile(buffer, file.type);

        // Validate with AI
        const validation = await validateDocument(extractedText, file.name);

        // Save to Firestore
        const documentRef = await addDoc(collection(db, 'documents'), {
          userId,
          filename: fileName,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          s3Url: fileUrl,
          category: validation.category,
          status: validation.isValid ? 'VALIDATED' : 'PROCESSING',
          extractedData: validation.extractedData,
          validationFeedback: {
            issues: validation.issues,
            warnings: validation.warnings,
          },
          uploadedAt: new Date(),
        });

        // Update user's documents array
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          documents: arrayUnion({
            id: documentRef.id,
            ...validation.extractedData,
            category: validation.category,
            status: validation.isValid ? 'VALIDATED' : 'PROCESSING',
          }),
        });

        results.push({
          id: documentRef.id,
          filename: file.name,
          category: validation.category,
          isValid: validation.isValid,
          issues: validation.issues,
          warnings: validation.warnings,
          suggestedQuestions: validation.suggestedQuestions,
        });
      } catch (error) {
        console.error('Error processing document:', error);
        results.push({
          filename: file.name,
          error: 'Failed to process document',
        });
      }
    }

    return NextResponse.json({ documents: results });
  } catch (error: any) {
    console.error('Upload documents error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload documents' },
      { status: 500 }
    );
  }
}