'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface VentaData {
  id_cliente: number;
  id_empleado: number;
  monto_total: number;
  moneda: string;
  pais: string;
}

export function VentaForm({
  onSubmit,
}: {
  onSubmit: (data: VentaData) => Promise<void>;
}) {
  const [form, setForm] = useState<VentaData>({
    id_cliente: 0,
    id_empleado: 0,
    monto_total: 0,
    moneda: '',
    pais: '',
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
        <Input label="ID Cliente" type="number" value={String(form.id_cliente)} onChange={e => setForm(s => ({ ...s, id_cliente: Number(e.target.value) }))} required />
        <Input label="ID Empleado" type="number" value={String(form.id_empleado)} onChange={e => setForm(s => ({ ...s, id_empleado: Number(e.target.value) }))} required />
        <Input label="Monto Total" type="number" step="0.01" value={String(form.monto_total)} onChange={e => setForm(s => ({ ...s, monto_total: Number(e.target.value) }))} required />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}