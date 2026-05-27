'use client';

import { Card } from '@/components/ui/Card';
import { Badge, getBadgeVariantForPais } from '@/components/ui/Badge';

interface PrecioData {
  pais: string;
  medicamentos: Array<{ nombre: string; principio_activo: string }>;
}

export function ComparativaPrecios({ data }: { data: PrecioData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Comparativa de Precios</h3>
      <div className="space-y-4">
        {data.map(d => (
          <div key={d.pais} className="flex items-center gap-2">
            <Badge variant={getBadgeVariantForPais(d.pais as any)}>{d.pais}</Badge>
            <span className="text-sm">{d.medicamentos.length} medicamentos</span>
          </div>
        ))}
      </div>
    </Card>
  );
}