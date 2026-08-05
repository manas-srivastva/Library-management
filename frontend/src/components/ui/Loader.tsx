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
    <div className={cn('flex flex-col items-center justify-center gap-5 py-12', className)}>
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Pulsing glow */}
        <span className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-lg animate-pulse-soft" />
        {/* Rotating conic ring */}
        <span
          className="absolute inset-0 rounded-2xl animate-spin"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(31,185,136,0.5) 90deg, transparent 180deg)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          }}
        />
        <LogoMark size={32} />
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <Loader label={label} />
    </div>
  );
}
