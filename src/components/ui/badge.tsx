'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'xl' | '2xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = '#FFFFFF',
  size = 'md',
  rounded = 'xl',
}) => {
  const roundedClasses: Record<NonNullable<BadgeProps['rounded']>, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'px-2 py-0.5 text-sm',
    md: 'px-3 py-1 text-md',
    xl: 'px-4 py-1.5 text-xl',
    '2xl': 'px-5 py-2 text-2xl',
  };

  return (
    <span
      className={cn(
        `inline-block h-auto w-auto ${roundedClasses[rounded]} ${sizeClasses[size]}`
      )}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
};

export default Badge;
