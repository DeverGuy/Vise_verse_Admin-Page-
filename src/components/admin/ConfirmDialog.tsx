import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      headerColor: 'error' as const,
      icon: <AlertTriangle size={32} className="text-status-error" />,
      confirmBtn: 'bg-status-error text-white hover:bg-status-error/90 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]'
    },
    warning: {
      headerColor: 'primary' as const,
      icon: <AlertTriangle size={32} className="text-accent-primary" />,
      confirmBtn: 'bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)]'
    },
    info: {
      headerColor: 'tertiary' as const,
      icon: <Info size={32} className="text-accent-tertiary" />,
      confirmBtn: 'bg-accent-tertiary text-black hover:opacity-90 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
    }
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      headerColor={style.headerColor}
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-16 h-16 rounded-full bg-surface-color-light border border-border-color flex items-center justify-center">
          {style.icon}
        </div>

        <p className="text-text-secondary font-body leading-relaxed text-sm md:text-base m-0">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full mt-4 pt-4 border-t border-border-color">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all border border-border-color bg-transparent text-text-secondary hover:text-text-primary hover:border-text-primary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all border-none ${style.confirmBtn} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
