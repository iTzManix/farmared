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
} from 'lucide-react';
import { DashboardMetrics } from './components/DashboardMetrics';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DashboardModules } from './components/DashboardModules';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isSA = session.user.rol === 'superadmin';
  const pais = session.user.pais;

  return (
    <div className="space-y-12">
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="flex items-start justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl">
              {isSA ? (
                <div className="bg-primary/10 text-primary">
                  <ArrowRight className="w-5 h-5" /> Global
                </div>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl">
                  <div className="w-3 h-3 rounded-full"
                    style={{ background: pais === 'BO' ? 'var(--pais-bo)' : pais === 'PE' ? 'var(--pais-pe)' : 'var(--pais-cl)' }}
                  />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted">
                {isSA ? 'Acceso Global' : `Nodo ${pais === 'BO' ? 'Bolivia' : pais === 'PE' ? 'Perú' : 'Chile'}`}
              </p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Hola, {session.user.nombre.split(' ')[0]}
              </h1>
            </div>
          </div>

          <p className="text-sm text-muted max-w-xl">
            {isSA
              ? 'Visión completa de todos los nodos de la red FARMARED.'
              : `Gestión integral del nodo farmacéutico ${pais === 'BO' ? 'Bolivia' : pais === 'PE' ? 'Perú' : 'Chile'}.`}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted uppercase tracking-wider">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full"
              style={{ background: pais === 'BO' ? 'var(--pais-bo)' : pais === 'PE' ? 'var(--pais-pe)' : 'var(--pais-cl)' }}
            />
            <span className="text-xs font-medium text-foreground">Activo</span>
          </div>
        </div>
      </section>

      {/* ─── Metrics ────────────────────────────────────── */}
      <DashboardMetrics />

      {/* ─── Analytics ──────────────────────────────────── */}
      <DashboardAnalytics />

      {/* ─── Modules ────────────────────────────────────── */}
      <DashboardModules isSA={isSA} />
    </div>
  );
}