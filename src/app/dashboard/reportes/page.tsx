import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';

export default async function ReportesPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (!isSuperAdmin(session)) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-rose-500">Acceso Denegado</h1>
        <p className="text-slate-400">Solo los Super Administradores pueden acceder a los reportes globales.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Reportes Globales</h1>
          <p className="text-slate-400 mt-1">Métricas y estadísticas consolidadas de la red</p>
        </div>
        <Badge variant="info">En Construcción</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Consolidado por Nodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10">
              <span className="text-sm text-slate-400">Gráfico de barras (En desarrollo)</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Medicamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10">
              <span className="text-sm text-slate-400">Heatmap semanal (En desarrollo)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
