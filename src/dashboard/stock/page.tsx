'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

interface StockItem {
  id_stock: number;
  id_medicamento: number;
  cantidad_disponible: number;
  precio_local: number;
  moneda: string;
  pais: string;
}

export default function StockPage() {
  const [data, setData] = useState<StockItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stock?page=${page}&pageSize=20`).then(r => r.json()).then(r => { setData(r.data ?? []); setTotal(r.total ?? 0); }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stock</h1>
        <Button>+ Nuevo</Button>
      </div>

      {loading ? <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      : data.length === 0 ? <EmptyState title="Sin stock" />
      : <DataTable data={data} columns={[
        { id: 'id_medicamento', header: 'ID Medicamento', accessorKey: 'id_medicamento' },
        { id: 'cantidad_disponible', header: 'Cantidad', accessorKey: 'cantidad_disponible' },
        { id: 'precio_local', header: 'Precio', cell: r => `$${Number(r.precio_local).toFixed(2)}` },
        { id: 'moneda', header: 'Moneda' },
        { id: 'pais', header: 'País' },
      ]} itemsPerPage={20} />}
    </div>
  );
}