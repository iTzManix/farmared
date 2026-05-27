'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';

interface Tasa {
  id_tasa: number;
  moneda_origen: string;
  moneda_destino: string;
  tasa: number;
  pais: string;
}

export default function TasasCambioPage() {
  const [data, setData] = useState<Tasa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tasas-cambio').then(r => r.json()).then(r => { setData(r.data ?? []); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tasas de Cambio</h1>

      {loading ? <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      : <DataTable data={data} columns={[
        { id: 'moneda_origen', header: 'Origen', accessorKey: 'moneda_origen' },
        { id: 'moneda_destino', header: 'Destino', accessorKey: 'moneda_destino' },
        { id: 'tasa', header: 'Tasa', cell: r => Number(r.tasa).toFixed(4) },
        { id: 'pais', header: 'País' },
      ]} />}
    </div>
  );
}