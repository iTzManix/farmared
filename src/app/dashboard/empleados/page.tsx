'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { EmpleadoForm } from '@/components/forms/EmpleadoForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';
import { EmpleadoTable } from '@/types/database';

export default function EmpleadosPage() {
  const [data, setData] = useState<EmpleadoTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/empleados?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar los empleados' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Exito', description: 'Empleado guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar empleado' });
    }
  };

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof EmpleadoTable, sortable: true },
    { id: 'apellido', header: 'Apellido', accessorKey: 'apellido' as keyof EmpleadoTable },
    { id: 'rol', header: 'Rol', accessorKey: 'rol' as keyof EmpleadoTable },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof EmpleadoTable },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Empleados</h1>
          <p className="text-slate-400 mt-2">Gestion del personal de sucursales</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Empleado
        </Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Empleado">
        <EmpleadoForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
