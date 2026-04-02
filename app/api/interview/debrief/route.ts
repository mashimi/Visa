import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { aiClient, AI_MODEL } from '@/lib/ai/client';

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

    const { caseId } = await req.json();
    if (!caseId) {
      return NextResponse.json({ error: 'caseId is required' }, { status: 400 });
    }

    // Load case file
    const caseDoc = await db.collection('caseFiles').doc(caseId).get();
    if (!caseDoc.exists || (caseDoc.data() as any).userId !== userId) {
      return NextResponse.json({ error: 'Case file not found' }, { status: 404 });
    }
    const caseData = caseDoc.data() as any;

    if (!caseData.interviewSessionId) {
      return NextResponse.json({ error: 'No interview session linked to this case' }, { status: 400 });
    }

    // Load full interview transcript
    const messagesSnap = await db
      .collection('interviewMessages')
      .where('sessionId', '==', caseData.interviewSessionId)
      .orderBy('createdAt', 'asc')
      .get();

    const transcript = messagesSnap.docs
      .map((doc: any) => {
        const d = doc.data();
        return `${d.role === 'ASSISTANT' ? 'Officer' : 'Applicant'}: ${d.content}`;
      })
      .join('\n');

    // Agent Analyst prompt
    const prompt = `
You are a master Visa Interview Analyst (Agent Analyst). Provide a final, holistic debriefing on a candidate's performance. You have access to their initial application, the pre-interview red flags, and the full transcript of their interview.

Visa Type: ${caseData.visaId}
Initial Application Data: ${JSON.stringify(caseData.applicationData, null, 2)}
Pre-Interview Red Flags: ${(caseData.applicationAnalysis?.redFlags || []).join(', ') || 'None identified.'}
Pre-Interview Strengths: ${(caseData.applicationAnalysis?.strengths || []).join(', ') || 'None identified.'}
Key Focus Areas: ${(caseData.applicationAnalysis?.suggestedFocusAreas || []).join(', ') || 'Standard areas.'}

Full Interview Transcript:
${transcript}

Provide a final report in **markdown format** that includes:

## Overall Assessment
A summary verdict (likely Approved / Borderline / Likely Denied) with clear reasoning.

## Performance on Red Flags
How well did the applicant address each pre-identified issue?

## Communication Skills
Analyze clarity, confidence, and conciseness based on the transcript.

## Critical Mistakes
Point out the 1-3 worst answers or moments in the interview with direct quotes.

## Actionable Improvement Plan
A numbered list of concrete, specific steps the applicant should take before their real interview.

Be direct, professional, and honest. This is for training purposes.
`;

    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const finalReport = completion.choices[0].message.content || 'Report generation failed.';

    // Save report and update case status
    await db.collection('caseFiles').doc(caseId).update({
      finalReport,
      status: 'DEBRIEF_COMPLETE',
      updatedAt: new Date(),
    });

    return NextResponse.json({ finalReport });
  } catch (error: any) {
    console.error('Debrief error:', error);
    return NextResponse.json({ error: error.message || 'Debrief generation failed' }, { status: 500 });
  }
}
