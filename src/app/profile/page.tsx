
import type { Metadata } from 'next';
import { ProfilePageContent } from './profile-page-content';

export const metadata: Metadata = {
    title: 'Your Profile - Shivlox AI',
    description: 'Manage your Shivlox AI user profile. Update your name, profile picture, and view your account details.',
    robots: {
        index: false,
        follow: false,
    }
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
