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
            
            <div className="flex h-dvh bg-background text-foreground w-full">
                {/* --- SIDEBAR --- */}
                <Sidebar collapsible="icon">
                    <SidebarHeader className="p-2">
                        <div className="flex items-center justify-between p-2">
                            <Link href="/" className="flex items-center gap-2 overflow-hidden">
                                <ShivloxIcon className="h-8 w-8 shrink-0" />
                                <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Shivlox AI</h2>
                            </Link>
                        </div>
                        <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center" asChild>
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
                                    <Link href="/" className="flex items-center w-full rounded-md px-2 py-2 hover:bg-accent/40 transition-colors group-data-[collapsible=icon]:justify-center">
                                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground group-data-[collapsible=icon]:mr-0" />
                                        <span className="text-sm group-data-[collapsible=icon]:hidden">Back to Chat</span>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                    </ScrollArea>
                    
                    {/* --- SIDEBAR FOOTER --- */}
                    <SidebarFooter className="p-2 border-t border-border group-data-[collapsible=icon]:hidden">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link 
                                    href="/donate" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-red-500 transition-colors"
                                >
                                    <Heart className="h-4 w-4" />
                                    <span>Donate</span>
                                </Link>
                            </SidebarMenuItem>
                            
                            <SidebarMenuItem>
                                <Link 
                                    href="/contact" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>Contact & Support</span>
                                </Link>
                            </SidebarMenuItem>

                            <div className="my-1 border-t border-border/50" />
                            
                            <div className="flex flex-wrap gap-2 px-2 py-1 text-xs text-muted-foreground/60">
                                <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                                <span>•</span>
                                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                                <span>•</span>
                                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                            </div>

                            <p className="mt-2 text-center text-[10px] text-muted-foreground/40">
                                &copy; {new Date().getFullYear()} Shivlox AI.
                            </p>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                {/* --- MAIN CONTENT (With Gradient) --- */}
                <main className="flex flex-1 flex-col overflow-hidden w-full relative bg-gradient-to-br from-background via-secondary/5 to-secondary/10">
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-border/40 bg-background/50 px-4 backdrop-blur-lg z-10 sticky top-0">
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
                                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                                    Privacy Policy
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Your privacy is important to us. This policy outlines how we handle your data.
                                    <br/><strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                                </p>
                            </motion.div>
          
                            <div className="space-y-8">
                                {sections.map((section, index) => (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.3 }}
                                    >
                                        <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
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

                                {/* Contact Card for Privacy Questions */}
                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Mail className="h-6 w-6 text-primary" />
                                                </div>
                                                <CardTitle>Contact Us About Privacy</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <p className="text-muted-foreground leading-relaxed max-w-xl">
                                                If you have specific questions about how we handle your data or wish to request data deletion, please contact our support team.
                                            </p>
                                            <Link href="/contact">
                                                <Button variant="outline" className="group">
                                                    Contact Support 
                                                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* --- CREATIVE FOOTER LINKS SECTION --- */}
                            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground border-t border-border/50 pt-10 mt-16 pb-10">
                                <Link href="/about" className="hover:text-primary hover:underline transition-all">About Shivlox</Link>
                                <Link href="/contact" className="hover:text-primary hover:underline transition-all">Contact Support</Link>
                                <Link href="/donate" className="flex items-center gap-2 hover:text-red-500 font-medium transition-colors">
                                    <Heart className="h-4 w-4 fill-current" /> Donate
                                </Link>
                                <Link href="/terms" className="hover:text-primary hover:underline transition-all">Terms of Service</Link>
                            </div>

                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    );
}
