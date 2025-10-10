import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: {
    default: 'Shivlox AI - Your Intelligent Chat Assistant',
    template: '%s | Shivlox AI',
  },
  description: 'Engage in intelligent conversations, generate images, and get instant answers with Shivlox AI, a modern chat application powered by Google\'s Gemini models.',
  keywords: ['AI Chat', 'Intelligent Assistant', 'Gemini AI', 'Next.js', 'Shivlox AI', 'Chatbot', 'Image Generation', 'AI assistant', 'Conversational AI'],
  authors: [{ name: 'Aditya Choudhary', url: 'https://shivloxai.netlify.app' }],
  creator: 'Aditya Choudhary',
  publisher: 'Shivlox AI',
  metadataBase: new URL('https://shivloxai.netlify.app'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'Shivlox AI - Your Intelligent Chat Assistant',
    description: 'Engage in intelligent conversations, generate images, and get instant answers with Shivlox AI.',
    url: 'https://shivloxai.netlify.app',
    siteName: 'Shivlox AI',
    images: [
        {
            url: '/og-image.png', // Must be an absolute URL
            width: 1200,
            height: 630,
            alt: 'Shivlox AI in action',
        },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivlox AI - Your Intelligent Chat Assistant',
    description: 'Engage in intelligent conversations, generate images, and get instant answers with Shivlox AI.',
    creator: '@adityacodes',
    images: ['/twitter-image.png'], // Must be an absolute URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://shivloxai.netlify.app',
  },
  // Added Google Site Verification here
  verification: {
    google: 'ftdUSQ0-7RzVhdMCxpKJOqlfjqOVyCy_ee4WIEwSjG0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Shivlox AI',
    'url': 'https://shivloxai.netlify.app',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.shivlox.ai/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#09011E" />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen dark">
        <AuthProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
