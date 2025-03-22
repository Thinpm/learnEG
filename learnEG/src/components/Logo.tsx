
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn("font-mono font-bold flex items-center", sizeClasses[size], className)}>
      <span className="mr-1.5 text-primary">Login</span>
      <span className="text-primary bg-clip-text">Lounge</span>
    </div>
  );
};

export default Logo;
