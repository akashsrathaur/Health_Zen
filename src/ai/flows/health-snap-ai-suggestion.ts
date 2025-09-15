'use server';
/**
 * @fileOverview This file defines the HealthSnap AI suggestion flow.
 *
 * - healthSnapAISuggestion - A function that takes an image and returns wellness suggestions.
 * - HealthSnapAISuggestionInput - The input type for the healthSnapAISuggestion function.
 * - HealthSnapAISuggestionOutput - The return type for the healthSnapAISuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthSnapAISuggestionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo (snap) uploaded by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  caption: z.string().describe('Optional caption added by the user.'),
  userId: z.string().describe('The ID of the user uploading the snap.'),
});
export type HealthSnapAISuggestionInput = z.infer<
  typeof HealthSnapAISuggestionInputSchema
>;

const HealthSnapAISuggestionOutputSchema = z.object({
  modernTip: z.string().describe('A concise modern health tip.'),
  ayurvedicTip: z.string().describe('A short Ayurvedic suggestion.'),
  categoryTags: z.array(z.string()).describe('Category tags for the suggestion.'),
  confidence: z.number().describe('A confidence score (0-1) for the suggestion.'),
});
export type HealthSnapAISuggestionOutput = z.infer<
  typeof HealthSnapAISuggestionOutputSchema
>;

export async function healthSnapAISuggestion(
  input: HealthSnapAISuggestionInput
): Promise<HealthSnapAISuggestionOutput> {
  return healthSnapAISuggestionFlow(input);
}

const healthSnapAISuggestionPrompt = ai.definePrompt({
  name: 'healthSnapAISuggestionPrompt',
  input: {schema: HealthSnapAISuggestionInputSchema},
  output: {schema: HealthSnapAISuggestionOutputSchema},
  prompt: `You are HealthSnap, an empathetic wellness assistant. For the given user image metadata and optional caption, produce:

1.  A concise modern health tip (1-2 sentences) that is safe and conservative.
2.  One short Ayurvedic suggestion (1 sentence) using common herbs or home remedies.
3.  2-3 category tags (Sleep, Digestion, Immunity, Skin, Stress, Women’sHealth, Other).
4.  A short confidence score (0-1).

Do NOT provide medical diagnoses. If the input suggests a potentially serious symptom (chest pain, severe bleeding, fainting), respond with a clear instruction to seek emergency care.

Input:
User ID: {{{userId}}}
Image: {{media url=photoDataUri}}
Caption: {{{caption}}}

Output: {
  "modernTip": "",
  "ayurvedicTip": "",
  "categoryTags": ["", ""],
  "confidence": 0.8
}
`,
});

const healthSnapAISuggestionFlow = ai.defineFlow(
  {
    name: 'healthSnapAISuggestionFlow',
    inputSchema: HealthSnapAISuggestionInputSchema,
    outputSchema: HealthSnapAISuggestionOutputSchema,
  },
  async input => {
    const {output} = await healthSnapAISuggestionPrompt(input);
    return output!;
  }
);
