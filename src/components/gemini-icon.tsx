import Image from 'next/image';
import { cn } from '@/lib/utils';

type ShivloxIconProps = React.HTMLAttributes<HTMLDivElement>;

export function GeminiIcon({ className, ...props }: ShivloxIconProps) {
  return (
    <div className={cn("relative h-10 w-10", className)} {...props}>
      <Image
        src="https://res.cloudinary.com/dmtnonxtt/image/upload/v1752516480/shivlox-logo-notext_d1dga1.png"
        alt="Shivlox AI Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
