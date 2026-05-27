'use client';

import { usePathname } from 'next/navigation';
import {
  Menu,
  Activity,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import type { Pais } from '@/types/database';
import type { Moneda } from '@/types/database';

interface NodeStatus {
  pais: Pais;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

interface HeaderProps {
  nodeStatuses?: NodeStatus[];
  onMobileMenuClick?: () => void;
}

const breadcrumbMap: Record<string, { label: string; emoji?: string }> = {
  '/dashboard':              { label: 'Dashboard' },
  '/dashboard/medicamentos': { label: 'Medicamentos' },
  '/dashboard/empleados':    { label: 'Empleados' },
  '/dashboard/clientes':     { label: 'Clientes' },
  '/dashboard/stock':        { label: 'Stock' },
  '/dashboard/ventas':       { label: 'Ventas' },
  '/dashboard/sucursales':   { label: 'Sucursales' },
  '/dashboard/reportes':     { label: 'Reportes Globales' },
  '/dashboard/tasas-cambio': { label: 'Tasas de Cambio' },
  '/dashboard/configuracion':{ label: 'Configuración' },
};

const currencyOptions: { value: Moneda; label: string; symbol: string; flag: string }[] = [
  { value: 'BOB', label: 'Bolivianos',  symbol: 'Bs.',  flag: '🇧🇴' },
  { value: 'PEN', label: 'Soles',       symbol: 'S/',   flag: '🇵🇪' },
  { value: 'CLP', label: 'Pesos CLP',  symbol: 'CL$',  flag: '🇨🇱' },
];

const nodePais: Record<Pais, string> = { BO: 'BOL', PE: 'PER', CL: 'CHI' };

export function Header({ nodeStatuses, onMobileMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useCurrency();

  const page = breadcrumbMap[pathname] || { label: 'Dashboard' };
  const isHome = pathname === '/dashboard';

  const activeCurrency = currencyOptions.find((c) => c.value === selectedCurrency);

  return (
    <header
      className="flex items-center gap-3 px-5"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      {/* ─── Left: mobile menu + breadcrumb ─── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--foreground-muted)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-sm">
          {!isHome && (
            <>
              <span style={{ color: 'var(--foreground-subtle)' }}>Dashboard</span>
              <span style={{ color: 'var(--border-strong)' }}>/</span>
            </>
          )}
          <span className="font-semibold text-white tracking-tight">{page.label}</span>
        </nav>
      </div>

      {/* ─── Center: search ─── */}
      <div className="flex-1 hidden lg:flex justify-center">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--foreground-subtle)' }}
          />
          <input
            placeholder="Buscar en Farmared..."
            className="w-full h-10 pl-10 pr-4 text-sm rounded-xl transition-all"
            style={{
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--foreground)',
              outline: 'none',
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.border = '1px solid var(--border-focus)';
              (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(34,211,238,0.06)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.border = '1px solid var(--border-subtle)';
              (e.target as HTMLInputElement).style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* ─── Right: currency + nodes + actions ─── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Currency selector — visible, premium */}
        <div className="hidden md:flex items-center">
          <div
            className="relative flex items-center"
            style={{
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
            }}
          >
            <span className="pl-3 pr-1 text-sm">{activeCurrency?.flag}</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Moneda)}
              className="appearance-none pl-1 pr-7 py-2 text-xs font-semibold cursor-pointer bg-transparent focus:outline-none"
              style={{ color: 'var(--foreground)', borderRadius: '12px' }}
            >
              {(availableCurrencies as Moneda[]).map((c) => {
                const opt = currencyOptions.find((o) => o.value === c);
                return (
                  <option key={c} value={c} style={{ background: '#0B1528' }}>
                    {opt?.symbol} {opt?.label}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
              style={{ color: 'var(--foreground-subtle)' }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6" style={{ background: 'var(--border-subtle)' }} />

        {/* Node status */}
        {nodeStatuses && (
          <div className="hidden md:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" style={{ color: 'var(--foreground-subtle)' }} />
            {nodeStatuses.map((ns) => (
              <div
                key={ns.pais}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                style={
                  ns.healthy
                    ? { background: 'var(--success-dim, rgba(52,211,153,0.1))', color: '#6ee7b7', borderColor: 'rgba(52,211,153,0.2)' }
                    : { background: 'var(--danger-dim, rgba(251,113,133,0.1))', color: '#fca5a5', borderColor: 'rgba(251,113,133,0.2)' }
                }
                title={ns.healthy ? `${ns.latencyMs || '?'}ms` : (ns.error || 'Desconectado')}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: ns.healthy ? '#34d399' : '#fb7185',
                    boxShadow: ns.healthy ? '0 0 6px rgba(52,211,153,0.6)' : '0 0 6px rgba(251,113,133,0.6)',
                    animation: ns.healthy ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                />
                {nodePais[ns.pais]}
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="hidden md:block w-px h-6" style={{ background: 'var(--border-subtle)' }} />

        {/* Bell */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all relative"
          style={{ color: 'var(--foreground-muted)', border: '1px solid var(--border-subtle)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'white';
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <Bell className="w-4 h-4" />
          {/* Badge */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 6px rgba(34,211,238,0.6)' }}
          />
        </button>
      </div>
    </header>
  );
}
