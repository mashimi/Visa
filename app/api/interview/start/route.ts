import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { generateNextQuestion, InterviewContext } from '@/lib/ai/interview-engine';

export async function POST(req: NextRequest) {
  if (!isAdminInitialized() || !auth || !db) {
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

    const { visaType, persona, missionId, caseId } = await req.json();

    if (!visaType || typeof visaType !== 'string') {
      return NextResponse.json({ error: 'Invalid visa type', message: 'Visa type is required' }, { status: 400 });
    }

    // 1. Gather all Mission Intelligence (RAG Context)
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
        // Using a 2000 character snippet for initial context
        content: data.extractedText?.substring(0, 2000) || ''
      };
    });

    // 2. Load DS-160 Case File Analysis if linked
    let caseFileData: any = null;
    if (caseId) {
      const caseDoc = await db.collection('caseFiles').doc(caseId).get();
      if (caseDoc.exists && (caseDoc.data() as any).userId === userId) {
        caseFileData = caseDoc.data();
      }
    }

    // 3. Initialize Interview Session
    const sessionRef = await db.collection('interviewSessions').add({
      userId,
      visaType,
      persona: persona || 'NEUTRAL',
      missionId: missionId || 'LONDON',
      caseId: caseId || null,
      status: 'ACTIVE',
      currentQuestionIndex: 0,
      progress: 0,
      averageScore: 0,
      startedAt: new Date(),
    });

    // 4. Link session back to caseFile
    if (caseId) {
      await db.collection('caseFiles').doc(caseId).update({
        interviewSessionId: sessionRef.id,
        status: 'INTERVIEW_STARTED',
        updatedAt: new Date(),
      });
    }

    // 5. Build AI context for the FIRST question
    const context: InterviewContext = {
      visaType,
      missionId: missionId || 'LONDON',
      userDocuments: missionIntelligence,
      previousAnswers: [],
      currentQuestionIndex: 0,
      persona: persona || 'NEUTRAL',
      caseFile: caseFileData
        ? {
            applicationData: caseFileData.applicationData,
            applicationAnalysis: caseFileData.applicationAnalysis,
          }
        : undefined,
    };

    // 6. Agent VO generates the opening question
    const firstQuestion = await generateNextQuestion(context);

    // 7. Store the first message in the log
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
    return NextResponse.json({ error: error.message || 'Failed to start interview' }, { status: 500 });
  }
}
