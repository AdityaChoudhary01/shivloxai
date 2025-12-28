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

      const systemPrompt = `You are Shivlox AI, a helpful and modern AI assistant. Your main goal is to provide helpful, accurate, and engaging content to the user.

RULES:
- Your responses should be informative, friendly, and engaging.
- Use markdown for formatting when appropriate (e.g., # for headings, - for lists, ** for bold).
- Use emojis to make the conversation more lively and visually appealing. For example: ✨, 🚀, 👍.
- Structure longer answers with clear headings and paragraphs to improve readability.
- MEMORY: You have access to the chat history. Always refer back to previous messages if the user asks "what did I just say?" or "elaborate on that".`;

      // 2. Smart Memory Construction (Remember Last 4 Exchanges)
      // We slice the last 10 messages. This covers:
      // - The previous 4 User Queries
      // - The previous 4 AI Responses
      // - Plus a buffer of 2 extra messages for context continuity.
      const safeHistory = input.history.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'model',
          content: [{ text: msg.content || '' }] // Handle potential empty content
      }));

      const history = [
        { role: 'user' as const, content: [{ text: systemPrompt }] },
        { role: 'model' as const, content: [{ text: "Okay, I'm ready to chat! How can I help you today? ✨" }] },
        ...safeHistory
      ];

      const resp = await ai.generate({
        prompt: input.prompt,
        history,
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
