'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Medicamentos</h1>
          <p className="text-slate-400 mt-2">Catalogo y gestion de medicamentos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Medicamento
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-0">
          <div className="p-6">
            <DataTable
              data={data}
              columns={columns}
              searchKey="nombre"
              isLoading={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Medicamento">
        <MedicamentoForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
