import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = '📦' }: EmptyStateProps) {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-5xl mb-4">{icon}</span>
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      </div>
    </Card>
  );
}