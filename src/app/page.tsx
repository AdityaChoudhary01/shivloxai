import type { Metadata } from 'next';
import { HomePageContent } from './home-page-content';

// 1. Enhanced Metadata for SEO
export const metadata: Metadata = {
  title: 'Shivlox AI | Free AI Chat, Code Generator & Debugger',
  description: 'Shivlox AI is a fast, intelligent chat assistant powered by Google Gemini 1.5 Flash. Debug MERN stack code, generate React components, transcribe audio, and create images in real-time.',
  keywords: ['AI Chat', 'Gemini 1.5 Flash', 'Code Generator', 'Shivlox AI', 'MERN Stack Debugger', 'Free AI Tool', 'React Native Helper'],
  alternates: {
    canonical: 'https://shivloxai.netlify.app',
  },
  openGraph: {
    title: 'Shivlox AI - Your Intelligent Development Partner',
    description: 'Engage in intelligent conversations, generate images, and debug code instantly.',
    url: 'https://shivloxai.netlify.app',
    siteName: 'Shivlox AI',
    type: 'website',
  },
};

// 2. Structured Data (JSON-LD)
// This tells Google exactly what your app is.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Shivlox AI',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'An advanced AI chat interface powered by Gemini 1.5 Flash for real-time code generation, image creation, and audio processing.',
  url: 'https://shivloxai.netlify.app',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent />
    </>
  );
}
