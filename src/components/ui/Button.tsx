'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      asChild = false,
      className = '',
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Default to button if not asChild
    const Component = asChild ? 'span' : 'button';

    const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const sizeVariants = {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
      lg: 'h-11 px-6',
      icon: 'h-10 w-10',
    };

    const variantVariants: Record<string, string> = {
      primary: `bg-primary text-primary-foreground hover:bg-primary/90`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`,
      destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90`,
      outline: `border border-input hover:bg-accent hover:text-accent-foreground`,
      ghost: `hover:bg-accent hover:text-accent-foreground`,
    };

    return (
      <Component
        ref={ref}
        className={`${base} ${sizeVariants[size]} ${variantVariants[variant]} ${className}`}
        {...props}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        ) : null}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button };
