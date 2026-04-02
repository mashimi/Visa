import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { deleteFromFirebaseStorage } from '@/lib/storage/s3';

function getUnauthorizedResponse() {
  return NextResponse.json(
    { 
      error: 'Firebase Admin not configured',
      message: 'Please configure Firebase Admin credentials in .env.local to use this feature.',
      setupGuide: 'https://firebase.google.com/docs/admin/setup'
    },
    { status: 503 }
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminInitialized()) {
    return getUnauthorizedResponse();
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const documentId = params.id;

    // Get document
    const documentRef = doc(db, 'documents', documentId);
    const documentDoc = await getDoc(documentRef);

    if (!documentDoc.exists()) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const documentData = documentDoc.data();
    if (documentData?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      document: {
        id: documentDoc.id,
        ...documentData,
        uploadedAt: documentData.uploadedAt.toDate(),
        verifiedAt: documentData.verifiedAt?.toDate(),
      },
    });
  } catch (error: any) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminInitialized()) {
    return getUnauthorizedResponse();
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const documentId = params.id;

    // Get document
    const documentRef = doc(db, 'documents', documentId);
    const documentDoc = await getDoc(documentRef);

    if (!documentDoc.exists()) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const documentData = documentDoc.data();
    if (documentData?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete from storage
    if (documentData.filename) {
      await deleteFromFirebaseStorage(documentData.filename);
    }

    // Delete from Firestore
    await deleteDoc(documentRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete document' },
      { status: 500 }
    );
  }
}