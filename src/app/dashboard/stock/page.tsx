'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { StockForm } from '@/components/forms/StockForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface StockRow {
  id_stock: number;
  id_medicamento: number;
  id_sucursal: number;
  cantidad: number;
  stock_minimo: number;
  nombre_medicamento?: string;
  nombre_sucursal?: string;
  pais: string;
}

export default function StockPage() {
  const [data, setData] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Stock registrado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar stock' });
    }
  };

  const columns = [
    { id: 'nombre_medicamento', header: 'Medicamento', accessorKey: 'nombre_medicamento' as keyof StockRow },
    { id: 'nombre_sucursal', header: 'Sucursal', accessorKey: 'nombre_sucursal' as keyof StockRow },
    { id: 'cantidad', header: 'Cantidad', accessorKey: 'cantidad' as keyof StockRow, sortable: true },
    { id: 'stock_minimo', header: 'Stock Mínimo', accessorKey: 'stock_minimo' as keyof StockRow },
    { id: 'pais', header: 'País', accessorKey: 'pais' as keyof StockRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Stock</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Inventario por sucursal</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Stock
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre_medicamento"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Stock">
        <StockForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
