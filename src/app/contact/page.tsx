import type { Metadata } from 'next';
import { ContactPageContent } from './contact-page-content';

export const metadata: Metadata = {
  title: 'Contact Shivlox AI | Support & Developer Inquiries',
  description: 'Get in touch with the Shivlox AI team. Support for Gemini 1.5 Flash integration, API inquiries, and general feedback.',
  keywords: ['Contact Shivlox', 'AI Support', 'Aditya Choudhary', 'MERN Stack Developer', 'Greater Noida AI Company'],
  alternates: {
    canonical: 'https://shivloxai.netlify.app/contact',
  },
  openGraph: {
    title: 'Contact Shivlox AI',
    description: 'We are here to help. Reach out for support or collaboration.',
    url: 'https://shivloxai.netlify.app/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
