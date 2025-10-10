
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Shivlox AI',
    description: 'Review the Terms of Service for using the Shivlox AI application. Understand your rights and responsibilities when interacting with our platform.',
};

export default function TermsOfServicePage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By using our application, Shivlox AI ('Application'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, do not use the Application."
    },
    {
      title: "2. Changes to Terms or Services",
      content: "We may modify the Terms at any time. If we do, we'll let you know by posting the modified Terms on the site or through other communications. Your continued use of the Application after we post modified Terms means you agree to be bound by them."
    },
    {
      title: "3. User Accounts",
      content: "You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. We are not responsible for any loss or damage that may be incurred as a result of unauthorized access."
    },
    {
      title: "4. User Conduct",
      content: "You agree not to post infringing, fraudulent, defamatory, or harmful content. You also agree not to attempt to probe, scan, or test the vulnerability of any Shivlox AI system or breach any security measures."
    },
    {
      title: "5. Termination",
      content: "We may terminate your access to and use of the Application, at our sole discretion, at any time and without notice. You may cancel your account by contacting us."
    },
    {
      title: "6. Limitation of Liability",
      content: "Shivlox AI will not be liable for any incidental, special, exemplary, or consequential damages, including lost profits or loss of data, arising out of or in connection with these terms or the use of the Application."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/50 px-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center">
            <Link href="/">
               <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shivlox AI
              </div>
            </Link>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href="/" passHref><DropdownMenuItem>Home</DropdownMenuItem></Link>
                <Link href="/about" passHref><DropdownMenuItem>About</DropdownMenuItem></Link>
                <Link href="/contact" passHref><DropdownMenuItem>Contact</DropdownMenuItem></Link>
                <Link href="/donate" passHref><DropdownMenuItem>Donate</DropdownMenuItem></Link>
                <Link href="/privacy" passHref><DropdownMenuItem>Privacy Policy</DropdownMenuItem></Link>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 px-4">
        <div className="container mx-auto max-w-4xl py-12 md:py-20">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Terms of Service</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Please read our terms carefully before using Shivlox AI.
              <br/><strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="mt-16 space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{section.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
             <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      If you have any questions about these Terms, please contact us through our <Link href="/contact" className="font-semibold text-primary hover:underline">contact page</Link>. You should also review our <Link href="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
