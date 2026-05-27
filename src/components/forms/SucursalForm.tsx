'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SucursalData {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  pais: string;
}

export function SucursalForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<SucursalData>;
  onSubmit: (data: SucursalData) => Promise<void>;
}) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';

  const [form, setForm] = useState<SucursalData>({
    nombre: initial?.nombre ?? '',
    direccion: initial?.direccion ?? '',
    ciudad: initial?.ciudad ?? '',
    telefono: initial?.telefono ?? '',
    pais: initial?.pais ?? (isSuperAdmin ? 'BO' : (session?.user?.pais ?? 'BO')),
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
        <Input label="Dirección" value={form.direccion} onChange={e => setForm(s => ({ ...s, direccion: e.target.value }))} required />
        <Input label="Ciudad" value={form.ciudad} onChange={e => setForm(s => ({ ...s, ciudad: e.target.value }))} required />
        <Input label="Teléfono" value={form.telefono} onChange={e => setForm(s => ({ ...s, telefono: e.target.value }))} />
        
        {isSuperAdmin && (
          <Select 
            label="País (Nodo)" 
            value={form.pais} 
            onChange={v => setForm(s => ({ ...s, pais: v }))} 
            options={[{value:'BO',label:'Bolivia'},{value:'PE',label:'Perú'},{value:'CL',label:'Chile'}]} 
          />
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
