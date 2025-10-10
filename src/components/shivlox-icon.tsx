import Image from 'next/image';
import { cn } from '@/lib/utils';

type ShivloxIconProps = React.HTMLAttributes<HTMLDivElement> & {
    logoType?: 'icon' | 'full';
};

const logos = {
    icon: 'https://res.cloudinary.com/dygtsoclj/image/upload/v1760107864/Gemini_Generated_Image_tdm06stdm06stdm0_ymfdnp.png',
    full: 'https://res.cloudinary.com/dygtsoclj/image/upload/v1760107855/Gemini_Generated_Image_9w2ueh9w2ueh9w2u-removebg-preview_ujovsa.png'
};

export function ShivloxIcon({ className, logoType = 'icon', ...props }: ShivloxIconProps) {
  const isFullLogo = logoType === 'full';
  return (
    <div className={cn(
        "relative",
        isFullLogo ? "h-8 w-32" : "h-10 w-10",
        className
    )} {...props}>
      <Image
        src={logos[logoType]}
        alt="Shivlox AI Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
