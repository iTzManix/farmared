'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', hideCloseButton = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#020617]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4`}
        style={{
          background: 'var(--surface-1)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(28px)',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-7 py-5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all"
                style={{ color: 'var(--foreground-subtle)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--foreground-subtle)';
                }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-7 pb-7">{children}</div>
      </div>
    </div>
  );
}
