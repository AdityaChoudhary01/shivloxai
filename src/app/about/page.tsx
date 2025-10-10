
import type { Metadata } from 'next';
import { AboutPageContent } from './about-page-content';

export const metadata: Metadata = {
  title: 'About Shivlox AI',
  description: 'Learn about the mission, vision, and technology behind Shivlox AI, a modern and intelligent chat application.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
