'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  FlaskConical,
  Package,
  FileText,
  Users,
  ShoppingBag,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleItem {
  name: string;
  href: string;
  desc: string;
  icon: LucideIcon;
}

const quickLinks: ModuleItem[] = [
  { name: 'Medicamentos', href: '/dashboard/medicamentos', desc: 'Catálogo y gestión de fármacos', icon: FlaskConical },
  { name: 'Stock',        href: '/dashboard/stock',        desc: 'Inventario por sucursal',        icon: Package },
  { name: 'Ventas',       href: '/dashboard/ventas',       desc: 'Historial de transacciones',     icon: FileText },
  { name: 'Empleados',    href: '/dashboard/empleados',    desc: 'Personal activo por nodo',       icon: Users },
  { name: 'Clientes',     href: '/dashboard/clientes',     desc: 'Base de clientes registrados',   icon: ShoppingBag },
  { name: 'Sucursales',   href: '/dashboard/sucursales',   desc: 'Red de farmacias activas',       icon: Building2 },
];

const superAdminLinks: ModuleItem[] = [
  { name: 'Reportes Globales', href: '/dashboard/reportes',      desc: 'Métricas consolidadas de la red', icon: BarChart3 },
  { name: 'Configuración',     href: '/dashboard/configuracion', desc: 'Estado de nodos y sistema',       icon: Settings },
];

interface DashboardModulesProps {
  isSA: boolean;
}

export function DashboardModules({ isSA }: DashboardModulesProps) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 flex-shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>

      {isSA && (
        <div className="mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Administración Global
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {superAdminLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200/80 transition-colors flex-shrink-0">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 flex-shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}