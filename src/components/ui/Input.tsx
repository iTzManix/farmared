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
            background: 'var(--surface-hover)',
            border: error ? '1px solid rgba(251,113,133,0.5)' : '1px solid var(--border-subtle)',
            color: 'var(--foreground)',
            outline: 'none',
          }}
          onFocus={(e) => {
            const el = e.target as HTMLInputElement;
            if (error) {
              el.style.border = '1px solid rgba(251,113,133,0.8)';
              el.style.boxShadow = '0 0 0 3px rgba(251,113,133,0.08)';
            } else {
              el.style.border = '1px solid var(--border-focus)';
              el.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.06)';
            }
          }}
          onBlur={(e) => {
            const el = e.target as HTMLInputElement;
            el.style.border = error ? '1px solid rgba(251,113,133,0.5)' : '1px solid var(--border-subtle)';
            el.style.boxShadow = 'none';
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
