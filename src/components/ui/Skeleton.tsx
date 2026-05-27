'use client';

import { HTMLAttributes, forwardRef } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', className = '', ...props }, ref) => {
    const baseStyles = 'animate-pulse bg-white/10';

    const variants = {
      text: 'h-4 rounded w-full',
      circular: 'rounded-full',
      rectangular: 'rounded-2xl',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
