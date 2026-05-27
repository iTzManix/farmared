'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

interface EmpleadoData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  pais: string;
}

export function EmpleadoForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<EmpleadoData>;
  onSubmit: (data: EmpleadoData) => Promise<void>;
}) {
  const [form, setForm] = useState<EmpleadoData>({
    nombre: initial?.nombre ?? '',
    apellido: initial?.apellido ?? '',
    email: initial?.email ?? '',
    telefono: initial?.telefono ?? '',
    rol: initial?.rol ?? '',
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
        <Select label="Rol" value={form.rol} onChange={v => setForm(s => ({ ...s, rol: v }))} options={[{value:'Administrador',label:'Administrador'},{value:'Vendedor',label:'Vendedor'},{value:'Farmacéutico',label:'Farmacéutico'},{value:'Almacenero',label:'Almacenero'}]} />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}