import type { Metadata } from 'next';
import { AboutPageContent } from './about-page-content';

export const metadata: Metadata = {
  title: 'About Shivlox AI',
  description: 'Learn about the mission, vision, and technology behind Shivlox AI, a modern and intelligent chat application.',
  // Add the canonical link using the alternates property
  alternates: {
    canonical: 'https://shivloxai.netlify.app/about',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
