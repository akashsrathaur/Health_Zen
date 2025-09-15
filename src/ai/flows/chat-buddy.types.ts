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
