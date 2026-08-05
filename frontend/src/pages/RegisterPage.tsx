import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Logo, LogoMark } from '@/components/brand/Logo';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (_data: FormValues) => {
    // NOTE: No backend auth here. UI-only demo that routes to the dashboard.
    toast.success('Account created. Welcome to LibraAI');
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 grid-bg-fade" />
      <div className="absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Branded logo */}
        <Link to="/" className="mb-8 flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-brand-500/20 blur-xl" />
            <LogoMark size={56} showGlow className="relative" />
          </motion.div>
          <Logo size={0} showText subtitle={undefined} className="scale-110" textClassName="text-lg" />
        </Link>

        <div className="glass rounded-2xl p-7 shadow-pop gradient-border">
          <h1 className="text-2xl font-bold text-fg tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-fg-muted">Start managing your library in minutes.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Full name</label>
              <div className="relative group">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  placeholder="Jane Doe"
                  className="input-base pl-9"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-danger-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Email</label>
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  type="email"
                  placeholder="you@library.io"
                  className="input-base pl-9"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-danger-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Password</label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="input-base pl-9"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-danger-400">{errors.password.message}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-fg-muted">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border bg-bg-elevated accent-brand-500" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <Button type="submit" className="w-full" loading={isSubmitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
