'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { VentaForm } from '@/components/forms/VentaForm';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { useSession } from 'next-auth/react';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface VentaRow {
  id_venta: number;
  id_cliente: number;
  id_sucursal: number;
  id_medicamento: number;
  cantidad: number;
  fecha_local: string;
  monto_total: number;
  moneda: string;
  nombre_cliente?: string;
  nombre_sucursal?: string;
  nombre_medicamento?: string;
  pais: string;
}

export default function VentasPage() {
  const [data, setData] = useState<VentaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';

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

  const columns: any[] = [
    { id: 'id_venta', header: '#', accessorKey: 'id_venta' as keyof VentaRow },
    { id: 'nombre_sucursal', header: 'Sucursal', cell: (row: VentaRow) => row.nombre_sucursal || String(row.id_sucursal) },
    { id: 'nombre_cliente', header: 'Cliente', cell: (row: VentaRow) => row.nombre_cliente || String(row.id_cliente) },
    { id: 'nombre_medicamento', header: 'Medicamento', cell: (row: VentaRow) => row.nombre_medicamento || String(row.id_medicamento) },
    { id: 'cantidad', header: 'Cantidad', accessorKey: 'cantidad' as keyof VentaRow, sortable: true },
    { id: 'total', header: 'Total', cell: (row: VentaRow) => `${row.monto_total} ${row.moneda}`, sortable: true },
    { id: 'fecha_local', header: 'Fecha', cell: (row: VentaRow) => new Date(row.fecha_local).toLocaleDateString() },
  ];
  if (isSuperAdmin) {
    columns.push({ id: 'pais', header: 'País', cell: (row: VentaRow) => <CountryFlag pais={row.pais as any} showBadge /> });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Ventas</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Historial de transacciones</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Registrar Venta
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={loading}
        rowKey={(row) => `${row.id_venta}-${row.pais}`}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Venta">
        <VentaForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
