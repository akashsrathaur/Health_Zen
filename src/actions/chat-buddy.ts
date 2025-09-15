'use server';

import { chatWithBuddy } from "@/ai/flows/chat-buddy";
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
    
    // Find the latest user message to update its status
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

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("The GEMINI_API_KEY environment variable is not set. Please add it to your hosting provider's environment variables and redeploy.");
        }

        const buddyPersona = JSON.parse(parsedData.data.buddyPersona);
        const userData = JSON.parse(parsedData.data.userData);
        
        const chatHistoryForAI = newMessages
            .filter(m => m.role === 'user' || m.role === 'model')
            .map(m => ({role: m.role, content: m.content}));

        const result = await chatWithBuddy(
            {
                message,
                buddyPersona,
                chatHistory: chatHistoryForAI,
                userData,
            }, 
            process.env.GEMINI_API_KEY
        );
        
        const updatedUserMessage: Message = { ...newUserMessage, status: 'delivered' };

        const modelMessage: Message = { 
            id: nanoid(), 
            role: 'model' as const, 
            content: result.response,
            timestamp: new Date().toISOString(),
        };
        
        const userMessageIndex = newMessages.findIndex(m => m.id === newUserMessage.id);
        if (userMessageIndex !== -1) {
            newMessages[userMessageIndex] = updatedUserMessage;
        }
        
        return {
            messages: [...newMessages, modelMessage],
            error: null
        };
    } catch (error) {
        console.error("Error in chatBuddyAction:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
        
        // IMPORTANT: Return newMessages here, not prevState.messages
        return { 
            messages: newMessages,
            error: errorMessage,
        };
    }
}
