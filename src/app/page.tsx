// src/app/page.tsx
import type { Metadata } from 'next';
// Import the Client Component which handles all interactivity and prompt button rendering
import { HomePageClient } from './home-page-content'; 
import { generateInitialPrompts } from '@/ai/flows/generate-initial-prompt';
import { ShivloxIcon } from '@/components/shivlox-icon';
import { motion } from 'framer-motion';

// 1. Define static Metadata for SEO (Runs at build time)
export const metadata: Metadata = {
  title: 'Shivlox AI - Your Intelligent Chat Assistant',
  description: 'Engage in intelligent conversations, generate images with AI, transcribe audio, and get instant answers with Shivlox AI, a modern and powerful chat application powered by Google\'s Gemini models.',
  alternates: {
      canonical: 'https://shivloxai.netlify.app',
  },
};

// 2. Main Server Component (Runs on the server)
export default async function Home() {
  // Data Fetching: Fetch the initial prompts data on the server.
  const allPrompts = await generateInitialPrompts();

  return (
    <div className="flex h-dvh bg-transparent text-foreground">
        {/* Pass the fetched data to the Client Component */}
        <HomePageClient initialPrompts={allPrompts}>
            {/* This content passed as 'children' is guaranteed to be Server-Side Rendered (SSR)
              in the initial HTML payload, which is essential for SEO.
              The motion components here use only static 'initial' and 'animate' props, 
              which are safe for server-to-client serialization.
            */}
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
                {/* NOTE: The interactive prompt buttons are now rendered inside HomePageClient (the client component), 
                   using the 'initialPrompts' prop, which prevents the serialization error. */}
            </div>
        </HomePageClient>
    </div>
  );
}
