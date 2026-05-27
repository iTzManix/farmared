'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DashboardModuleLinkProps {
  item: {
    name: string;
    href: string;
    desc: string;
    gradient: string;
    glow?: string;
    iconColor: string;
  };
  iconNode: React.ReactNode;
}

export function DashboardModuleLink({ item, iconNode }: DashboardModuleLinkProps) {
  return (
    <Link
      href={item.href}
      className="group relative flex items-start gap-5 p-7 rounded-2xl transition-all duration-300 overflow-hidden"
      style={{
        background: 'var(--surface-0)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.35), 0 0 30px ${item.glow || 'rgba(129,140,248,0.08)'}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          background: item.glow || 'rgba(129,140,248,0.08)',
        }}
      >
        {iconNode}
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="text-base font-semibold text-white mb-1 group-hover:text-white transition-colors">
          {item.name}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-subtle)' }}>
          {item.desc}
        </p>
      </div>

      <ArrowRight
        className="relative w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
        style={{ color: 'var(--foreground-muted)' }}
      />
    </Link>
  );
}
