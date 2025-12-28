'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Copy, Sparkles, User } from 'lucide-react';
import Markdown from 'react-markdown';
import Image from 'next/image';
import { Button } from './ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Typewriter } from '@/components/ui/typewriter';

export type ChatMessageProps = {
  // Make message optional so we can render <ChatMessage isLoading /> safely
  message?: {
    role: 'user' | 'model';
    content: string;
  };
  isLoading?: boolean;
  isLatest?: boolean;
};

export function ChatMessage({ message, isLoading = false, isLatest = false }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);

  // --- CRITICAL FIX: Handle Loading State FIRST ---
  // We return early here so we never access 'message.role' if message is undefined.
  if (isLoading) {
    const aiAvatarUrl = "https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png";
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full items-start gap-4 py-6"
      >
        <Avatar className="h-8 w-8 shrink-0 border border-primary/20">
            <AvatarImage src={aiAvatarUrl} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1 pt-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"></span>
        </div>
      </motion.div>
    );
  }

  // --- Safe to access message now ---
  if (!message) return null; // Fallback just in case

  const isUser = message.role === 'user';
  const isImage = message.content.startsWith('data:image') || message.content.startsWith('http');
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

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex w-full gap-4 py-6 group/message', 
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className={cn(
          "h-8 w-8 shrink-0 border",
          isUser ? "border-zinc-700 bg-secondary" : "border-primary/20 bg-primary/5"
      )}>
        {isUser ? (
            <AvatarFallback className="text-muted-foreground"><User className="h-4 w-4" /></AvatarFallback>
        ) : (
            <>
                <AvatarImage src={aiAvatarUrl} className="object-cover" />
                <AvatarFallback className="text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback>
            </>
        )}
      </Avatar>

      <div className={cn(
          "relative flex max-w-[85%] flex-col gap-1", 
          isUser ? "items-end" : "items-start"
      )}>
        <span className="text-xs font-medium text-muted-foreground/50 ml-1">
            {isUser ? 'You' : 'Shivlox AI'}
        </span>

        <div className={cn(
            'relative overflow-hidden text-sm leading-7',
            isUser 
                ? 'rounded-2xl rounded-tr-sm bg-secondary px-5 py-3 text-secondary-foreground shadow-sm' 
                : 'w-full px-1 py-0 text-foreground'
        )}>
           
          {isImage ? (
            <Image
              src={message.content}
              alt="Generated image"
              width={512}
              height={512}
              className="rounded-lg border border-border"
            />
          ) : (
            <article className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border max-w-none">
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

        {!isUser && !isImage && (
            <div className="mt-1 flex items-center gap-2 opacity-0 transition-opacity group-hover/message:opacity-100">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCopy}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                    {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
            </div>
        )}
      </div>
    </motion.div>
  );
}
