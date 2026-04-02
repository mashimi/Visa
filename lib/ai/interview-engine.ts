import OpenAI from 'openai';
import { getInterviewQuestions, generateFollowUp } from './prompts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterviewContext {
  visaType: string;
  userDocuments: any[];
  previousAnswers: Array<{ question: string; answer: string }>;
  currentQuestionIndex: number;
  persona?: string;
  mission?: string;
}

export interface InterviewResult {
  score: number;
  feedback: string;
  suggestions: string[];
  nextQuestion: string;
}



export async function generateNextQuestion(context: InterviewContext): Promise<string> {
  const personaProfile = context.persona === 'STRICT' 
    ? "You are a very skeptical and strict officer. You focus heavily on Section 214(b) (immigrant intent). You challenge the applicant's ties to their home country and financial stability."
    : context.persona === 'HELPFUL'
    ? "You are a supportive and clear officer. You want to help the applicant explain their situation fully, though you still maintain official standards."
    : "You are a professional and neutral officer. You follow standard protocols without extreme bias.";

  const prompt = `
You are a US consular officer at the ${context.mission || 'US Embassy'} conducting a visa interview for a ${context.visaType} visa applicant.

${personaProfile}

Context from documents:
${JSON.stringify(context.userDocuments, null, 2)}

Previous conversation:
${context.previousAnswers.map(a => `Officer: ${a.question}\nApplicant: ${a.answer}`).join('\n')}

Based on the visa type and previous answers, generate the next appropriate interview question.
Be concise, professional, and ask follow-up questions based on previous answers when relevant.
If the applicant's answers seem incomplete or inconsistent, probe deeper.

Next question:
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return completion.choices[0].message.content || "Thank you. Let's continue with the next question.";
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  context: InterviewContext
): Promise<{
  score: number;
  feedback: string;
  suggestions: string[];
  nextQuestion: string;
}> {
  const prompt = `
Evaluate this visa interview answer for a ${context.visaType} application at the ${context.mission || 'US Embassy'}:

Question: ${question}
Answer: ${answer}

Provide analysis in JSON format:
{
  "score": (0-100, based on relevance, clarity, and honesty),
  "feedback": "Brief feedback on the answer quality",
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"],
  "nextQuestion": "Follow-up question based on this answer"
}

Consider:
- Does the answer directly address the question?
- Is the answer consistent with documents?
- Does it demonstrate strong ties to home country (Section 214(b))?
- Is the financial situation clear?
- Is the purpose of travel legitimate?
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  
  return {
    score: result.score || 70,
    feedback: result.feedback || 'Your answer was acceptable.',
    suggestions: result.suggestions || [],
    nextQuestion: result.nextQuestion || await generateNextQuestion(context),
  };
}