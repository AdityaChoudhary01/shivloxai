'use client';

import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { AuthModal } from '@/components/auth-modal';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare, 
  Github, 
  Linkedin, 
  Twitter, 
  Plus, 
  HelpCircle, 
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContactPageContent() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Message Sent!",
            description: "We'll get back to you within 24 hours.",
        });

        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsLoading(false);
    };

    return (
        <SidebarProvider>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            
            <div className="flex h-dvh bg-background text-foreground w-full">
                {/* --- REUSED SIDEBAR (Consistency) --- */}
                <Sidebar>
                    <SidebarHeader className="p-2">
                        <div className="flex items-center justify-between p-2">
                            <Link href="/" className="flex items-center gap-2">
                                <ShivloxIcon className="h-8 w-8" />
                                <h2 className="text-lg font-semibold">Shivlox AI</h2>
                            </Link>
                            <SidebarTrigger className="md:hidden"/>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">
                                <Plus className="mr-2" />
                                New Chat
                            </Link>
                        </Button>
                    </SidebarHeader>
                    <ScrollArea className="flex-1">
                        <SidebarContent className="p-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link href="/" className="flex items-center w-full rounded-md px-2 py-2 hover:bg-accent/40 transition-colors">
                                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Back to Chat</span>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                    </ScrollArea>
                    <SidebarFooter className="p-4 border-t border-border">
                        <p className="text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Shivlox AI.
                        </p>
                    </SidebarFooter>
                </Sidebar>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex flex-1 flex-col overflow-hidden w-full relative bg-secondary/5">
                    {/* Header */}
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-border/40 bg-background/50 px-4 backdrop-blur-lg z-10">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            {user ? <UserNav /> : <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>}
                        </div>
                    </header>

                    <ScrollArea className="flex-1">
                        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* 1. HERO SECTION */}
                            <div className="text-center mb-16 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                        Get in Touch with <span className="text-primary">Shivlox</span>
                                    </h1>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Have a question about our Gemini integration? Found a bug? 
                                        Or just want to discuss a partnership? We'd love to hear from you.
                                    </p>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                
                                {/* 2. CONTACT FORM */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="bg-background rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        Send us a Message
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                                <Input 
                                                    id="name" name="name" placeholder="John Doe" 
                                                    value={formData.name} onChange={handleChange} required 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                                <Input 
                                                    id="email" name="email" type="email" placeholder="john@example.com" 
                                                    value={formData.email} onChange={handleChange} required 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                            <Input 
                                                id="subject" name="subject" placeholder="Bug Report / Feature Request" 
                                                value={formData.subject} onChange={handleChange} required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                                            <Textarea 
                                                id="message" name="message" placeholder="Tell us how we can help..." 
                                                className="min-h-[150px]"
                                                value={formData.message} onChange={handleChange} required 
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Sending..." : "Send Message"} 
                                            {!isLoading && <Send className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </form>
                                </motion.div>

                                {/* 3. INFO & FAQ SIDEBAR */}
                                <div className="space-y-8">
                                    
                                    {/* Direct Contact Cards */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <h3 className="font-semibold text-blue-600 mb-1">General Support</h3>
                                            <p className="text-sm text-muted-foreground mb-3">For account & technical issues</p>
                                            <a href="mailto:support@shivlox.ai" className="text-sm font-medium hover:underline">support@shivlox.ai</a>
                                        </div>
                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                            <h3 className="font-semibold text-purple-600 mb-1">Partnerships</h3>
                                            <p className="text-sm text-muted-foreground mb-3">For business & API inquiries</p>
                                            <a href="mailto:partners@shivlox.ai" className="text-sm font-medium hover:underline">partners@shivlox.ai</a>
                                        </div>
                                    </motion.div>

                                    {/* Location & Hours */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="bg-background rounded-2xl border border-border/50 p-6 space-y-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                            <div>
                                                <h3 className="font-semibold">Headquarters</h3>
                                                <p className="text-sm text-muted-foreground">Greater Noida, Uttar Pradesh<br/>India, 201310</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                                            <div>
                                                <h3 className="font-semibold">Business Hours</h3>
                                                <p className="text-sm text-muted-foreground">Mon - Fri: 10:00 AM - 7:00 PM (IST)</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Socials */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <h3 className="text-lg font-semibold mb-4">Connect with the Developer</h3>
                                        <div className="flex gap-4">
                                            <a href="https://github.com/adityachoudhary" target="_blank" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a href="https://linkedin.com" target="_blank" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <a href="https://twitter.com" target="_blank" className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </motion.div>

                                </div>
                            </div>

                            {/* 4. MINI FAQ SECTION */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="mt-20 pt-12 border-t border-border/50"
                            >
                                <h2 className="text-2xl font-bold text-center mb-10">Before you ask...</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <FaqItem 
                                        question="Is the API free?" 
                                        answer="Shivlox is currently free to use during our beta period. API usage limits apply based on Google's Gemini quotas." 
                                    />
                                    <FaqItem 
                                        question="How do I report a bug?" 
                                        answer="Please use the form above with the subject 'Bug Report'. Include steps to reproduce the issue for faster resolution." 
                                    />
                                    <FaqItem 
                                        question="Can I contribute?" 
                                        answer="Yes! Check out our GitHub repository. We welcome pull requests for new features and bug fixes." 
                                    />
                                </div>
                            </motion.div>

                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="space-y-2">
            <h4 className="font-semibold text-lg flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                {question}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {answer}
            </p>
        </div>
    );
}
