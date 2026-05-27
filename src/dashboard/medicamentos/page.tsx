'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Badge, getBadgeVariantForPais } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { MedicamentoForm } from '@/components/forms/MedicamentoForm';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Medicamento {
  id_medicamento: number;
  nombre: string;
  principio_activo: string;
  presentacion: string;
  concentracion: string;
  laboratorio: string;
  pais: string;
}

export default function MedicamentosPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<Medicamento[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Medicamento | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await fetch(`/api/medicamentos?${params}`);
      const json = await res.json();
      setData(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar?')) return;
    await fetch(`/api/medicamentos/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
        <Button onClick={() => { setEditItem(null); setModalOpen(true); }}>+ Nuevo</Button>
      </div>

      {loading ? (
        <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>
      ) : data.length === 0 ? (
        <EmptyState title="Sin medicamentos" description="Agrega el primero usando + Nuevo" />
      ) : (
        <DataTable
          data={data}
          columns={[
            { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' },
            { id: 'principio_activo', header: 'Principio Activo', accessorKey: 'principio_activo' },
            { id: 'presentacion', header: 'Presentación', accessorKey: 'presentacion' },
            { id: 'concentracion', header: 'Concentración', accessorKey: 'concentracion' },
            { id: 'laboratorio', header: 'Laboratorio', accessorKey: 'laboratorio' },
            { id: 'pais', header: 'País', cell: (r) => <Badge variant={getBadgeVariantForPais(r.pais as any)}>{r.pais}</Badge> },
          ]}
          itemsPerPage={20}
          actions={(row) => (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditItem(row as any); setModalOpen(true); }}>Editar</Button>
              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete((row as any).id_medicamento)}>Eliminar</Button>
            </div>
          )}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Editar' : 'Nuevo'}>
        <MedicamentoForm
          initial={editItem ?? undefined}
          onSubmit={async (formData) => {
            const method = editItem ? 'PUT' : 'POST';
            await fetch('/api/medicamentos', { method, body: JSON.stringify({ ...formData, id: editItem?.id_medicamento }) });
            setModalOpen(false);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
}