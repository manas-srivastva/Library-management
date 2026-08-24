import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="surface-enter relative mb-7 flex flex-col gap-5 overflow-hidden rounded-xl border border-border-soft bg-bg-card/55 px-5 py-5 shadow-card backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-glow-sm" />
          LibraAI workspace
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="relative flex items-center gap-2.5">{actions}</div>}
    </motion.div>
  );
}
