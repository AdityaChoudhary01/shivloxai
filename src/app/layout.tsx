import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/auth-provider';

// 1. Optimize Fonts with next/font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// 2. Viewport Settings (Theme Color goes here in Next.js 14+)
export const viewport: Viewport = {
  themeColor: '#09011E',
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
      {/* Applied font class and background colors */}
      <body className={`${poppins.className} font-sans antialiased flex flex-col min-h-screen dark bg-background text-foreground selection:bg-primary/20`}>
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
