import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const items: (number | '...')[] = [];
  let prev = 0;
  for (const p of visible) {
    if (p - prev > 1) items.push('...');
    items.push(p);
    prev = p;
  }

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <p className="text-sm text-fg-muted">
        Page <span className="text-fg font-medium tabular-nums">{page}</span> of{' '}
        <span className="tabular-nums">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {items.map((item, i) =>
          item === '...' ? (
            <span key={`gap-${i}`} className="px-1.5 text-fg-subtle">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                'min-h-8 min-w-8 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200 tabular-nums',
                item === page
                  ? 'bg-brand-500 text-white shadow-glow-sm'
                  : 'text-fg-muted hover:bg-bg-elevated hover:text-fg',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
