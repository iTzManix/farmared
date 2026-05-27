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
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Session } from 'next-auth';
import type { RolUsuario, Pais } from '@/types/database';
import { cn } from '@/lib/utils';

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
  { name: 'Dashboard',     href: '/dashboard',              icon: Home },
  { name: 'Medicamentos',  href: '/dashboard/medicamentos', icon: FlaskConical },
  { name: 'Empleados',     href: '/dashboard/empleados',    icon: Users },
  { name: 'Clientes',      href: '/dashboard/clientes',     icon: ShoppingBag },
  { name: 'Stock',         href: '/dashboard/stock',        icon: Package },
  { name: 'Ventas',        href: '/dashboard/ventas',       icon: Banknote },
  { name: 'Sucursales',    href: '/dashboard/sucursales',   icon: Building2 },
];

const superAdminNavItems: NavItem[] = [
  { name: 'Reportes Globales', href: '/dashboard/reportes',      icon: BarChart3 },
  { name: 'Tasas de Cambio',   href: '/dashboard/tasas-cambio',  icon: DollarSign },
  { name: 'Configuración',     href: '/dashboard/configuracion', icon: Settings },
];

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

  const initials = session.user.nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col flex-shrink-0 w-[260px] m-4 mr-0 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

      {/* ─── Brand ─── */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 tracking-tight">FARMARED</div>
            <div className="text-[11px] text-slate-400 font-medium">Red de Farmacias</div>
          </div>
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div className="h-px bg-slate-100 mx-5" />

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">

        {/* Main */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Principal
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn(
                    'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                    active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                  )} />
                  <span className="truncate">{item.name}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary/50" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Super Admin */}
        {isSuperAdmin && (
          <div>
            <div className="h-px bg-slate-100 mx-3 mb-4" />
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Administración
            </p>
            <div className="space-y-0.5">
              {superAdminNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn(
                      'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                      active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                    )} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ─── User info ─── */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2">
        <div className="h-px bg-slate-100 mx-2 mb-3" />
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-primary/10 text-primary">
            {initials}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
              {session.user.nombre}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Zap className="w-2.5 h-2.5" />
                  Super Admin
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Admin · {session.user.pais || 'N/A'}
                </span>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
