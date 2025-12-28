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
      
      // Extensive list of keywords covering typos, slang, and grammar errors
      const contextKeywords = [
        // Summarization (Standard)
        'summarize', 'summary', 'sum', 'recap', 'overview', 'abstract', 'digest',
        // Summarization (Shortness)
        'short', 'brief', 'condense', 'abbreviate', 'cut', 'shorten', 'nutshell', 'tldr', 'quick',
        // Summarization (Typos/Slang)
        'sumary', 'summery', 'sumarize', 'summerize', 'sumup', 'shrt', 'brif', 'breif', 'shot',
        
        // Explanation (Standard)
        'explain', 'elaborate', 'expand', 'detail', 'clarify', 'describe', 'interpret', 'define', 'meaning', 'mean',
        // Explanation (Typos/Slang)
        'explian', 'explane', 'elaberate', 'elaborat', 'detial', 'clarif', 'clafiry', 'wats', 'wat',
        
        // Continuation (Standard)
        'continue', 'next', 'more', 'proceed', 'further', 'go on', 'keep going',
        // Continuation (Typos/Slang)
        'cont', 'contine', 'moar', 'mor', 'gwan', 'nxt',
        
        // Questions (Standard)
        'what', 'why', 'how', 'who', 'where', 'when', 'which',
        // Questions (Typos/Slang)
        'wat', 'wht', 'wy', 'y', 'hw', 'hows', 'hos', 'wer', 'wen', 'wich',
        
        // Affirmation/Reaction (Standard)
        'yes', 'yeah', 'yep', 'okay', 'ok', 'sure', 'right', 'correct', 'true', 'exactly', 'agree', 'cool', 'nice', 'wow',
        // Affirmation (Typos/Slang)
        'ye', 'ya', 'yea', 'yah', 'k', 'oky', 'alright', 'alr', 'rite', 'tru',
        
        // References (Standard)
        'that', 'this', 'it', 'previous', 'last', 'above', 'one',
        // References (Typos)
        'tht', 'ths', 'prev', 'lst', 'dat', 'dis',
        
        // Modification (Standard)
        'change', 'fix', 'rewrite', 'rephrase', 'word', 'translate', 'modify', 'adjust', 'convert',
        // Modification (Typos)
        'chanhe', 'chage', 'fx', 'rewrit', 'translat',
        
        // Coding (Standard)
        'code', 'script', 'function', 'syntax', 'implement', 'generate', 'write',
        // Coding (Typos)
        'cod', 'scrip', 'func', 'impl', 'gen',
        
        // Simplification
        'simple', 'simplify', 'easier', 'easy', 'child', 'kid', '5', 'explain like i\'m 5', 'eli5',
        // Simplification (Typos)
        'simpl', 'ez', 'ezy',
        
        // Examples
        'example', 'instance', 'sample', 'show', 'demo',
        // Examples (Typos)
        'eg', 'ex', 'exampl', 'sampl',
        
        // Connectors/Fillers implying continuation
        'so', 'then', 'and', 'but', 'well', 'anyway', 'ok then'
      ];
      
      const lowerPrompt = input.prompt.toLowerCase();

      // Logic: If prompt is short (< 150 chars) AND has a keyword AND we have history
      // Increased length limit to 150 to catch slightly longer messy sentences
      if (
        input.prompt.length < 150 && 
        contextKeywords.some(kw => lowerPrompt.includes(kw)) &&
        lastMessage && 
        lastMessage.role === 'model'
      ) {
         console.log('[Chat] 💉 Injecting Context into Prompt...');
         finalPrompt = `${input.prompt}\n\n---\nContext from previous message to use:\n"${lastMessage.content}"\n---`;
      }

      /* -------- DEBUG -------- */
      console.log('[Chat] Original Prompt:', input.prompt);
      console.log('[Chat] Final Sent Prompt:', finalPrompt.substring(0, 100));

      /* -------- HISTORY TRANSFORM -------- */
      const history = input.history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: [{ text: msg.content }],
      }));

      /* -------- GENERATE -------- */
      const resp = await ai.generate({
        system: systemPrompt,
        prompt: finalPrompt,
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
