'use server';

import { chatWithBuddy } from "@/ai/flows/chat-buddy";
import { ChatWithBuddyInputSchema, type ChatWithBuddyInput } from "@/ai/flows/chat-buddy.types";
import { nanoid } from "nanoid";


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
    
    const parsedData = ChatWithBuddyInputSchema.safeParse({
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
    
    const newUserMessage = { id: nanoid(), role: 'user' as const, content: message };
    const newMessages = [...prevState.messages, newUserMessage];


    const input: ChatWithBuddyInput = {
        message,
        buddyPersona,
        chatHistory,
        userData,
    };
    
    try {
        const result = await chatWithBuddy(input);
        const modelMessage = { id: nanoid(), role: 'model' as const, content: result.response };
        
        return {
            messages: [
                ...newMessages,
                modelMessage
            ],
            error: null
        };
    } catch (error) {
        console.error(error);
        return { 
            ...prevState,
            messages: newMessages,
            error: 'Failed to get response from your buddy. Please try again.' 
        };
    }
}
