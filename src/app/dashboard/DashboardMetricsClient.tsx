'use client';

import { useCurrency } from '@/lib/contexts/CurrencyContext';
import {
  DollarSign,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

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
      accentColor: '#22D3EE',
      accentDim: 'rgba(34,211,238,0.08)',
      trend: '+0%',
      trendPositive: true,
    },
    {
      label: 'Stock bajo',
      value: String(initialData.medicamentosConStockBajo),
      icon: AlertTriangle,
      accentColor: '#FBBF24',
      accentDim: 'rgba(251,191,36,0.08)',
      sub: 'Productos bajo mínimo',
      trend: initialData.medicamentosConStockBajo > 0 ? 'Revisar' : 'OK',
      trendPositive: initialData.medicamentosConStockBajo === 0,
    },
    {
      label: 'Clientes',
      value: String(initialData.clientesRegistrados),
      icon: Users,
      accentColor: '#818CF8',
      accentDim: 'rgba(129,140,248,0.08)',
      sub: 'Clientes registrados',
      trend: '+0 hoy',
      trendPositive: true,
    },
    {
      label: 'Ventas hoy',
      value: String(initialData.ventasHoy),
      icon: TrendingUp,
      accentColor: '#34D399',
      accentDim: 'rgba(52,211,153,0.08)',
      sub: formatCurrency(initialData.montoVentasHoy, initialData.monedaBase),
      trend: '+0%',
      trendPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((m) => (
        <div
          key={m.label}
          className="relative overflow-hidden rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300"
          style={{
            background: 'var(--surface-0)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${m.accentDim}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${m.accentDim} 0%, transparent 70%)` }}
          />

          <div className="flex items-start justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--foreground-subtle)' }}
            >
              {m.label}
            </span>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: m.accentDim }}
            >
              <m.icon className="w-5 h-5" style={{ color: m.accentColor }} />
            </div>
          </div>

          <div>
            <p className="text-3xl font-bold text-white tracking-tight leading-none">
              {m.value}
            </p>
            {m.sub && (
              <p className="text-xs mt-2" style={{ color: 'var(--foreground-subtle)' }}>
                {m.sub}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={
                m.trendPositive
                  ? { background: 'rgba(52,211,153,0.06)', color: '#6ee7b7' }
                  : { background: 'rgba(251,191,36,0.06)', color: '#fcd34d' }
              }
            >
              {m.trendPositive && <ArrowUpRight className="w-3 h-3" />}
              {m.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
