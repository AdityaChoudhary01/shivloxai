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
You are Shivlox AI, a smart and modern AI assistant.

RULES:
- Be helpful, accurate, and engaging.
- Use markdown and emojis (✨, 🚀).
- If the prompt contains "Context from previous message", use that text to answer the user's request.
- PRIVACY: If asked "Who am I?" or "What is my name?", use the chat history to answer.
      `.trim();

      /* -------- CONTEXT INJECTION (THE FIX) -------- */
      // Problem: Model ignores history for short commands.
      // Fix: If prompt is short, grab the last AI message and STUFF it into the prompt.
      let finalPrompt = input.prompt;
      
      const lastMessage = input.history.length > 0 ? input.history[input.history.length - 1] : null;
      
      // Keywords that indicate the user refers to previous context
      const contextKeywords = ['summarize', 'short', 'explain', 'elaborate', 'tell me more', 'continue', 'yes', 'what', 'why'];
      const lowerPrompt = input.prompt.toLowerCase();

      // Logic: If prompt is short (< 100 chars) AND has a keyword AND we have history
      if (
        input.prompt.length < 100 && 
        contextKeywords.some(kw => lowerPrompt.includes(kw)) &&
        lastMessage && 
        lastMessage.role === 'model'
      ) {
         console.log('[Chat] 💉 Injecting Context into Prompt...');
         finalPrompt = `${input.prompt}\n\n---\nContext from previous message to use:\n"${lastMessage.content}"\n---`;
      }

      /* -------- DEBUG -------- */
      console.log('[Chat] Original Prompt:', input.prompt);
      console.log('[Chat] Final Sent Prompt:', finalPrompt.substring(0, 100)); // Log what we actually send

      /* -------- HISTORY TRANSFORM -------- */
      const history = input.history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: [{ text: msg.content }],
      }));

      /* -------- GENERATE -------- */
      const resp = await ai.generate({
        system: systemPrompt,
        prompt: finalPrompt, // Send the modified prompt
        history: history as any,
        config: {
          temperature: 0.6,
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
