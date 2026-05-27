import { getSession } from '@/lib/auth/helpers';
import Link from 'next/link';
import {
  FlaskConical,
  Package,
  FileText,
  Users,
  Store,
  BarChart3,
  Settings,
  ShoppingBag,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { DashboardMetricsClient } from './DashboardMetricsClient';
import { DashboardChartsClient } from './DashboardChartsClient';

const quickLinks = [
  {
    name: 'Medicamentos',
    href: '/dashboard/medicamentos',
    desc: 'Catálogo y gestión de fármacos',
    icon: FlaskConical,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    glow: 'rgba(59,130,246,0.15)',
    iconColor: '#93C5FD',
  },
  {
    name: 'Stock',
    href: '/dashboard/stock',
    desc: 'Inventario por sucursal',
    icon: Package,
    gradient: 'from-amber-500/20 to-orange-500/10',
    glow: 'rgba(245,158,11,0.15)',
    iconColor: '#FCD34D',
  },
  {
    name: 'Ventas',
    href: '/dashboard/ventas',
    desc: 'Historial de transacciones',
    icon: FileText,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    glow: 'rgba(16,185,129,0.15)',
    iconColor: '#6EE7B7',
  },
  {
    name: 'Empleados',
    href: '/dashboard/empleados',
    desc: 'Personal activo por nodo',
    icon: Users,
    gradient: 'from-violet-500/20 to-purple-500/10',
    glow: 'rgba(139,92,246,0.15)',
    iconColor: '#C4B5FD',
  },
  {
    name: 'Clientes',
    href: '/dashboard/clientes',
    desc: 'Base de clientes registrados',
    icon: ShoppingBag,
    gradient: 'from-indigo-500/20 to-blue-500/10',
    glow: 'rgba(99,102,241,0.15)',
    iconColor: '#A5B4FC',
  },
  {
    name: 'Sucursales',
    href: '/dashboard/sucursales',
    desc: 'Red de farmacias activas',
    icon: Store,
    gradient: 'from-sky-500/20 to-blue-500/10',
    glow: 'rgba(14,165,233,0.15)',
    iconColor: '#7DD3FC',
  },
];

const superAdminLinks = [
  {
    name: 'Reportes Globales',
    href: '/dashboard/reportes',
    desc: 'Métricas consolidadas de la red',
    icon: BarChart3,
    gradient: 'from-rose-500/20 to-pink-500/10',
    iconColor: '#FCA5A5',
  },
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    desc: 'Estado de nodos y sistema',
    icon: Settings,
    gradient: 'from-slate-500/20 to-gray-500/10',
    iconColor: '#CBD5E1',
  },
];

const paisName: Record<string, string> = {
  BO: 'Bolivia',
  PE: 'Perú',
  CL: 'Chile',
};

const paisAccent: Record<string, string> = {
  BO: 'from-blue-500/25 to-cyan-500/10',
  PE: 'from-rose-500/25 to-pink-500/10',
  CL: 'from-emerald-500/25 to-teal-500/10',
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isSA = session.user.rol === 'superadmin';
  const pais = session.user.pais;
  const nodoLabel = pais ? paisName[pais] : 'Global';
  const heroGradient = pais ? paisAccent[pais] : 'from-cyan-500/20 to-blue-500/10';

  // Get current date
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-10">

      {/* ─── Hero Banner ──────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-3xl px-8 py-9"
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        {/* Background gradient blobs */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${heroGradient} opacity-60 pointer-events-none`}
        />
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                style={{
                  background: 'rgba(34,211,238,0.1)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(34,211,238,0.2)',
                }}
              >
                {isSA ? (
                  <><Zap className="w-3 h-3" /> Acceso Global</>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-current inline-block" /> Nodo {nodoLabel}</>
                )}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
              Hola, {session.user.nombre.split(' ')[0]}
            </h1>

            {/* Subheading */}
            <p className="text-base" style={{ color: 'var(--foreground-muted)' }}>
              {isSA
                ? 'Acceso completo a todos los nodos de la red FARMARED.'
                : `Administrando el nodo farmacéutico de ${nodoLabel}.`}
            </p>
          </div>

          {/* Date badge */}
          <div
            className="text-right hidden sm:block flex-shrink-0"
          >
            <p className="text-xs capitalize" style={{ color: 'var(--foreground-subtle)' }}>
              {dateStr}
            </p>
            <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
              Sistema activo
            </p>
          </div>
        </div>
      </section>

      {/* ─── KPI Metrics ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground-subtle)' }}>
            Métricas clave
          </h2>
          <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Tiempo real</span>
        </div>
        <DashboardMetricsClient
          initialData={{
            totalVentas: 0,
            monedaBase: pais === 'PE' ? 'PEN' : pais === 'CL' ? 'CLP' : 'BOB',
            medicamentosConStockBajo: 0,
            clientesRegistrados: 0,
            ventasHoy: 0,
            montoVentasHoy: 0,
          }}
        />
      </section>

      {/* ─── Charts ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground-subtle)' }}>
            Análisis
          </h2>
          <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>Últimos 7 días</span>
        </div>
        <DashboardChartsClient />
      </section>

      {/* ─── Modules Grid ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground-subtle)' }}>
            Módulos
          </h2>
          <span className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{quickLinks.length} disponibles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-start gap-4 p-6 rounded-2xl transition-all duration-200 overflow-hidden"
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${item.glow || 'rgba(34,211,238,0.1)'}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Card gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`} />

              {/* Icon */}
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: `${item.glow || 'rgba(34,211,238,0.1)'}`,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.iconColor }} />
              </div>

              {/* Text */}
              <div className="relative min-w-0 flex-1">
                <p className="text-sm font-semibold text-white mb-0.5 group-hover:text-white transition-colors">
                  {item.name}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-subtle)' }}>
                  {item.desc}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                className="relative w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                style={{ color: 'var(--foreground-muted)' }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Super Admin Section ─────────────────────────── */}
      {isSA && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground-subtle)' }}>
              Administración Global
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {superAdminLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative flex items-start gap-4 p-6 rounded-2xl transition-all duration-200 overflow-hidden"
                style={{
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(129,140,248,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`} />
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)' }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.iconColor }} />
                </div>
                <div className="relative min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white mb-0.5">{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--foreground-subtle)' }}>{item.desc}</p>
                </div>
                <ArrowRight
                  className="relative w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                  style={{ color: 'var(--foreground-muted)' }}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom breathing room */}
      <div className="h-4" />
    </div>
  );
}
