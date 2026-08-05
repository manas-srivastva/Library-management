import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookCopy,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo, LogoMark } from '@/components/brand/Logo';

const features = [
  { icon: BookOpen, title: 'Smart Catalog', body: 'Search and filter thousands of titles with AI-assisted recommendations.' },
  { icon: CalendarClock, title: 'Borrow Tracking', body: 'Issue, return, and renew books with automatic due-date reminders.' },
  { icon: BookCopy, title: 'Copy Management', body: 'Track every physical copy by barcode, shelf, and condition in real time.' },
  { icon: Receipt, title: 'Fine Handling', body: 'Automatic overdue fines with one-click payment and waiver workflows.' },
  { icon: BarChart3, title: 'Analytics', body: 'Beautiful dashboards for borrows, popular books, and member activity.' },
  { icon: ShieldCheck, title: 'Secure by Design', body: 'Role-based access keeps member data and library operations safe.' },
];

const stats = [
  { label: 'Books managed', value: '48k+' },
  { label: 'Active members', value: '12k+' },
  { label: 'Borrows / month', value: '245' },
  { label: 'Uptime', value: '99.9%' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link to="/" aria-label="LibraAI home">
            <Logo size={32} subtitle="Smart Library" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-fg-muted md:flex">
            <a href="#features" className="hover:text-fg transition">Features</a>
            <a href="#stats" className="hover:text-fg transition">Stats</a>
            <a href="#cta" className="hover:text-fg transition">Get started</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 grid-bg-fade" />
        <div className="absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-accent-500/8 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Branded badge with AI spark */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/[0.07] px-3.5 py-1.5 text-xs font-medium text-brand-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered library management
            </div>

            {/* Large brand mark above headline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-500/20 blur-2xl animate-pulse-soft" />
                <LogoMark size={64} showGlow className="relative" />
              </div>
            </motion.div>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
              The modern operating system for{' '}
              <span className="gradient-text">smart libraries</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-fg-muted sm:text-lg">
              Manage books, copies, borrows, reservations, and fines — all in one beautiful,
              fast, and secure dashboard built for modern institutions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start for free
                </Button>
              </Link>
              <Link to="/app/dashboard">
                <Button variant="secondary" size="lg">View live demo</Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-fg-subtle">
              <CheckCircle2 className="h-4 w-4 text-brand-400" />
              No credit card required · Free for 30 days
            </div>
          </motion.div>

          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <Card className="overflow-hidden p-0 shadow-pop gradient-border">
              <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-danger-500/70" />
                <span className="h-3 w-3 rounded-full bg-warning-500/70" />
                <span className="h-3 w-3 rounded-full bg-success-500/70" />
                <span className="ml-3 text-xs text-fg-subtle">libraai.io/dashboard</span>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { icon: BookOpen, label: 'Total Books', value: '12,480', tone: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
                  { icon: Users, label: 'Members', value: '4,210', tone: 'text-info-400 bg-info-500/10 border-info-500/20' },
                  { icon: CalendarClock, label: 'Active Borrows', value: '318', tone: 'text-accent-300 bg-accent-500/10 border-accent-500/20' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-bg-soft p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${s.tone}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl font-bold text-fg tabular-nums">{s.value}</p>
                    <p className="text-sm text-fg-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated/50 px-3 py-1 text-xs font-medium text-fg-muted">
            <BookOpen className="h-3.5 w-3.5 text-brand-400" />
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-fg">Everything your library needs</h2>
          <p className="mt-3 text-fg-muted">A complete platform to run your library — from catalog to analytics.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card hover glow className="h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 transition-transform duration-300 group-hover:scale-105">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-fg">{f.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{f.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border-soft bg-bg-soft/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-14 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-fg tabular-nums sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <Card className="relative overflow-hidden p-10 text-center sm:p-16 gradient-border">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-6 flex justify-center">
              <LogoMark size={48} showGlow />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Ready to modernize your library?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-fg-muted">
              Join thousands of institutions running on LibraAI. Set up in minutes.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Create account</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Sign in</Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-fg-subtle sm:flex-row lg:px-8">
          <Logo size={28} subtitle={undefined} />
          <p>© 2026 LibraAI. Built for modern libraries.</p>
        </div>
      </footer>
    </div>
  );
}
