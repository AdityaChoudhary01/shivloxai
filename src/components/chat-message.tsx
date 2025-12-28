'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Typewriter } from '@/components/ui/typewriter';
import { useState } from 'react';
import { Button } from './ui/button';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
  isLatest?: boolean; // We only type the LATEST message
}

export function ChatMessage({ role, content, isLatest }: ChatMessageProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group flex w-full gap-4 p-4 md:px-8',
        isUser ? 'flex-row-reverse bg-transparent' : 'bg-transparent'
      )}
    >
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8 border", isUser ? "border-zinc-700" : "border-indigo-500/30")}>
        {isUser ? (
          <>
             {/* Replace with user image if available */}
            <AvatarImage src="/user-placeholder.png" />
            <AvatarFallback className="bg-zinc-800 text-zinc-200"><User className="h-4 w-4" /></AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-indigo-950/50 text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {/* Name Label */}
        <span className="text-xs font-medium text-zinc-500">
          {isUser ? 'You' : 'Shivlox AI'}
        </span>

        {/* Bubble / Text Area */}
        <div
          className={cn(
            'relative overflow-hidden text-sm leading-7 shadow-sm',
            isUser
              ? 'rounded-2xl rounded-tr-sm bg-zinc-800 px-5 py-3 text-zinc-100' // User Bubble
              : 'w-full rounded-lg px-0 py-0 text-zinc-300' // AI: No bubble, just clean text
          )}
        >
          {role === 'model' && isLatest ? (
            // Typewriter effect only for the NEWEST AI message
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 max-w-none">
                <Typewriter text={content} speed={5} />
            </div>
          ) : (
             // Static text for history or user messages
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action Buttons (Copy, etc.) - Only for AI */}
        {!isUser && (
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
