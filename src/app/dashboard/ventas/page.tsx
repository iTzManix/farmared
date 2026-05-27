'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { VentaForm } from '@/components/forms/VentaForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface VentaRow {
  id_venta: number;
  id_cliente: number;
  id_sucursal: number;
  fecha: string;
  total: number;
  moneda: string;
  nombre_cliente?: string;
  nombre_sucursal?: string;
  pais: string;
}

export default function VentasPage() {
  const [data, setData] = useState<VentaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/ventas?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar las ventas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Venta registrada exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar venta' });
    }
  };

  const columns = [
    { id: 'id_venta', header: '#', accessorKey: 'id_venta' as keyof VentaRow },
    { id: 'nombre_cliente', header: 'Cliente', accessorKey: 'nombre_cliente' as keyof VentaRow },
    { id: 'nombre_sucursal', header: 'Sucursal', accessorKey: 'nombre_sucursal' as keyof VentaRow },
    { id: 'fecha', header: 'Fecha', accessorKey: 'fecha' as keyof VentaRow, sortable: true },
    { id: 'total', header: 'Total', accessorKey: 'total' as keyof VentaRow, sortable: true },
    { id: 'moneda', header: 'Moneda', accessorKey: 'moneda' as keyof VentaRow },
    { id: 'pais', header: 'País', accessorKey: 'pais' as keyof VentaRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ventas</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Historial de transacciones</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Venta
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre_cliente"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Venta">
        <VentaForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
