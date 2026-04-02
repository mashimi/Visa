import { NextRequest, NextResponse } from 'next/server';
import { auth, db, isAdminInitialized } from '@/lib/firebase-admin';
import { aiClient, AI_MODEL } from '@/lib/ai/client';
import { getVisaDefinitionById } from '@/lib/ai/visa-definitions';

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

    const { visaId, missionId, applicationData } = await req.json();

    if (!visaId || !applicationData) {
      return NextResponse.json({ error: 'visaId and applicationData are required' }, { status: 400 });
    }

    const visaDefinition = getVisaDefinitionById(visaId);

    // 1. Fetch available mission intelligence (RAG Context)
    const documentsSnap = await db
      .collection('userDocuments')
      .where('userId', '==', userId)
      .get();
    
    const missionIntelligence = documentsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        category: data.category,
        data: data.extractedData,
        source: data.name
      };
    });

    const intelBriefing = missionIntelligence.length > 0
      ? `
VERIFIED MISSION INTELLIGENCE (Documents uploaded by user):
${missionIntelligence.map(m => `- [${m.category}] from ${m.source}: ${JSON.stringify(m.data)}`).join('\n')}
`
      : 'No verified documents found for this user yet.';

    // 2. Agent DS-160 prompt with RAG integration
    const prompt = `
You are an expert pre-adjudication visa consultant (Agent DS-160). Your job is to analyze a draft visa application (DS-160 data) against the verified mission intelligence (uploaded documents) to find inconsistencies and red flags.

Visa Type: ${visaDefinition?.name || visaId}
Primary Concern: ${visaDefinition?.aiContext.primaryConcern || 'Prove legitimacy of travel intent.'}

${intelBriefing}

Applicant's Form Data:
${JSON.stringify(applicationData, null, 2)}

TASK:
1. Verify if the form data matches the uploaded mission intelligence.
2. Identify red flags where form data contradicts documents (e.g. salary in form vs salary in bank statement).
3. Identify strengths (where documents strongly support the claims).
4. Suggest focus areas for the interview.

Return a JSON object:
{
  "redFlags": ["List of inconsistencies between form and verified documents."],
  "strengths": ["List of points strongly supported by docs."],
  "suggestedFocusAreas": ["Questions the officer will likely ask based on these discrepancies/strengths."]
}
`;

    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    // 3. Create/Update caseFile document
    const caseRef = await db.collection('caseFiles').add({
      userId,
      visaId,
      missionId: missionId || 'LONDON',
      status: 'ANALYSIS_COMPLETE',
      applicationData,
      applicationAnalysis: {
        redFlags: analysis.redFlags || [],
        strengths: analysis.strengths || [],
        suggestedFocusAreas: analysis.suggestedFocusAreas || [],
      },
      intelligenceUsed: missionIntelligence.map(m => m.source),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      caseId: caseRef.id,
      analysis: {
        redFlags: analysis.redFlags || [],
        strengths: analysis.strengths || [],
        suggestedFocusAreas: analysis.suggestedFocusAreas || [],
      },
    });
  } catch (error: any) {
    console.error('Preparation analyze error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
