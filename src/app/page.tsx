
import type { Metadata } from 'next';
import { HomePageContent } from './home-page-content';

export const metadata: Metadata = {
  title: 'Shivlox AI - Your Intelligent Chat Assistant',
  description: 'Engage in intelligent conversations, generate images with AI, transcribe audio, and get instant answers with Shivlox AI, a modern and powerful chat application powered by Google\'s Gemini models.',
  alternates: {
      canonical: 'https://shivloxai.netlify.app',
  },
};

export default function Home() {
  return <HomePageContent />;
}
