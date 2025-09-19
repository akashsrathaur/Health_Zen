
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Chat Buddy AI Flow - Gemini AI integration for wellness conversations
 * Implements personalized AI wellness companion with Ayurvedic knowledge
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use server';
/**
 * @fileOverview A personalized chat buddy AI agent.
 * 
 * - chatWithBuddy - A function that handles the chat buddy conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  ChatWithBuddyInputSchema,
  ChatWithBuddyOutputSchema,
  type ChatWithBuddyInput,
  type ChatWithBuddyOutput
} from './chat-buddy.types';


export async function chatWithBuddy(input: ChatWithBuddyInput): Promise<ChatWithBuddyOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("The GEMINI_API_KEY environment variable is not set. Please add it to your hosting provider's environment variables and redeploy.");
  }
  return chatWithBuddyFlow(input);
}

const chatWithBuddyPrompt = ai.definePrompt({
  name: 'chatWithBuddyPrompt',
  input: { schema: z.object({
    message: z.string(),
    chatHistory: z.string(),
    buddyPersona: ChatWithBuddyInputSchema.shape.buddyPersona,
    userData: ChatWithBuddyInputSchema.shape.userData,
  }) },
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
{{{chatHistory}}}

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
    
    const formattedHistory = input.chatHistory.map(m => {
        if (m.role === 'user') return `User: ${m.content}`;
        return `Buddy: ${m.content}`;
    }).join('\n');

    const { output } = await chatWithBuddyPrompt({
      ...input,
      chatHistory: formattedHistory,
    });
    return output!;
  }
);
