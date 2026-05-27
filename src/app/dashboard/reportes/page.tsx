import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getSession, isSuperAdmin } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';

export default async function ReportesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  if (!isSuperAdmin(session)) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Acceso Denegado</h1>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Solo los Super Administradores pueden acceder a los reportes globales.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reportes Globales</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Métricas y estadísticas consolidadas de la red</p>
        </div>
        <Badge variant="info">En Construcción</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Consolidado por Nodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="h-64 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-sm" style={{ color: 'var(--foreground-subtle)' }}>Gráfico de barras (En desarrollo)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Medicamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="h-64 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-sm" style={{ color: 'var(--foreground-subtle)' }}>Heatmap semanal (En desarrollo)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
