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
}

const navItems: NavItem[] = [
  { name: 'Dashboard',     href: '/dashboard',             icon: Home },
  { name: 'Medicamentos',  href: '/dashboard/medicamentos', icon: FlaskConical },
  { name: 'Empleados',     href: '/dashboard/empleados',    icon: Users },
  { name: 'Clientes',      href: '/dashboard/clientes',     icon: ShoppingBag },
  { name: 'Stock',         href: '/dashboard/stock',        icon: Package },
  { name: 'Ventas',        href: '/dashboard/ventas',       icon: Banknote },
  { name: 'Sucursales',    href: '/dashboard/sucursales',   icon: Building2 },
];

const superAdminNavItems: NavItem[] = [
  { name: 'Reportes Globales', href: '/dashboard/reportes',       icon: BarChart3 },
  { name: 'Tasas de Cambio',   href: '/dashboard/tasas-cambio',   icon: DollarSign },
  { name: 'Configuración',     href: '/dashboard/configuracion',  icon: Settings },
];

const paisMeta: Record<string, { label: string; dot: string }> = {
  BO: { label: 'Bolivia',  dot: 'bg-blue-500' },
  PE: { label: 'Perú',     dot: 'bg-orange-500' },
  CL: { label: 'Chile',    dot: 'bg-emerald-500' },
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
        margin: '24px',
        background: 'var(--surface-0)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* ─── Brand ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 pt-8 pb-6">
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{
            background: 'var(--primary)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <div>
          <div className="text-lg font-bold text-foreground tracking-tight">
            FARMARED
          </div>
          <div className="text-sm text-muted">
            Red de Farmacias
          </div>
        </div>
      </div>

      {/* ─── Navigation ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3" style={{ scrollbarWidth: 'none' }}>

        <div className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/50'}`}
              >
                <item.icon
                  className="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                  style={active ? { color: 'var(--primary)' } : { color: 'var(--foreground-muted)' }}
                />
                <span className="truncate">{item.name}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40 text-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Super Admin */}
        {isSuperAdmin && (
          <div className="mt-8 pt-8 border-t border-muted">
            <div className="space-y-2">
              {superAdminNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${active ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/50'}`}
                  >
                    <item.icon
                      className="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                      style={active ? { color: 'var(--primary)' } : { color: 'var(--foreground-muted)' }}
                    />
                    <span className="truncate">{item.name}</span>
                    {active && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40 text-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Bottom — user info ───────────────────────────── */}
      <div className="flex-shrink-0 px-3 pb-5 pt-4 border-t border-muted">
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
          style={{
            background: 'var(--surface-1)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-foreground"
            style={{
              background: 'var(--primary)',
            }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-foreground truncate leading-tight">
              {session.user.nombre}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {isSuperAdmin ? (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: 'var(--success)/10', color: 'var(--success)' }}
                >
                  Super Admin
                </span>
              ) : paisInfo ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: 'var(--foreground-muted)' }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${paisInfo.dot}`} />
                  {paisInfo.label}
                </span>
              ) : (
                <span className="text-[10px]" style={{ color: 'var(--foreground-subtle)' }}>Admin</span>
              )}
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 rounded-xl transition-all duration-200 flex-shrink-0"
            style={{ color: 'var(--foreground-muted)' }}
            title="Cerrar sesión"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#fb7185';
              (e.currentTarget as HTMLElement).style.background = 'rgba(251,113,133,0.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)';
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
