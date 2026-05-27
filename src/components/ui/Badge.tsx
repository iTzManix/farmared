'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Pais, RolUsuario, Moneda } from '@/types/database';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full',
  {
    variants: {
      variant: {
        default:    'bg-slate-100 text-slate-500',
        primary:    'bg-sky-50 text-sky-600',
        secondary:  'bg-slate-100 text-slate-600',
        success:    'bg-emerald-50 text-emerald-600',
        warning:    'bg-amber-50 text-amber-600',
        danger:     'bg-red-50 text-red-600',
        info:       'bg-blue-50 text-blue-600',
        outline:    'border border-slate-200 text-slate-600 bg-transparent',
        'pais-BO':  'bg-blue-50 text-blue-600',
        'pais-PE':  'bg-orange-50 text-orange-600',
        'pais-CL':  'bg-emerald-50 text-emerald-600',
        superadmin: 'bg-emerald-50 text-emerald-600',
        admin:      'bg-slate-100 text-slate-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
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

export { Badge, badgeVariants };
