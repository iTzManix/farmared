'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { MedicamentoForm } from '@/components/forms/MedicamentoForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface MedicamentoRow {
  id_medicamento: number;
  nombre: string;
  principio_activo: string;
  presentacion: string;
  requiere_receta: boolean;
  pais: string;
}

export default function MedicamentosPage() {
  const [data, setData] = useState<MedicamentoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MedicamentoRow | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;

  const fetchData = async () => {
    try {
      const res = await fetch('/api/medicamentos?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar los medicamentos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    const isEdit = !!editingRow;
    try {
      const res = await fetch('/api/medicamentos', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...formData, id_medicamento: editingRow.id_medicamento } : formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Medicamento guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar medicamento' });
    }
  };

  const handleDelete = async (row: MedicamentoRow) => {
    if (!window.confirm('¿Estás seguro de eliminar este medicamento?')) return;
    try {
      const res = await fetch(`/api/medicamentos?id=${row.id_medicamento}&pais=${row.pais}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      sileo.success({ title: 'Éxito', description: 'Medicamento eliminado' });
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar' });
    }
  };

  const openEdit = (row: MedicamentoRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const columns: any[] = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof MedicamentoRow, sortable: true },
    { id: 'principio_activo', header: 'Principio Activo', accessorKey: 'principio_activo' as keyof MedicamentoRow },
    { id: 'presentacion', header: 'Presentacion', accessorKey: 'presentacion' as keyof MedicamentoRow },
    { id: 'requiere_receta', header: 'Receta', cell: (row: MedicamentoRow) => row.requiere_receta ? 'Sí' : 'No' },
  ];
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: MedicamentoRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Medicamentos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Catálogo de fármacos registrados</p>
        </div>
        <Button onClick={() => { setEditingRow(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Medicamento
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        searchKey="nombre"
        rowKey={(row) => `${row.id_medicamento}-${row.pais}`}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? "Editar Medicamento" : "Nuevo Medicamento"}>
        <MedicamentoForm onSubmit={handleSubmit} initial={editingRow || undefined} />
      </Modal>
    </div>
  );
}
