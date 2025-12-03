// src/app/page.tsx
import type { Metadata } from 'next';
import { HomePageClient } from './home-page-content';
import { generateInitialPrompts } from '@/ai/flows/generate-initial-prompt';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Shivlox AI - Your Intelligent Chat Assistant',
  description: 'Engage in intelligent conversations, generate images with AI, transcribe audio, and get instant answers with Shivlox AI, a modern and powerful chat application powered by Google\'s Gemini models.',
  alternates: {
      canonical: 'https://shivloxai.netlify.app',
  },
};

// Define the server component that orchestrates the page.
export default async function Home() {
  // 1. Fetch initial prompts on the server (this is the key change for SEO)
  const allPrompts = await generateInitialPrompts();
  const initialPrompts = allPrompts.slice(0, 4);

  // Animation variants moved here from the client component for server rendering compatibility
  const promptVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  // 2. Render static, SEO-rich content on the server
  return (
    // The main chat area uses flex-1 flex-col to fill the screen
    <div className="flex h-dvh bg-transparent text-foreground">
        {/* Pass fetched data and render all the static, SEO-rich content as children */}
        <HomePageClient initialPrompts={allPrompts}>
            <div className="flex flex-1 flex-col items-center justify-start pt-16 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                    className="mb-4"
                >
                    <ShivloxIcon className="h-20 w-20" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl font-bold text-foreground tracking-tight"
                >
                    Your Intelligent **Shivlox AI** Chat Assistant ✨
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-4 text-lg text-muted-foreground"
                >
                    Ask anything to begin your first conversation.
                </motion.p>
                
                {/* Initial Prompts rendered here (Server-side rendered for SEO/fastest load) */}
                <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {initialPrompts.map((prompt, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={promptVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* The data-prompt attribute is crucial for the client component to read the clicked prompt */}
                            <Button
                                type="button"
                                variant="outline"
                                className="h-auto w-full whitespace-normal rounded-lg border-dashed p-4 text-left text-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
                                data-prompt={prompt}
                            >
                                {prompt}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </HomePageClient>
    </div>
  );
}
