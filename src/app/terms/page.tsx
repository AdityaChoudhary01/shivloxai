import type { Metadata } from 'next';
import { TermsPageContent } from './terms-page-content';

export const metadata: Metadata = {
    title: 'Terms of Service - Shivlox AI',
    description: 'Review the Terms of Service for using the Shivlox AI application. Understand your rights and responsibilities when interacting with our platform.',
    // Add the canonical link using the alternates property
    alternates: {
        canonical: 'https://shivloxai.netlify.app/terms',
    },
};

export default function TermsOfServicePage() {
    return <TermsPageContent />;
}
