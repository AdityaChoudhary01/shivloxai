import Image from 'next/image';
import { cn } from '@/lib/utils';

type ShivloxIconProps = React.HTMLAttributes<HTMLDivElement>;

const logoUrl = 'https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png';

export function ShivloxIcon({ className, ...props }: ShivloxIconProps) {
  return (
    <div className={cn(
        "relative h-10 w-10 overflow-hidden rounded-full",
        className
    )} {...props}>
      <Image
        src={logoUrl}
        alt="Shivlox AI Logo"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
