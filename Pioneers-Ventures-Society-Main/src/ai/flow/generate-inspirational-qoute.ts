// src/ai/flows/generate-inspirational-quote.ts
'use server';
/**
 * @fileOverview Generates inspirational quotes based on keywords.
 *
 * - generateInspirationalQuote - A function that generates an inspirational quote.
 * - GenerateInspirationalQuoteInput - The input type for the generateInspirationalQuote function.
 * - GenerateInspirationalQuoteOutput - The return type for the generateInspirationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationalQuoteInputSchema = z.object({
  keywords: z.string().describe('Keywords related to ventures and innovation.'),
  context: z.string().describe('Context in which quote will be used, for example Hero section, Member spotlight etc.'),
});
export type GenerateInspirationalQuoteInput = z.infer<typeof GenerateInspirationalQuoteInputSchema>;

const GenerateInspirationalQuoteOutputSchema = z.object({
  quote: z.string().describe('An inspirational quote related to the provided keywords.'),
});
export type GenerateInspirationalQuoteOutput = z.infer<typeof GenerateInspirationalQuoteOutputSchema>;

export async function generateInspirationalQuote(
  input: GenerateInspirationalQuoteInput
): Promise<GenerateInspirationalQuoteOutput> {
  return generateInspirationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspirationalQuotePrompt',
  input: {schema: GenerateInspirationalQuoteInputSchema},
  output: {schema: GenerateInspirationalQuoteOutputSchema},
  prompt: `You are an AI assistant designed to generate inspirational quotes related to ventures and innovation.

  Generate a single inspirational quote based on the following keywords: {{{keywords}}}.
  Consider this context: {{{context}}}.
  The quote should be suitable for use on a landing page to engage visitors.
  The quote should sound very profound, smart, and wise.
  `,
});

const generateInspirationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateInspirationalQuoteFlow',
    inputSchema: GenerateInspirationalQuoteInputSchema,
    outputSchema: GenerateInspirationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
