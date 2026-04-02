import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { doc, updateDoc } from 'firebase/firestore';

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

    const { documentId, status } = await req.json();

    // Update document status
    const documentRef = doc(db, 'documents', documentId);
    await updateDoc(documentRef, {
      status: status === 'verified' ? 'VALIDATED' : 'REJECTED',
      verifiedAt: new Date(),
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