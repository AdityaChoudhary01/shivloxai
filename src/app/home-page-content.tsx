
'use client';

import { chat, type ChatInput } from '@/ai/flows/chat';
import { generateInitialPrompts } from '@/ai/flows/generate-initial-prompt';
import { processAudio } from '@/ai/flows/process-audio';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { ChatMessage, type ChatMessageProps } from '@/components/chat-message';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ImageIcon, LoaderCircle, MessageSquare, Mic, Plus, SendHorizontal, X, Trash2, BookText, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/auth-modal';
import { UserNav } from '@/components/user-nav';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';

type Message = ChatMessageProps['message'];

type Conversation = {
    id: string;
    title: string;
    messages: Message[];
};

export function HomePageContent() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
    const [allPrompts, setAllPrompts] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const { toast } = useToast();
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);


    useEffect(() => {
        const savedConversations = localStorage.getItem('chatHistory');
        if (savedConversations) {
            const parsedConversations = JSON.parse(savedConversations);
            setConversations(parsedConversations);
            if (parsedConversations.length > 0) {
                setCurrentConversationId(parsedConversations[0].id);
            } else {
                startNewChat();
            }
        } else {
            startNewChat();
        }
    }, []);

    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(conversations));
        } else {
            localStorage.removeItem('chatHistory');
        }
    }, [conversations]);

    useEffect(() => {
        async function fetchPrompts() {
            try {
                const prompts = await generateInitialPrompts();
                setAllPrompts(prompts);
                setInitialPrompts(prompts.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch initial prompts:', error);
            }
        }
        fetchPrompts();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversationId, isLoading]);

    const currentMessages = conversations.find(c => c.id === currentConversationId)?.messages || [];
    
    const triggerAiResponse = useCallback(async (convId: string, messageContent: string) => {
        try {
            if (!user) {
                setSessionMessageCount(prev => prev + 1);
            }

            const currentConv = conversations.find(c => c.id === convId);
            
            // This is a critical change. We get the latest history from the state,
            // but we add the new user message to it manually for the API call.
            // This avoids race conditions with React's state updates.
            const historyForApi = (currentConv?.messages || []).filter(m => m.role !== 'user' || m.content !== messageContent);
            const fullHistoryForApi = [...historyForApi, { role: 'user' as const, content: messageContent }];

            const chatInput: ChatInput = { 
                history: fullHistoryForApi.slice(0, -1).map(m => ({ role: m.role as 'user' | 'model', content: m.content })),
                prompt: messageContent 
            };
            const result = await chat(chatInput);
            const aiMessage: Message = { role: 'model', content: result.response };

            setConversations(prev =>
                prev.map(c =>
                    c.id === convId
                        ? { ...c, messages: [...c.messages, aiMessage] }
                        : c
                )
            );
        } catch (error) {
            console.error('Error calling chat AI:', error);
            const errorMessage: Message = {
                role: 'model',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setConversations(prev =>
                prev.map(c =>
                    c.id === convId
                        ? { ...c, messages: [...c.messages, errorMessage] }
                        : c
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [user, conversations]); // conversations is a dependency
    
    const handleSendMessage = useCallback(async (prompt?: string) => {
        if (!user && sessionMessageCount >= 15) {
            setIsAuthModalOpen(true);
            return;
        }

        const userMessageContent = prompt || input;
        if (!userMessageContent.trim()) return;

        if (!prompt) {
            setInput('');
        }

        let effectiveConvId = currentConversationId;
        
        // This check is important: only create a new chat if the current one is empty.
        const isCurrentChatEmpty = (conversations.find(c => c.id === effectiveConvId)?.messages.length || 0) === 0;

        if (!effectiveConvId || isCurrentChatEmpty) {
            const newId = `chat-${Date.now()}`;
            const newTitle = userMessageContent.split(' ').slice(0, 5).join(' ');
            const newConversation: Conversation = {
                id: newId,
                title: newTitle,
                messages: [],
            };
             
            // Replace the empty chat or prepend a new one
            if (isCurrentChatEmpty && effectiveConvId) {
                setConversations(prev => prev.map(c => c.id === effectiveConvId ? { ...newConversation, messages: c.messages } : c));
            } else {
                setConversations(prev => [newConversation, ...prev.filter(c => c.messages.length > 0)]);
            }

            setCurrentConversationId(newId);
            effectiveConvId = newId;
        }
        
        const newUserMessage: Message = { role: 'user', content: userMessageContent };
        
        setConversations(prev => {
            return prev.map(c =>
                c.id === effectiveConvId
                    ? { ...c, messages: [...c.messages, newUserMessage] }
                    : c
            );
        });

        setIsLoading(true);

        // Defer the AI call to the next tick to ensure state is updated.
        setTimeout(() => triggerAiResponse(effectiveConvId!, userMessageContent), 0);

    }, [input, user, sessionMessageCount, currentConversationId, conversations, triggerAiResponse]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const promptVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3,
            },
        }),
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result as string;
                    try {
                        setIsLoading(true);
                        const { transcript } = await processAudio({ audioDataUri: base64Audio });
                        setInput(transcript);
                    } catch (error) {
                        console.error('Error processing audio:', error);
                        toast({
                            title: 'Error',
                            description: 'Failed to process audio. Please try again.',
                            variant: 'destructive',
                        });
                    } finally {
                        setIsLoading(false);
                    }
                };
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            toast({
                title: 'Microphone Error',
                description: 'Could not access the microphone. Please check your permissions.',
                variant: 'destructive',
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    
    const handleImageGeneration = () => {
        if (!input.trim()) return;
        handleSendMessage(`/imagine ${input.trim()}`);
    }

    const startNewChat = (setActive = true) => {
        const newId = `chat-${Date.now()}`;
        const newConversation: Conversation = {
            id: newId,
            title: 'New Chat',
            messages: [],
        };
        setConversations(prev => [newConversation, ...prev]);
        if (setActive) {
            setCurrentConversationId(newId);
        }
        return newId;
    }

    const handleDeleteConversation = (id: string) => {
        setConversationToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!conversationToDelete) return;

        const newConversations = conversations.filter(c => c.id !== conversationToDelete);
        setConversations(newConversations);

        if (currentConversationId === conversationToDelete) {
            if (newConversations.length > 0) {
                setCurrentConversationId(newConversations[0].id);
            } else {
                startNewChat();
            }
        }
        
        setConversationToDelete(null);
        setIsDeleteDialogOpen(false);
        toast({
            title: "Chat Deleted",
            description: "The conversation has been removed.",
        })
    };

    const handleSummarize = async () => {
        if (!currentConversationId || currentMessages.length === 0) return;

        setIsSummarizing(true);
        try {
            const conversationText = currentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
            const { summary } = await summarizeConversation({ conversation: conversationText });
            toast({
                title: "Conversation Summary",
                description: summary,
                duration: 9000,
            })
        } catch (error) {
            console.error("Failed to summarize conversation:", error);
            toast({
                title: "Error",
                description: "Could not generate a summary. Please try again.",
                variant: 'destructive',
            })
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleSurpriseMe = () => {
        if (allPrompts.length > 0) {
            const randomIndex = Math.floor(Math.random() * allPrompts.length);
            setInput(allPrompts[randomIndex]);
        }
    };

    return (
        <SidebarProvider>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        chat history.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex h-dvh bg-transparent text-foreground">
                <Sidebar>
                    <SidebarHeader className="p-2">
                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                                <Link href="/" className="flex items-center gap-2">
                                    <ShivloxIcon className="h-8 w-8" />
                                    <h2 className="text-lg font-semibold">Shivlox AI</h2>
                                </Link>
                            </div>
                            <SidebarTrigger className="md:hidden"/>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => startNewChat()}>
                            <Plus className="mr-2" />
                            New Chat
                        </Button>
                    </SidebarHeader>
                    <ScrollArea className="flex-1">
                        <SidebarContent className="p-2">
                            <SidebarMenu>
                             {conversations.map((conv) => (
  <SidebarMenuItem key={conv.id} className="group">
    <div
      onClick={() => setCurrentConversationId(conv.id)}
      className={cn(
        // Added 'justify-between' to push items apart
        "flex items-center w-full rounded-md px-2 py-1.5 cursor-pointer transition-colors justify-between",
        currentConversationId === conv.id
          ? "bg-accent/60"
          : "hover:bg-accent/40"
      )}
      title={conv.title} // full title tooltip
    >
      {/* Container for the Chat Icon and Title
        This div ensures the icon and title stick together on the left 
      */}
      <div className="flex items-center overflow-hidden">
        {/* Chat icon */}
        <MessageSquare className="h-4 w-4 shrink-0 mr-2 text-muted-foreground" />

        {/* Title — truncated with ellipsis */}
        <span
          // Removed inline styles and replaced with Tailwind classes for truncation and flexibility
          // 'flex-1' is not needed here anymore, replaced by the parent flex structure
          className="text-sm text-foreground truncate max-w-[130px]" // Max-width is now more controlled
        >
          {conv.title}
        </span>
      </div>

      {/* Delete icon — remains on the right due to 'justify-between' on the parent div */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteConversation(conv.id);
        }}
        className="
          ml-1 h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive
          transition-opacity duration-200 ease-in-out
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        "
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </SidebarMenuItem>
))}
                            </SidebarMenu>
                        </SidebarContent>
                    </ScrollArea>
                    <SidebarFooter className="p-4 border-t border-border">
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <Link href="/about" className="hover:text-primary">About</Link>
                            <Link href="/contact" className="hover:text-primary">Contact</Link>
                            <Link href="/donate" className="hover:text-primary">Donate</Link>
                            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                            <Link href="/terms" className="hovertext-primary">Terms</Link>
                        </div>
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Shivlox AI. All rights reserved.
                        </p>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex flex-1 flex-col overflow-hidden">
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-white/10 bg-background/50 px-4 shadow-lg backdrop-blur-lg">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                             {currentMessages.length > 1 && (
                                <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isSummarizing}>
                                    {isSummarizing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <BookText className="mr-2 h-4 w-4" />
                                    )}
                                    Summarize
                                </Button>
                            )}
                            {user ? (
                                <UserNav />
                            ) : (
                                <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>
                            )}
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto flex flex-col relative">
                        {currentMessages.length === 0 && !isLoading ? (
                                <div className="flex flex-1 flex-col items-center justify-start pt-16 text-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                                        className="mb-4"
                                    >
                                        <ShivloxIcon className="h-20 w-20" />
                                    </motion.div>
                                   <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="text-3xl font-bold text-foreground tracking-tight"
>
    Your Intelligent **Shivlox AI** Chat Assistant ✨
</motion.h2>
<motion.p 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mt-4 text-lg text-muted-foreground"
>
    Ask anything to begin your first conversation.
</motion.p>


                                    <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                                        {initialPrompts.map((prompt, i) => (
                                            <motion.div
                                                key={i}
                                                custom={i}
                                                variants={promptVariants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="h-auto w-full whitespace-normal rounded-lg border-dashed p-4 text-left text-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
                                                    onClick={() => handleSendMessage(prompt)}
                                                >
                                                    {prompt}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                 <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-4 md:p-6 flex flex-col">
                                    {currentMessages.map((msg, index) => (
                                        <ChatMessage key={index} message={msg} />
                                    ))}
                                </div>
                            )}
                            {isLoading && <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-4 md:p-6 flex flex-col"><ChatMessage isLoading /></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="shrink-0 bg-background/50 p-4 backdrop-blur-sm"
                    >
                        <div className="mx-auto w-full max-w-3xl">
                            <form
                                onSubmit={handleFormSubmit}
                                id="chat-input" 
                                className="relative flex w-full items-end space-x-2 rounded-2xl border bg-secondary/30 p-2 shadow-lg transition-all focus-within:border-primary/50 focus-within:shadow-primary/20"
                            >
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleSurpriseMe}
                                    className="h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                                    aria-label="Surprise me"
                                >
                                    <Sparkles className="h-5 w-5" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleMicClick}
                                    className={cn("h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary", isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500")}
                                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                                >
                                    {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    disabled={isLoading || !input.trim()}
                                    onClick={handleImageGeneration}
                                    className="h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                                    aria-label="Generate image"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                                <TextareaAutosize
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRecording ? 'Recording...' : 'Ask Shivlox AI anything...'}
                                    className="flex-1 resize-none border-none bg-transparent py-1.5 text-base shadow-none focus-visible:ring-0 focus:outline-none"
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading || isRecording}
                                    maxRows={5}
                                    rows={1}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim() || isRecording}
                                    aria-label="Send message"
                                    className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isLoading && !isRecording ? (
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <SendHorizontal className="h-5 w-5" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </main>
            </div>
        </SidebarProvider>
    );
            }
