import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // 1. Structural Null Guard for Firebase Admin
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
    
    // 2. Verified Admin Auth call
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 3. Server-side Firestore access (Refactored from Client SDK to Admin SDK)
    const userSnap = await db.collection('users').doc(userId).get();
    const userData = userSnap.data();

    return NextResponse.json({
      user: {
        id: userId,
        email: decodedToken.email,
        name: userData?.name || 'User',
        documents: userData?.documents || [],
      },
    });
  } catch (error: any) {
    console.error('Get user session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to authenticate user session' },
      { status: 401 }
    );
  }
}