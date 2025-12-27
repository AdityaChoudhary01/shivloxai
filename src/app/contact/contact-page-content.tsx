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
  Lightbulb, 
  Cpu, 
  Users, 
  Handshake, 
  MessageSquare, 
  Plus, 
  Mail, 
  Heart, 
  Info, 
  Lock, 
  FileText, 
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutPageContent() {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

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
                        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* HERO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center mb-16"
                            >
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 mb-4 ring-1 ring-blue-500/20">
                                    <Info className="h-8 w-8 text-blue-500" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                                    About Shivlox AI
                                </h1>
                                <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
                                    Shivlox AI is a cutting-edge chat application designed to provide intelligent, helpful, and engaging conversations. Our mission is to push the boundaries of artificial intelligence to create a seamless and intuitive user experience.
                                </p>
                            </motion.div>

                            {/* MAIN GRID */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                                    <Card className="h-full border-border/50 hover:shadow-lg transition-all">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                                </div>
                                                <CardTitle>Our Vision</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                We believe in a future where AI assistants are not just tools, but collaborative partners that help us learn, create, and solve problems more effectively. Shivlox is our first step towards that future, built on a foundation of powerful large language models and a commitment to user-centric design.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                                    <Card className="h-full border-border/50 hover:shadow-lg transition-all">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                                    <Cpu className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <CardTitle>The Technology</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Powered by Google&apos;s Gemini models, Shivlox AI leverages state-of-the-art natural language processing to understand context, generate human-like text, create images, and more. The application is built with a modern tech stack, including Next.js, React, and Tailwind CSS, ensuring a fast, responsive, and scalable platform.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* TEAM SECTION */}
                            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mt-8">
                                <Card className="border-border/50 hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Users className="h-6 w-6 text-purple-500" />
                                            </div>
                                            <CardTitle>Our Team</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Shivlox AI is developed and maintained by a passionate individual dedicated to exploring the potential of artificial intelligence. As a solo developer, I&apos;m committed to continuously improving the platform and delivering a high-quality experience for all users. Your feedback and support are invaluable to this project&apos;s growth.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            {/* GET INVOLVED SECTION */}
                            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mt-8">
                                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Handshake className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle>Get Involved</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                                            Have questions, ideas, or want to collaborate? We would love to hear from you. You can also support the project to keep it free for everyone.
                                        </p>
                                        <div className="flex gap-3">
                                            <Link href="/contact">
                                                <Button size="lg">Get in Touch</Button>
                                            </Link>
                                            <Link href="/donate">
                                                <Button size="lg" variant="outline">Support Us</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* --- CREATIVE FOOTER LINKS SECTION --- */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="mt-24 border-t border-border/50 pt-16"
                            >
                                <h2 className="text-2xl font-bold mb-8 text-center">Helpful Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* Donate Link */}
                                    <Link href="/donate" className="group block p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                                <Heart className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Support Us</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Help cover server costs and keep Shivlox AI free for students and developers.
                                        </p>
                                    </Link>

                                    {/* Privacy Link */}
                                    <Link href="/privacy" className="group block p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                                <Lock className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Privacy Policy</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            We value your data. Read how we handle your information and ensure security.
                                        </p>
                                    </Link>

                                    {/* Terms Link */}
                                    <Link href="/terms" className="group block p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Terms of Service</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Understand the rules of engagement and our policies regarding AI content.
                                        </p>
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
