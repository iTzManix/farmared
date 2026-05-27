'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ClienteForm } from '@/components/forms/ClienteForm';

interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  email: string;
}

export default function ClienteDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Cliente | null>(null);

  useEffect(() => {
    fetch(`/api/clientes/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{item.nombre} {item.apellido}</h1>
      <ClienteForm initial={item} onSubmit={async () => {}} />
    </div>
  );
}