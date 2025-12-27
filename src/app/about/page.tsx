import type { Metadata } from 'next';
import { AboutPageContent } from './about-page-content';

export const metadata: Metadata = {
  title: 'About Shivlox AI | Mission & Technology',
  description: 'Learn about the mission, vision, and technology behind Shivlox AI. Built by developers, for developers using Gemini 1.5 Flash.',
  openGraph: {
    title: 'About Shivlox AI',
    description: 'Empowering conversations with next-gen AI.',
    url: 'https://shivloxai.netlify.app/about',
    type: 'website',
  },
  alternates: {
    canonical: 'https://shivloxai.netlify.app/about',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
