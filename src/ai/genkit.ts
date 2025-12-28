import { genkit } from 'genkit';
// UPDATED IMPORT: Using the new standard plugin for Gemini 2.5+
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // Gemini 2.5 Flash is supported by this plugin
  model: 'googleai/gemini-2.5-flash-tts', 
});
