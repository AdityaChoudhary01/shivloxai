'use client';

import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { AuthModal } from '@/components/auth-modal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPin, 
  Clock,
  MessageSquare, 
  Github, 
  Linkedin, 
  Twitter, 
  Plus, 
  HelpCircle, 
  Mail,
  Heart,
  Info,
  Lock,
  FileText,
  ChevronRight
} from 'lucide-react';

import { ContactForm } from './contact-form'; 

export function ContactPageContent() {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <SidebarProvider>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            
            {/* 1. UPDATED: Changed bg-background to bg-transparent */}
            <div className="flex h-dvh bg-transparent text-foreground w-full">
                
                {/* 2. UPDATED: Sidebar with Glassmorphism */}
                <Sidebar collapsible="icon" className="bg-background/40 backdrop-blur-md border-r border-white/5">
                    <SidebarHeader className="p-2">
                        <div className="flex items-center justify-between p-2">
                            <Link href="/" className="flex items-center gap-2 overflow-hidden">
                                <ShivloxIcon className="h-8 w-8 shrink-0" />
                                <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Shivlox AI</h2>
                            </Link>
                        </div>
                        <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center bg-secondary/50 border-white/10 hover:bg-secondary/80" asChild>
                            <Link href="/">
                                <Plus className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                                <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
                            </Link>
                        </Button>
                    </SidebarHeader>
                    
                    <ScrollArea className="flex-1">
                        <SidebarContent className="p-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link href="/" className="flex items-center w-full rounded-md px-2 py-2 hover:bg-white/5 hover:text-white text-muted-foreground transition-colors group-data-[collapsible=icon]:justify-center">
                                        <MessageSquare className="h-4 w-4 mr-2 group-data-[collapsible=icon]:mr-0" />
                                        <span className="text-sm group-data-[collapsible=icon]:hidden">Back to Chat</span>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                    </ScrollArea>
                    
                    {/* --- SIDEBAR FOOTER --- */}
                    <SidebarFooter className="p-2 border-t border-white/10 group-data-[collapsible=icon]:hidden">
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
                            
                            {/* Contact Active */}
                            <SidebarMenuItem>
                                <Link 
                                    href="/contact" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium bg-white/10 text-white transition-colors"
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

                {/* --- MAIN CONTENT --- */}
                {/* 3. UPDATED: No specific background, just transparent relative container */}
                <main className="flex flex-1 flex-col overflow-hidden w-full relative bg-transparent">
                    
                    {/* 4. UPDATED: Header Glassmorphism */}
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-white/5 bg-background/20 backdrop-blur-xl px-4 shadow-sm z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            {user ? <UserNav /> : <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>}
                        </div>
                    </header>

                    <ScrollArea className="flex-1">
                        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* HERO */}
                            <div className="text-center mb-16 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                                        Get in Touch with <span className="text-primary">Shivlox</span>
                                    </h1>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Have a question about our Gemini integration? Found a bug? 
                                        Or just want to discuss a partnership? We'd love to hear from you.
                                    </p>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                
                                {/* 1. CONTACT FORM */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
                                        <Mail className="h-5 w-5 text-primary" />
                                        Send us a Message
                                    </h2>
                                    <ContactForm />
                                </div>

                                {/* 2. INFO SIDEBAR */}
                                <div className="space-y-8 mt-12 lg:mt-0">
                                    {/* Direct Contact Cards */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                                            <h3 className="font-semibold text-blue-500 mb-1">General Support</h3>
                                            <p className="text-sm text-muted-foreground mb-3">For account & technical issues</p>
                                            <a href="mailto:aadiwrld01@gmail.com" className="text-sm font-medium hover:underline text-white">aadiwrld01@gmail.com</a>
                                        </div>
                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                                            <h3 className="font-semibold text-purple-500 mb-1">Partnerships</h3>
                                            <p className="text-sm text-muted-foreground mb-3">For business & API inquiries</p>
                                            <a href="mailto:aadiwrld01@gmail.com" className="text-sm font-medium hover:underline text-white">aadiwrld01@gmail.com</a>
                                        </div>
                                    </motion.div>

                                    {/* Location Card - Updated to Glass */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4 shadow-sm"
                                    >
                                        <div className="flex items-start gap-4">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white">Headquarters</h3>
                                                <p className="text-sm text-muted-foreground">Greater Noida, Uttar Pradesh<br/>India, 201310</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-white">Business Hours</h3>
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
                                        <h3 className="text-lg font-semibold mb-4 text-white">Connect with the Developer</h3>
                                        <div className="flex gap-4">
                                            <a href="https://github.com/adityachoudhary01" target="_blank" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-colors text-white">
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a href="https://www.linkedin.com/in/aditya-kumar-38093a304/" target="_blank" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-colors text-white">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <a href="https://twitter.com" target="_blank" className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-colors text-white">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* 3. HELPFUL RESOURCES (Glass Cards) */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="mt-24 border-t border-white/10 pt-16"
                            >
                                <h2 className="text-2xl font-bold mb-8 text-center text-white">Helpful Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    <Link href="/about" className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:shadow-lg transition-all backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                                <Info className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">About Us</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Learn about the mission behind Shivlox AI, our commitment to open-source, and the technology powering our platform.
                                        </p>
                                    </Link>

                                    <Link href="/privacy" className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:shadow-lg transition-all backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                                <Lock className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">Privacy Policy</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            We value your data. Read how we handle your information, chat logs, and ensure your conversations remain secure.
                                        </p>
                                    </Link>

                                    <Link href="/terms" className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:shadow-lg transition-all backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">Terms of Service</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Understand the rules of engagement, usage limits for the free tier, and our policies regarding AI-generated content.
                                        </p>
                                    </Link>

                                </div>
                            </motion.div>

                            {/* 4. FAQ SECTION */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="mt-20 pt-12 border-t border-white/10"
                            >
                                <h2 className="text-2xl font-bold text-center mb-10 text-white">Before you ask...</h2>
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
            <h4 className="font-semibold text-lg flex items-center gap-2 text-white">
                <HelpCircle className="h-4 w-4 text-primary" />
                {question}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {answer}
            </p>
        </div>
    );
}
