'use client';

import { HTMLAttributes, forwardRef } from 'react';
import type { Pais, RolUsuario, Moneda } from '@/types/database';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'pais-BO'
  | 'pais-PE'
  | 'pais-CL'
  | 'superadmin'
  | 'admin';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantTokens: Record<BadgeVariant, { bg: string; color: string }> = {
  default:    { bg: 'var(--surface-1)', color: 'var(--foreground-muted)' },
  primary:    { bg: 'var(--primary)/10',   color: 'var(--primary)' },
  secondary:  { bg: 'var(--secondary)/10', color: 'var(--secondary)' },
  success:    { bg: 'var(--success)/10',   color: 'var(--success)' },
  warning:    { bg: 'var(--warning)/10',   color: 'var(--warning)' },
  danger:     { bg: 'var(--danger)/10',    color: 'var(--danger)' },
  info:       { bg: 'var(--info)/10',      color: 'var(--info)' },
  'pais-BO':  { bg: 'var(--pais-bo)/10',   color: 'var(--pais-bo)' },
  'pais-PE':  { bg: 'var(--pais-pe)/10',   color: 'var(--pais-pe)' },
  'pais-CL':  { bg: 'var(--pais-cl)/10',   color: 'var(--pais-cl)' },
  superadmin: { bg: 'var(--success)/10',   color: 'var(--success)' },
  admin:      { bg: 'var(--surface-1)', color: 'var(--foreground-muted)' },
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const t = variantTokens[variant];
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}
        style={{
          background: t.bg,
          color: t.color,
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export function getBadgeVariantForPais(pais: Pais): BadgeVariant {
  return `pais-${pais}` as BadgeVariant;
}

export function getBadgeVariantForRol(rol: RolUsuario): BadgeVariant {
  return rol === 'superadmin' ? 'superadmin' : 'admin';
}

export function getCountryName(pais: Pais): string {
  const names: Record<Pais, string> = {
    BO: 'Bolivia',
    PE: 'Perú',
    CL: 'Chile',
  };
  return names[pais];
}

export function getCurrencySymbol(moneda: Moneda): string {
  const symbols: Record<Moneda, string> = {
    BOB: 'Bs.',
    PEN: 'S/',
    CLP: '$',
  };
  return symbols[moneda];
}

export { Badge };
