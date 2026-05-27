'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { sileo } from 'sileo';
import { VentaTable } from '@/types/database';

export default function VentasPage() {
  const [data, setData] = useState<VentaTable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/ventas?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar las ventas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { id: 'fecha_local', header: 'Fecha', accessorKey: 'fecha_local' as keyof VentaTable, sortable: true },
    { id: 'id_sucursal', header: 'Sucursal', accessorKey: 'id_sucursal' as keyof VentaTable },
    { id: 'id_cliente', header: 'Cliente', accessorKey: 'id_cliente' as keyof VentaTable },
    { id: 'monto_total', header: 'Total', accessorKey: 'monto_total' as keyof VentaTable },
    { id: 'moneda', header: 'Moneda', accessorKey: 'moneda' as keyof VentaTable },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Ventas</h1>
          <p className="text-slate-400 mt-2">Historial de transacciones de la red</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-0">
          <div className="p-6">
            <DataTable
              data={data}
              columns={columns}
              searchKey="fecha_local"
              isLoading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
