import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  headerColor?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  headerColor = 'primary'
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const maxWidthClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[550px]',
    lg: 'max-w-[750px]',
    xl: 'max-w-[950px]'
  };

  const colorClasses = {
    primary: 'text-accent-primary border-accent-primary/40 shadow-[0_0_20px_rgba(251,200,21,0.15)]',
    secondary: 'text-accent-secondary border-accent-secondary/40 shadow-[0_0_20px_rgba(255,0,127,0.15)]',
    tertiary: 'text-accent-tertiary border-accent-tertiary/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
    error: 'text-status-error border-status-error/40 shadow-[0_0_20px_rgba(255,0,127,0.2)]'
  };

  return createPortal(
    <div className="fixed inset-0 bg-[rgba(5,5,8,0.85)] backdrop-blur-md z-[1000] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div
        className={`bg-surface-color border ${colorClasses[headerColor]} rounded-xl w-full ${maxWidthClasses[maxWidth]} relative p-6 md:p-8 m-auto transform translate-y-0`}
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-[rgba(255,255,255,0.05)] border border-border-color text-text-primary w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-status-error hover:border-status-error hover:text-white hover:rotate-90 z-10"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="mb-6 border-b border-border-color pb-4 pr-8">
          <h2 className={`font-heading tracking-[2px] leading-[1.1] uppercase m-0 text-2xl md:text-3xl ${
            headerColor === 'primary' ? 'text-accent-primary' :
            headerColor === 'secondary' ? 'text-accent-secondary' :
            headerColor === 'tertiary' ? 'text-accent-tertiary' : 'text-status-error'
          }`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-text-secondary text-sm font-body m-0 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
