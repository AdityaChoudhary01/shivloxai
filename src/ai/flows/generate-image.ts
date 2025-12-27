'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // UPDATED: Using the valid 2025 image model
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image', 
      prompt: input.prompt,
      config: {
        // responseModalities is implied for image models
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}
