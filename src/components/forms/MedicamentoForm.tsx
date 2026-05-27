'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface MedicamentoData {
  nombre: string;
  principio_activo: string;
  presentacion: string;
  concentracion: string;
  laboratorio: string;
  pais: string;
}

export function MedicamentoForm({
  initial,
  onSubmit,
  pais,
}: {
  initial?: Partial<MedicamentoData>;
  onSubmit: (data: MedicamentoData) => Promise<void>;
  pais?: string;
}) {
  const [form, setForm] = useState<MedicamentoData>({
    nombre: initial?.nombre ?? '',
    principio_activo: initial?.principio_activo ?? '',
    presentacion: initial?.presentacion ?? '',
    concentracion: initial?.concentracion ?? '',
    laboratorio: initial?.laboratorio ?? '',
    pais: initial?.pais ?? pais ?? '',
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
        <Input label="Nombre" value={form.nombre} onChange={e => setForm(s => ({ ...s, nombre: e.target.value }))} required />
        <Input label="Principio Activo" value={form.principio_activo} onChange={e => setForm(s => ({ ...s, principio_activo: e.target.value }))} required />
        <Select label="Presentación" value={form.presentacion} onChange={v => setForm(s => ({ ...s, presentacion: v }))} options={[{value:'Tabletas',label:'Tabletas'},{value:'Cápsulas',label:'Cápsulas'},{value:'Jarabe',label:'Jarabe'},{value:'Inyectable',label:'Inyectable'},{value:'Crema',label:'Crema'},{value:'Gotas',label:'Gotas'},{value:'Solución',label:'Solución'},{value:'Polvo',label:'Polvo'}]} />
        <Input label="Concentración" value={form.concentracion} onChange={e => setForm(s => ({ ...s, concentracion: e.target.value }))} />
        <Input label="Laboratorio" value={form.laboratorio} onChange={e => setForm(s => ({ ...s, laboratorio: e.target.value }))} />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}