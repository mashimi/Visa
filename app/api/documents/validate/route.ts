import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  if (!isAdminInitialized() || !auth || !db) {
    return NextResponse.json(
      { error: 'Firebase Admin not properly initialized' },
      { status: 503 }
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verified Admin Auth call
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { documentId, status } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // Verify document ownership before update
    const docRef = db.collection('userDocuments').doc(documentId);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
    }

    // Update document status using Admin SDK
    await docRef.update({
      status: status === 'verified' ? 'VALIDATED' : 'REJECTED',
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Validate document error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate document' },
      { status: 500 }
    );
  }
}