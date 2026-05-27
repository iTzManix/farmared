'use client';

import { useCurrency } from '@/lib/contexts/CurrencyContext';
import {
  DollarSign,
  AlertTriangle,
  Users,
  TrendingUp,
} from 'lucide-react';

interface DashboardMetricsProps {
  initialData?: {
    totalVentas: number;
    monedaBase: 'BOB' | 'PEN' | 'CLP';
    medicamentosConStockBajo: number;
    clientesRegistrados: number;
    ventasHoy: number;
    montoVentasHoy: number;
  };
}

export function DashboardMetrics({ initialData }: DashboardMetricsProps) {
  const { formatCurrency } = useCurrency();
  const data = initialData ?? {
    totalVentas: 0,
    monedaBase: 'BOB',
    medicamentosConStockBajo: 0,
    clientesRegistrados: 0,
    ventasHoy: 0,
    montoVentasHoy: 0,
  };

  const cards = [
    {
      title: 'Ventas mensuales',
      value: formatCurrency(data.totalVentas, data.monedaBase),
      icon: DollarSign,
      bg: 'var(--primary)/10',
      color: 'var(--primary)',
      trend: '+12% vs mes anterior',
      trendPositive: true,
    },
    {
      title: 'Stock bajo',
      value: String(data.medicamentosConStockBajo),
      icon: AlertTriangle,
      bg: 'var(--warning)/10',
      color: 'var(--warning)',
      trend: data.medicamentosConStockBajo > 0 ? 'Requiere atención' : 'Nivel óptimo',
      trendPositive: data.medicamentosConStockBajo === 0,
    },
    {
      title: 'Clientes activos',
      value: String(data.clientesRegistrados),
      icon: Users,
      bg: 'var(--info)/10',
      color: 'var(--info)',
      trend: '+8% este mes',
      trendPositive: true,
    },
    {
      title: 'Ventas hoy',
      value: formatCurrency(data.montoVentasHoy, data.monedaBase),
      icon: TrendingUp,
      bg: 'var(--success)/10',
      color: 'var(--success)',
      trend: data.ventasHoy > 0 ? `${data.ventasHoy} transacciones` : 'Sin ventas hoy',
      trendPositive: data.ventasHoy >= 0,
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex-1 rounded-xl p-6"
            style={{
              background: card.bg,
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ background: card.bg }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </div>
              </div>
              <div className="text-xs font-medium"
                style={{ 
                  color: card.trendPositive ? 'var(--success)' : 'var(--warning)', 
                }}>
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}