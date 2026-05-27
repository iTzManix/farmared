'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-sky-600 shadow-sm',
        secondary:
          'bg-slate-100 text-slate-700 hover:bg-slate-200',
        outline:
          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
        ghost:
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        danger:
          'bg-danger text-white hover:bg-red-600 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Keep backward compat: map old "primary"→"default", "destructive"→"danger"
type LegacyVariant = 'primary' | 'destructive';
const variantAliases: Record<LegacyVariant, 'default' | 'danger'> = {
  primary: 'default',
  destructive: 'danger',
};

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      asChild = false,
      className,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? 'span' : 'button';

    // Resolve aliases for backward compat
    const resolvedVariant =
      variant in variantAliases
        ? variantAliases[variant as LegacyVariant]
        : (variant as Exclude<typeof variant, LegacyVariant>);

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant: resolvedVariant, size }), className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : null}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
