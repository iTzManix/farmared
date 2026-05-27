'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { StockForm } from '@/components/forms/StockForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface StockRow {
  id_stock: number;
  id_sucursal: number;
  id_medicamento: number;
  cantidad_disponible: number;
  precio_local: number;
  moneda: string;
  pais: string;
  nombre_sucursal?: string;
  nombre_medicamento?: string;
}

export default function StockPage() {
  const [data, setData] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StockRow | null>(null);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;

  const fetchData = async () => {
    try {
      const res = await fetch('/api/stock?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo cargar el stock' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    const isEdit = !!editingRow;
    try {
      const res = await fetch('/api/stock', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...formData, id_stock: editingRow.id_stock } : formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Stock guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar stock' });
    }
  };

  const handleDelete = async (row: StockRow) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de stock?')) return;
    try {
      const res = await fetch(`/api/stock?id=${row.id_stock}&pais=${row.pais}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      sileo.success({ title: 'Éxito', description: 'Registro eliminado' });
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar' });
    }
  };

  const openEdit = (row: StockRow) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const columns: any[] = [
    { id: 'id_stock', header: '#', accessorKey: 'id_stock' as keyof StockRow },
    { id: 'nombre_sucursal', header: 'Sucursal', cell: (row: StockRow) => row.nombre_sucursal || String(row.id_sucursal) },
    { id: 'nombre_medicamento', header: 'Medicamento', cell: (row: StockRow) => row.nombre_medicamento || String(row.id_medicamento) },
    { id: 'cantidad', header: 'Cantidad', accessorKey: 'cantidad_disponible' as keyof StockRow, sortable: true },
    { id: 'precio', header: 'Precio', cell: (row: StockRow) => `${row.precio_local} ${row.moneda}`, sortable: true },
  ];
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: StockRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Stock</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Inventario por sucursal</p>
        </div>
        <Button onClick={() => { setEditingRow(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Stock
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        rowKey={(row) => `${row.id_stock}-${row.pais}`}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRow ? "Editar Stock" : "Nuevo Stock"}>
        <StockForm onSubmit={handleSubmit} initial={editingRow || undefined} />
      </Modal>
    </div>
  );
}
