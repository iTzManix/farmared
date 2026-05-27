'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

const variantClasses = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse bg-slate-100', variantClasses[variant], className)}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
