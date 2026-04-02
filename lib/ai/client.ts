import OpenAI from 'openai';

const provider = process.env.AI_PROVIDER || 'openai';
const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY;
const baseURL = provider === 'openai' ? undefined : (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com');
const defaultModel = provider === 'openai' ? 'gpt-4o' : 'deepseek-chat';

export const aiClient = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

export const AI_MODEL = process.env.AI_MODEL || defaultModel;

export function isUsingDeepSeek() {
  return provider === 'deepseek';
}
