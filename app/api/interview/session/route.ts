import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
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

  // Ensure auth and db are initialized
  if (!auth || !db) {
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
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get up to 10 recent sessions
    const sessionsSnapshot = await db
      .collection('interviewSessions')
      .where('userId', '==', userId)
      .orderBy('startedAt', 'desc')
      .limit(10)
      .get();

    const sessions = sessionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      startedAt: doc.data().startedAt?.toDate?.() || doc.data().startedAt
    }));

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('List sessions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
