'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface VentaData {
  id_sucursal: number;
  id_cliente: number;
  id_empleado: number;
  id_medicamento: number;
  cantidad: number;
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
    id_sucursal: 0,
    id_cliente: 0,
    id_empleado: 0,
    id_medicamento: 0,
    cantidad: 1,
    monto_total: 0,
    moneda: '',
    pais: '',
  });
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.rol === 'superadmin';
  const userPais = session?.user?.pais;
  const [loading, setLoading] = useState(false);

  const [sucursales, setSucursales] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sucursales?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const arr = d.data.filter((s: any) => isSuperAdmin ? true : s.pais === userPais);
        setSucursales(arr);
        if (arr.length > 0) setForm(s => ({ ...s, id_sucursal: arr[0].id_sucursal }));
      }
    }).catch(console.error);

    fetch('/api/clientes?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const arr = d.data.filter((c: any) => isSuperAdmin ? true : c.pais === userPais);
        setClientes(arr);
        if (arr.length > 0) setForm(s => ({ ...s, id_cliente: arr[0].id_cliente }));
      }
    }).catch(console.error);

    fetch('/api/empleados?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const arr = d.data.filter((e: any) => isSuperAdmin ? true : e.pais === userPais);
        setEmpleados(arr);
        if (arr.length > 0) setForm(s => ({ ...s, id_empleado: arr[0].id_empleado }));
      }
    }).catch(console.error);

    fetch('/api/medicamentos?pageSize=100').then(r => r.json()).then(d => {
      if (d.data) {
        const arr = d.data.filter((m: any) => isSuperAdmin ? true : m.pais === userPais);
        setMedicamentos(arr);
        if (arr.length > 0) setForm(s => ({ ...s, id_medicamento: arr[0].id_medicamento }));
      }
    }).catch(console.error);
    
    setForm(s => ({ ...s, moneda: userPais === 'CL' ? 'CLP' : userPais === 'PE' ? 'PEN' : 'BOB' }));
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
        <Select label="Cliente" value={String(form.id_cliente)} onChange={v => setForm(s => ({ ...s, id_cliente: Number(v) }))} options={clientes.map(c => ({ value: String(c.id_cliente), label: `${c.nombre} ${c.apellido ?? ''}` }))} />
        <Select label="Empleado" value={String(form.id_empleado)} onChange={v => setForm(s => ({ ...s, id_empleado: Number(v) }))} options={empleados.map(e => ({ value: String(e.id_empleado), label: `${e.nombre} ${e.apellido ?? ''}` }))} />
        <Select label="Medicamento" value={String(form.id_medicamento)} onChange={v => setForm(s => ({ ...s, id_medicamento: Number(v) }))} options={medicamentos.map(m => ({ value: String(m.id_medicamento), label: m.nombre }))} />
        <Input label="Cantidad" type="number" value={String(form.cantidad)} onChange={e => setForm(s => ({ ...s, cantidad: Number(e.target.value) }))} required />
        <Input label="Monto Total" type="number" step="0.01" value={String(form.monto_total)} onChange={e => setForm(s => ({ ...s, monto_total: Number(e.target.value) }))} required />
        <Select label="Moneda" value={form.moneda} onChange={v => setForm(s => ({ ...s, moneda: v }))} options={[{value:'BOB',label:'BOB'},{value:'PEN',label:'PEN'},{value:'CLP',label:'CLP'}]} />
        {isSuperAdmin && (
          <Select label="País Destino" value={form.pais} onChange={v => setForm(s => ({ ...s, pais: v }))} options={[{value:'BO',label:'Bolivia'},{value:'PE',label:'Perú'},{value:'CL',label:'Chile'}]} />
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
}