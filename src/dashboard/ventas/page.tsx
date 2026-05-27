'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

interface Venta {
  id_venta: string;
  monto_total: number;
  moneda: string;
  fecha_local: string;
  pais: string;
}

export default function VentasPage() {
  const [data, setData] = useState<Venta[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ventas?page=${page}&pageSize=20`).then(r => r.json()).then(r => { setData(r.data ?? []); setTotal(r.total ?? 0); }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
        <Button>+ Nueva</Button>
      </div>

      {loading ? <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      : data.length === 0 ? <EmptyState title="Sin ventas" />
      : <DataTable data={data} columns={[
        { id: 'id_venta', header: 'ID', accessorKey: 'id_venta' },
        { id: 'monto_total', header: 'Monto', cell: r => `$${Number(r.monto_total).toFixed(2)}` },
        { id: 'moneda', header: 'Moneda', cell: r => <Badge>{r.moneda}</Badge> },
        { id: 'fecha_local', header: 'Fecha', accessorKey: 'fecha_local' },
        { id: 'pais', header: 'País' },
      ]} itemsPerPage={20} />}
    </div>
  );
}