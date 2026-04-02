import { aiClient, AI_MODEL } from '@/lib/ai/client';
import { getVisaDefinitionById } from '@/lib/ai/visa-definitions';

export interface DocumentValidationResult {
  isValid: boolean;
  category: string;
  extractedData: any;
  issues: string[];
  warnings: string[];
  suggestedQuestions: string[];
}

export async function validateDocument(
  text: string,
  filename: string,
  visaType?: string
): Promise<DocumentValidationResult> {
  const visaDefinition = visaType ? getVisaDefinitionById(visaType) : undefined;
  const documentHint = visaDefinition
    ? `The applicant is applying for a ${visaDefinition.name}. Key documents for this visa include: ${visaDefinition.aiContext.documentHint}. Please analyze with this context in mind.`
    : 'The applicant is applying for a visa. Analyze this document generally.';

  const prompt = `
Analyze the following document text extracted from a file named "${filename}".
${documentHint}

Document Text (first 3000 chars):
${text.substring(0, 3000)}

Provide analysis in JSON format:
{
  "category": "passport|bank_statement|employment_letter|business_plan|proof_of_relationship|travel_itinerary|invitation_letter|other",
  "extractedData": {
    "name": "if present",
    "dateOfBirth": "if present",
    "issueDate": "if present",
    "expiryDate": "if present",
    "amount": "if financial document",
    "employer": "if employment letter",
    "position": "if employment letter",
    "travelDates": "if itinerary",
    "purpose": "if invitation letter"
  },
  "issues": ["list of critical missing information or red flags"],
  "warnings": ["list of potential concerns, like a soon-to-expire passport"],
  "suggestedQuestions": ["2-3 specific questions a consular officer might ask based on this document's content, tailored to the visa type if known"]
}
`;

  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return {
    isValid: (result.issues || []).length === 0,
    category: result.category || 'other',
    extractedData: result.extractedData || {},
    issues: result.issues || [],
    warnings: result.warnings || [],
    suggestedQuestions: result.suggestedQuestions || [],
  };
}