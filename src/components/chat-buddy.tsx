
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Chat Buddy Component - Personalized AI wellness companion
 * Features adaptive personality and intelligent health conversations
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Bot, User, Check, CheckCheck, Maximize2, Lock } from 'lucide-react';
import { chatBuddyAction, type Message } from '@/actions/chat-buddy';
import { nanoid } from 'nanoid';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { defaultUser, type BuddyPersona } from '@/lib/user-store';

const MessageStatus = ({ status }: { status: Message['status'] }) => {
    if (status === 'read') {
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (status === 'delivered') {
        return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
    }
    if (status === 'sent') {
        return <Check className="h-4 w-4 text-muted-foreground" />;
    }
    return null;
}

export function ChatBuddy() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const { user } = useAuth();
    const userData = user || defaultUser;
    const persona = userData.buddyPersona || defaultUser.buddyPersona!;
    
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    const initialMessages: Message[] = [{ 
        id: nanoid(), 
        role: 'system' as const, 
        content: "Might occasionally roast you, but only out of love",
        timestamp: new Date().toISOString(),
    }];

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [error, setError] = useState<string | null>(null);
    
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTo({
                top: scrollAreaViewportRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isPending]);
    
    // Restore focus when isPending changes from true to false
    useEffect(() => {
        if (!isPending && inputRef.current && isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus({ preventScroll: true });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isPending, isOpen]);
    
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const messageContent = formData.get('message') as string;
        if(!messageContent.trim()) return;

        const newUserMessage: Message = {
            id: nanoid(),
            role: 'user',
            content: messageContent,
            timestamp: new Date().toISOString(),
            status: 'sent',
        };

        setMessages(currentMessages => [...currentMessages, newUserMessage]);
        setError(null);
        formRef.current?.reset();
        // Keep focus on input during the conversation
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }

        startTransition(async () => {
            
            formData.set('buddyPersona', JSON.stringify(persona));
            const chatHistoryForAI = [...messages, newUserMessage]
                .filter(m => m.role === 'user' || m.role === 'model')
                .map(m => ({role: m.role, content: m.content}));
            formData.set('chatHistory', JSON.stringify(chatHistoryForAI));
            
            const currentUserData = { name: userData.name, streak: userData.streak };
            formData.set('userData', JSON.stringify(currentUserData));
            
            try {
                // Add a 1-second delay for a more human-like feel
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const result = await chatBuddyAction(formData);

                if (result.error) {
                    throw new Error(result.error);
                }

                if (result.response) {
                    const modelMessage: Message = {
                        id: nanoid(),
                        role: 'model',
                        content: result.response,
                        timestamp: new Date().toISOString(),
                    };
                    setMessages(currentMessages => [...currentMessages.map(msg => 
                        msg.id === newUserMessage.id ? { ...msg, status: 'read' as const } : msg
                    ), modelMessage]);
                    
                    // Restore focus to input after AI response
                    setTimeout(() => {
                        if (inputRef.current && !isPending) {
                            inputRef.current.focus({ preventScroll: true });
                        }
                    }, 150);
                }
            } catch (error: any) {
                console.error("Error in chat action:", error);
                setError(error.message || 'An unexpected error occurred.');
                setMessages(currentMessages => currentMessages.map(msg => 
                    msg.id === newUserMessage.id ? { ...msg, status: 'sent' } : msg
                ));
                
                // Restore focus to input even after error
                setTimeout(() => {
                    if (inputRef.current && !isPending) {
                        inputRef.current.focus({ preventScroll: true });
                    }
                }, 150);
            }
        });
    };

    const cardVariants = {
        closed: { opacity: 0, y: 50, scale: 0.9 },
        open: { opacity: 1, y: 0, scale: 1 },
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={cardVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className={cn(
                            "fixed z-50",
                            isMaximized 
                                ? "inset-0" 
                                : "bottom-24 right-4 w-full max-w-sm"
                        )}
                    >
                        <Card className={cn(
                            "flex flex-col shadow-2xl",
                            isMaximized ? "h-full w-full rounded-none" : "h-[60vh]"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Bot className="h-6 w-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" />
                                    <div className='grid gap-0.5'>
                                        <h3 className="font-semibold">{persona.name}</h3>
                                        <p className="text-xs text-muted-foreground">{persona.relationship}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Button variant="ghost" size="icon" onClick={() => setIsMaximized(p => !p)}><Maximize2 className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-4">
                                <ScrollArea className="h-full" viewportRef={scrollAreaViewportRef}>
                                    <div className="space-y-4 pr-4">
                                    {messages.map((msg, index) => {
                                        const msgDate = new Date(msg.timestamp);
                                        const prevMsgDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                                        const showDate = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();
                                        
                                        let dateLabel = '';
                                        if (showDate) {
                                            if (isToday(msgDate)) {
                                                dateLabel = 'Today';
                                            } else if (isYesterday(msgDate)) {
                                                dateLabel = 'Yesterday';
                                            } else {
                                                dateLabel = format(msgDate, 'MMMM d, yyyy');
                                            }
                                        }

                                        return(
                                        <React.Fragment key={msg.id}>
                                            {showDate && msg.role !== 'system' && (
                                                <div className="my-4 flex justify-center">
                                                    <div className="text-xs text-muted-foreground rounded-full bg-secondary px-3 py-1">
                                                        {dateLabel}
                                                    </div>
                                                </div>
                                            )}
                                            <div className={cn("flex items-end gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                                {msg.role === 'model' && (
                                                    <Avatar className='h-8 w-8'>
                                                        <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                {msg.role !== 'system' ? (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className={cn("group relative max-w-[75%] rounded-lg px-3 py-2 text-sm", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                                        <p style={{whiteSpace: 'pre-wrap'}} className={msg.role === 'user' ? 'pb-4' : ''}>{msg.content}</p>
                                                         <div className={cn("absolute bottom-1 right-2 flex items-center gap-1 text-xs min-w-fit",
                                                            msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                        )}>
                                                            <span className="whitespace-nowrap">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                                                            {msg.role === 'user' && <MessageStatus status={msg.status} />}
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <div className="my-2 mx-auto max-w-sm rounded-lg bg-yellow-100/80 p-2 text-center text-xs text-yellow-900 dark:bg-muted/40 dark:text-gray-300 flex items-center justify-center gap-2">
                                                        <Lock className="h-3 w-3 flex-shrink-0" />
                                                        <p>{msg.content}</p>
                                                    </div>
                                                )}
                                                {msg.role === 'user' && (
                                                    <Avatar className='h-8 w-8'>
                                                        <AvatarFallback><User className='h-4 w-4'/></AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    )})}
                                    {isPending && (
                                         <div className="flex items-end gap-2 justify-start">
                                            <Avatar className='h-8 w-8'>
                                                <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-secondary flex items-center gap-2">
                                                <span className="text-muted-foreground">{persona.name} is typing...</span>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                    {error && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <form ref={formRef} onSubmit={handleFormSubmit} className="flex w-full items-center gap-2">
                                    <Input ref={inputRef} name="message" placeholder="Type your message..." className="flex-1" autoComplete="off" disabled={isPending} />
                                    <Button type="submit" size="icon" disabled={isPending}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                            className="fixed bottom-4 right-4 z-40"
                        >
                            <Button
                                size="lg"
                                className="h-14 w-14 rounded-full shadow-lg"
                                onClick={() => setIsOpen(p => !p)}
                            >
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div key="close" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }}>
                                            <X className="h-6 w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="open" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }}>
                                            <MessageCircle className="h-6 w-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        {isOpen ? 'Close Chat' : 'Open Chat Buddy'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


        </>
    );
}

