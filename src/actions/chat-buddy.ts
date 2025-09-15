'use server';

import { chatWithBuddy } from "@/ai/flows/chat-buddy";
import { type ChatWithBuddyInput } from "@/ai/flows/chat-buddy.types";
import { z } from "zod";

const ChatBuddyActionInputSchema = z.object({
  message: z.string(),
  buddyPersona: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.string(),
    relationship: z.string(),
  }),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
  userData: z.object({
    name: z.string(),
    streak: z.number(),
  }),
});


export type ChatState = {
  messages: {
    id: string;
    role: 'user' | 'model' | 'system';
    content: string;
  }[];
  error?: string | null;
}

export async function chatBuddyAction(
  prevState: ChatState,
  formData: FormData
): Promise<ChatState> {
    
    const parsedData = ChatBuddyActionInputSchema.safeParse({
        message: formData.get('message'),
        buddyPersona: JSON.parse(formData.get('buddyPersona') as string),
        chatHistory: JSON.parse(formData.get('chatHistory') as string),
        userData: JSON.parse(formData.get('userData') as string)
    });

    if (!parsedData.success) {
        return { 
            ...prevState,
            error: parsedData.error.flatten().fieldErrors.message?.[0] ?? "Invalid input." 
        };
    }

    const { message, buddyPersona, chatHistory, userData } = parsedData.data;

    const input: ChatWithBuddyInput = {
        message,
        buddyPersona,
        chatHistory,
        userData,
    };
    
    try {
        const result = await chatWithBuddy(input);
        return {
            messages: [
                ...prevState.messages,
                { id: formData.get('id') as string, role: 'model', content: result.response }
            ],
            error: null
        };
    } catch (error) {
        console.error(error);
        return { 
            ...prevState,
            error: 'Failed to get response from your buddy. Please try again.' 
        };
    }
}
