import { getVisaDefinitionById } from './visa-definitions';
import { missionDefinitions } from './mission-definitions';
import { aiClient, AI_MODEL } from './client';

export interface CaseFileAnalysis {
  redFlags: string[];
  strengths: string[];
  suggestedFocusAreas: string[];
}

export interface ApplicationData {
  personal?: { fullName: string; nationality: string; maritalStatus: string };
  travel?: { purpose: string; arrivalDate: string; duration: string };
  employment?: { occupation: string; employerName: string; monthlyIncomeUSD: string };
}

export interface InterviewContext {
  visaType: string;
  userDocuments: {
    category: string;
    intelligence: any;
    source: string;
    content: string; // The extracted text snippet
  }[];
  previousAnswers: Array<{ question: string; answer: string }>;
  currentQuestionIndex: number;
  persona?: string;
  missionId?: string;
  caseFile?: {
    applicationData?: ApplicationData;
    applicationAnalysis?: CaseFileAnalysis;
  };
}

export interface InterviewResult {
  score: number;
  feedback: string;
  suggestions: string[];
  nextQuestion: string;
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

function getVisaSpecificContext(visaType: string, missionId?: string) {
  const visaDefinition = getVisaDefinitionById(visaType);
  const visaCategory = visaDefinition?.category;

  let missionFocus = 'Standard operational procedure.';
  if (visaCategory && missionId && missionDefinitions[visaCategory]) {
    const mission = missionDefinitions[visaCategory].find((m) => m.id === missionId);
    if (mission) missionFocus = mission.focus;
  }

  return {
    visa: visaDefinition?.aiContext ?? {
      name: 'Visa',
      keyRegulation: 'local immigration laws',
      primaryConcern:
        'The applicant must prove the purpose of their trip is legitimate and that they will not overstay.',
      documentHint: 'application form',
    },
    mission: { focus: missionFocus },
  };
}

// ─── Exported functions ────────────────────────────────────────────────────────

export async function generateNextQuestion(context: InterviewContext): Promise<string> {
  const { visa, mission } = getVisaSpecificContext(context.visaType, context.missionId);

  const personaProfile =
    context.persona === 'STRICT'
      ? `You are a very skeptical and strict officer. Your questioning is sharp and direct.`
      : context.persona === 'HELPFUL'
      ? `You are a supportive and clear officer. You want to help the applicant explain their situation fully.`
      : `You are a professional and neutral officer. You follow standard protocols.`;

  // LAYER 1: MISSION INTELLIGENCE (Directly from docs)
  const intelligenceBriefing = context.userDocuments.length > 0 
    ? `
**MISSION INTELLIGENCE (Verified Handheld Documents):**
${context.userDocuments.map(doc => `
- SOURCE: ${doc.source} (${doc.category})
  INTELLIGENCE EXTRACTION: ${JSON.stringify(doc.intelligence)}
  RAW SNIPPET: "${doc.content.substring(0, 500)}..."
`).join('\n')}
`
    : 'No documents provided.';

  // LAYER 2: DS-160 PRE-ANALYSIS (Case File)
  const caseFileBriefing = context.caseFile 
    ? `
**CASE FILE ANALYSIS (Agent DS-160 PRE-SCREEN):**
Application Data: ${JSON.stringify(context.caseFile.applicationData)}
RED FLAGS IDENTIFIED: ${context.caseFile.applicationAnalysis?.redFlags.join(', ')}
STRENGTHS: ${context.caseFile.applicationAnalysis?.strengths.join(', ')}
SUGGESTED FOCUS: ${context.caseFile.applicationAnalysis?.suggestedFocusAreas.join(', ')}
`
    : 'No case file pre-analysis available.';

  const prompt = `
You are a consular officer conducting a ${visa.name} interview.
Location Focus: ${mission.focus}
Persona: ${personaProfile}
Primary Concern: ${visa.primaryConcern}

${caseFileBriefing}
${intelligenceBriefing}

Previous conversation:
${context.previousAnswers.length === 0 ? 'Interview is just starting.' : context.previousAnswers.map((a) => `Officer: ${a.question}\nApplicant: ${a.answer}`).join('\n')}

INSTRUCTIONS:
1. Conduct the interview based on the Case File and Mission Intelligence.
2. Probe into identified Red Flags immediately.
3. Be aware of strengths but continue to cross-verify.
4. DO NOT suggest uploading documents that are already listed in the MISSION INTELLIGENCE.
5. Generate the NEXT Logical Question.

Output ONLY the question itself.
`;

  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return completion.choices[0].message.content || "Thank you. Let's continue.";
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  context: InterviewContext
): Promise<InterviewResult> {
  const { visa, mission } = getVisaSpecificContext(context.visaType, context.missionId);

  const intelligenceContext = context.userDocuments.length > 0
    ? `
**VERIFIED INTELLIGENCE RECORDS (What you can see):**
${context.userDocuments.map(doc => `
- ${doc.category} (${doc.source}):
  Data: ${JSON.stringify(doc.intelligence)}
  Text: ${doc.content.substring(0, 300)}...
`).join('\n')}
`
    : 'No documents provided.';

  const caseFileContext = context.caseFile 
    ? `
**DS-160 PRE-ANALYSIS RED FLAGS:**
${context.caseFile.applicationAnalysis?.redFlags.join(', ')}
` 
    : '';

  const prompt = `
Evaluate the applicant's answer for a ${context.visaType} application.
Location Focus: ${mission.focus}
Primary Concern: ${visa.primaryConcern}

${caseFileContext}
${intelligenceContext}

Question: ${question}
Applicant Answer: ${answer}

EVALUATION CRITERIA:
1. Does the answer match the VERIFIED INTELLIGENCE RECORDS?
2. Does the answer address previously identified RED FLAGS?
3. If they contradict the documents (e.g. salary, employer), score must be < 40 and feedback must be severe.

Provide analysis in JSON format:
{
  "score": (0-100),
  "feedback": "Analysis of their answer, explicitly mentioning if it matches or contradicts the uploaded documents/case-file.",
  "suggestions": ["specific improvement for the applicant"],
  "nextQuestion": "Logical follow-up question."
}
`;

  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });

  const resultBody = completion.choices[0].message.content || '{}';
  const result = JSON.parse(resultBody);

  return {
    score: result.score || 70,
    feedback: result.feedback || 'Your answer was acceptable.',
    suggestions: result.suggestions || [],
    nextQuestion: result.nextQuestion || (await generateNextQuestion(context)),
  };
}