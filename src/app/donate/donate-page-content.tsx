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
  Heart, 
  Coffee, 
  Server, 
  Zap, 
  MessageSquare, 
  Plus, 
  QrCode, 
  CreditCard,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DonatePageContent() {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <SidebarProvider>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            
            <div className="flex h-dvh bg-background text-foreground w-full">
                {/* --- SIDEBAR --- */}
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

                {/* --- MAIN CONTENT --- */}
                <main className="flex flex-1 flex-col overflow-hidden w-full relative bg-gradient-to-br from-background via-secondary/5 to-secondary/10">
                    <header className="shrink-0 flex h-16 items-center justify-between border-b border-border/40 bg-background/50 px-4 backdrop-blur-lg z-10">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            {user ? <UserNav /> : <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>}
                        </div>
                    </header>

                    <ScrollArea className="flex-1">
                        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* HERO SECTION */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16 space-y-6"
                            >
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-4">
                                    <Heart className="h-8 w-8 text-red-500 fill-current animate-pulse" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                    Help Keep Shivlox <span className="text-primary">Alive & Free</span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Shivlox AI is built and maintained by a solo developer. Your support directly covers 
                                    server costs, API fees, and helps accelerate the development of new features.
                                </p>
                            </motion.div>

                            {/* DONATION METHODS TABS */}
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="max-w-4xl mx-auto"
                            >
                                <Tabs defaultValue="international" className="w-full">
                                    <div className="flex justify-center mb-8">
                                        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                                            <TabsTrigger value="international">Cards / International</TabsTrigger>
                                            <TabsTrigger value="upi">UPI (India)</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {/* --- TAB 1: BUY ME A COFFEE / PAYPAL --- */}
                                    <TabsContent value="international">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            
                                            {/* Tier 1 */}
                                            <motion.div variants={itemVariants}>
                                                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg relative overflow-hidden group">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Coffee className="h-5 w-5 text-blue-500" /> 
                                                            Buy me a Coffee
                                                        </CardTitle>
                                                        <CardDescription>Fuel for late night coding</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-3xl font-bold mb-4">$5 <span className="text-sm font-normal text-muted-foreground">/ one-time</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Virtual High Five</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Developer Gratitude</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                        {/* UPDATE LINK HERE */}
                                                        <Button className="w-full" asChild>
                                                            <Link href="https://buymeacoffee.com/adityachoudhary" target="_blank">Support $5</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>

                                            {/* Tier 2 (Highlighted) */}
                                            <motion.div variants={itemVariants}>
                                                <Card className="h-full border-primary shadow-md hover:shadow-xl transition-all relative overflow-hidden scale-105 z-10 bg-background">
                                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Server className="h-5 w-5 text-primary" /> 
                                                            Server Sponsor
                                                        </CardTitle>
                                                        <CardDescription>Keeps the API running</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-3xl font-bold mb-4">$15 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Covers 10k Tokens</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Support</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Name in GitHub Readme</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                         {/* UPDATE LINK HERE */}
                                                        <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                                                            <Link href="https://ko-fi.com/adityachoudhary" target="_blank">Become a Sponsor</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>

                                            {/* Tier 3 */}
                                            <motion.div variants={itemVariants}>
                                                <Card className="h-full hover:border-purple-500/50 transition-all hover:shadow-lg relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Zap className="h-5 w-5 text-purple-500" /> 
                                                            Power User
                                                        </CardTitle>
                                                        <CardDescription>Accelerate Development</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-3xl font-bold mb-4">$50+ <span className="text-sm font-normal text-muted-foreground">/ one-time</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Feature Request Priority</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Early Access to Beta</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Personal Thank You</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                         {/* UPDATE LINK HERE */}
                                                        <Button className="w-full" variant="outline" asChild>
                                                            <Link href="https://paypal.me/adityachoudhary" target="_blank">Donate Custom</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </TabsContent>

                                    {/* --- TAB 2: UPI / QR CODE (For India) --- */}
                                    <TabsContent value="upi">
                                        <motion.div 
                                            variants={itemVariants}
                                            className="bg-background rounded-xl border border-border p-8 max-w-2xl mx-auto shadow-sm"
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                                                    {/* REPLACE WITH YOUR ACTUAL QR CODE IMAGE */}
                                                    {/* <img src="/upi-qr.png" alt="UPI QR Code" className="w-48 h-48 object-contain" /> */}
                                                    <div className="w-48 h-48 bg-gray-100 flex flex-col items-center justify-center rounded-lg text-gray-400">
                                                        <QrCode className="h-12 w-12 mb-2" />
                                                        <span className="text-xs text-center px-2">Add your QR Code Image here</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4 text-center md:text-left">
                                                    <div>
                                                        <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                                                            <CreditCard className="h-5 w-5 text-primary" />
                                                            Pay via UPI
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm mt-1">
                                                            Scan the QR code with Paytm, PhonePe, GPay, or any UPI app.
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                                                        <code className="text-sm font-mono font-semibold">adityachoudhary@okhdfcbank</code>
                                                        <Button size="sm" variant="ghost" onClick={() => {
                                                            navigator.clipboard.writeText("adityachoudhary@okhdfcbank");
                                                            // Optional: Add toast here
                                                        }}>
                                                            Copy
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        * 100% of UPI contributions go directly to server maintenance.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>

                            {/* TRANSPARENCY SECTION */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="mt-20 border-t border-border/50 pt-10 text-center"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-4">
                                    <ShieldCheck className="h-4 w-4" /> 100% Transparency
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Where does the money go?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-sm text-muted-foreground">
                                    <div className="p-4">
                                        <strong className="block text-foreground text-lg mb-2">60%</strong>
                                        Covers Google Cloud Platform & Vercel hosting fees to keep the app fast.
                                    </div>
                                    <div className="p-4">
                                        <strong className="block text-foreground text-lg mb-2">30%</strong>
                                        API Usage costs (Gemini Pro/Flash) as we scale beyond free tiers.
                                    </div>
                                    <div className="p-4">
                                        <strong className="block text-foreground text-lg mb-2">10%</strong>
                                        Coffee & Snacks to keep the developer awake during bug fixes.
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </ScrollArea>
                </main>
            </div>
        </SidebarProvider>
    );
}
