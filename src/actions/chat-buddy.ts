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
    if (!process.env.GEMINI_API_KEY) {
        return { 
            ...prevState,
            error: "The GEMINI_API_KEY environment variable is not set. Please add it to your hosting provider's environment variables and redeploy." 
        };
    }
    
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
    
    // Add new user message for optimistic UI update
    const newMessages: Message[] = [...prevMessages, newUserMessage];

    try {
        const buddyPersona = JSON.parse(parsedData.data.buddyPersona);
        const userData = JSON.parse(parsedData.data.userData);
        
        const chatHistoryForAI = newMessages
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({role: m.role, content: m.content}));

        const input: ChatWithBuddyInput = {
            message,
            buddyPersona,
            chatHistory: chatHistoryForAI,
            userData,
        };

        const result = await chatWithBuddy(input, process.env.GEMINI_API_KEY);
        
        const updatedUserMessage: Message = { ...newUserMessage, status: 'delivered' };

        const modelMessage: Message = { 
            id: nanoid(), 
            role: 'model' as const, 
            content: result.response,
            timestamp: new Date().toISOString(),
        };
        
        // Find the index of the optimistic user message to replace it
        const userMessageIndex = newMessages.findIndex(m => m.id === newUserMessage.id);
        if (userMessageIndex !== -1) {
            newMessages[userMessageIndex] = updatedUserMessage;
        }
        
        return {
            messages: [...newMessages, modelMessage],
            error: null
        };
    } catch (error) {
        console.error(error);
        // Return the state with the optimistic user message still present, plus an error
        return { 
            ...prevState,
            messages: newMessages,
            error: 'Failed to get response from your buddy. Please check your API key and try again.' 
        };
    }
}
