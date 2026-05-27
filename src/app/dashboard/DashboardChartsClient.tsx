'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface DashboardChartsClientProps {
  initialData: {
    ventasSemana: { dia: string; ventas: number }[];
    topMedicamentos: { nombre: string; cantidad: number }[];
  };
}

// Charts need inline styles for SVG elements — this is one of the valid exceptions
const tooltipContentStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#334155',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '8px 12px',
};

export function DashboardChartsClient({ initialData }: DashboardChartsClientProps) {
  const ventasSemana = initialData.ventasSemana;
  const topMedicamentos = initialData.topMedicamentos;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── Ventas de la semana ── */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ventas de la semana</h3>
              <p className="text-xs text-slate-400 mt-1">Transacciones por día</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-600">
              7 días
            </span>
          </div>
        </div>

        {/* Chart height needs style for Recharts ResponsiveContainer */}
        <div className="px-4 py-4" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventasSemana} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={tooltipContentStyle} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#fillVentas)"
                dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#bae6fd' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top medicamentos ── */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Top medicamentos</h3>
              <p className="text-xs text-slate-400 mt-1">Más vendidos este mes</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-violet-50 text-violet-600">
              Top 5
            </span>
          </div>
        </div>

        <div className="px-4 py-4" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topMedicamentos} layout="vertical" margin={{ top: 0, right: 8, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="nombre" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={82} />
              <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="cantidad" fill="url(#barGrad)" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
