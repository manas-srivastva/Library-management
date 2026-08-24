import { cn } from '@/utils/cn';
import { LogoMark } from '@/components/brand/Logo';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Branded loader — the LibraAI book mark with a soft pulsing glow and a
 * rotating conic ring, giving a premium "thinking" feel.
 */
export function Loader({ className, label }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 rounded-xl border-2 border-border" />
        <span className="absolute inset-0 animate-spin rounded-xl border-2 border-transparent border-t-brand-400" />
        <LogoMark size={24} />
      </div>
      {label && (
        <p className="flex items-center gap-1.5 text-sm text-fg-muted">
          <span className="inline-flex gap-1">
            <span className="h-1 w-1 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: '0ms' }} />
            <span className="h-1 w-1 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: '200ms' }} />
            <span className="h-1 w-1 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: '400ms' }} />
          </span>
          {label}
        </p>
      )}
    </div>
  );
}

export function FullPageLoader({ label = 'Loading your library…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader label={label} />
    </div>
  );
}
