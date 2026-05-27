'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface StockData {
  id_medicamento: number;
  cantidad_disponible: number;
  precio_local: number;
  moneda: string;
  pais: string;
}

export function StockForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<StockData>;
  onSubmit: (data: StockData) => Promise<void>;
}) {
  const [form, setForm] = useState<StockData>({
    id_medicamento: initial?.id_medicamento ?? 0,
    cantidad_disponible: initial?.cantidad_disponible ?? 0,
    precio_local: initial?.precio_local ?? 0,
    moneda: initial?.moneda ?? '',
    pais: initial?.pais ?? '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="ID Medicamento" type="number" value={String(form.id_medicamento)} onChange={e => setForm(s => ({ ...s, id_medicamento: Number(e.target.value) }))} required />
        <Input label="Cantidad" type="number" value={String(form.cantidad_disponible)} onChange={e => setForm(s => ({ ...s, cantidad_disponible: Number(e.target.value) }))} required />
        <Input label="Precio" type="number" step="0.01" value={String(form.precio_local)} onChange={e => setForm(s => ({ ...s, precio_local: Number(e.target.value) }))} required />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}