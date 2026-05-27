'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Activity,
  Search,
  Bell,
  ChevronDown,
  Check,
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
  onMobileMenuClick?: () => void;
}

const currencyOptions: { value: Moneda; label: string; symbol: string; flag: string }[] = [
  { value: 'BOB', label: 'Bolivianos',  symbol: 'Bs',  flag: '🇧🇴' },
  { value: 'PEN', label: 'Soles',       symbol: 'S/',   flag: '🇵🇪' },
  { value: 'CLP', label: 'Pesos CLP',  symbol: 'CL$',  flag: '🇨🇱' },
];

const nodePais: Record<Pais, string> = { BO: 'BOL', PE: 'PER', CL: 'CHI' };

export function Header({ onMobileMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useCurrency();
  const [nodeStatuses, setNodeStatuses] = useState<NodeStatus[] | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

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
      } catch { /* fallback */ }
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurrency = currencyOptions.find((c) => c.value === selectedCurrency);

  return (
    <header
      className="flex items-center gap-6 px-8"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface-0)',
      }}
    >
      {/* ─── Left: mobile menu ─── */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl"
          style={{ color: 'var(--foreground-muted)' }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ─── Center: search ─── */}
      <div className="flex-1 hidden lg:flex justify-center">
        <div className="relative w-full max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--foreground-subtle)' }}
          />
          <input
            placeholder="Buscar en Farmared..."
            className="w-full h-11 pl-11 pr-4 text-sm rounded-xl transition-all"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              outline: 'none',
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--primary)';
              (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.2)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--border)';
              (e.target as HTMLInputElement).style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* ─── Right: currency + nodes + actions ─── */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Premium Currency Switcher */}
        <div className="hidden md:block relative" ref={currencyRef}>
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-2.5 h-11 px-4 rounded-xl transition-all"
            style={{
              background: currencyOpen ? 'var(--surface-1)' : 'var(--surface-0)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)'; }}
            onMouseLeave={(e) => { if (!currencyOpen) (e.currentTarget as HTMLElement).style.background = 'var(--surface-0)'; }}
          >
            <span className="text-base leading-none">{activeCurrency?.flag}</span>
            <span className="text-sm font-semibold">{activeCurrency?.symbol}</span>
            <ChevronDown
              className="w-3.5 h-3.5"
              style={{ color: 'var(--foreground-subtle)', transform: currencyOpen ? 'rotate(180deg)' : '' }}
            />
          </button>

          {currencyOpen && (
            <div
              className="absolute right-0 top-full mt-2 min-w-[200px] rounded-xl overflow-hidden z-50"
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {(availableCurrencies as Moneda[]).map((c) => {
                const opt = currencyOptions.find((o) => o.value === c);
                const isActive = c === selectedCurrency;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCurrency(c);
                      setCurrencyOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left"
                    style={{
                      color: isActive ? '#fff' : 'var(--foreground)',
                      background: isActive ? 'var(--primary)' : 'var(--surface-0)',
                      border: isActive ? 'none' : '1px solid var(--border)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--primary)' : 'var(--surface-1)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--primary)' : 'var(--surface-0)'; }}
                  >
                    <span className="text-base">{opt?.flag}</span>
                    <div className="flex-1">
                      <span className="font-medium">{opt?.symbol}</span>
                      <span className="ml-2" style={{ color: 'var(--foreground-muted)' }}>{opt?.label}</span>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4" style={{ color: 'var(--primary-foreground)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Node status */}
        <div className="hidden lg:flex items-center gap-2">
          {!nodeStatuses ? (
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-8 rounded-xl" style={{ background: 'var(--surface-1)' }} />
              ))}
            </div>
          ) : (
            <div className="flex space-x-2">
              {nodeStatuses.map((ns) => {
                return (
                  <div
                    key={ns.pais}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
                    style={
                      ns.healthy
                        ? { background: 'var(--success)/10', color: 'var(--success)' }
                        : { background: 'var(--danger)/10', color: 'var(--danger)' }
                    }
                    title={ns.healthy ? `${ns.latencyMs || '?'}ms` : (ns.error || 'Desconectado')}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: ns.healthy ? 'var(--success)' : 'var(--danger)',
                        boxShadow: ns.healthy ? '0 0 4px rgba(16, 185, 129, 0.3)' : '0 0 4px rgba(239, 68, 68, 0.3)',
                      }}
                    />
                    {nodePais[ns.pais]}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bell */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
          style={{ color: 'var(--foreground-muted)', background: 'var(--surface-0)', border: '1px solid var(--border)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'white';
            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)';
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-0)';
          }}
        >
          <Bell className="w-[18px] h-[18px]" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'var(--primary)', boxShadow: '0 0 3px rgba(14, 165, 233, 0.4)' }}
          />
        </button>
      </div>
    </header>
  );
}