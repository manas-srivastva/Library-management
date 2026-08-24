import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Branded empty-state illustration — an abstract "open book" with an AI spark,
 * drawn as inline SVG so it inherits the theme and stays crisp at any size.
 */
function EmptyIllustration({ variant = 'book' }: { variant?: EmptyVariant }) {
  return (
    <div className="relative">
      {/* Soft glow */}
      <div className="absolute inset-3 rounded-full bg-brand-500/5 blur-xl" aria-hidden />
      <svg viewBox="0 0 120 120" fill="none" width="120" height="120" className="relative">
        <defs>
          <linearGradient id="empty-book" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#65c5b8" />
            <stop offset="1" stopColor="#2a9d8f" />
          </linearGradient>
          <linearGradient id="empty-spark" x1="55" y1="14" x2="65" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5dda0" />
            <stop offset="1" stopColor="#e9c46a" />
          </linearGradient>
        </defs>

        {/* Dashed orbit ring — AI */}
        <circle cx="60" cy="62" r="44" stroke="#376582" strokeWidth="1.5" strokeDasharray="4 6" />

        {/* Open book */}
        <path
          d="M60 44C52 38 42 36 32 38V78C42 76 52 78 60 84"
          stroke="url(#empty-book)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 44C68 38 78 36 88 38V78C78 76 68 78 60 84"
          stroke="url(#empty-book)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path d="M60 44V84" stroke="url(#empty-book)" strokeWidth="3" strokeLinecap="round" />

        {/* AI spark */}
        <path
          d="M60 16C61.8 22 64.2 24.4 70 26C64.2 27.6 61.8 30 60 36C58.2 30 55.8 27.6 50 26C55.8 24.4 58.2 22 60 16Z"
          fill="url(#empty-spark)"
        />

        {/* Small nodes — neural */}
        <circle cx="26" cy="26" r="2.5" fill="#65c5b8" opacity="0.7" />
        <circle cx="94" cy="30" r="2" fill="#f5dda0" opacity="0.6" />
        <circle cx="98" cy="86" r="2.5" fill="#65c5b8" opacity="0.5" />
        <circle cx="22" cy="82" r="2" fill="#f5dda0" opacity="0.5" />
      </svg>
      {variant === 'search' && (
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl bg-bg-elevated border border-border text-fg-muted shadow-pop-sm">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </div>
  );
}

type EmptyVariant = 'book' | 'search';

interface EmptyStateProps {
  icon?: never;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: EmptyVariant;
}

/** Legacy prop support: allow `icon` but prefer branded illustration. */
export function EmptyState({ title, description, action, className, variant = 'book' }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <EmptyIllustration variant={variant} />
      </motion.div>
      <h3 className="mt-6 text-base font-semibold text-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-fg-muted leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
