import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';

interface SessionDocument {
  userId: string;
  visaType: string;
  status: string;
  progress: number;
}

interface MessageDocument {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: any;
  evaluation?: any;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate sessionId is not null or "null"
  const sessionId = params.id;
  if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
    return NextResponse.json(
      { error: 'Invalid session ID', message: 'No session ID provided' },
      { status: 400 }
    );
  }

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

    // 1. Get Session
    const sessionDoc = await db.collection('interviewSessions').doc(sessionId).get();
    const sessionData = sessionDoc.data() as SessionDocument | undefined;

    if (!sessionDoc.exists || sessionData?.userId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // 2. Get Messages
    const messagesSnap = await db.collection('interviewMessages')
      .where('sessionId', '==', sessionId)
      .orderBy('createdAt', 'asc')
      .get();

    const messages: MessageDocument[] = messagesSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...(doc.data() as Omit<MessageDocument, 'id'>)
    }));

    return NextResponse.json({
      id: sessionId,
      ...sessionData,
      messages
    });

  } catch (error: any) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

