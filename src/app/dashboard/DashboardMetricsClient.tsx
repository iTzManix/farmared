'use client';

import { useCurrency } from '@/lib/contexts/CurrencyContext';
import {
  DollarSign,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardMetricsClientProps {
  initialData: {
    totalVentas: number;
    monedaBase: 'BOB' | 'PEN' | 'CLP';
    medicamentosConStockBajo: number;
    clientesRegistrados: number;
    ventasHoy: number;
    montoVentasHoy: number;
  };
}

export function DashboardMetricsClient({ initialData }: DashboardMetricsClientProps) {
  const { formatCurrency } = useCurrency();

  const cards = [
    {
      label: 'Ventas del mes',
      value: formatCurrency(initialData.totalVentas, initialData.monedaBase),
      icon: DollarSign,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
      trend: '+0%',
      trendPositive: true,
    },
    {
      label: 'Stock bajo',
      value: String(initialData.medicamentosConStockBajo),
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      sub: 'Productos bajo mínimo',
      trend: initialData.medicamentosConStockBajo > 0 ? 'Revisar' : 'OK',
      trendPositive: initialData.medicamentosConStockBajo === 0,
    },
    {
      label: 'Clientes',
      value: String(initialData.clientesRegistrados),
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      sub: 'Clientes registrados',
      trend: '+0 hoy',
      trendPositive: true,
    },
    {
      label: 'Ventas hoy',
      value: String(initialData.ventasHoy),
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      sub: formatCurrency(initialData.montoVentasHoy, initialData.monedaBase),
      trend: '+0%',
      trendPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-slate-200/80 bg-white shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {m.label}
            </span>
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', m.iconBg)}>
              <m.icon className={cn('w-4.5 h-4.5', m.iconColor)} />
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {m.value}
            </p>
            {m.sub && (
              <p className="text-xs text-slate-400 mt-1.5">{m.sub}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={cn(
              'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md',
              m.trendPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            )}>
              {m.trendPositive && <ArrowUpRight className="w-3 h-3" />}
              {m.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
