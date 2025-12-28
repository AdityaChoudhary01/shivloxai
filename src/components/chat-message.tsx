'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Copy, User } from 'lucide-react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  // This prop is crucial to stop old messages from re-animating
  isLatest?: boolean; 
};

// --- Configuration ---
const TYPING_SPEED = 2; 

// --- Sub-components ---

const TypingIndicator = () => (
  <div className="flex space-x-1 p-2">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="h-1.5 w-1.5 rounded-full bg-primary/60"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: dot * 0.15,
        }}
      />
    ))}
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
    <div className="relative my-4 overflow-hidden rounded-lg border border-border bg-zinc-950">
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-1.5">
        <span className="text-xs text-zinc-400 lowercase font-mono">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={onCopy}
        >
          {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem', background: 'transparent' }}
            wrapLongLines={true}
        >
            {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// --- Main Component ---
export function ChatMessage({ message, isLoading = false, isLatest = false }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  
  const isUser = message.role === 'user';
  const isImage = message.content.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(message.content);
  
  const aiAvatarUrl = "https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png";

  // --- Typing Effect Logic ---
  useEffect(() => {
    // STOP RE-TYPING: If it's not the latest message, show full content immediately
    if (isUser || isImage || isLoading || !isLatest) {
      setDisplayedContent(message.content);
      return;
    }

    // Reset logic for strictly new, streaming messages
    if (!message.content.startsWith(displayedContent) && displayedContent !== '') {
        setDisplayedContent('');
    }

    if (displayedContent.length === message.content.length) return;

    const timeoutId = setTimeout(() => {
      setDisplayedContent((prev) => message.content.slice(0, prev.length + 2)); 
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
      // STOP ANIMATION ON REFRESH: Only animate if it is the latest message
      initial={isLatest ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full items-start gap-3 py-2',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* AI Avatar (Left Side) */}
      {!isUser && (
        <Avatar className="h-8 w-8 border shadow-sm bg-primary/5">
            <AvatarImage src={aiAvatarUrl} alt="Shivlox AI" className="object-cover" />
            <AvatarFallback>SA</AvatarFallback>
        </Avatar>
      )}

      {/* User Avatar (Right Side) - ADDED THIS BLOCK */}
      {isUser && (
        <Avatar className="h-8 w-8 border shadow-sm bg-muted">
            <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
            </AvatarFallback>
        </Avatar>
      )}

      {/* Message Bubble */}
      <div className={cn(
        "group/bubble relative max-w-[85%] lg:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-sm" 
          : "bg-background border border-border/60 rounded-tl-sm shadow-sm"
      )}>
        
        {isLoading ? (
          <TypingIndicator />
        ) : isImage ? (
          <div className="relative mt-1 aspect-square max-w-[300px] overflow-hidden rounded-lg border bg-muted">
            <Image
              src={message.content}
              alt="Generated content"
              width={512}
              height={512}
              className="object-cover"
            />
          </div>
        ) : (
          <div className={cn(
            "prose prose-sm max-w-none break-words leading-relaxed",
            "dark:prose-invert",
            isUser ? "prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-li:text-primary-foreground text-primary-foreground" : "text-foreground"
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
                        "rounded px-1.5 py-0.5 font-mono text-xs font-semibold", 
                        isUser ? "bg-white/20 text-inherit" : "bg-muted text-foreground"
                      )} 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                   <a {...props} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 opacity-90 hover:opacity-100 transition-opacity" />
                ),
              }}
            >
              {/* Use full content if it's the user or history, otherwise use typing state */}
              {isUser || !isLatest ? message.content : displayedContent}
            </Markdown>
          </div>
        )}

        {/* Copy Button */}
        {!isLoading && !isImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCopyMessage}
              className={cn(
                "absolute -bottom-6 h-6 w-6 text-muted-foreground opacity-0 transition-opacity group-hover/bubble:opacity-100",
                isUser ? "right-0" : "left-0"
              )}
            >
              {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
        )}
      </div>
    </motion.div>
  );
}
