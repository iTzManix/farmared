'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Info } from 'lucide-react';

export type ConfirmDialogType = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const iconMap = {
  danger: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  danger: 'text-rose-300',
  warning: 'text-amber-300',
  info: 'text-cyan-300',
};

const bgColorMap = {
  danger: 'bg-rose-500/8',
  warning: 'bg-amber-500/8',
  info: 'bg-cyan-500/8',
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}: ConfirmDialogProps) {
  const Icon = iconMap[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center pt-2">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${bgColorMap[type]} mb-4`}>
          <Icon className={`h-6 w-6 ${colorMap[type]}`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>{message}</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'destructive' : 'primary'}
            onClick={() => { onConfirm(); }}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
