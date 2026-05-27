'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Home,
  FlaskConical,
  Users,
  ShoppingBag,
  Package,
  Banknote,
  Building2,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Session } from 'next-auth';
import type { RolUsuario, Pais } from '@/types/database';

interface SidebarSession extends Session {
  user: {
    id: number;
    username: string;
    nombre: string;
    rol: RolUsuario;
    pais: Pais | null;
  };
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  accent?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard',     href: '/dashboard',             icon: Home,        accent: 'text-cyan-300' },
  { name: 'Medicamentos',  href: '/dashboard/medicamentos', icon: FlaskConical, accent: 'text-blue-300' },
  { name: 'Empleados',     href: '/dashboard/empleados',    icon: Users,        accent: 'text-violet-300' },
  { name: 'Clientes',      href: '/dashboard/clientes',     icon: ShoppingBag,  accent: 'text-indigo-300' },
  { name: 'Stock',         href: '/dashboard/stock',        icon: Package,      accent: 'text-amber-300' },
  { name: 'Ventas',        href: '/dashboard/ventas',       icon: Banknote,     accent: 'text-emerald-300' },
  { name: 'Sucursales',    href: '/dashboard/sucursales',   icon: Building2,    accent: 'text-sky-300' },
];

const superAdminNavItems: NavItem[] = [
  { name: 'Reportes Globales', href: '/dashboard/reportes',       icon: BarChart3, accent: 'text-rose-300' },
  { name: 'Tasas de Cambio',   href: '/dashboard/tasas-cambio',   icon: DollarSign, accent: 'text-yellow-300' },
  { name: 'Configuración',     href: '/dashboard/configuracion',  icon: Settings,   accent: 'text-slate-300' },
];

const paisMeta: Record<string, { label: string; color: string; dot: string }> = {
  BO: { label: 'Bolivia',  color: 'bg-blue-500/15 text-blue-300 border-blue-500/25',   dot: 'bg-blue-400' },
  PE: { label: 'Perú',     color: 'bg-rose-500/15 text-rose-300 border-rose-500/25',   dot: 'bg-rose-400' },
  CL: { label: 'Chile',    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', dot: 'bg-emerald-400' },
};

interface SidebarProps {
  session: SidebarSession;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = session.user.rol === 'superadmin';

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const paisInfo = session.user.pais ? paisMeta[session.user.pais] : null;
  const initials = session.user.nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside
      className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        width: 'var(--sidebar-width)',
        margin: '16px 0 16px 16px',
        background: 'var(--surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '28px',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      {/* ─── Brand ───────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3.5">
          {/* Logo mark */}
          <div
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(96,165,250,0.15) 100%)',
              border: '1px solid rgba(34,211,238,0.25)',
              borderRadius: '14px',
              boxShadow: '0 0 20px rgba(34,211,238,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="url(#logoGrad)">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          {/* Name + tagline */}
          <div>
            <div className="text-[15px] font-bold text-white tracking-tight leading-none">
              FARMARED
            </div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: 'var(--foreground-subtle)' }}>
              Red de Farmacias
            </div>
          </div>
        </div>
      </div>

      {/* ─── Divider ─────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 20px' }} />

      {/* ─── Navigation ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: 'none' }}>

        {/* Main */}
        <div className="mb-6">
          <p
            className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: 'var(--foreground-subtle)' }}
          >
            Principal
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 relative"
                  style={
                    active
                      ? {
                          background: 'linear-gradient(90deg, rgba(34,211,238,0.1) 0%, rgba(96,165,250,0.05) 100%)',
                          color: '#fff',
                          borderLeft: '2px solid rgba(34,211,238,0.7)',
                          paddingLeft: '10px',
                        }
                      : {
                          color: 'var(--foreground-muted)',
                        }
                  }
                >
                  <item.icon
                    className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150 ${
                      active ? item.accent || 'text-cyan-300' : 'group-hover:' + (item.accent || 'text-cyan-300')
                    }`}
                    style={active ? {} : { color: 'var(--foreground-subtle)' }}
                  />
                  <span className="truncate">{item.name}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40 text-cyan-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Super Admin */}
        {isSuperAdmin && (
          <div>
            <div
              style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 12px 16px' }}
            />
            <p
              className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'var(--foreground-subtle)' }}
            >
              Administración
            </p>
            <div className="space-y-0.5">
              {superAdminNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150"
                    style={
                      active
                        ? {
                            background: 'linear-gradient(90deg, rgba(129,140,248,0.12) 0%, rgba(96,165,250,0.06) 100%)',
                            color: '#fff',
                            borderLeft: '2px solid rgba(129,140,248,0.7)',
                            paddingLeft: '10px',
                          }
                        : {
                            color: 'var(--foreground-muted)',
                          }
                    }
                  >
                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                        active ? item.accent || 'text-violet-300' : ''
                      }`}
                      style={active ? {} : { color: 'var(--foreground-subtle)' }}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Bottom — user info ───────────────────────────── */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2">
        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 8px 12px' }} />

        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl"
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(96,165,250,0.2) 100%)',
              border: '1px solid rgba(34,211,238,0.2)',
            }}
          >
            {initials}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate leading-tight">
              {session.user.nombre}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isSuperAdmin ? (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(52,211,153,0.12)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  Super Admin
                </span>
              ) : paisInfo ? (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${paisInfo.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${paisInfo.dot}`} />
                  {paisInfo.label}
                </span>
              ) : (
                <span className="text-[10px]" style={{ color: 'var(--foreground-subtle)' }}>Admin</span>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-1.5 rounded-lg transition-all duration-150 flex-shrink-0"
            style={{ color: 'var(--foreground-subtle)' }}
            title="Cerrar sesión"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#fb7185';
              (e.currentTarget as HTMLElement).style.background = 'rgba(251,113,133,0.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--foreground-subtle)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
