'use server';
/**
 * @fileOverview A symptom check AI agent that provides modern and Ayurvedic advice.
 *
 * - symptomCheck - A function that handles the symptom check process.
 * - SymptomCheckInput - The input type for the symptomCheck function.
 * - SymptomCheckOutput - The return type for the symptomCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the user, can include text or emojis.'),
});
export type SymptomCheckInput = z.infer<typeof SymptomCheckInputSchema>;

const SymptomCheckOutputSchema = z.object({
  modernAdvice: z.string().describe('Modern medical advice for the symptoms.'),
  ayurvedicAdvice: z.string().describe('Ayurvedic advice for the symptoms.'),
});
export type SymptomCheckOutput = z.infer<typeof SymptomCheckOutputSchema>;

export async function symptomCheck(input: SymptomCheckInput): Promise<SymptomCheckOutput> {
  return symptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckPrompt',
  input: {schema: SymptomCheckInputSchema},
  output: {schema: SymptomCheckOutputSchema},
  prompt: `You are HealthSnap, an empathetic wellness assistant. A user will describe their symptoms, and you will provide modern and Ayurvedic advice.

Symptoms: {{{symptoms}}}

Provide your output in JSON format with the following keys and structure:
{
  "modernAdvice": "...",
  "ayurvedicAdvice": "..."
}`,
});

const symptomCheckFlow = ai.defineFlow(
  {
    name: 'symptomCheckFlow',
    inputSchema: SymptomCheckInputSchema,
    outputSchema: SymptomCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
