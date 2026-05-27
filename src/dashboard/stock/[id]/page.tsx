'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StockForm } from '@/components/forms/StockForm';

interface StockItem {
  id_stock: number;
  id_medicamento: number;
  cantidad_disponible: number;
  precio_local: number;
  moneda: string;
}

export default function StockDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<StockItem | null>(null);

  useEffect(() => {
    fetch(`/api/stock/${id}`).then(r => r.json()).then(setItem);
  }, [id]);

  if (!item) return <Card><div className="p-8 text-center">Cargando...</div></Card>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Stock #{item.id_medicamento}</h1>
      <StockForm initial={item} onSubmit={async () => {}} />
    </div>
  );
}