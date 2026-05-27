'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Sample data — will be replaced with real data from the API
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
  backgroundColor: '#070E1C',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  fontSize: '12px',
  color: '#E2E8F0',
  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  padding: '8px 14px',
};

export function DashboardChartsClient() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* ── Ventas de la semana ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Card header */}
        <div
          className="px-7 pt-6 pb-5"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Ventas de la semana</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                Transacciones por día
              </p>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.15)' }}
            >
              7 días
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 py-5" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventasSemana} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22D3EE" stopOpacity={0.30} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="dia"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(34,211,238,0.15)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#22D3EE"
                strokeWidth={2}
                fill="url(#fillVentas)"
                dot={{ r: 3, fill: '#22D3EE', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#22D3EE', strokeWidth: 2, stroke: 'rgba(34,211,238,0.3)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top medicamentos ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Card header */}
        <div
          className="px-7 pt-6 pb-5"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Top medicamentos</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                Más vendidos este mes
              </p>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(129,140,248,0.1)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.15)' }}
            >
              Top 5
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 py-5" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topMedicamentos}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#818CF8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" horizontal={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                width={82}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
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
  );
}
