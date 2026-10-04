import React from 'react';
import { Loader2, FolderOpen, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Accessing Vice Verse Terminal Data...', className = '' }: LoadingStateProps) {
  return (
    <div className={`glass-panel p-12 flex flex-col items-center justify-center text-center gap-4 my-4 animate-fade-in ${className}`}>
      <div className="relative">
        <Loader2 size={40} className="text-accent-secondary animate-spin" />
        <div className="absolute inset-0 rounded-full border border-accent-primary animate-ping opacity-30"></div>
      </div>
      <p className="font-tech text-accent-primary uppercase tracking-[2px] font-bold text-sm m-0 animate-flicker">
        {message}
      </p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No Records Found',
  description = 'There are currently no items matching your request.',
  actionLabel,
  onAction,
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`glass-panel p-12 flex flex-col items-center justify-center text-center gap-4 my-4 animate-fade-in ${className}`}>
      <div className="w-16 h-16 rounded-full bg-surface-color-light border border-border-color flex items-center justify-center text-accent-primary shadow-[0_0_15px_rgba(251,200,21,0.1)]">
        {icon || <FolderOpen size={32} />}
      </div>
      <div>
        <h3 className="text-xl font-heading tracking-[2px] text-text-primary uppercase mb-1 m-0">
          {title}
        </h3>
        <p className="text-text-secondary font-body text-sm max-w-md m-0">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 font-bold font-tech uppercase tracking-[1px] cursor-pointer transition-all duration-200 border-none bg-accent-primary text-black hover:bg-accent-primary-hover hover:shadow-[0_0_15px_rgba(251,200,21,0.4)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Data Fetch Exception',
  message = 'An unexpected error occurred while communicating with the database.',
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`glass-panel p-8 border-status-error/50 bg-[rgba(255,0,127,0.05)] flex flex-col md:flex-row items-center justify-between gap-6 my-4 animate-fade-in ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[rgba(255,0,127,0.15)] border border-status-error flex items-center justify-center text-status-error shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-heading text-lg tracking-[1px] text-status-error uppercase m-0 mb-1">
            {title}
          </h4>
          <p className="text-text-secondary text-sm m-0">
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 font-tech font-bold uppercase tracking-[1px] border border-status-error bg-transparent text-status-error hover:bg-status-error hover:text-white transition-all cursor-pointer shrink-0"
        >
          <RefreshCw size={16} /> Retry Operation
        </button>
      )}
    </div>
  );
}
