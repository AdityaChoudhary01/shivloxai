
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Lightbulb, Cpu, Users, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Shivlox AI',
  description: 'Learn about the mission, vision, and technology behind Shivlox AI, a modern and intelligent chat application.',
};

export default function AboutPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
                <Link href="/contact" passHref><DropdownMenuItem>Contact</DropdownMenuItem></Link>
                <Link href="/donate" passHref><DropdownMenuItem>Donate</DropdownMenuItem></Link>
                <Link href="/privacy" passHref><DropdownMenuItem>Privacy Policy</DropdownMenuItem></Link>
                <Link href="/terms" passHref><DropdownMenuItem>Terms of Service</DropdownMenuItem></Link>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 px-4">
        <div className="container mx-auto max-w-4xl py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About Shivlox AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Shivlox AI is a cutting-edge chat application designed to provide intelligent, helpful, and engaging conversations. Our mission is to push the boundaries of artificial intelligence to create a seamless and intuitive user experience.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Lightbulb className="h-8 w-8 text-primary" />
                    <CardTitle>Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in a future where AI assistants are not just tools, but collaborative partners that help us learn, create, and solve problems more effectively. Shivlox is our first step towards that future, built on a foundation of powerful large language models and a commitment to user-centric design.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Cpu className="h-8 w-8 text-primary" />
                    <CardTitle>The Technology</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Powered by Google's Gemini models, Shivlox AI leverages state-of-the-art natural language processing to understand context, generate human-like text, create images, and more. The application is built with a modern tech stack, including Next.js, React, and Tailwind CSS, ensuring a fast, responsive, and scalable platform.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mt-8">
            <Card>
              <CardHeader>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-primary" />
                    <CardTitle>Our Team</CardTitle>
                  </div>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Shivlox AI is developed and maintained by a passionate individual dedicated to exploring the potential of artificial intelligence. As a solo developer, I'm committed to continuously improving the platform and delivering a high-quality experience for all users. Your feedback and support are invaluable to this project's growth. Consider reaching out via our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link> or <Link href="/donate" className="text-primary hover:underline">donating</Link> to help the project.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
           <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mt-8">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                  <div className="flex items-center gap-4">
                    <Handshake className="h-8 w-8 text-primary" />
                    <CardTitle>Get Involved</CardTitle>
                  </div>
                </CardHeader>
              <CardContent className="flex flex-col items-center text-center gap-4">
                <p className="text-muted-foreground">
                  Have questions, ideas, or want to collaborate? We'd love to hear from you.
                </p>
                <Link href="/contact">
                    <Button size="lg">Get in Touch</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
