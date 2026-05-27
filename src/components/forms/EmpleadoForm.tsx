'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface EmpleadoData {
  id_sucursal: number;
  nombre: string;
  apellido: string;
  email: string;
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
    id_sucursal: initial?.id_sucursal ?? 0,
    nombre: initial?.nombre ?? '',
    apellido: initial?.apellido ?? '',
    email: initial?.email ?? '',
    rol: initial?.rol ?? '',
    pais: initial?.pais ?? '',
  });
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;
  const [loading, setLoading] = useState(false);
  
  const [sucursales, setSucursales] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/sucursales?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const arr = d.data.filter((s: any) => isSuperAdmin ? true : s.pais === userPais);
        setSucursales(arr);
        if (arr.length > 0 && !initial?.id_sucursal) {
          setForm(s => ({ ...s, id_sucursal: arr[0].id_sucursal }));
        }
      }
    }).catch(console.error);
  }, [isSuperAdmin, userPais, initial]);

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
        <Select label="Sucursal" value={String(form.id_sucursal)} onChange={v => setForm(s => ({ ...s, id_sucursal: Number(v) }))} options={sucursales.map(s => ({ value: String(s.id_sucursal), label: `${s.nombre} (${s.ciudad})` }))} />
        <Input label="Nombre" value={form.nombre} onChange={e => setForm(s => ({ ...s, nombre: e.target.value }))} required />
        <Input label="Apellido" value={form.apellido} onChange={e => setForm(s => ({ ...s, apellido: e.target.value }))} required />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} required />
        <Select label="Rol" value={form.rol} onChange={v => setForm(s => ({ ...s, rol: v }))} options={[{value:'Administrador',label:'Administrador'},{value:'Vendedor',label:'Vendedor'},{value:'Farmacéutico',label:'Farmacéutico'},{value:'Almacenero',label:'Almacenero'}]} />
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