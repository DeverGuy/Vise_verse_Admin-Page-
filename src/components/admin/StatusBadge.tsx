import React from 'react';

export type StatusType = 
  | 'Active' | 'Inactive' | 'Suspended'
  | 'Published' | 'Draft' | 'Archived'
  | 'Leader' | 'Core Member' | 'Organizer' | 'Member'
  | 'General' | 'Urgent' | 'Schedule' | 'Competition' | 'Payment'
  | 'Assigned' | 'Pending' | 'Disqualified' | 'Paid' | 'Unpaid';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
  let badgeStyle = 'bg-surface-color-light text-text-primary border-border-color';

  switch (status) {
    case 'Active':
    case 'Published':
    case 'Paid':
    case 'Assigned':
      badgeStyle = 'bg-[rgba(16,185,129,0.12)] text-status-success border-status-success/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      break;

    case 'Inactive':
    case 'Draft':
    case 'Pending':
    case 'General':
      badgeStyle = 'bg-[rgba(251,200,21,0.12)] text-accent-primary border-accent-primary/40 shadow-[0_0_8px_rgba(251,200,21,0.2)]';
      break;

    case 'Urgent':
    case 'Suspended':
    case 'Disqualified':
    case 'Unpaid':
      badgeStyle = 'bg-[rgba(255,0,127,0.12)] text-status-error border-status-error/40 shadow-[0_0_8px_rgba(255,0,127,0.2)]';
      break;

    case 'Archived':
    case 'Schedule':
    case 'Competition':
    case 'Payment':
      badgeStyle = 'bg-[rgba(0,240,255,0.12)] text-accent-tertiary border-accent-tertiary/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]';
      break;

    case 'Leader':
    case 'Core Member':
      badgeStyle = 'bg-gradient-to-r from-[rgba(255,0,127,0.2)] to-[rgba(251,200,21,0.2)] text-text-primary border-accent-secondary/50';
      break;

    case 'Organizer':
      badgeStyle = 'bg-[rgba(0,240,255,0.15)] text-text-primary border-accent-tertiary/50';
      break;

    default:
      badgeStyle = 'bg-surface-color-light text-text-secondary border-border-color';
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs tracking-[1px]',
    md: 'px-3 py-1 text-xs tracking-[1px]',
    lg: 'px-4 py-1.5 text-sm tracking-[1.5px]'
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold font-tech uppercase rounded border transition-all duration-200 ${sizeClasses[size]} ${badgeStyle} ${className}`}
    >
      {status}
    </span>
  );
}
