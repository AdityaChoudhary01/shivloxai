
import type { Metadata } from 'next';
import { DonatePageContent } from './donate-page-content';

export const metadata: Metadata = {
    title: 'Donate to Shivlox AI',
    description: 'Support the development of Shivlox AI. Your contributions help cover server costs, fund new features, and keep the platform ad-free.',
};

export default function DonatePage() {
    return <DonatePageContent />;
}
