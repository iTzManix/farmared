'use client';

import { Card } from '@/components/ui/Card';

interface StockData {
  pais: string;
  totalStock: number;
  count: number;
}

export function StockChart({ data }: { data: StockData[] }) {
  const maxTotal = Math.max(...data.map(d => d.totalStock), 1);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Stock Global</h3>
      <div className="space-y-4">
        {data.map(d => (
          <div key={d.pais} className="flex items-center gap-4">
            <span className="w-12 text-sm font-medium text-slate-200">{d.pais}</span>
            <div className="flex-1 bg-white/10 rounded-full h-4">
              <div
                className="bg-emerald-400 rounded-full h-4 transition-all"
                style={{ width: `${(d.totalStock / maxTotal) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-400">{d.totalStock}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}