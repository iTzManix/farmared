'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface ClienteRow {
  id_cliente: number;
  nombre: string;
  nit_ci: string;
  telefono: string;
  email: string;
  pais: string;
}

export default function ClientesPage() {
  const [data, setData] = useState<ClienteRow[]>([]);
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

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al guardar');
      sileo.success({ title: 'Éxito', description: 'Cliente registrado exitosamente' });
      setIsModalOpen(false);
      fetchData();
    } catch {
      sileo.error({ title: 'Error', description: 'Error al guardar cliente' });
    }
  };

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof ClienteRow, sortable: true },
    { id: 'nit_ci', header: 'NIT/CI', accessorKey: 'nit_ci' as keyof ClienteRow },
    { id: 'telefono', header: 'Teléfono', accessorKey: 'telefono' as keyof ClienteRow },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof ClienteRow },
    { id: 'pais', header: 'País', accessorKey: 'pais' as keyof ClienteRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Base de clientes registrados</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Cliente">
        <ClienteForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
