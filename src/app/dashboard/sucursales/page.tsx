'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/shared/DataTable';
import { sileo } from 'sileo';
import { Plus } from 'lucide-react';

interface SucursalRow {
  id_sucursal: number;
  nombre: string;
  direccion: string;
  telefono: string;
  pais: string;
}

export default function SucursalesPage() {
  const [data, setData] = useState<SucursalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sucursales?pageSize=100');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudieron cargar las sucursales' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { id: 'nombre', header: 'Nombre', accessorKey: 'nombre' as keyof SucursalRow, sortable: true },
    { id: 'direccion', header: 'Dirección', accessorKey: 'direccion' as keyof SucursalRow },
    { id: 'telefono', header: 'Teléfono', accessorKey: 'telefono' as keyof SucursalRow },
    { id: 'pais', header: 'País', accessorKey: 'pais' as keyof SucursalRow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sucursales</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Red de farmacias activas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Sucursal
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="nombre"
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Sucursal">
        <div className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
          Formulario de sucursal pendiente de implementar.
        </div>
      </Modal>
    </div>
  );
}
