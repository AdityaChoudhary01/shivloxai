'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Copy, User, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Types ---
export type ChatMessageProps = {
  message: {
    role: 'user' | 'model';
    content: string;
  };
  isLoading?: boolean;
  isLatest?: boolean; 
  userAvatar?: string | null;
};

// --- Configuration ---
const TYPING_SPEED = 5; 

// --- Sub-components ---

const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-1">
    <Sparkles className="h-4 w-4 text-primary animate-pulse mr-1" />
    <div className="flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-primary/70"
          animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot * 0.15,
          }}
        />
      ))}
    </div>
  </div>
);

const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(children);
    setIsCopied(true);
    toast({ description: "Code copied to clipboard" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-border/50 bg-zinc-950/80 shadow-md">
      <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm px-4 py-2 border-b border-white/5">
        <span className="text-xs text-zinc-400 font-mono font-medium">{language || 'plaintext'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
          onClick={onCopy}
        >
          {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.875rem', lineHeight: '1.6', background: 'transparent' }}
            wrapLongLines={true}
        >
            {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// --- Main Component ---
export function ChatMessage({ message, isLoading = false, isLatest = false, userAvatar }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  
  const isUser = message.role === 'user';
  const isImage = message.content.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.content);
  
  const aiAvatarUrl = "https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png";

  // --- Typing Effect Logic ---
  useEffect(() => {
    // If it's the user, an image, loading, or NOT the latest message -> show full text immediately
    if (isUser || isImage || isLoading || !isLatest) {
      setDisplayedContent(message.content);
      return;
    }

    // Reset if content changed (e.g. new streaming token arrived)
    if (!message.content.startsWith(displayedContent) && displayedContent !== '') {
        setDisplayedContent('');
    }

    // If finished typing, stop
    if (displayedContent.length === message.content.length) return;

    // Type writer speed
    const timeoutId = setTimeout(() => {
      setDisplayedContent((prev) => message.content.slice(0, prev.length + 3)); 
    }, TYPING_SPEED);

    return () => clearTimeout(timeoutId);
  }, [message.content, displayedContent, isUser, isImage, isLoading, isLatest]);

  const onCopyMessage = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast({ description: "Message copied" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'flex w-full items-start gap-4 py-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "h-9 w-9 border ring-2 ring-offset-2 ring-offset-background transition-shadow",
        isUser ? "ring-primary/20 bg-muted" : "ring-purple-500/20 bg-primary/5"
      )}>
        {!isUser ? (
          <AvatarImage src={aiAvatarUrl} alt="AI" className="object-cover" />
        ) : (
          <>
            {userAvatar && <AvatarImage src={userAvatar} alt="User" className="object-cover" />}
            <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "group/bubble relative max-w-[85%] lg:max-w-[75%] rounded-2xl px-5 py-4 text-sm shadow-sm transition-all",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-sm" 
          : "bg-card border border-border/50 rounded-tl-sm shadow-md"
      )}>
        
        {isLoading ? (
          <TypingIndicator />
        ) : isImage ? (
          <div className="relative mt-1 aspect-square max-w-[340px] overflow-hidden rounded-xl border bg-muted shadow-inner">
            <Image
              src={message.content}
              alt="Generated content"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 340px"
            />
          </div>
        ) : (
          <div className={cn(
            "prose prose-sm max-w-none break-words leading-7 tracking-wide",
            "font-sans", 
            "dark:prose-invert",
            isUser 
                ? "prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-li:text-primary-foreground text-primary-foreground" 
                // UPDATED: Added prose-headings:text-foreground to force visibility
                : "text-foreground prose-headings:text-foreground prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-p:text-muted-foreground prose-strong:text-foreground"
          )}>
            <Markdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock language={match[1]}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code 
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-xs font-medium", 
                        isUser 
                            ? "bg-white/20 text-inherit" 
                            : "bg-primary/10 text-primary border border-primary/20"
                      )} 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                   <a 
                     {...props} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="font-medium underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors" 
                   />
                ),
                blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground" {...props} />
                )
              }}
            >
              {isUser || !isLatest ? message.content : displayedContent}
            </Markdown>
          </div>
        )}

        {/* Copy Button */}
        {!isLoading && !isImage && (
            <div className={cn(
                "absolute -bottom-5 opacity-0 transition-opacity duration-300 group-hover/bubble:opacity-100",
                isUser ? "right-0" : "left-0"
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCopyMessage}
                    className="h-6 w-6 text-muted-foreground/60 hover:text-foreground"
                >
                {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
            </div>
        )}
      </div>
    </motion.div>
  );
}
