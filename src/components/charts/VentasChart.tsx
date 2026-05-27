'use client';

import { Card } from '@/components/ui/Card';

interface VentaData {
  pais: string;
  total: number;
  count: number;
}

export function VentasChart({ data }: { data: VentaData[] }) {
  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Ventas Globales</h3>
      <div className="space-y-4">
        {data.map(d => (
          <div key={d.pais} className="flex items-center gap-4">
            <span className="w-12 text-sm font-medium text-slate-200">{d.pais}</span>
            <div className="flex-1 bg-white/10 rounded-full h-4">
              <div
                className="bg-cyan-400 rounded-full h-4 transition-all"
                style={{ width: `${(d.total / maxTotal) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-400">{d.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}