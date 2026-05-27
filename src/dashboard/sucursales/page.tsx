'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

interface Sucursal {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  pais: string;
}

export default function SucursalesPage() {
  const [data, setData] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/sucursales').then(r => r.json()).then(r => { setData(r.data ?? []); }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>

      {loading ? <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      : data.length === 0 ? <EmptyState title="Sin sucursales" />
      : <DataTable data={data} columns={[
        { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' },
        { id: 'direccion', header: 'Dirección', accessorKey: 'direccion' },
        { id: 'pais', header: 'País' },
      ]} />}
    </div>
  );
}