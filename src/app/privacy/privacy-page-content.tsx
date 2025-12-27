'use client';

import React, { useState } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarTrigger, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { AuthModal } from '@/components/auth-modal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageSquare, 
  Plus, 
  Mail, 
  Heart, 
  Lock, 
  ShieldCheck, 
  Info, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PrivacyPageContent() {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const sections = [
        {
            title: "Information We Collect",
            content: "We may collect information about you in a variety of ways. The information we may collect via the Application includes: Personal Data (name, email, profile picture), Derivative Data (IP address, browser type), and User Content (chat messages, prompts)."
        },
        {
            title: "How We Use Your Information",
            content: "Having accurate information permits us to provide a smooth, efficient, and customized experience. We use your information to create and manage your account, email you regarding your account, improve our Application, monitor usage, and prevent fraudulent activity."
        },
        {
            title: "Disclosure of Your Information",
            content: "We may share information in certain situations, such as to comply with legal processes, protect our rights, or with third-party service providers (like data analysis or hosting services) who perform services on our behalf."
        },
        {
            title: "Security of Your Information",
            content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide, no security measures are perfect or impenetrable."
        },
        {
            title: "Policy for Children",
            content: "We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the information provided below."
        }
    ];

    return (
        <SidebarProvider>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            
            {/* 1. UPDATED: bg-transparent */}
            <div className="flex h-dvh bg-transparent text-foreground w-full">
                
                {/* 2. UPDATED: Sidebar Glassmorphism */}
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

                {/* --- MAIN CONTENT --- */}
                {/* 3. UPDATED: Transparent main wrapper */}
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
                        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* HERO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center mb-16"
                            >
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 mb-4 ring-1 ring-green-500/20">
                                    <Lock className="h-8 w-8 text-green-500" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
                                    Privacy Policy
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Your privacy is important to us. This policy outlines how we handle your data.
                                    <br/><strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                                </p>
                            </motion.div>
          
                            {/* SECTIONS */}
                            <div className="space-y-8">
                                {sections.map((section, index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        {/* 5. UPDATED: Glass Cards for Content */}
                                        <Card className="transition-all duration-300 hover:shadow-lg border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-white">
                                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                                    {section.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* --- CREATIVE FOOTER LINKS SECTION --- */}
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
                                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Info className="h-6 w-6" /></div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">About Us</h3>
                                        <p className="text-sm text-muted-foreground">Learn about our mission and technology.</p>
                                    </Link>

                                    <Link href="/contact" className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:shadow-lg transition-all backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><Mail className="h-6 w-6" /></div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">Contact Support</h3>
                                        <p className="text-sm text-muted-foreground">Get help or report issues directly.</p>
                                    </Link>

                                    <Link href="/terms" className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:shadow-lg transition-all backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500"><FileText className="h-6 w-6" /></div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors text-white">Terms of Service</h3>
                                        <p className="text-sm text-muted-foreground">Read our usage rules and policies.</p>
                                    </Link>

                                </div>
                            </motion.div>

                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    );
}
