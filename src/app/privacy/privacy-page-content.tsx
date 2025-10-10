
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PrivacyPageContent() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sections = [
    {
      title: "Information We Collect",
      content: "We may collect information about you in a variety of ways. The information we may collect via the Application includes: Personal Data (name, email, profile picture), Derivative Data (IP address, browser type), and User Content (chat messages, prompts)."
    },
    {
      title: "How We Use Your Information",
      content: "Having accurate information permits us to provide a smooth, efficient, and customized experience. We use your information to create and manage your account, email you regarding your account, improve our Application, monitor usage, and prevent fraudulent activity."
    },
    {
      title: "Disclosure of Your Information",
      content: "We may share information in certain situations, such as to comply with legal processes, protect our rights, or with third-party service providers (like data analysis or hosting services) who perform services on our behalf."
    },
    {
      title: "Security of Your Information",
      content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide, no security measures are perfect or impenetrable."
    },
    {
      title: "Policy for Children",
      content: "We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the information provided below."
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
                <Link href="/terms" passHref><DropdownMenuItem>Terms of Service</DropdownMenuItem></Link>
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
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Your privacy is important to us. This policy outlines how we handle your data.
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
                    <CardTitle>Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      If you have questions or comments about this Privacy Policy, please contact us through our <Link href="/contact" className="font-semibold text-primary hover:underline">contact page</Link>. You may also want to review our <Link href="/terms" className="font-semibold text-primary hover:underline">Terms of Service</Link>.
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
