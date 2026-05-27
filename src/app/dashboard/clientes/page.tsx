'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';
import { ClienteTable } from '@/types/database';

export default function ClientesPage() {
  const [data, setData] = useState<ClienteTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Exito', description: 'Cliente guardado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar cliente' });
    }
  };

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof ClienteTable, sortable: true },
    { id: 'apellido', header: 'Apellido', accessorKey: 'apellido' as keyof ClienteTable },
    { id: 'ci', header: 'Documento', accessorKey: 'ci' as keyof ClienteTable },
    { id: 'telefono', header: 'Telefono', accessorKey: 'telefono' as keyof ClienteTable },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof ClienteTable },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Clientes</h1>
          <p className="text-slate-400 mt-2">Base de datos de clientes recurrentes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Cliente">
        <ClienteForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
