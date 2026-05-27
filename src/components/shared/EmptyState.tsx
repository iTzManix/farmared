'use client';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl"
      style={{
        background: 'var(--surface-0)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {icon && (
        <div className="mb-5" style={{ color: 'var(--foreground-subtle)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      {description && (
        <p className="text-sm mb-6" style={{ color: 'var(--foreground-subtle)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
