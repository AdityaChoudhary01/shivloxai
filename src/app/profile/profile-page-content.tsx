'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
import { ShivloxIcon } from '@/components/shivlox-icon';
import { UserNav } from '@/components/user-nav';
import { AuthModal } from '@/components/auth-modal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LoaderCircle, 
  Camera, 
  User, 
  Mail, 
  MessageSquare, 
  Plus, 
  Heart, 
  Info, 
  Lock, 
  FileText 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePageContent() {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setAvatarPreview(user.photoURL || '');
    }
  }, [user]);

  // Redirect logic or empty state if not logged in
  if (!loading && !user) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">Please log in to view your profile.</p>
                <Button onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        </div>
     )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);

    try {
      let photoURL = user?.photoURL;
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          photoURL = data.secure_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
      });

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      
      // Allow visual update before reload
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-background">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

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
                            <Link href="/donate" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-red-500 transition-colors">
                                <Heart className="h-4 w-4" />
                                <span>Donate</span>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/contact" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
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
                        <UserNav />
                    </div>
                </header>

                <ScrollArea className="flex-1">
                    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* 5. UPDATED: Profile Card Glassmorphism */}
                            <Card className="border-white/10 shadow-lg bg-white/5 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10 pb-8">
                                    <CardTitle className="text-2xl font-bold text-white">Profile Settings</CardTitle>
                                    <CardDescription>
                                        Manage your public profile and account settings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        
                                        {/* Avatar Upload Section */}
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                                <Avatar className="h-32 w-32 border-4 border-white/10 shadow-xl ring-2 ring-white/10 transition-transform group-hover:scale-105">
                                                    <AvatarImage src={avatarPreview} className="object-cover" />
                                                    <AvatarFallback className="text-3xl bg-secondary">{getInitials(name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="h-8 w-8 text-white" />
                                                </div>
                                                <input 
                                                    ref={fileInputRef}
                                                    type="file" 
                                                    onChange={handleAvatarChange} 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                />
                                            </div>
                                            <div className="flex-1 text-center md:text-left space-y-2">
                                                <h3 className="font-medium text-lg text-white">Profile Picture</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Click on the avatar to upload a custom photo from your device.
                                                </p>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={triggerFileInput}
                                                    className="mt-2 border-white/10 hover:bg-white/10 hover:text-white"
                                                >
                                                    Upload New Image
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="flex items-center gap-2 text-white">
                                                    <User className="h-4 w-4" /> Display Name
                                                </Label>
                                                <Input 
                                                    id="name" 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)} 
                                                    className="max-w-md bg-white/10 border-white/10 text-white focus-visible:ring-primary/50"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2 text-white">
                                                    <Mail className="h-4 w-4" /> Email Address
                                                </Label>
                                                <Input 
                                                    id="email" 
                                                    value={user?.email || ''} 
                                                    disabled 
                                                    className="max-w-md bg-white/5 border-white/5 text-muted-foreground cursor-not-allowed"
                                                />
                                                <p className="text-[12px] text-muted-foreground">
                                                    Your email address is managed by Google Sign-In.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-white/10">
                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="min-w-[140px] bg-primary hover:bg-primary/90 text-primary-foreground"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </ScrollArea>
            </main>
        </div>
    </SidebarProvider>
  );
}
