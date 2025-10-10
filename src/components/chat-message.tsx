'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import Image from 'next/image';

export type ChatMessageProps = {
  message: {
    role: 'user' | 'model';
    content: string;
  };
  isLoading?: boolean;
};

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const aiAvatarUrl = "https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png";

  if (isLoading) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-start gap-3"
      >
        <Avatar className="h-8 w-8 border-2 border-primary/50">
            <AvatarImage src={aiAvatarUrl} alt="Shivlox AI" />
            <AvatarFallback>SA</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center rounded-lg bg-secondary p-3 text-sm shadow-md">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  const isUser = message.role === 'user';
  const isImage = message.content.startsWith('data:image');

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
         <Avatar className="h-8 w-8 border-2 border-primary/50">
            <AvatarImage src={aiAvatarUrl} alt="Shivlox AI" />
            <AvatarFallback>SA</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[90%] rounded-xl p-0.5 text-sm sm:max-w-[80%]',
           isUser 
            ? 'bg-gradient-to-br from-secondary to-muted' 
            : 'bg-gradient-to-br from-primary/30 to-accent/30',
        )}
      >
        <div className={cn(
            'rounded-[10px] w-full h-full',
            isUser ? 'bg-secondary' : 'bg-background',
            isImage ? 'p-0 overflow-hidden' : 'p-3'
        )}>
          {isImage ? (
            <Image
              src={message.content}
              alt="Generated image"
              width={512}
              height={512}
              className="rounded-lg"
            />
          ) : (
            <article className="prose prose-invert max-w-none">
              <Markdown>{message.content}</Markdown>
            </article>
          )}
        </div>
      </div>
    </motion.div>
  );
}
