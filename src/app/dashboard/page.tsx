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
import { getDashboardChartsData } from './actions';

const quickLinks = [
  { name: 'Medicamentos', href: '/dashboard/medicamentos', desc: 'Catálogo y gestión de fármacos', icon: FlaskConical },
  { name: 'Stock',        href: '/dashboard/stock',        desc: 'Inventario por sucursal',        icon: Package },
  { name: 'Ventas',       href: '/dashboard/ventas',       desc: 'Historial de transacciones',     icon: FileText },
  { name: 'Empleados',    href: '/dashboard/empleados',    desc: 'Personal activo por nodo',       icon: Users },
  { name: 'Clientes',     href: '/dashboard/clientes',     desc: 'Base de clientes registrados',   icon: ShoppingBag },
  { name: 'Sucursales',   href: '/dashboard/sucursales',   desc: 'Red de farmacias activas',       icon: Store },
];

const superAdminLinks = [
  { name: 'Reportes Globales', href: '/dashboard/reportes',      desc: 'Métricas consolidadas de la red', icon: BarChart3 },
  { name: 'Configuración',     href: '/dashboard/configuracion', desc: 'Estado de nodos y sistema',       icon: Settings },
];

const paisName: Record<string, string> = { BO: 'Bolivia', PE: 'Perú', CL: 'Chile' };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isSA = session.user.rol === 'superadmin';
  const pais = session.user.pais;
  const nodoLabel = pais ? paisName[pais] : 'Global';

  const chartsData = await getDashboardChartsData();

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-8">

      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm px-8 py-8">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 pointer-events-none" />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                {isSA ? (
                  <><Zap className="w-3 h-3" /> Acceso Global</>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Nodo {nodoLabel}
                  </>
                )}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
              Hola, {session.user.nombre.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500">
              {isSA
                ? 'Acceso completo a todos los nodos de la red FARMARED.'
                : `Administrando el nodo farmacéutico de ${nodoLabel}.`}
            </p>
          </div>

          <div className="text-right hidden sm:block flex-shrink-0">
            <p className="text-xs text-slate-400 capitalize">{dateStr}</p>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Sistema activo</p>
          </div>
        </div>
      </section>

      {/* ─── KPI Metrics ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Métricas clave
          </h2>
          <span className="text-xs text-slate-400">Tiempo real</span>
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

      {/* ─── Charts ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Análisis
          </h2>
          <span className="text-xs text-slate-400">Últimos 7 días</span>
        </div>
        <DashboardChartsClient initialData={chartsData} />
      </section>

      {/* ─── Modules Grid ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Módulos
          </h2>
          <span className="text-xs text-slate-400">{quickLinks.length} disponibles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-0.5">{item.name}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Super Admin Section ─── */}
      {isSA && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Administración Global
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {superAdminLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100 group-hover:bg-slate-200/80 transition-colors">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 mb-0.5">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />
    </div>
  );
}