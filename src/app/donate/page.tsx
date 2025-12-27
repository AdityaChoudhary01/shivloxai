import type { Metadata } from 'next';
import { DonatePageContent } from './donate-page-content';

export const metadata: Metadata = {
  title: 'Support Shivlox AI | Donate to Keep Us Free',
  description: 'Help Aditya Choudhary keep Shivlox AI running. Your donations cover server costs, API fees, and development time.',
  keywords: ['Donate', 'Support Open Source', 'Aditya Choudhary', 'Shivlox AI', 'Buy Me a Coffee'],
  alternates: {
    canonical: 'https://shivloxai.netlify.app/donate',
  },
  openGraph: {
    title: 'Support Shivlox AI',
    description: 'Powering the future of free AI. Help us keep the lights on.',
    url: 'https://shivloxai.netlify.app/donate',
    type: 'website',
  },
};

export default function DonatePage() {
  return <DonatePageContent />;
}
