import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Library } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/brand/Logo';

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 grid-bg-fade" />
      <div className="absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* Branded mark with lost-book feel */}
        <div className="relative mx-auto mb-8 flex justify-center">
          <div className="absolute inset-0 rounded-3xl bg-brand-500/15 blur-2xl" />
          <LogoMark size={64} showGlow className="relative" />
        </div>

        <p className="text-7xl font-extrabold tracking-tight text-fg tabular-nums">404</p>
        <h1 className="mt-3 text-xl font-semibold text-fg">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-fg-muted leading-relaxed">
          The page you&apos;re looking for has wandered off the shelf. Let&apos;s get you back on track.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/app/dashboard">
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" leftIcon={<Library className="h-4 w-4" />}>Go home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
