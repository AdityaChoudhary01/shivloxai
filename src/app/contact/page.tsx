
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
    title: 'Contact Us - Shivlox AI',
    description: 'Get in touch with the Shivlox AI team. Send us your questions, feedback, or collaboration ideas through our contact form.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/50 px-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center">
            <Link href="/">
               <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shivlox AI
              </div>
            </Link>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href="/" passHref><DropdownMenuItem>Home</DropdownMenuItem></Link>
                <Link href="/about" passHref><DropdownMenuItem>About</DropdownMenuItem></Link>
                <Link href="/donate" passHref><DropdownMenuItem>Donate</DropdownMenuItem></Link>
                <Link href="/privacy" passHref><DropdownMenuItem>Privacy Policy</DropdownMenuItem></Link>
                <Link href="/terms" passHref><DropdownMenuItem>Terms of Service</DropdownMenuItem></Link>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl py-12 md:py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Have a question, feedback, or a collaboration idea? We'd love to hear from you. Drop us a line using the form below. For details on how we handle your data, please see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </motion.div>

          <ContactForm />

        </div>
      </main>
    </div>
  );
}
