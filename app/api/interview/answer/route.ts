import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { evaluateAnswer, InterviewContext, InterviewResult } from '@/lib/ai/interview-engine';

interface SessionDocument {
  userId: string;
  visaType: string;
  persona?: string;
  mission?: string;
  userDocuments?: string[];
  currentQuestionIndex: number;
  status: 'ACTIVE' | 'COMPLETED';
}

interface MessageDocument {
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: Date;
  sessionId: string;
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
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

    const { sessionId, answer } = await req.json();

    // Validate sessionId
    if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid session ID', message: 'No session ID provided' },
        { status: 400 }
      );
    }

    // Validate answer
    if (!answer || typeof answer !== 'string' || !answer.trim()) {
      return NextResponse.json(
        { error: 'Invalid answer', message: 'Answer is required' },
        { status: 400 }
      );
    }

    // 1. Get Session Data
    const sessionDoc = await db.collection('interviewSessions').doc(sessionId).get();
    if (!sessionDoc.exists || (sessionDoc.data() as SessionDocument).userId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const sessionData = sessionDoc.data() as SessionDocument;

    // Check if session is completed
    if (sessionData.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Session completed', message: 'This interview session has already been completed' },
        { status: 400 }
      );
    }

    // 2. Get previous messages for context
    const messagesSnap = await db.collection('interviewMessages')
      .where('sessionId', '==', sessionId)
      .orderBy('createdAt', 'asc')
      .get();
    
    const allMessages = messagesSnap.docs.map((doc: any) => doc.data() as MessageDocument);
    const lastAssistantMessage = [...allMessages].reverse().find(m => m.role === 'ASSISTANT');
    const question = lastAssistantMessage?.content || "Please tell me about your travel plans.";

    // 3. Save User Answer
    await db.collection('interviewMessages').add({
      sessionId,
      role: 'USER',
      content: answer,
      createdAt: new Date(),
    });

    // 4. Prepare Context for AI
    const previousAnswers: { question: string; answer: string }[] = [];
    for (let i = 0; i < allMessages.length; i++) {
        const current = allMessages[i];
        const next = allMessages[i+1];
        if (current.role === 'ASSISTANT' && next?.role === 'USER') {
            previousAnswers.push({
                question: current.content,
                answer: next.content
            });
        }
    }

    const context: InterviewContext = {
      visaType: sessionData.visaType,
      persona: sessionData.persona,
      mission: sessionData.mission,
      userDocuments: sessionData.userDocuments || [],
      previousAnswers,
      currentQuestionIndex: sessionData.currentQuestionIndex + 1,
    };

    // 5. Evaluate Answer and Generate Next Question
    const result: InterviewResult = await evaluateAnswer(question, answer, context);

    // 6. Update Session
    const newProgress = Math.min(100, Math.round(((sessionData.currentQuestionIndex + 1) / 10) * 100));
    const isComplete = newProgress >= 100;

    await db.collection('interviewSessions').doc(sessionId).update({
      currentQuestionIndex: sessionData.currentQuestionIndex + 1,
      progress: newProgress,
      status: isComplete ? 'COMPLETED' : 'ACTIVE',
      lastEvaluation: result
    });

    // 7. Save Assistant Question/Response
    await db.collection('interviewMessages').add({
      sessionId,
      role: 'ASSISTANT',
      content: result.nextQuestion,
      createdAt: new Date(),
      evaluation: {
        score: result.score,
        feedback: result.feedback,
        suggestions: result.suggestions
      }
    });

    return NextResponse.json({
      feedback: result.feedback,
      score: result.score,
      suggestions: result.suggestions,
      nextQuestion: result.nextQuestion,
      progress: newProgress,
      isComplete
    });

  } catch (error: any) {
    console.error('Answer submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process answer' },
      { status: 500 }
    );
  }
}

