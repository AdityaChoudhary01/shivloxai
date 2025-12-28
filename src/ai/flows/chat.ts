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

      /* -------- SYSTEM PROMPT (STRICT CONTEXT) -------- */
      const systemPrompt = `
You are Shivlox AI, a helpful and modern AI assistant.

RULES:
- Be helpful, accurate, and engaging.
- Use markdown and emojis (✨, 🚀).

🧠 MEMORY & CONTEXT RULES (CRITICAL):
1. **IMPLICIT CONTEXT:** If the user sends a short follow-up like "tell me in short", "summarize", "why?", "explain", or "continue", THEY ARE REFERRING TO THE PREVIOUS MESSAGE.
2. **DO NOT ASK FOR CLARIFICATION:** If there is chat history, never ask "What do you want me to summarize?". Just summarize the last topic immediately.
3. **IDENTITY:** If the user asks "Who am I?" or "What is my name?", check the history. If they told you their name, say it.

Your goal is to be conversational and smart. Don't play dumb if the context is right there in the history.
      `.trim();

      /* -------- DEBUG -------- */
      console.log('[Chat] Prompt:', input.prompt);
      console.log('[Chat] History received:', input.history.length);

      /* -------- HISTORY TRANSFORM -------- */
      const history = input.history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: [{ text: msg.content }],
      }));

      // Debug check
      if (history.length > 0) {
        const lastMsg = history[history.length - 1]; 
        console.log(`[Chat] Last Topic: ${lastMsg.content[0].text.substring(0, 40)}...`);
      }

      /* -------- GENERATE -------- */
      const resp = await ai.generate({
        system: systemPrompt,
        prompt: input.prompt,
        history: history as any,
        config: {
          temperature: 0.6, // Slightly lower temp to make it follow instructions better
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
