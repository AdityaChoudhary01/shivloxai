'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateImage } from './generate-image';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })),
  prompt: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    try {
      // 1. Image Generation Handler
      if (input.prompt.startsWith('/imagine ')) {
        const imagePrompt = input.prompt.replace('/imagine ', '');
        const { imageUrl } = await generateImage({ prompt: imagePrompt });
        return { response: imageUrl };
      }

      const systemPrompt = `You are Shivlox AI, a helpful and modern AI assistant.
RULES:
- Be helpful, accurate, and engaging.
- Use markdown and emojis (✨, 🚀).
- MEMORY: You have access to the chat history. Use it to answer follow-up questions.`;

      // 2. Debugging (Check your server terminal to confirm history is arriving)
      console.log(`[Chat] Prompt: ${input.prompt.substring(0, 50)}...`);
      console.log(`[Chat] History Depth: ${input.history.length} messages`);

      // 3. Construct History
      // We take the last 10 messages (5 user turns, 5 ai turns) for context.
      // CRITICAL: Do NOT add fake system messages here. Pass them to 'system' below.
      const history = input.history.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          content: [{ text: msg.content }] 
      }));

      // 4. Generate Response
      const resp = await ai.generate({
        prompt: input.prompt,
        history: history as any, // Cast to avoid strict type conflicts if any
        system: systemPrompt,    // Native system instruction support
        config: {
          temperature: 0.7,
        }
      });

      const textResponse = resp.text || "I'm sorry, I couldn't generate a response.";

      return { response: textResponse };

    } catch (error: any) {
      console.error("Server Action Error in chatFlow:", error);
      return { response: `Error: ${error.message || 'Something went wrong on the server.'}` };
    }
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}
