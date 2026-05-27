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

interface ModuleItem {
  name: string;
  href: string;
  desc: string;
  icon: () => React.ReactNode;
  bgColor: string;
}

const quickLinks: ModuleItem[] = [
  {
    name: 'Medicamentos',
    href: '/dashboard/medicamentos',
    desc: 'Catálogo y gestión de fármacos',
    icon: () => <FlaskConical className="w-5 h-5" />,
    bgColor: 'var(--primary)/10',
  },
  {
    name: 'Stock',
    href: '/dashboard/stock',
    desc: 'Inventario por sucursal',
    icon: () => <Package className="w-5 h-5" />,
    bgColor: 'var(--warning)/10',
  },
  {
    name: 'Ventas',
    href: '/dashboard/ventas',
    desc: 'Historial de transacciones',
    icon: () => <FileText className="w-5 h-5" />,
    bgColor: 'var(--success)/10',
  },
  {
    name: 'Empleados',
    href: '/dashboard/empleados',
    desc: 'Personal activo por nodo',
    icon: () => <Users className="w-5 h-5" />,
    bgColor: 'var(--info)/10',
  },
  {
    name: 'Clientes',
    href: '/dashboard/clientes',
    desc: 'Base de clientes registrados',
    icon: () => <ShoppingBag className="w-5 h-5" />,
    bgColor: 'var(--secondary)/10',
  },
  {
    name: 'Sucursales',
    href: '/dashboard/sucursales',
    desc: 'Red de farmacias activas',
    icon: () => <Building2 className="w-5 h-5" />,
    bgColor: 'var(--primary)/10',
  },
];

const superAdminLinks: ModuleItem[] = [
  {
    name: 'Reportes Globales',
    href: '/dashboard/reportes',
    desc: 'Métricas consolidadas de la red',
    icon: () => <BarChart3 className="w-5 h-5" />,
    bgColor: 'var(--danger)/10',
  },
  {
    name: 'Configuración',
    href: '/dashboard/configuracion',
    desc: 'Estado de nodos y sistema',
    icon: () => <Settings className="w-5 h-5" />,
    bgColor: 'var(--secondary)/10',
  },
];

interface DashboardModulesProps {
  isSA: boolean;
}

export function DashboardModules({ isSA }: DashboardModulesProps) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group block rounded-xl p-6"
            style={{
              background: item.bgColor,
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div className="mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                style={{ background: item.bgColor }}>
                {item.icon()}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
            <ArrowRight
              className="mt-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#64748b' }}
            />
          </Link>
        ))}
      </div>

      {isSA && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Administración Global
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {superAdminLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group block rounded-xl p-6"
                style={{
                  background: item.bgColor,
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div className="mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                    style={{ background: item.bgColor }}>
                    {item.icon()}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
                <ArrowRight
                  className="mt-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#64748b' }}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}