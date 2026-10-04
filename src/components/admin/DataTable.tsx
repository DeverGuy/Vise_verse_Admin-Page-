import React from 'react';
import { LoadingState, EmptyState } from './States';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  isEmpty = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no records to display.',
  emptyActionLabel,
  onEmptyAction,
  className = ''
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState message="Fetching data records..." />;
  }

  if (isEmpty || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={`glass-panel p-0 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-color/80 border-b border-border-color">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 text-accent-primary font-tech text-[0.85rem] uppercase tracking-[1px] font-bold ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="transition-colors duration-200 hover:bg-[rgba(255,0,127,0.05)] border-b border-border-color last:border-b-0"
              >
                {columns.map((col) => (
                  <td
                    key={`${keyExtractor(row)}-${col.key}`}
                    className={`p-4 text-sm font-body text-text-primary ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
