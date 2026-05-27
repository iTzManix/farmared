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
  backgroundColor: 'rgba(7, 14, 28, 0.9)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: 'none',
  borderRadius: '14px',
  fontSize: '12px',
  color: '#E2E8F0',
  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  padding: '10px 16px',
};

export function DashboardChartsClient() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* ── Ventas de la semana ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-0)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="px-8 pt-7 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Ventas de la semana</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                Transacciones por día
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(34,211,238,0.06)', color: '#22D3EE' }}
            >
              7 días
            </span>
          </div>
        </div>

        <div className="px-4 py-6" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventasSemana} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#22D3EE" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="0" vertical={false} />
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
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(34,211,238,0.10)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#22D3EE"
                strokeWidth={2}
                fill="url(#fillVentas)"
                dot={{ r: 3, fill: '#22D3EE', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#22D3EE', strokeWidth: 2, stroke: 'rgba(34,211,238,0.2)' }}
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
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="px-8 pt-7 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Top medicamentos</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                Más vendidos este mes
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(129,140,248,0.06)', color: '#818CF8' }}
            >
              Top 5
            </span>
          </div>
        </div>

        <div className="px-4 py-6" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topMedicamentos}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#818CF8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="0" horizontal={false} />
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
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
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
