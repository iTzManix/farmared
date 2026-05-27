'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { EmpleadoForm } from '@/components/forms/EmpleadoForm';

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
}

export default function EmpleadoDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Empleado | null>(null);

  useEffect(() => {
    fetch(`/api/empleados/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{item.nombre} {item.apellido}</h1>
      <EmpleadoForm initial={item} onSubmit={async () => {}} />
    </div>
  );
}