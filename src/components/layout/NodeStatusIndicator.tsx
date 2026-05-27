'use client';

import { Badge } from '@/components/ui/Badge';
import type { Pais } from '@/types/database';

interface NodeStatus {
  pais: Pais;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

interface NodeStatusIndicatorProps {
  status: NodeStatus;
  showLatency?: boolean;
}

const countryNames: Record<Pais, string> = {
  BO: 'Bolivia',
  PE: 'Perú',
  CL: 'Chile',
};

export function NodeStatusIndicator({ status, showLatency = false }: NodeStatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${status.healthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span className="text-sm font-medium text-slate-200">{countryNames[status.pais]}</span>
      {status.healthy ? (
        <>
          <Badge variant="success">Online</Badge>
          {showLatency && status.latencyMs !== undefined && (
            <span className="text-xs text-slate-400">{status.latencyMs}ms</span>
          )}
        </>
      ) : (
        <Badge variant="danger">Offline</Badge>
      )}
    </div>
  );
}

interface AllNodesStatusIndicatorProps {
  statuses: NodeStatus[];
  compact?: boolean;
}

export function AllNodesStatusIndicator({ statuses, compact = false }: AllNodesStatusIndicatorProps) {
  const allOnline = statuses.every((s) => s.healthy);
  const allOffline = statuses.every((s) => !s.healthy);
  const partialOnline = !allOnline && !allOffline;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {statuses.map((s) => (
          <div
            key={s.pais}
            className={`w-2.5 h-2.5 rounded-full ${s.healthy ? 'bg-emerald-400' : 'bg-rose-400'}`}
            title={`${countryNames[s.pais]}: ${s.healthy ? 'Online' : 'Offline'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {allOnline && <Badge variant="success">Todos los nodos online</Badge>}
      {allOffline && <Badge variant="danger">Todos los nodos offline</Badge>}
      {partialOnline && <Badge variant="warning">Algunos nodos offline</Badge>}
    </div>
  );
}
