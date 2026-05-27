'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { EmpleadoForm } from '@/components/forms/EmpleadoForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface EmpleadoRow {
  id_empleado: number;
  nombre: string;
  cargo: string;
  telefono: string;
  email: string;
  id_sucursal: number;
  nombre_sucursal?: string;
  pais: string;
}

export default function EmpleadosPage() {
  const [data, setData] = useState<EmpleadoRow[]>([]);
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

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Empleado registrado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar empleado' });
    }
  };

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof EmpleadoRow, sortable: true },
    { id: 'cargo', header: 'Cargo', accessorKey: 'cargo' as keyof EmpleadoRow },
    { id: 'telefono', header: 'Teléfono', accessorKey: 'telefono' as keyof EmpleadoRow },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof EmpleadoRow },
    { id: 'nombre_sucursal', header: 'Sucursal', accessorKey: 'nombre_sucursal' as keyof EmpleadoRow },
    { id: 'pais', header: 'País', accessorKey: 'pais' as keyof EmpleadoRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Empleados</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Personal activo por nodo</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Empleado
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Empleado">
        <EmpleadoForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
