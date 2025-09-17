'use server';
/**
 * @fileOverview A symptom check AI agent that provides Homeopathy and Ayurvedic advice.
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
  homeopathyAdvice: z.string().describe('Homeopathy advice for the symptoms in bullet points.'),
  ayurvedicAdvice: z.string().describe('Ayurvedic advice for the symptoms in bullet points.'),
  remedies: z.string().describe('Suggested remedies for the symptoms in bullet points.'),
});
export type SymptomCheckOutput = z.infer<typeof SymptomCheckOutputSchema>;

export async function symptomCheck(input: SymptomCheckInput): Promise<SymptomCheckOutput> {
  return symptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckPrompt',
  input: {schema: SymptomCheckInputSchema},
  output: {schema: SymptomCheckOutputSchema},
  prompt: `You are HealthSnap, an empathetic wellness assistant. A user will describe their symptoms in any language, and you will provide Homeopathy, Ayurvedic, and Remedy advice in point-wise format, in the same language as the user's input.

Your entire response must be a valid JSON object and nothing else. Do NOT wrap it in markdown. Do not include any introductory text.

**IMPORTANT: Keep the advice concise. For each category (Homeopathy, Ayurvedic, Remedies), provide a maximum of two bullet points. Each point should be a short, simple sentence.**

If the symptoms sound serious (e.g., chest pain, difficulty breathing, severe bleeding), your first priority is to advise the user to see a doctor or seek emergency medical help immediately in all fields.

Symptoms: {{{symptoms}}}

Your JSON response (use bullet points for advice, using \\n for new lines):
{
    "homeopathyAdvice": "- Advice point 1\\n- Advice point 2",
    "ayurvedicAdvice": "- Advice point 1\\n- Advice point 2",
    "remedies": "- Remedy suggestion 1\\n- Remedy suggestion 2"
}
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
