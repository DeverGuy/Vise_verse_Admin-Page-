import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onResetFilters?: () => void;
  actions?: React.ReactNode;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  onResetFilters,
  actions
}: SearchFilterBarProps) {
  const hasActiveFilters = searchTerm !== '' || filters.some(f => f.value !== '' && f.value !== 'ALL');

  return (
    <div className="bg-surface-color rounded-lg border border-border-color p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-bg-color border border-border-color pl-10 pr-9 py-2.5 rounded text-text-primary font-body text-sm outline-none focus:border-accent-primary focus:shadow-[0_0_10px_rgba(251,200,21,0.2)] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[140px]">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full bg-bg-color border border-border-color py-2.5 px-3 rounded text-text-primary font-body text-sm outline-none focus:border-accent-secondary transition-colors"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface-color text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-tech font-bold uppercase text-accent-secondary hover:underline cursor-pointer"
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
