import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: 'brand' | 'info' | 'warning' | 'danger' | 'accent';
  delay?: number;
  className?: string;
}

const accents: Record<string, { icon: string; bar: string }> = {
  brand: {
    icon: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    bar: 'bg-brand-400',
  },
  info: {
    icon: 'bg-info-500/10 text-info-400 border-info-500/20',
    bar: 'bg-info-400',
  },
  warning: {
    icon: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
    bar: 'bg-warning-400',
  },
  danger: {
    icon: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
    bar: 'bg-danger-400',
  },
  accent: {
    icon: 'bg-accent-500/10 text-accent-300 border-accent-500/20',
    bar: 'bg-accent-400',
  },
};

export function StatCard({ label, value, icon: Icon, trend, accent = 'brand', delay = 0, className }: StatCardProps) {
  const a = accents[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('card card-hover card-glow surface-enter group relative overflow-hidden p-5', className)}
      style={{ '--glow-y': '0%' } as React.CSSProperties}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-fg-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-fg tabular-nums">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg border transition-colors duration-200',
            a.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium',
              trend.up ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400',
            )}
          >
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
          <span className="text-fg-subtle">vs last month</span>
        </div>
      )}

      {/* Accent bar at bottom */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100">
        <div className={cn('h-full w-full', a.bar)} />
      </div>
    </motion.div>
  );
}
