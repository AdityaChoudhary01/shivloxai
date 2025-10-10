'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-transparent pt-4">
      <div className="container mx-auto flex items-center justify-between py-4 md:flex-row flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Shivlox AI</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          <Link href="/donate" className="transition-colors hover:text-foreground">
            Donate
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Shivlox AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
