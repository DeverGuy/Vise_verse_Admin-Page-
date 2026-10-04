import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-border-color bg-surface-color/50 font-tech text-xs">
      <div className="text-text-secondary uppercase tracking-[1px]">
        Showing <span className="text-accent-primary font-bold">{startItem}</span> to{' '}
        <span className="text-accent-primary font-bold">{endItem}</span> of{' '}
        <span className="text-text-primary font-bold">{totalItems}</span> Records
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-text-secondary uppercase">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-bg-color border border-border-color px-2 py-1 rounded text-text-primary outline-none focus:border-accent-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-border-color text-text-secondary hover:text-text-primary hover:border-accent-primary disabled:opacity-30 disabled:hover:border-border-color transition-colors"
            title="First Page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-border-color text-text-secondary hover:text-text-primary hover:border-accent-primary disabled:opacity-30 disabled:hover:border-border-color transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 text-text-primary font-bold">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded border border-border-color text-text-secondary hover:text-text-primary hover:border-accent-primary disabled:opacity-30 disabled:hover:border-border-color transition-colors"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded border border-border-color text-text-secondary hover:text-text-primary hover:border-accent-primary disabled:opacity-30 disabled:hover:border-border-color transition-colors"
            title="Last Page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
