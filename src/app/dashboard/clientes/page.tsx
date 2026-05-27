'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ClienteRow {
  id_cliente: number;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  email: string;
  ciudad?: string;
  direccion?: string;
  pais: string;
}

export default function ClientesPage() {
  const [data, setData] = useState<ClienteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ClienteRow | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;

  const fetchData = async () => {
    try {
      const res = await fetch('/api/clientes?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar los clientes' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    const isEdit = !!editingRow;
    try {
      const res = await fetch('/api/clientes', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...formData, id_cliente: editingRow.id_cliente } : formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Cliente guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar cliente' });
    }
  };

  const handleDelete = async (row: ClienteRow) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      const res = await fetch(`/api/clientes?id=${row.id_cliente}&pais=${row.pais}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      sileo.success({ title: 'Éxito', description: 'Cliente eliminado' });
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar' });
    }
  };

  const openEdit = (row: ClienteRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const columns: any[] = [
    { id: 'nombre', header: 'Nombre', cell: (row: ClienteRow) => `${row.nombre} ${row.apellido ?? ''}`, sortable: true },
    { id: 'ci', header: 'CI', accessorKey: 'ci' as keyof ClienteRow },
    { id: 'telefono', header: 'Teléfono', accessorKey: 'telefono' as keyof ClienteRow },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof ClienteRow },
  ];
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: ClienteRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Base de clientes registrados</p>
        </div>
        <Button onClick={() => { setEditingRow(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        searchKey="nombre"
        rowKey={(row) => `${row.id_cliente}-${row.pais}`}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? "Editar Cliente" : "Nuevo Cliente"}>
        <ClienteForm onSubmit={handleSubmit} initial={editingRow || undefined} />
      </Modal>
    </div>
  );
}
