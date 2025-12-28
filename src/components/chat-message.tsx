'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Copy, Sparkles, User } from 'lucide-react';
import Markdown from 'react-markdown';
import Image from 'next/image';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// --- Typewriter Helper Component ---
// This component handles the character-by-character typing animation
function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Safety check: if text is empty, do nothing
    if (!text) return;

    // Reset if the text prop changes completely (e.g. switching chats)
    if (index === 0 && displayedText !== '') {
        setDisplayedText('');
    }

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 10); // Adjust typing speed here (lower number = faster)
      
      return () => clearTimeout(timeout);
    } else {
      // Animation finished
      if (onComplete) onComplete();
    }
  }, [index, text, displayedText, onComplete]);

  return <Markdown>{displayedText}</Markdown>;
}

export type ChatMessageProps = {
  message: {
    role: 'user' | 'model';
    content: string;
  };
  isLoading?: boolean;
  isLatest?: boolean; // New prop to trigger typing animation
};

export function ChatMessage({ message, isLoading = false, isLatest = false }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const isUser = message.role === 'user';
  const isImage = message.content.startsWith('data:image') || message.content.startsWith('http');
  
  // Use your existing Cloudinary image or a fallback
  const aiAvatarUrl = "https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png";

  const onCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full items-start gap-4 py-4"
      >
        <Avatar className="h-8 w-8 shrink-0 border border-white/10">
            <AvatarImage src={aiAvatarUrl} className="object-cover" />
            <AvatarFallback><Sparkles className="h-4 w-4" /></AvatarFallback>
        </Avatar>
        <div className="space-y-2">
            <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></span>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex w-full gap-4 py-6 md:px-4 group/message', 
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar Section */}
      <Avatar className={cn(
          "h-8 w-8 shrink-0 border",
          isUser ? "border-zinc-700 bg-zinc-800" : "border-indigo-500/20"
      )}>
        {isUser ? (
            <AvatarFallback className="bg-zinc-800 text-zinc-400"><User className="h-4 w-4" /></AvatarFallback>
        ) : (
            <>
                <AvatarImage src={aiAvatarUrl} className="object-cover" />
                <AvatarFallback className="bg-indigo-950 text-indigo-400"><Sparkles className="h-4 w-4" /></AvatarFallback>
            </>
        )}
      </Avatar>

      {/* Content Section */}
      <div className={cn(
          "relative flex max-w-[85%] flex-col gap-1", 
          isUser ? "items-end" : "items-start"
      )}>
        {/* Name Label */}
        <span className="text-xs font-medium text-muted-foreground/60 ml-1">
            {isUser ? 'You' : 'Shivlox AI'}
        </span>

        {/* Message Bubble / Canvas */}
        <div className={cn(
            'relative overflow-hidden text-sm leading-7',
            isUser 
                ? 'rounded-2xl rounded-tr-sm bg-zinc-800 px-5 py-3 text-zinc-100 shadow-md' // User: Bubble
                : 'w-full px-1 py-0 text-zinc-300' // AI: Clean Text (Transparent)
        )}>
           
          {isImage ? (
            <Image
              src={message.content}
              alt="Generated image"
              width={512}
              height={512}
              className="rounded-lg border border-white/10"
            />
          ) : (
            <article className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 max-w-none">
              {/* Only use Typewriter if it's the AI, it's the latest message, and not done typing yet */}
              {!isUser && isLatest && !isTypingDone ? (
                  <Typewriter 
                    text={message.content} 
                    onComplete={() => setIsTypingDone(true)} 
                  />
              ) : (
                  <Markdown>{message.content}</Markdown>
              )}
            </article>
          )}
        </div>

        {/* Action Buttons (Copy) - Only for AI & Text */}
        {!isUser && !isImage && (
            <div className="mt-1 flex items-center gap-2 opacity-0 transition-opacity group-hover/message:opacity-100">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCopy}
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                >
                    {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
            </div>
        )}
      </div>
    </motion.div>
  );
}
