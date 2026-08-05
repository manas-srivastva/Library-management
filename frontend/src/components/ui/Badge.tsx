import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  success: 'bg-success-500/10 text-success-400 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
  danger: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
  info: 'bg-info-500/10 text-info-400 border-info-500/20',
  neutral: 'bg-bg-elevated text-fg-muted border-border',
  accent: 'bg-accent-500/10 text-accent-300 border-accent-500/20',
};

const dotTones: Record<Tone, string> = {
  brand: 'bg-brand-400',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
  info: 'bg-info-400',
  neutral: 'bg-fg-subtle',
  accent: 'bg-accent-400',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ tone = 'neutral', children, dot, className }: BadgeProps) {
  return (
    <span className={cn('badge', tones[tone], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotTones[tone])} />}
      {children}
    </span>
  );
}
