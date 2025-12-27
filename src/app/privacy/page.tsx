import type { Metadata } from 'next';
import { PrivacyPageContent } from './privacy-page-content';

export const metadata: Metadata = {
    title: 'Privacy Policy | Shivlox AI',
    description: 'Read the Privacy Policy for Shivlox AI to understand how we collect, use, and protect your personal information and data.',
    openGraph: {
        title: 'Privacy Policy - Shivlox AI',
        description: 'Your data privacy is our priority. Learn more here.',
        url: 'https://shivloxai.netlify.app/privacy',
        type: 'website',
    },
    alternates: {
        canonical: 'https://shivloxai.netlify.app/privacy',
    },
};

export default function PrivacyPolicyPage() {
    return <PrivacyPageContent />;
}
