'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Badge: React.FC<BadgeProps> = ({ children, color, rounded }) => {
  const roundedClasses: Record<BadgeProps['rounded'], string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <span
      className={cn(
        `inline-block h-auto w-auto px-3 py-1 ${roundedClasses[rounded]}`
      )}
      style={{ backgroundColor: color ?? '#FFFFFF' }}
    >
      {children}
    </span>
  );
};

export default Badge;
