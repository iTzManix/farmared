'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className = '',
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5',
      md: 'px-4.5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-sm gap-2.5',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #22D3EE 0%, #38BDF8 100%)',
        color: '#0B1528',
        boxShadow: '0 0 20px rgba(34,211,238,0.2), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      secondary: {
        background: 'var(--surface-hover)',
        color: 'var(--foreground)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
      },
      danger: {
        background: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)',
        color: '#fff',
        boxShadow: '0 0 16px rgba(251,113,133,0.2), 0 2px 8px rgba(0,0,0,0.3)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--foreground-muted)',
      },
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${className}`}
        style={{ ...variantStyles[variant], ...style }}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (variant === 'primary') el.style.opacity = '0.92';
          if (variant === 'secondary') el.style.background = 'var(--surface-active)';
          if (variant === 'ghost') el.style.background = 'var(--surface-hover)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (variant === 'primary') el.style.opacity = '1';
          if (variant === 'secondary') el.style.background = 'var(--surface-hover)';
          if (variant === 'ghost') el.style.background = 'transparent';
        }}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
