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

      /* -------- SYSTEM PROMPT (HYBRID FIXED) -------- */
      // This prompt explicitly authorizes the AI to use the name found in history
      // AND instructs it to use context for other follow-up questions.
      const systemPrompt = `
You are Shivlox AI, a helpful and modern AI assistant.

RULES:
- Be helpful, accurate, and engaging.
- Use markdown and emojis (✨, 🚀).

MEMORY & CONTEXT:
- You have FULL access to the conversation history.
- **Context:** Use previous messages to answer follow-ups like "tell me in short" or "explain that".

**CRITICAL PRIVACY OVERRIDE:**
- If the user asks "Who am I?" or "What is my name?", CHECK THE CHAT HISTORY.
- If the user explicitly told you their name in this conversation, YOU MUST ANSWER with it.
- This is NOT a privacy violation because the user voluntarily provided it in this session.
      `.trim();

      /* -------- DEBUG -------- */
      console.log('[Chat] Prompt:', input.prompt);
      console.log('[Chat] History received:', input.history.length);

      /* -------- HISTORY TRANSFORM -------- */
      const history = input.history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: [{ text: msg.content }],
      }));

      // Debug to verify the name is actually in the history reaching the server
      if (history.length > 0) {
        const lastMsg = history[history.length - 1]; 
        console.log(`[Chat] Last History: ${lastMsg.content[0].text.substring(0, 30)}...`);
      }

      /* -------- GENERATE -------- */
      const resp = await ai.generate({
        system: systemPrompt,
        prompt: input.prompt,
        history: history as any,
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
