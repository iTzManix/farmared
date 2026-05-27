'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  Activity,
  Bell,
} from 'lucide-react';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import type { Pais } from '@/types/database';
import { cn } from '@/lib/utils';

interface NodeStatus {
  pais: Pais;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

const breadcrumbMap: Record<string, { label: string }> = {
  '/dashboard': { label: 'Dashboard' },
  '/dashboard/medicamentos': { label: 'Medicamentos' },
  '/dashboard/empleados': { label: 'Empleados' },
  '/dashboard/clientes': { label: 'Clientes' },
  '/dashboard/stock': { label: 'Stock' },
  '/dashboard/ventas': { label: 'Ventas' },
  '/dashboard/sucursales': { label: 'Sucursales' },
  '/dashboard/reportes': { label: 'Reportes' },
  '/dashboard/tasas-cambio': { label: 'Tasas de Cambio' },
  '/dashboard/configuracion': { label: 'Configuración' },
};

const currencyFlags: Record<string, string> = { BOB: '🇧🇴', PEN: '🇵🇪', CLP: '🇨🇱' };
const nodePais: Record<Pais, string> = { BO: 'BOL', PE: 'PER', CL: 'CHI' };

export function Header({ onMobileMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useCurrency();
  const [nodeStatuses, setNodeStatuses] = useState<NodeStatus[] | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/salud');
        if (!res.ok) return;
        const data = await res.json();
        const array = Object.entries(data).map(([pais, status]: [string, any]) => ({
          pais: pais as Pais,
          ...status,
        }));
        setNodeStatuses(array);
      } catch {
        // Silent fail
      }
    }
    fetchHealth();
  }, []);

  const page = breadcrumbMap[pathname] || { label: 'Dashboard' };
  const isHome = pathname === '/dashboard';

  return (
    <header className="flex-shrink-0 px-4 pt-4">
      <div className="flex items-center justify-between gap-4 h-14 px-5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">

        {/* Left: Mobile menu + breadcrumb */}
        <div className="flex items-center gap-3">
          {onMobileMenuClick && (
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 text-sm">
            {!isHome && (
              <>
                <span className="text-slate-400">Dashboard</span>
                <span className="text-slate-300">/</span>
              </>
            )}
            <span className="font-semibold text-slate-900">{page.label}</span>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3">

          {/* Currency selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-sm">{currencyFlags[selectedCurrency] || '💰'}</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer appearance-none pr-1"
            >
              {availableCurrencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-slate-200" />

          {/* Node status */}
          <div className="hidden md:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            {!nodeStatuses ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-14 h-6 rounded-md animate-pulse bg-slate-100" />
                ))}
              </>
            ) : (
              nodeStatuses.map((ns) => (
                <div
                  key={ns.pais}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold border',
                    ns.healthy
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-red-50 text-red-600 border-red-100'
                  )}
                  title={ns.healthy ? `${ns.latencyMs || '?'}ms` : (ns.error || 'Desconectado')}
                >
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    ns.healthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'
                  )} />
                  {nodePais[ns.pais]}
                </div>
              ))
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-slate-200" />

          {/* Notifications */}
          <button className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}