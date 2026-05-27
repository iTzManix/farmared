'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNodeHealth } from '@/lib/hooks/useNodeHealth';
import { NodeStatusIndicator } from '@/components/layout/NodeStatusIndicator';
import type { Pais } from '@/types/database';

export default function ConfiguracionPage() {
  const health = useNodeHealth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Estado de Nodos</h2>
        <div className="space-y-3">
          {health.map(h => (
            <NodeStatusIndicator 
              key={h.node} 
              status={{ 
                pais: h.node as Pais, 
                healthy: h.status === 'online', 
                latencyMs: h.latency 
              }} 
            />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Acerca de</h2>
        <p className="text-sm text-gray-500">Farmared v0.1.0 — Sistema distribuido de farmacias</p>
      </Card>
    </div>
  );
}