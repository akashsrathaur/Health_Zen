'use server';
/**
 * @fileOverview A personalized chat buddy AI agent.
 * 
 * - chatWithBuddy - A function that handles the chat buddy conversation.
 * - ChatWithBuddyInput - The input type for the chatWithBuddy function.
 * - ChatWithBuddyOutput - The return type for the chatWithBuddy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BuddyPersonaSchema = z.object({
  name: z.string().describe("The buddy's name."),
  age: z.number().describe("The buddy's age."),
  gender: z.string().describe("The buddy's gender."),
  relationship: z.string().describe("The user's relationship to the buddy (e.g., 'friend', 'granny', 'girlfriend')."),
});

const UserDataSchema = z.object({
    name: z.string().describe("The user's name."),
    streak: z.number().describe("The user's current wellness streak in days."),
});

export const ChatWithBuddyInputSchema = z.object({
  message: z.string().describe('The message from the user.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation.'),
  buddyPersona: BuddyPersonaSchema,
  userData: UserDataSchema,
});
export type ChatWithBuddyInput = z.infer<typeof ChatWithBuddyInputSchema>;

export const ChatWithBuddyOutputSchema = z.object({
  response: z.string().describe('The chat buddy\'s response.'),
});
export type ChatWithBuddyOutput = z.infer<typeof ChatWithBuddyOutputSchema>;

export async function chatWithBuddy(input: ChatWithBuddyInput): Promise<ChatWithBuddyOutput> {
  return chatWithBuddyFlow(input);
}

const chatWithBuddyPrompt = ai.definePrompt({
  name: 'chatWithBuddyPrompt',
  input: { schema: ChatWithBuddyInputSchema },
  output: { schema: ChatWithBuddyOutputSchema },
  prompt: `You are a personalized chat buddy for a wellness app. Your personality and responses should be shaped by the persona defined below.

Your main goals are to be positive, supportive, and encouraging. You should help the user on their wellness journey by providing motivation and thoughtful conversation. Always stay in character.

**Your Persona:**
- Name: {{{buddyPersona.name}}}
- Age: {{{buddyPersona.age}}}
- Gender: {{{buddyPersona.gender}}}
- Relationship to User: {{{buddyPersona.relationship}}}

**User's Information:**
- Name: {{{userData.name}}}
- Current Wellness Streak: {{{userData.streak}}} days

**Conversation Guidelines:**
1.  **Stay in Character:** Your responses MUST reflect your persona. For example, if you are a 'granny', use warm, wise, and nurturing language. If you are a 'friend', be casual, supportive, and maybe a bit playful.
2.  **Be Positive:** Always maintain a positive and optimistic tone.
3.  **Focus on Improvement:** Gently guide conversations towards personal growth and wellness.
4.  **Acknowledge User Data:** Casually mention the user's streak or name to make the conversation feel personal.
5.  **Keep it Conversational:** Ask questions and keep the dialogue flowing naturally.
6.  **Do NOT give medical advice.** Defer to professionals.
7.  **Keep responses concise (2-3 sentences max).**

**Conversation History:**
{{#each chatHistory}}
{{#if (eq role 'user')}}User: {{content}}{{/if}}
{{#if (eq role 'model')}}Buddy: {{content}}{{/if}}
{{/each}}

**Current User Message:**
User: {{{message}}}

**Your Response (as {{{buddyPersona.name}}}):**
Buddy:`,
});

const chatWithBuddyFlow = ai.defineFlow(
  {
    name: 'chatWithBuddyFlow',
    inputSchema: ChatWithBuddyInputSchema,
    outputSchema: ChatWithBuddyOutputSchema,
  },
  async (input) => {
    const { output } = await chatWithBuddyPrompt(input);
    return output!;
  }
);
