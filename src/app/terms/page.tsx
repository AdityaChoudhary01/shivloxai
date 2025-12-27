import type { Metadata } from 'next';
import { TermsPageContent } from './terms-page-content';

export const metadata: Metadata = {
    title: 'Terms of Service - Shivlox AI',
    description: 'Review the Terms of Service for using the Shivlox AI application. Understand your rights and responsibilities when interacting with our platform.',
    openGraph: {
        title: 'Terms of Service - Shivlox AI',
        description: 'Understand the rules of engagement for Shivlox AI.',
        url: 'https://shivloxai.netlify.app/terms',
        type: 'website',
    },
    alternates: {
        canonical: 'https://shivloxai.netlify.app/terms',
    },
};

export default function TermsOfServicePage() {
    return <TermsPageContent />;
}
