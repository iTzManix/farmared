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
      sub: '↑ Actualizado en tiempo real',
      icon: DollarSign,
      accentColor: '#22D3EE',
      accentDim: 'rgba(34,211,238,0.12)',
      accentBorder: 'rgba(34,211,238,0.25)',
      topBorder: '#22D3EE',
      trend: '+0%',
      trendPositive: true,
    },
    {
      label: 'Stock bajo',
      value: String(initialData.medicamentosConStockBajo),
      sub: 'Productos bajo mínimo',
      icon: AlertTriangle,
      accentColor: '#FBBF24',
      accentDim: 'rgba(251,191,36,0.12)',
      accentBorder: 'rgba(251,191,36,0.25)',
      topBorder: '#FBBF24',
      trend: initialData.medicamentosConStockBajo > 0 ? 'Revisar' : 'OK',
      trendPositive: initialData.medicamentosConStockBajo === 0,
    },
    {
      label: 'Clientes',
      value: String(initialData.clientesRegistrados),
      sub: 'Clientes registrados',
      icon: Users,
      accentColor: '#818CF8',
      accentDim: 'rgba(129,140,248,0.12)',
      accentBorder: 'rgba(129,140,248,0.25)',
      topBorder: '#818CF8',
      trend: '+0 hoy',
      trendPositive: true,
    },
    {
      label: 'Ventas hoy',
      value: String(initialData.ventasHoy),
      sub: formatCurrency(initialData.montoVentasHoy, initialData.monedaBase),
      icon: TrendingUp,
      accentColor: '#34D399',
      accentDim: 'rgba(52,211,153,0.12)',
      accentBorder: 'rgba(52,211,153,0.25)',
      topBorder: '#34D399',
      trend: '+0%',
      trendPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((m) => (
        <div
          key={m.label}
          className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
          style={{
            background: 'var(--surface-0)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            borderTop: `2px solid ${m.topBorder}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${m.accentDim}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
          }}
        >
          {/* Subtle corner glow */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${m.accentDim} 0%, transparent 70%)` }}
          />

          {/* Header row */}
          <div className="flex items-start justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--foreground-subtle)' }}
            >
              {m.label}
            </span>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: m.accentDim, border: `1px solid ${m.accentBorder}` }}
            >
              <m.icon className="w-4.5 h-4.5" style={{ color: m.accentColor, width: 18, height: 18 }} />
            </div>
          </div>

          {/* Value */}
          <div>
            <p className="text-3xl font-bold text-white tracking-tight leading-none">
              {m.value}
            </p>
            {m.sub && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--foreground-subtle)' }}>
                {m.sub}
              </p>
            )}
          </div>

          {/* Trend badge */}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={
                m.trendPositive
                  ? { background: 'rgba(52,211,153,0.12)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }
                  : { background: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.2)' }
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
