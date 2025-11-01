// app/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { HomePageContent } from './home-page-content'; // Your Client Component

// --- METADATA ---
export const metadata: Metadata = {
    title: 'Shivlox AI - Your Intelligent Chat Assistant',
    description: 'Engage in intelligent conversations, generate images with AI, transcribe audio, and get instant answers with Shivlox AI, a modern and powerful chat application powered by Google\'s Gemini models.',
    alternates: {
        canonical: 'https://shivloxai.netlify.app',
    },
};

// --- SEO WELCOME BANNER (Server Component) ---
// This content is guaranteed to be in the initial HTML for Google to crawl, 
// resolving the "Thin Content" issue.
const WelcomeBanner = () => (
    <div className="text-center py-12 md:py-24 bg-background/50 backdrop-blur-md border-b border-border">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Shivlox AI: Your Intelligent Chat Assistant
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground px-4">
            **Engage in intelligent conversations, generate images with AI, transcribe audio, and get instant answers with Shivlox AI**.
            We are a modern and powerful chat application, built by Aditya Choudhary, and powered by Google's Gemini models.
            Start chatting now or explore our powerful features like **AI image generation** and **audio transcription**.
        </p>
        <div className="mt-6">
            <Link 
                href="#chat-input" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                Start Chatting
            </Link>
        </div>
    </div>
);

// --- HOME PAGE (Combines Static and Dynamic) ---
export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Static SEO Banner (Server Rendered) */}
            <WelcomeBanner /> 
            
            {/* 2. Client Chat Interface */}
            <HomePageContent /> 
        </div>
    );
}
