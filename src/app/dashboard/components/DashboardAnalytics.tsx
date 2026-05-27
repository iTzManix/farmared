'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const ventasSemana = [
  { dia: 'Lun', ventas: 12 },
  { dia: 'Mar', ventas: 19 },
  { dia: 'Mié', ventas: 15 },
  { dia: 'Jue', ventas: 22 },
  { dia: 'Vie', ventas: 30 },
  { dia: 'Sáb', ventas: 18 },
  { dia: 'Dom', ventas: 8 },
];

const topMedicamentos = [
  { nombre: 'Amoxicilina',  cantidad: 45 },
  { nombre: 'Ibuprofeno',   cantidad: 38 },
  { nombre: 'Paracetamol',  cantidad: 32 },
  { nombre: 'Omeprazol',    cantidad: 28 },
  { nombre: 'Losartán',     cantidad: 21 },
];

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(226, 232, 240, 0.5)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#0f172a',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  padding: '8px 12px',
};

export function DashboardAnalytics() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Ventas de la semana ── */}
        <div className="rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ventas de la semana</h3>
              <p className="text-sm text-muted">Transacciones por día</p>
            </div>
            <span className="px-3 py-1 rounded text-xs font-medium"
              style={{ background: 'var(--primary)/10', color: 'var(--primary)' }}>
              7 días
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventasSemana} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(226, 232, 240, 0.3)" strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#fillVentas)"
                  dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#0ea5e9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Top medicamentos ── */}
        <div className="rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Top medicamentos</h3>
              <p className="text-sm text-muted">Más vendidos este mes</p>
            </div>
            <span className="px-3 py-1 rounded text-xs font-medium"
              style={{ background: 'var(--info)/10', color: 'var(--info)' }}>
              Top 5
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topMedicamentos}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 18, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(226, 232, 240, 0.3)" strokeDasharray="0" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  width={84}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.2)' }} />
                <Bar
                  dataKey="cantidad"
                  fill="url(#barGrad)"
                  radius={[0, 6, 6, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}