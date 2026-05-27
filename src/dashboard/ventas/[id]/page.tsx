'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

interface Venta {
  id_venta: string;
  monto_total: number;
  moneda: string;
  fecha_local: string;
}

export default function VentaDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Venta | null>(null);

  useEffect(() => {
    fetch(`/api/ventas/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Venta #{id}</h1>
      <Card className="p-6">
        <p className="text-sm text-gray-500">Monto: ${Number(item.monto_total).toFixed(2)}</p>
        <p className="text-sm text-gray-500">Moneda: {item.moneda}</p>
        <p className="text-sm text-gray-500">Fecha: {item.fecha_local}</p>
      </Card>
    </div>
  );
}