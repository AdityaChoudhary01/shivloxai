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
  FileText, 
  Shield, 
  Info, 
  Lock, 
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TermsPageContent() {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const sections = [
        {
            title: "1. Agreement to Terms",
            content: "By using our application, Shivlox AI ('Application'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, do not use the Application."
        },
        {
            title: "2. Changes to Terms or Services",
            content: "We may modify the Terms at any time. If we do, we'll let you know by posting the modified Terms on the site or through other communications. Your continued use of the Application after we post modified Terms means you agree to be bound by them."
        },
        {
            title: "3. User Accounts",
            content: "You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. We are not responsible for any loss or damage that may be incurred as a result of unauthorized access."
        },
        {
            title: "4. User Conduct",
            content: "You agree not to post infringing, fraudulent, defamatory, or harmful content. You also agree not to attempt to probe, scan, or test the vulnerability of any Shivlox AI system or breach any security measures."
        },
        {
            title: "5. Termination",
            content: "We may terminate your access to and use of the Application, at our sole discretion, at any time and without notice. You may cancel your account by contacting us."
        },
        {
            title: "6. Limitation of Liability",
            content: "Shivlox AI will not be liable for any incidental, special, exemplary, or consequential damages, including lost profits or loss of data, arising out of or in connection with these terms or the use of the Application."
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
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-orange-500/10 mb-4 ring-1 ring-orange-500/20">
                                    <FileText className="h-8 w-8 text-orange-500" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                                    Terms of Service
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Please read our terms carefully before using Shivlox AI.
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
                                                    <Shield className="h-5 w-5 text-primary" />
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
                                className="mt-24 border-t border-border/50 pt-16"
                            >
                                <h2 className="text-2xl font-bold mb-8 text-center">Helpful Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* About Link */}
                                    <Link href="/about" className="group block p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                                <Info className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">About Us</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Learn about our mission and the technology powering Shivlox AI.
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
                                            Read how we handle your information and chat logs securely.
                                        </p>
                                    </Link>

                                    {/* Contact Link */}
                                    <Link href="/contact" className="group block p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Contact Us</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Have questions about these terms? Reach out to our support team.
                                        </p>
                                    </Link>

                                </div>
                            </motion.div>

                            {/* Standard Footer Links */}
                            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground border-t border-border/50 pt-10 mt-16 pb-10">
                                <Link href="/about" className="hover:text-primary hover:underline transition-all">About Shivlox</Link>
                                <Link href="/contact" className="hover:text-primary hover:underline transition-all">Contact Support</Link>
                                <Link href="/donate" className="flex items-center gap-2 hover:text-red-500 font-medium transition-colors">
                                    <Heart className="h-4 w-4 fill-current" /> Donate
                                </Link>
                                <Link href="/privacy" className="hover:text-primary hover:underline transition-all">Privacy Policy</Link>
                            </div>

                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    );
}
