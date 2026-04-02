import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { evaluateAnswer, InterviewContext, InterviewResult } from '@/lib/ai/interview-engine';

export async function POST(req: NextRequest) {
  if (!db || !auth) {
    return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 503 });
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

    if (!sessionId) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    // 1. Get session
    const sessionDoc = await db.collection('interviewSessions').doc(sessionId).get();
    if (!sessionDoc.exists || sessionDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const sessionData = sessionDoc.data() as any;

    if (sessionData.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Session completed' }, { status: 400 });
    }

    // 2. Get previous messages
    const messagesSnap = await db
      .collection('interviewMessages')
      .where('sessionId', '==', sessionId)
      .orderBy('createdAt', 'asc')
      .get();

    const allMessages = messagesSnap.docs.map(doc => doc.data());
    const lastAssistantMessage = [...allMessages].reverse().find(m => m.role === 'ASSISTANT');
    const question = lastAssistantMessage?.content || 'Please tell me about your travel plans.';

    // 3. Save user answer
    const userMessageRef = await db.collection('interviewMessages').add({
      sessionId,
      role: 'USER',
      content: answer,
      createdAt: new Date(),
    });

    // 4. Build conversation history
    const previousAnswers: { question: string; answer: string }[] = [];
    for (let i = 0; i < allMessages.length; i++) {
      const current = allMessages[i];
      const next = allMessages[i + 1];
      if (current.role === 'ASSISTANT' && next?.role === 'USER') {
        previousAnswers.push({ question: current.content, answer: next.content });
      }
    }

    // 5. Load mission intelligence (RAG Context)
    const documentsSnap = await db
      .collection('userDocuments')
      .where('userId', '==', userId)
      .get();
    
    const missionIntelligence = documentsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        category: data.category,
        intelligence: data.extractedData,
        source: data.name,
        // We only send a snippet of text to save tokens, or the full text if small
        content: data.extractedText?.substring(0, 2000)
      };
    });

    // 6. Build AI context
    const context: InterviewContext = {
      visaType: sessionData.visaType,
      persona: sessionData.persona,
      missionId: sessionData.missionId,
      userDocuments: missionIntelligence, // Now contains RAG intelligence
      previousAnswers,
      currentQuestionIndex: sessionData.currentQuestionIndex + 1,
    };

    // 7. Evaluate answer
    const result: InterviewResult = await evaluateAnswer(question, answer, context);

    // 8. Calculate running average score
    const evaluationsSnap = await db
      .collection('interviewSessions')
      .doc(sessionId)
      .collection('evaluations')
      .get();
    const existingScores = evaluationsSnap.docs.map(doc => doc.data().score as number);
    const allScores = [...existingScores, result.score];
    const averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

    const newProgress = Math.min(100, Math.round(((sessionData.currentQuestionIndex + 1) / 10) * 100));
    const isComplete = newProgress >= 100;

    // 9. Update session
    await db.collection('interviewSessions').doc(sessionId).update({
      currentQuestionIndex: sessionData.currentQuestionIndex + 1,
      progress: newProgress,
      status: isComplete ? 'COMPLETED' : 'ACTIVE',
      lastEvaluation: result,
      averageScore,
    });

    // 10. Store detailed evaluation
    await db
      .collection('interviewSessions')
      .doc(sessionId)
      .collection('evaluations')
      .doc(userMessageRef.id)
      .set({
        question,
        answer,
        score: result.score,
        feedback: result.feedback,
        suggestions: result.suggestions,
        createdAt: new Date(),
      });

    // 11. Save assistant response
    await db.collection('interviewMessages').add({
      sessionId,
      role: 'ASSISTANT',
      content: result.nextQuestion,
      createdAt: new Date(),
      evaluation: {
        score: result.score,
        feedback: result.feedback,
        suggestions: result.suggestions,
      },
    });

    return NextResponse.json({
      feedback: result.feedback,
      score: result.score,
      suggestions: result.suggestions,
      nextQuestion: result.nextQuestion,
      progress: newProgress,
      averageScore,
      isComplete,
    });
  } catch (error: any) {
    console.error('Answer submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process answer' }, { status: 500 });
  }
}
