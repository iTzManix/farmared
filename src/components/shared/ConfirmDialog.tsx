'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  danger: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-sky-500',
};

const bgColorMap = {
  danger: 'bg-red-50',
  warning: 'bg-amber-50',
  info: 'bg-sky-50',
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
        <div className={cn('mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4', bgColorMap[type])}>
          <Icon className={cn('h-6 w-6', colorMap[type])} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'default'}
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
