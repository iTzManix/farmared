'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MedicamentoForm } from '@/components/forms/MedicamentoForm';

interface Medicamento {
  id_medicamento: number;
  nombre: string;
  principio_activo: string;
  presentacion: string;
  concentracion: string;
  laboratorio: string;
}

export default function MedicamentoDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Medicamento | null>(null);

  useEffect(() => {
    fetch(`/api/medicamentos/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center text-gray-500">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{item.nombre}</h1>
      <MedicamentoForm
        initial={item}
        onSubmit={async () => {
          // Actualización
        }}
      />
      <div className="flex gap-4">
        <Button>Volver</Button>
      </div>
    </div>
  );
}