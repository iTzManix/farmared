'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = 'Selecciona...', onChange, className = '', value, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-11 px-4 pr-10 rounded-xl text-sm appearance-none transition-all ${className}`}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: 'none',
              color: 'var(--foreground)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: error ? '0 0 0 1px rgba(251,113,133,0.5)' : 'none',
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.boxShadow = '0 0 0 1px rgba(34,211,238,0.3), 0 0 0 3px rgba(34,211,238,0.04)';
              }
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = error ? '0 0 0 1px rgba(251,113,133,0.5)' : 'none';
            }}
            {...props}
          >
            <option value="" disabled style={{ background: '#070E1C' }}>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#070E1C' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--foreground-subtle)' }}
          />
        </div>
        {error && (
          <p className="text-xs" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
