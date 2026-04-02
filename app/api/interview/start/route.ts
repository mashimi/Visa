import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { generateNextQuestion } from '@/lib/ai/interview-engine';

interface UserDocument {
  documents: any[];
}

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

    const { visaType, persona, mission } = await req.json();

    // Validate visaType
    if (!visaType || typeof visaType !== 'string') {
      return NextResponse.json(
        { error: 'Invalid visa type', message: 'Visa type is required' },
        { status: 400 }
      );
    }

    // Get user documents
    const userDocFromDb = await db.collection('users').doc(userId).get();
    const userData = userDocFromDb.data() as UserDocument | undefined;
    const userDocuments = userData?.documents || [];

    // Create interview session
    const sessionRef = await db.collection('interviewSessions').add({
      userId,
      visaType,
      persona: persona || 'NEUTRAL',
      mission: mission || 'LONDON',
      status: 'ACTIVE',
      currentQuestionIndex: 0,
      progress: 0,
      startedAt: new Date(),
    });

    // Generate first question with document context
    const context = {
      visaType,
      userDocuments,
      previousAnswers: [],
      currentQuestionIndex: 0,
    };

    const firstQuestion = await generateNextQuestion(context);

    // Save the first message
    await db.collection('interviewMessages').add({
      sessionId: sessionRef.id,
      role: 'ASSISTANT',
      content: firstQuestion,
      createdAt: new Date(),
    });

    return NextResponse.json({
      sessionId: sessionRef.id,
      question: firstQuestion,
      progress: 0,
    });
  } catch (error: any) {
    console.error('Start interview error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start interview' },
      { status: 500 }
    );
  }
}

