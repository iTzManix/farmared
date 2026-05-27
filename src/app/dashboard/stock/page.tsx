'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { StockForm } from '@/components/forms/StockForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';
import { StockTable } from '@/types/database';

export default function StockPage() {
  const [data, setData] = useState<StockTable[]>([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Exito', description: 'Stock guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar stock' });
    }
  };

  const columns = [
    { id: 'id_sucursal', header: 'ID Sucursal', accessorKey: 'id_sucursal' as keyof StockTable },
    { id: 'id_medicamento', header: 'ID Medicamento', accessorKey: 'id_medicamento' as keyof StockTable },
    { id: 'cantidad_disponible', header: 'Cantidad', accessorKey: 'cantidad_disponible' as keyof StockTable, sortable: true },
    { id: 'precio_local', header: 'Precio Unitario', accessorKey: 'precio_local' as keyof StockTable },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Stock</h1>
          <p className="text-slate-400 mt-2">Inventario disponible en sucursales</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajustar Stock
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-0">
          <div className="p-6">
            <DataTable
              data={data}
              columns={columns}
              searchKey="id_medicamento"
              isLoading={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajuste de Stock">
        <StockForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
