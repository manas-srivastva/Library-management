import { cn } from '@/utils/cn';

interface LogoMarkProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

/**
 * LibraAI brand mark — an open book whose spine forms a neural/AI spark,
 * communicating the fusion of knowledge (library) and intelligence (AI).
 */
export function LogoMark({ size = 36, className, showGlow = false }: LogoMarkProps) {
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <span
          className="absolute inset-0 rounded-[28%] bg-brand-500/25 blur-md"
          aria-hidden
        />
      )}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        width={size}
        height={size}
        className="relative"
        aria-hidden
      >
        <defs>
          <linearGradient id="libra-mark-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0e0f14" />
            <stop offset="1" stopColor="#181a21" />
          </linearGradient>
          <linearGradient id="libra-mark-stroke" x1="8" y1="10" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#43d0a1" />
            <stop offset="1" stopColor="#1fb988" />
          </linearGradient>
          <linearGradient id="libra-mark-spark" x1="18" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Rounded tile background */}
        <rect width="40" height="40" rx="11" fill="url(#libra-mark-bg)" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" stroke="#1f222c" />

        {/* Open book — left page */}
        <path
          d="M20 13.5C17.5 11.8 14.5 11.2 11 11.8V27.5C14.5 26.9 17.5 27.5 20 29.2"
          stroke="url(#libra-mark-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Open book — right page */}
        <path
          d="M20 13.5C22.5 11.8 25.5 11.2 29 11.8V27.5C25.5 26.9 22.5 27.5 20 29.2"
          stroke="url(#libra-mark-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        />
        {/* Spine */}
        <path d="M20 13.5V29.2" stroke="url(#libra-mark-stroke)" strokeWidth="2" strokeLinecap="round" />

        {/* AI spark — four-point star above the book */}
        <path
          d="M20 5.5C20.6 7.6 21.4 8.4 23.5 9C21.4 9.6 20.6 10.4 20 12.5C19.4 10.4 18.6 9.6 16.5 9C18.6 8.4 19.4 7.6 20 5.5Z"
          fill="url(#libra-mark-spark)"
        />
      </svg>
    </span>
  );
}

interface LogoProps {
  size?: number;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

export function Logo({ size = 36, showText = true, subtitle = 'Smart Library', className, textClassName }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {showText && (
        <span className="leading-tight">
          <span className={cn('block text-sm font-bold tracking-tight text-fg', textClassName)}>
            Libra<span className="text-brand-400">AI</span>
          </span>
          {subtitle && <span className="block text-[11px] text-fg-subtle">{subtitle}</span>}
        </span>
      )}
    </span>
  );
}
