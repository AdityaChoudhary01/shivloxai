import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

// 1. Primary UI Font (Clean, Modern, Legible)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// 2. Code Font (Professional, Ligatures support)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// 3. Viewport Settings
export const viewport: Viewport = {
  themeColor: '#09090b', // Modern rich black
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

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
            url: '/og-image.png',
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
    images: ['/twitter-image.png'],
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
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://shivloxai.netlify.app',
  },
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
        {/* JSON-LD for SEO */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Applied font variables and base styles */}
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-primary/20",
          inter.variable,
          jetbrainsMono.variable
        )}
      >
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
