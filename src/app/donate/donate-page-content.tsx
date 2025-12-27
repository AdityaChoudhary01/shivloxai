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
import { useToast } from '@/hooks/use-toast';
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
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Info,
  Lock,
  FileText,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DonatePageContent() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleCopyUpi = () => {
        navigator.clipboard.writeText("adityachoudhary@okhdfcbank");
        setIsCopied(true);
        toast({ 
            title: "Copied!", 
            description: "UPI ID copied to clipboard.",
            variant: "default"
        });
        
        setTimeout(() => setIsCopied(false), 2000);
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
                            {/* Donate Link (Active/Highlighted) */}
                            <SidebarMenuItem>
                                <Link 
                                    href="/donate" 
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium bg-accent text-red-500 transition-colors"
                                >
                                    <Heart className="h-4 w-4 fill-current" />
                                    <span>Donate</span>
                                </Link>
                            </SidebarMenuItem>

                            {/* Contact Link */}
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

                {/* --- MAIN CONTENT (Gradient Applied) --- */}
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
                        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                            
                            {/* HERO SECTION */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16 space-y-6"
                            >
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-4 ring-1 ring-red-500/20">
                                    <Heart className="h-8 w-8 text-red-500 fill-red-500/20 animate-pulse" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                    Help Keep Shivlox <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Alive & Free</span>
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
                                <Tabs defaultValue="upi" className="w-full">
                                    <div className="flex justify-center mb-8">
                                        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                                            <TabsTrigger value="upi">UPI (India)</TabsTrigger>
                                            <TabsTrigger value="international">Cards / International</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {/* --- TAB 1: UPI / QR CODE (For India) --- */}
                                    <TabsContent value="upi">
                                        <motion.div 
                                            variants={itemVariants}
                                            className="bg-background rounded-xl border border-border p-8 max-w-2xl mx-auto shadow-sm"
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 shrink-0">
                                                    {/* REPLACE WITH YOUR ACTUAL QR CODE IMAGE */}
                                                    {/* <img src="/upi-qr.png" alt="UPI QR Code" className="w-48 h-48 object-contain" /> */}
                                                    <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center rounded-lg text-gray-400">
                                                        <QrCode className="h-12 w-12 mb-2 opacity-50" />
                                                        <span className="text-xs text-center px-2 font-medium">Add QR Code Image</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4 text-center md:text-left w-full">
                                                    <div>
                                                        <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                                                            <CreditCard className="h-5 w-5 text-primary" />
                                                            Pay via UPI
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm mt-1">
                                                            Scan the QR code with Paytm, PhonePe, GPay, or any UPI app.
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="bg-secondary/50 border border-border p-3 rounded-lg flex items-center justify-between group hover:border-primary/50 transition-colors">
                                                        <code className="text-sm font-mono font-semibold truncate mr-2 select-all">adityachoudhary@okhdfcbank</code>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 shrink-0"
                                                            onClick={handleCopyUpi}
                                                        >
                                                            {isCopied ? (
                                                                <Check className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        100% of UPI contributions go directly to server maintenance.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </TabsContent>

                                    {/* --- TAB 2: BUY ME A COFFEE (International/Cards) --- */}
                                    <TabsContent value="international">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                            {/* Tier 1 */}
                                            <motion.div variants={itemVariants} className="flex">
                                                <Card className="flex flex-col h-full hover:border-blue-500/50 transition-all hover:shadow-lg relative overflow-hidden group w-full">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Coffee className="h-5 w-5 text-blue-500" /> 
                                                            Buy a Coffee
                                                        </CardTitle>
                                                        <CardDescription>Fuel for late night coding</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex-1">
                                                        <div className="text-3xl font-bold mb-4">₹150 <span className="text-sm font-normal text-muted-foreground">/ one-time</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Virtual High Five</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Developer Gratitude</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button className="w-full" variant="outline" asChild>
                                                            <Link href="https://buymeacoffee.com/adityachoudhary" target="_blank">Support ₹150</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>

                                            {/* Tier 2 (Highlighted) */}
                                            <motion.div variants={itemVariants} className="flex">
                                                <Card className="flex flex-col h-full border-primary shadow-md hover:shadow-xl transition-all relative overflow-hidden scale-105 z-10 bg-background w-full">
                                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">POPULAR</div>
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Server className="h-5 w-5 text-primary" /> 
                                                            Server Sponsor
                                                        </CardTitle>
                                                        <CardDescription>Keeps the API running</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex-1">
                                                        <div className="text-3xl font-bold mb-4">₹1,000 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Covers 10k Tokens</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Support</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Name in GitHub Readme</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                                                            <Link href="https://buymeacoffee.com/adityachoudhary" target="_blank">Become a Sponsor</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>

                                            {/* Tier 3 */}
                                            <motion.div variants={itemVariants} className="flex">
                                                <Card className="flex flex-col h-full hover:border-purple-500/50 transition-all hover:shadow-lg relative overflow-hidden group w-full">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Zap className="h-5 w-5 text-purple-500" /> 
                                                            Power User
                                                        </CardTitle>
                                                        <CardDescription>Accelerate Development</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex-1">
                                                        <div className="text-3xl font-bold mb-4">₹4,000+ <span className="text-sm font-normal text-muted-foreground">/ one-time</span></div>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Feature Request Priority</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Early Access to Beta</li>
                                                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Personal Thank You</li>
                                                        </ul>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button className="w-full" variant="outline" asChild>
                                                            <Link href="https://buymeacoffee.com/adityachoudhary" target="_blank">Support on BMC</Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        </div>
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
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-4 ring-1 ring-green-500/20">
                                    <ShieldCheck className="h-4 w-4" /> 100% Transparency
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Where does the money go?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-sm text-muted-foreground">
                                    <div className="p-4 rounded-lg bg-background/50 border border-transparent hover:border-border/50 transition-colors">
                                        <strong className="block text-foreground text-lg mb-2">60%</strong>
                                        Covers Google Cloud Platform & Vercel hosting fees to keep the app fast.
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/50 border border-transparent hover:border-border/50 transition-colors">
                                        <strong className="block text-foreground text-lg mb-2">30%</strong>
                                        API Usage costs (Gemini Pro/Flash) as we scale beyond free tiers.
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/50 border border-transparent hover:border-border/50 transition-colors">
                                        <strong className="block text-foreground text-lg mb-2">10%</strong>
                                        Coffee & Snacks to keep the developer awake during bug fixes.
                                    </div>
                                </div>
                            </motion.div>

                            {/* --- CREATIVE FOOTER LINKS SECTION --- */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                                className="mt-24 border-t border-border/50 pt-16"
                            >
                                <h2 className="text-2xl font-bold text-center mb-10">Explore More</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    
                                    {/* About Link */}
                                    <Link href="/about" className="group p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all text-left">
                                        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg w-fit text-blue-500">
                                            <Info className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">About Us</h3>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Learn about our mission to democratize AI access.
                                        </p>
                                    </Link>

                                    {/* Contact Link */}
                                    <Link href="/contact" className="group p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all text-left">
                                        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg w-fit text-purple-500">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Contact</h3>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Get support or report bugs directly to the team.
                                        </p>
                                    </Link>

                                    {/* Privacy Link */}
                                    <Link href="/privacy" className="group p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all text-left">
                                        <div className="mb-4 p-3 bg-green-500/10 rounded-lg w-fit text-green-500">
                                            <Lock className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Privacy</h3>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            How we secure your data and chat history.
                                        </p>
                                    </Link>

                                    {/* Terms Link */}
                                    <Link href="/terms" className="group p-6 rounded-xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg transition-all text-left">
                                        <div className="mb-4 p-3 bg-orange-500/10 rounded-lg w-fit text-orange-500">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Terms</h3>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Rules of engagement and usage policies.
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
