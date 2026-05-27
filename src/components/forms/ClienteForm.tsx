'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ClienteData {
  nombre: string;
  apellido: string;
  ci: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
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
    ci: initial?.ci ?? '',
    email: initial?.email ?? '',
    telefono: initial?.telefono ?? '',
    direccion: initial?.direccion ?? '',
    ciudad: initial?.ciudad ?? '',
    pais: initial?.pais ?? '',
  });
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;
  const [loading, setLoading] = useState(false);

  const [ciudades, setCiudades] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/sucursales?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const filtered = d.data.filter((s: any) => isSuperAdmin ? true : s.pais === userPais);
        const uniqueCities = Array.from(new Set(filtered.map((s: any) => s.ciudad))) as string[];
        setCiudades(uniqueCities);
      }
    }).catch(console.error);
  }, [isSuperAdmin, userPais]);

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
        <Input label="CI / Carnet" value={form.ci} onChange={e => setForm(s => ({ ...s, ci: e.target.value }))} required />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} required />
        <Input label="Teléfono" value={form.telefono} onChange={e => setForm(s => ({ ...s, telefono: e.target.value }))} />
        <Input label="Dirección" value={form.direccion} onChange={e => setForm(s => ({ ...s, direccion: e.target.value }))} />
        <Select label="Ciudad" value={form.ciudad} onChange={v => setForm(s => ({ ...s, ciudad: v }))} options={ciudades.map(c => ({ value: c, label: c }))} />
        {isSuperAdmin && (
          <Select label="País Destino" value={form.pais} onChange={v => setForm(s => ({ ...s, pais: v }))} options={[{value:'BO',label:'Bolivia'},{value:'PE',label:'Perú'},{value:'CL',label:'Chile'}]} />
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}