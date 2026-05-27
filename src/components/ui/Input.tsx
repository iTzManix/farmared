'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-11 px-4 rounded-xl text-sm transition-all ${className}`}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: 'none',
            color: 'var(--foreground)',
            outline: 'none',
            boxShadow: error ? '0 0 0 1px rgba(251,113,133,0.5)' : 'none',
          }}
          onFocus={(e) => {
            const el = e.target as HTMLInputElement;
            if (error) {
              el.style.boxShadow = '0 0 0 1px rgba(251,113,133,0.8), 0 0 0 3px rgba(251,113,133,0.06)';
            } else {
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.boxShadow = '0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(34,211,238,0.04)';
            }
          }}
          onBlur={(e) => {
            const el = e.target as HTMLInputElement;
            el.style.background = 'rgba(255,255,255,0.03)';
            el.style.boxShadow = error ? '0 0 0 1px rgba(251,113,133,0.5)' : 'none';
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
