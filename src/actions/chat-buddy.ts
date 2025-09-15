'use server';

import { chatWithBuddy } from "@/ai/flows/chat-buddy";
import { type ChatWithBuddyInput } from "@/ai/flows/chat-buddy.types";
import { nanoid } from "nanoid";
import { z } from "zod";


const ChatActionInputSchema = z.object({
    message: z.string(),
    buddyPersona: z.string(),
    chatHistory: z.string(),
    userData: z.string()
});


export type Message = {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export type ChatState = {
  messages: Message[];
  error?: string | null;
}

export async function chatBuddyAction(
  prevState: ChatState,
  formData: FormData
): Promise<ChatState> {
    
    const parsedData = ChatActionInputSchema.safeParse({
        message: formData.get('message'),
        buddyPersona: formData.get('buddyPersona'),
        chatHistory: formData.get('chatHistory'),
        userData: formData.get('userData')
    });


    if (!parsedData.success) {
        return { 
            ...prevState,
            error: "Invalid input." 
        };
    }

    const { message } = parsedData.data;
    const buddyPersona = JSON.parse(parsedData.data.buddyPersona);
    const userData = JSON.parse(parsedData.data.userData);
    
    const prevMessages = prevState.messages.map(m => (
        m.role === 'user' ? { ...m, status: 'read' as const } : m
    ));

    const newUserMessage: Message = { 
        id: nanoid(), 
        role: 'user' as const, 
        content: message,
        timestamp: new Date().toISOString(),
        status: 'sent' as const,
    };
    
    const newMessages: Message[] = [...prevMessages, newUserMessage];

    const chatHistoryForAI = newMessages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({role: m.role, content: m.content}));

    const input: ChatWithBuddyInput = {
        message,
        buddyPersona,
        chatHistory: chatHistoryForAI,
        userData,
    };
    
    try {
        const result = await chatWithBuddy(input);
        
        const updatedUserMessage: Message = { ...newUserMessage, status: 'delivered' };

        const modelMessage: Message = { 
            id: nanoid(), 
            role: 'model' as const, 
            content: result.response,
            timestamp: new Date().toISOString(),
        };
        
        return {
            messages: [
                ...prevMessages.slice(0, -1), // All previous messages
                updatedUserMessage, // The user message with 'delivered' status
                modelMessage // The new model message
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
