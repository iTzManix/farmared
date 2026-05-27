'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { EmpleadoForm } from '@/components/forms/EmpleadoForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface EmpleadoRow {
  id_empleado: number;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
  id_sucursal: number;
  nombre_sucursal?: string;
  pais: string;
}

export default function EmpleadosPage() {
  const [data, setData] = useState<EmpleadoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<EmpleadoRow | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;

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
    const isEdit = !!editingRow;
    try {
      const res = await fetch('/api/empleados', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...formData, id_empleado: editingRow.id_empleado } : formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Empleado guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar empleado' });
    }
  };

  const handleDelete = async (row: EmpleadoRow) => {
    if (!window.confirm('¿Estás seguro de eliminar este empleado?')) return;
    try {
      const res = await fetch(`/api/empleados?id=${row.id_empleado}&pais=${row.pais}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      sileo.success({ title: 'Éxito', description: 'Empleado eliminado' });
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar' });
    }
  };

  const openEdit = (row: EmpleadoRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const columns: any[] = [
    { id: 'nombre', header: 'Nombre', cell: (row: EmpleadoRow) => `${row.nombre} ${row.apellido ?? ''}`, sortable: true },
    { id: 'rol', header: 'Rol', accessorKey: 'rol' as keyof EmpleadoRow },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof EmpleadoRow },
    { id: 'nombre_sucursal', header: 'Sucursal', cell: (row: EmpleadoRow) => row.nombre_sucursal || String(row.id_sucursal) },
  ];
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: EmpleadoRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Empleados</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Personal de la red</p>
        </div>
        <Button onClick={() => { setEditingRow(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Empleado
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        searchKey="nombre"
        rowKey={(row) => `${row.id_empleado}-${row.pais}`}
        actions={(row) => {
          const canEdit = isSuperAdmin || row.pais === userPais;
          if (!canEdit) return null;
          return (
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => openEdit(row)}><Edit2 className="w-4 h-4 text-sky-400"/></Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}><Trash2 className="w-4 h-4 text-red-400"/></Button>
            </div>
          );
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? "Editar Empleado" : "Nuevo Empleado"}>
        <EmpleadoForm onSubmit={handleSubmit} initial={editingRow || undefined} />
      </Modal>
    </div>
  );
}
