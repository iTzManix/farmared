'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface StockData {
  id_sucursal: number;
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
    id_sucursal: initial?.id_sucursal ?? 0,
    id_medicamento: initial?.id_medicamento ?? 0,
    cantidad_disponible: initial?.cantidad_disponible ?? 0,
    precio_local: initial?.precio_local ?? 0,
    moneda: initial?.moneda ?? '',
    pais: initial?.pais ?? '',
  });
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;
  const [loading, setLoading] = useState(false);

  const [sucursales, setSucursales] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sucursales?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        setSucursales(d.data.filter((s: any) => isSuperAdmin ? true : s.pais === userPais));
      }
    }).catch(console.error);

    fetch('/api/medicamentos?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        setMedicamentos(d.data.filter((m: any) => isSuperAdmin ? true : m.pais === userPais));
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
        <Select label="Sucursal" value={String(form.id_sucursal)} onChange={v => setForm(s => ({ ...s, id_sucursal: Number(v) }))} options={sucursales.map(s => ({ value: String(s.id_sucursal), label: `${s.nombre} (${s.ciudad})` }))} />
        <Select label="Medicamento" value={String(form.id_medicamento)} onChange={v => setForm(s => ({ ...s, id_medicamento: Number(v) }))} options={medicamentos.map(m => ({ value: String(m.id_medicamento), label: m.nombre }))} />
        <Input label="Cantidad" type="number" value={String(form.cantidad_disponible)} onChange={e => setForm(s => ({ ...s, cantidad_disponible: Number(e.target.value) }))} required />
        <Input label="Precio" type="number" step="0.01" value={String(form.precio_local)} onChange={e => setForm(s => ({ ...s, precio_local: Number(e.target.value) }))} required />
        <Select label="Moneda" value={form.moneda} onChange={v => setForm(s => ({ ...s, moneda: v }))} options={[{value:'BOB',label:'BOB'},{value:'PEN',label:'PEN'},{value:'CLP',label:'CLP'}]} />
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