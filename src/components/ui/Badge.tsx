'use client';

import { HTMLAttributes, forwardRef } from 'react';
import type { Pais, RolUsuario, Moneda } from '@/types/database';

export type BadgeVariant =
  | 'default'
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
  dot?: boolean;
}

const variantTokens: Record<BadgeVariant, { bg: string; color: string; border: string; dotColor?: string }> = {
  default:    { bg: 'rgba(255,255,255,0.08)', color: '#CBD5E1',  border: 'rgba(255,255,255,0.1)',  dotColor: '#94A3B8' },
  success:    { bg: 'rgba(52,211,153,0.1)',   color: '#6EE7B7',  border: 'rgba(52,211,153,0.2)',   dotColor: '#34D399' },
  warning:    { bg: 'rgba(251,191,36,0.1)',   color: '#FCD34D',  border: 'rgba(251,191,36,0.2)',   dotColor: '#FBBF24' },
  danger:     { bg: 'rgba(251,113,133,0.1)',  color: '#FCA5A5',  border: 'rgba(251,113,133,0.2)',  dotColor: '#FB7185' },
  info:       { bg: 'rgba(129,140,248,0.1)',  color: '#A5B4FC',  border: 'rgba(129,140,248,0.2)',  dotColor: '#818CF8' },
  'pais-BO':  { bg: 'rgba(59,130,246,0.1)',   color: '#93C5FD',  border: 'rgba(59,130,246,0.2)',   dotColor: '#3B82F6' },
  'pais-PE':  { bg: 'rgba(239,68,68,0.1)',    color: '#FCA5A5',  border: 'rgba(239,68,68,0.2)',    dotColor: '#EF4444' },
  'pais-CL':  { bg: 'rgba(16,185,129,0.1)',   color: '#6EE7B7',  border: 'rgba(16,185,129,0.2)',   dotColor: '#10B981' },
  superadmin: { bg: 'rgba(52,211,153,0.1)',   color: '#6EE7B7',  border: 'rgba(52,211,153,0.2)',   dotColor: '#34D399' },
  admin:      { bg: 'rgba(255,255,255,0.06)', color: '#94A3B8',  border: 'rgba(255,255,255,0.1)',  dotColor: '#64748B' },
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', dot = false, className = '', style, ...props }, ref) => {
    const t = variantTokens[variant];
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${className}`}
        style={{
          background: t.bg,
          color: t.color,
          border: `1px solid ${t.border}`,
          ...style,
        }}
        {...props}
      >
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: t.dotColor }}
          />
        )}
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
