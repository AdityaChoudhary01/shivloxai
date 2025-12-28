'use client';

import { chat, type ChatInput } from '@/ai/flows/chat';
import { processAudio } from '@/ai/flows/process-audio';
import { summarizeConversation } from '@/ai/flows/summarize-conversation';
import { ChatMessage } from '@/components/chat-message';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
    ImageIcon, LoaderCircle, MessageSquare, Mic, Plus, SendHorizontal, X, 
    Trash2, BookText, Sparkles, Brain, Code, PenTool, Globe, 
    ExternalLink, Layers, GraduationCap, BookOpen, Heart,
    Cpu, Shield, Mail
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
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

// Strict types
type Message = {
    role: 'user' | 'model';
    content: string;
};

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
    const shouldAnimateRef = useRef(false);

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const { toast } = useToast();
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [sessionMessageCount, setSessionMessageCount] = useState(0);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

    // --- STATIC PROMPT POOL LOGIC ---
    useEffect(() => {
        const promptPool = [
            "Explain the theory of relativity like I'm 5",
            "Debug this React useEffect code snippet",
            "Write a creative blog post about AI trends in 2025",
            "Create a 3-day workout plan for beginners",
            "Suggest 5 unique dinner recipes with chicken",
            "How do I center a div using Tailwind CSS?",
            "Analyze the pros and cons of remote work",
            "Generate a Python script to scrape a website",
            "Explain the difference between SQL and NoSQL",
            "Write a regex to validate an email address",
            "Design a database schema for an e-commerce app",
            "Explain concept of 'closure' in JavaScript",
            "Write a professional email rescheduling a meeting",
            "Generate a Dockerfile for a Next.js application",
            "Suggest 3 underrated travel destinations in Asia",
            "Explain Quantum Computing in simple terms",
            "Write a short story about a time-traveling developer",
            "How to optimize a React app for performance?",
            "Create a study schedule for learning Python",
            "Explain the SOLID principles in software design"
        ];
        
        setAllPrompts(promptPool);
        
        // Randomly shuffle and pick 4
        const shuffled = [...promptPool].sort(() => 0.5 - Math.random());
        setInitialPrompts(shuffled.slice(0, 4));
    }, []);

    useEffect(() => {
        const savedConversations = localStorage.getItem('chatHistory');
        if (savedConversations) {
            try {
                const parsedConversations = JSON.parse(savedConversations);
                setConversations(parsedConversations);
                if (parsedConversations.length > 0) {
                    setCurrentConversationId(parsedConversations[0].id);
                } else {
                    startNewChat(false);
                }
            } catch (e) {
                console.error("Failed to parse history", e);
                startNewChat(false);
            }
        } else {
            startNewChat(false);
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversationId, isLoading, conversations]);

    const currentMessages = conversations.find(c => c.id === currentConversationId)?.messages || [];
    
    // REFACTORED: Now accepts the message history explicitly to avoid stale state
    const triggerAiResponse = useCallback(async (convId: string, messageHistory: Message[]) => {
        try {
            if (!user) {
                setSessionMessageCount(prev => prev + 1);
            }

            // Prepare history for API (excluding the very last message which is the prompt)
            const prompt = messageHistory[messageHistory.length - 1].content;
            const history = messageHistory.slice(0, -1).map(m => ({
                role: m.role,
                content: m.content
            }));

            const chatInput: ChatInput = { 
                history,
                prompt 
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
                content: 'Sorry, I encountered an error. Please try again or check your connection.',
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
    }, [user]); 
    
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

        shouldAnimateRef.current = true;

        let effectiveConvId = currentConversationId;
        const currentConv = conversations.find(c => c.id === effectiveConvId);
        
        // Safety check: ensure messages array exists
        let existingMessages = currentConv ? currentConv.messages : [];

        // Logic to create new chat if needed
        if (!effectiveConvId || !currentConv || existingMessages.length === 0) {
            const newId = `chat-${Date.now()}`;
            effectiveConvId = newId;
            const newTitle = userMessageContent.split(' ').slice(0, 5).join(' ');
            
            const newConversation: Conversation = {
                id: newId,
                title: newTitle,
                messages: [],
            };
            
            // If we are "replacing" an empty current chat
            if (currentConversationId && existingMessages.length === 0) {
                 setConversations(prev => prev.map(c => c.id === currentConversationId ? newConversation : c));
            } else {
                 setConversations(prev => [newConversation, ...prev]);
            }
            setCurrentConversationId(newId);
            existingMessages = []; // It's a new chat, so history is empty
        }
        
        const newUserMessage: Message = { role: 'user', content: userMessageContent };
        const updatedMessages = [...existingMessages, newUserMessage];
        
        // Optimistic Update
        setConversations(prev => {
            return prev.map(c =>
                c.id === effectiveConvId
                    ? { ...c, messages: updatedMessages }
                    : c
            );
        });

        setIsLoading(true);
        
        // Pass the calculated 'updatedMessages' directly to avoid undefined role errors
        setTimeout(() => triggerAiResponse(effectiveConvId!, updatedMessages), 0);

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
        shouldAnimateRef.current = false;
        return newId;
    }

    const switchChat = (id: string) => {
        setCurrentConversationId(id);
        shouldAnimateRef.current = false;
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
                startNewChat(true);
            }
        }
        
        setConversationToDelete(null);
        setIsDeleteDialogOpen(false);
        shouldAnimateRef.current = false; 
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

            <div className="flex h-dvh bg-transparent text-foreground w-full">
                
                <Sidebar className="bg-background/40 backdrop-blur-md border-r border-white/5">
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
                        <Button variant="outline" className="w-full bg-secondary/50 border-white/10 hover:bg-secondary/80" onClick={() => startNewChat()}>
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
                                    onClick={() => switchChat(conv.id)}
                                    className={cn(
                                        "flex items-center w-full rounded-md px-2 py-1.5 cursor-pointer transition-colors justify-between",
                                        currentConversationId === conv.id
                                        ? "bg-accent/60 text-white" 
                                        : "hover:bg-white/5 text-muted-foreground hover:text-white"
                                    )}
                                    title={conv.title}
                                    >
                                    <div className="flex items-center overflow-hidden">
                                        <MessageSquare className="h-4 w-4 shrink-0 mr-2" />
                                        <span className="text-sm truncate max-w-[130px]">
                                        {conv.title}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteConversation(conv.id);
                                        }}
                                        className="ml-1 h-7 w-7 shrink-0 hover:text-destructive transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </div>
                                </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                    </ScrollArea>
                    
                    <SidebarFooter className="p-2 border-t border-white/10">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link 
                                    href="/donate" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-red-500 transition-colors"
                                >
                                    <Heart className="h-4 w-4" />
                                    <span>Donate</span>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link 
                                    href="/contact" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>Contact & Support</span>
                                </Link>
                            </SidebarMenuItem>
                            <div className="my-1 border-t border-white/10" />
                            <div className="flex flex-wrap gap-2 px-2 py-1 text-xs text-muted-foreground/60">
                                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                                <span>•</span>
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <span>•</span>
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            </div>
                            <p className="mt-2 text-center text-[10px] text-muted-foreground/40">
                                &copy; {new Date().getFullYear()} Shivlox AI.
                            </p>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex flex-1 flex-col overflow-hidden w-full relative bg-transparent">
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-white/5 bg-background/20 backdrop-blur-xl px-4 shadow-sm z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                             {currentMessages.length > 1 && (
                                <Button variant="ghost" size="sm" className="hover:bg-white/10 border border-white/5" onClick={handleSummarize} disabled={isSummarizing}>
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

                    <div className="flex-1 overflow-y-auto flex flex-col relative w-full scroll-smooth">
                        {currentMessages.length === 0 && !isLoading ? (
                                <div className="flex flex-1 flex-col items-center justify-start pt-20 pb-32 text-center px-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                                        className="mb-6"
                                    >
                                        <ShivloxIcon className="h-24 w-24 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    </motion.div>
                                   <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
                                    >
                                        Your Intelligent <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Shivlox AI</span> Assistant
                                    </motion.h1>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="mt-2 text-lg md:text-xl text-muted-foreground max-w-2xl"
                                    >
                                        Experience the future of conversation. Ask questions, generate code, create images, and solve complex problems instantly.
                                    </motion.p>

                                    <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
                                                    className="h-auto w-full justify-start text-left whitespace-normal rounded-xl border-white/10 bg-white/5 hover:bg-white/10 p-4 text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
                                                    onClick={() => handleSendMessage(prompt)}
                                                >
                                                    <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                                        {i === 0 ? <Zap className="h-4 w-4" /> : 
                                                         i === 1 ? <Code className="h-4 w-4" /> :
                                                         i === 2 ? <PenTool className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                                                    </span>
                                                    {prompt}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                        className="mt-20 w-full max-w-5xl text-left space-y-16 pb-10"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-bold text-center mb-8 text-white">Why Developers Choose Shivlox</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <div className="h-12 w-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                                        <Brain className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2">Advanced Reasoning</h3>
                                                    <p className="text-muted-foreground text-sm">Powered by Gemini 1.5 Flash, Shivlox AI understands complex stack traces, context, and nuance better than ever before.</p>
                                                </div>
                                                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <div className="h-12 w-12 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mb-4">
                                                        <Shield className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2">Secure & Private</h3>
                                                    <p className="text-muted-foreground text-sm">Your conversations are private. We prioritize data security with enterprise-grade encryption for all user interactions.</p>
                                                </div>
                                                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                                                        <Sparkles className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2">Multimodal Magic</h3>
                                                    <p className="text-muted-foreground text-sm">Generate images, process audio, and analyze code all in one interface. Type <code className="bg-white/10 px-1 rounded">/imagine</code> to start.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                                <div className="flex-1 space-y-4">
                                                    <h2 className="text-2xl font-bold">Master the MERN Stack</h2>
                                                    <p className="text-muted-foreground">Shivlox is optimized for modern web development. Whether you are building with Next.js, managing MongoDB aggregations, or debugging React Native apps.</p>
                                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Generate boilerplate Express.js servers</li>
                                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Optimize React rendering performance</li>
                                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Convert Python logic to TypeScript</li>
                                                    </ul>
                                                </div>
                                                <div className="flex-1 w-full space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                                                        <Code className="h-5 w-5 text-blue-500" />
                                                        <div>
                                                            <div className="font-semibold text-sm">Code Refactoring</div>
                                                            <div className="text-xs text-muted-foreground">Clean up legacy code instantly</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                                                        <Cpu className="h-5 w-5 text-orange-500" />
                                                        <div>
                                                            <div className="font-semibold text-sm">Algorithm Logic</div>
                                                            <div className="text-xs text-muted-foreground">Explain complex O(n) problems</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                                                        <Globe className="h-5 w-5 text-indigo-500" />
                                                        <div>
                                                            <div className="font-semibold text-sm">Translation & Content</div>
                                                            <div className="text-xs text-muted-foreground">Translate docs and write blogs</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-white/10">
                                            <h2 className="text-2xl font-bold text-center mb-8 text-white">Explore Our Ecosystem</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                                <Link 
                                                    href="https://peernotez.netlify.app" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all hover:shadow-lg backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                                            <Layers className="h-6 w-6" />
                                                        </div>
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">PeerNotez</h3>
                                                    <p className="text-sm text-muted-foreground">The ultimate note-sharing platform for students. Upload, share, and organize your study materials seamlessly.</p>
                                                </Link>
                                                <Link 
                                                    href="https://parikshanode.netlify.app" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all hover:shadow-lg backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                                            <GraduationCap className="h-6 w-6" />
                                                        </div>
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">ParikshaNode</h3>
                                                    <p className="text-sm text-muted-foreground">Ace your exams with our intelligent quiz application. Test your knowledge across various subjects in real-time.</p>
                                                </Link>
                                                <Link 
                                                    href="https://jatpedia.netlify.app" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all hover:shadow-lg backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                                            <BookOpen className="h-6 w-6" />
                                                        </div>
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">JatPedia</h3>
                                                    <p className="text-sm text-muted-foreground">Dive deep into history and culture. A comprehensive resource for heritage and community knowledge.</p>
                                                </Link>
                                            </div>
                                            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground border-t border-white/10 pt-8">
                                                <Link href="/about" className="hover:text-primary hover:underline transition-all">About Shivlox</Link>
                                                <Link href="/contact" className="hover:text-primary hover:underline transition-all">Contact Support</Link>
                                                <Link href="/privacy" className="hover:text-primary hover:underline transition-all">Privacy Policy</Link>
                                                <Link href="/terms" className="hover:text-primary hover:underline transition-all">Terms of Service</Link>
                                                <Link href="/donate" className="flex items-center gap-2 hover:text-red-500 font-medium transition-colors">
                                                    <Heart className="h-4 w-4 fill-current" /> Donate
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <h4 className="font-semibold mb-2">Is Shivlox AI free to use?</h4>
                                                    <p className="text-sm text-muted-foreground">Yes, Shivlox AI provides a free tier powered by Gemini 1.5 Flash, making advanced AI accessible for students and developers.</p>
                                                </div>
                                                <div className="p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <h4 className="font-semibold mb-2">Can I generate images?</h4>
                                                    <p className="text-sm text-muted-foreground">Absolutely. Just type a prompt starting with "Generate an image of..." or use the image command to create visuals instantly.</p>
                                                </div>
                                                <div className="p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <h4 className="font-semibold mb-2">Does it support coding?</h4>
                                                    <p className="text-sm text-muted-foreground">Yes, Shivlox excels at coding. It can write, debug, and explain code in Python, JavaScript, C++, Java, and more.</p>
                                                </div>
                                                <div className="p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                                    <h4 className="font-semibold mb-2">How do I save my chats?</h4>
                                                    <p className="text-sm text-muted-foreground">Chats are automatically saved to your local browser storage. Login features for cross-device syncing are coming soon.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 md:p-6 flex flex-col pb-32">
                                    {currentMessages.map((msg, index) => (
                                        <ChatMessage 
                                            key={index} 
                                            message={msg} 
                                            isLatest={index === currentMessages.length - 1 && shouldAnimateRef.current} 
                                        />
                                    ))}
                                    {isLoading && <ChatMessage isLoading message={{ role: 'model', content: '' }} />}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                    </div>
                    
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 p-4 z-20"
                    >
                        <div className="mx-auto w-full max-w-3xl">
                            <form
                                onSubmit={handleFormSubmit}
                                id="chat-input" 
                                className="relative flex w-full items-end space-x-2 rounded-3xl border border-white/10 bg-background/60 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 transition-all focus-within:border-primary/50 focus-within:shadow-primary/20"
                            >
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleSurpriseMe}
                                    className="h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary hover:bg-white/10 disabled:opacity-50"
                                    aria-label="Surprise me"
                                >
                                    <Sparkles className="h-5 w-5" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleMicClick}
                                    className={cn("h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary hover:bg-white/10", isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500")}
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
                                    className="h-9 w-9 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary hover:bg-white/10 disabled:opacity-50"
                                    aria-label="Generate image"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                                <TextareaAutosize
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isRecording ? 'Recording...' : 'Ask Shivlox AI anything...'}
                                    className="flex-1 resize-none border-none bg-transparent py-2.5 text-base shadow-none focus-visible:ring-0 focus:outline-none text-white placeholder:text-muted-foreground/50"
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
                                    className="h-9 w-9 shrink-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:shadow-none"
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
