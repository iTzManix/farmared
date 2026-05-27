'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { sileo } from 'sileo';
import { SucursalTable } from '@/types/database';

export default function SucursalesPage() {
  const [data, setData] = useState<SucursalTable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sucursales?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar las sucursales' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof SucursalTable, sortable: true },
    { id: 'pais', header: 'Pais', accessorKey: 'pais' as keyof SucursalTable },
    { id: 'ciudad', header: 'Ciudad', accessorKey: 'ciudad' as keyof SucursalTable },
    { id: 'direccion', header: 'Direccion', accessorKey: 'direccion' as keyof SucursalTable },
    { id: 'estado', header: 'Estado', accessorKey: 'estado' as keyof SucursalTable },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Sucursales</h1>
          <p className="text-slate-400 mt-2">Red de puntos de venta</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-0">
          <div className="p-6">
            <DataTable
              data={data}
              columns={columns}
              searchKey="nombre"
              isLoading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
