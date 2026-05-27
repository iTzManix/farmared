'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { SucursalForm } from '@/components/forms/SucursalForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface SucursalRow {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  pais: string;
}

export default function SucursalesPage() {
  const [data, setData] = useState<SucursalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SucursalRow | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;

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

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    const isEdit = !!editingRow;
    try {
      const res = await fetch('/api/sucursales', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...formData, id_sucursal: editingRow.id_sucursal } : formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Sucursal guardada exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar sucursal' });
    }
  };

  const handleDelete = async (row: SucursalRow) => {
    if (!window.confirm('¿Estás seguro de eliminar esta sucursal?')) return;
    try {
      const res = await fetch(`/api/sucursales?id=${row.id_sucursal}&pais=${row.pais}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      sileo.success({ title: 'Éxito', description: 'Sucursal eliminada' });
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar' });
    }
  };

  const openEdit = (row: SucursalRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const columns: any[] = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof SucursalRow, sortable: true },
    { id: 'ciudad', header: 'Ciudad', accessorKey: 'ciudad' as keyof SucursalRow, sortable: true },
    { id: 'direccion', header: 'Dirección', accessorKey: 'direccion' as keyof SucursalRow },
    { id: 'telefono', header: 'Teléfono', accessorKey: 'telefono' as keyof SucursalRow },
  ];
  
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: SucursalRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sucursales</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Red de farmacias</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => { setEditingRow(null); setIsModalOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Nueva Sucursal
          </Button>
        )}
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        searchKey="nombre"
        rowKey={(row) => `${row.id_sucursal}-${row.pais}`}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? "Editar Sucursal" : "Nueva Sucursal"}>
        <SucursalForm onSubmit={handleSubmit} initial={editingRow || undefined} />
      </Modal>
    </div>
  );
}
