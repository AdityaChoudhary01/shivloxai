// src/ai/flows/generate-initial-prompt.ts
'use server';

/**
 * @fileOverview Generates example prompts for users.
 *
 * - generateInitialPrompts - A function that returns a list of example prompts.
 * - GenerateInitialPromptsOutput - The return type for the generateInitialPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptsOutputSchema = z.array(
  z.string().describe('An example prompt for the user to try.')
);
export type GenerateInitialPromptsOutput = z.infer<
  typeof GenerateInitialPromptsOutputSchema
>;

// Hardcoded prompts to avoid unnecessary API calls and rate limiting.
const initialPrompts: GenerateInitialPromptsOutput = [
  "Explain quantum computing in simple terms.",
  "Write a short story about a robot who discovers music.",
  "What are some healthy and delicious breakfast ideas?",
  "Create a workout plan for building muscle at home.",
  "Summarize the plot of the movie 'Inception'.",
  "Translate 'Where is the nearest library?' to French.",
  "Write a python script to sort a list of numbers.",
  "Give me some tips for learning a new language.",
  "What's the history of the Eiffel Tower?",
  "Plan a 3-day trip to Tokyo.",
  "Write a haiku about a rainy day.",
  "/imagine a futuristic city in the clouds",
  "What are the main differences between React and Vue.js?",
  "Explain the theory of relativity like I'm five.",
  "Come up with a catchy slogan for a new coffee shop.",
  "Write a formal email to a client requesting feedback.",
];


export async function generateInitialPrompts(): Promise<GenerateInitialPromptsOutput> {
  return initialPrompts;
}
