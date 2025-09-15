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
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'The GEMINI_API_KEY environment variable is not set. Please add it to your hosting provider\'s environment variables.'
    );
  }
  return symptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckPrompt',
  input: {schema: SymptomCheckInputSchema},
  output: {schema: SymptomCheckOutputSchema},
  prompt: `You are HealthSnap, an empathetic wellness assistant. A user will describe their symptoms, and you will provide modern and Ayurvedic advice. Do NOT provide a diagnosis. If the symptoms sound serious, advise the user to see a doctor.

Your response must be a valid JSON object and nothing else.

Symptoms: {{{symptoms}}}

Your JSON response:
`,
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
