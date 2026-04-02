import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  filename: string
): Promise<DocumentValidationResult> {
  const prompt = `
Analyze this visa document:

${text.substring(0, 3000)}

Document name: ${filename}

Provide analysis in JSON:
{
  "category": "passport|bank_statement|employment_letter|travel_itinerary|invitation_letter|other",
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
  "issues": ["missing critical information"],
  "warnings": ["passport expires soon"],
  "suggestedQuestions": ["What is the source of these funds?"]
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
}