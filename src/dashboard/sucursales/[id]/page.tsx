'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

interface Sucursal {
  id_sucursal: number;
  nombre: string;
  direccion: string;
}

export default function SucursalDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Sucursal | null>(null);

  useEffect(() => {
    fetch(`/api/sucursales/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{item.nombre}</h1>
      <Card className="p-6">
        <p className="text-sm text-gray-500">Dirección: {item.direccion}</p>
      </Card>
    </div>
  );
}