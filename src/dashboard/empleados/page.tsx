'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  pais: string;
}

export default function EmpleadosPage() {
  const [data, setData] = useState<Empleado[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/empleados?page=${page}&pageSize=20`).then(r => r.json()).then(r => { setData(r.data ?? []); setTotal(r.total ?? 0); }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
        <Button>+ Nuevo</Button>
      </div>

      {loading ? <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      : data.length === 0 ? <EmptyState title="Sin empleados" />
      : <DataTable data={data} columns={[
        { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' },
        { id: 'apellido', header: 'Apellido', accessorKey: 'apellido' },
        { id: 'email', header: 'Email', accessorKey: 'email' },
        { id: 'rol', header: 'Rol', cell: r => <Badge>{r.rol}</Badge> },
        { id: 'pais', header: 'País' },
      ]} itemsPerPage={20} />}
    </div>
  );
}