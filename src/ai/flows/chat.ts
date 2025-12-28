'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateImage } from './generate-image';

/* ---------------- SCHEMAS ---------------- */

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  prompt: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

/* ---------------- FLOW ---------------- */

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    try {
      /* -------- IMAGE COMMAND -------- */
      if (input.prompt.startsWith('/imagine ')) {
        const imagePrompt = input.prompt.replace('/imagine ', '').trim();
        const { imageUrl } = await generateImage({ prompt: imagePrompt });
        return { response: imageUrl };
      }

      /* -------- SYSTEM PROMPT -------- */
      const systemPrompt = `
You are Shivlox AI, a helpful and modern AI assistant.

RULES:
- Be helpful, accurate, and engaging.
- Use markdown and emojis (✨, 🚀).
- You have FULL access to the conversation history.
- Use previous messages to answer follow-up questions.
      `.trim();

      /* -------- DEBUG -------- */
      // This helps you see in the terminal exactly what the AI is receiving
      console.log('[Chat] New Prompt:', input.prompt);
      console.log('[Chat] History Count:', input.history.length);

      /* -------- ✅ CORRECT HISTORY TRANSFORM -------- */
      // We map the input history to the format Genkit expects.
      // We do NOT slice it here. We trust the client sent us the right context.
      const history = input.history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model', // Explicitly cast for safety
        content: [{ text: msg.content }],
      }));

      // Log the last message in history to verify continuity (optional debug)
      if (history.length > 0) {
        const lastMsg = history[history.length - 1];
        console.log(`[Chat] Last History Item: [${lastMsg.role}] ${lastMsg.content[0].text.substring(0, 30)}...`);
      }

      /* -------- GENERATE -------- */
      const resp = await ai.generate({
        system: systemPrompt,
        prompt: input.prompt,
        history: history as any, // Cast to any to bypass strict version mismatches
        config: {
          temperature: 0.7,
        },
      });

      return {
        response: resp.text || "I'm sorry, I couldn't generate a response.",
      };

    } catch (error: any) {
      console.error('Server Action Error in chatFlow:', error);
      return {
        response: `Error: ${error?.message || 'Something went wrong on the server.'}`,
      };
    }
  }
);

/* ---------------- EXPORT ---------------- */

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}
