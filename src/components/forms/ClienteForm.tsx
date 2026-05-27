'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface ClienteData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  pais: string;
}

export function ClienteForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<ClienteData>;
  onSubmit: (data: ClienteData) => Promise<void>;
}) {
  const [form, setForm] = useState<ClienteData>({
    nombre: initial?.nombre ?? '',
    apellido: initial?.apellido ?? '',
    email: initial?.email ?? '',
    telefono: initial?.telefono ?? '',
    direccion: initial?.direccion ?? '',
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
        <Input label="Nombre" value={form.nombre} onChange={e => setForm(s => ({ ...s, nombre: e.target.value }))} required />
        <Input label="Apellido" value={form.apellido} onChange={e => setForm(s => ({ ...s, apellido: e.target.value }))} required />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} required />
        <Input label="Teléfono" value={form.telefono} onChange={e => setForm(s => ({ ...s, telefono: e.target.value }))} />
        <Input label="Dirección" value={form.direccion} onChange={e => setForm(s => ({ ...s, direccion: e.target.value }))} />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}