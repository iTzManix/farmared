'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { MedicamentoForm } from '@/components/forms/MedicamentoForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface MedicamentoRow {
  id_medicamento: number;
  nombre: string;
  principio_activo: string;
  presentacion: string;
  categoria: string;
  pais: string;
}

export default function MedicamentosPage() {
  const [data, setData] = useState<MedicamentoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/medicamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Exito', description: 'Medicamento registrado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar medicamento' });
    }
  };

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof MedicamentoRow, sortable: true },
    { id: 'principio_activo', header: 'Principio Activo', accessorKey: 'principio_activo' as keyof MedicamentoRow },
    { id: 'presentacion', header: 'Presentacion', accessorKey: 'presentacion' as keyof MedicamentoRow },
    { id: 'categoria', header: 'Categoria', accessorKey: 'categoria' as keyof MedicamentoRow },
    { id: 'pais', header: 'Pais', accessorKey: 'pais' as keyof MedicamentoRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Medicamentos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Catálogo y gestión de medicamentos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Medicamento
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Medicamento">
        <MedicamentoForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
