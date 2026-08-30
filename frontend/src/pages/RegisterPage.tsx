import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const PASSWORD_REQUIREMENTS = [
  { label: '12+ characters', test: (p: string) => p.length >= 12 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'Special character (@$!%*?&)', test: (p: string) => /[@$!%*?&]/.test(p) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const passwordValue = watch('password');
  const passwordStrength = PASSWORD_REQUIREMENTS.filter(req => req.test(passwordValue || '')).length;
  const isPasswordValid = passwordStrength === PASSWORD_REQUIREMENTS.length;

  const onSubmit = async (data: FormValues) => {
    if (!isPasswordValid) {
      toast.error('Password does not meet all requirements');
      return;
    }

    try {
      await registerUser(data);
      toast.success('Account created successfully! Welcome to LibraAI');
      navigate('/app/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Registration failed');
    }
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
            {/* Name Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Full name</label>
              <div className="relative group">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  placeholder="Jane Doe"
                  className="input-base pl-9 transition-all focus:ring-2 focus:ring-brand-400/20"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                />
              </div>
              {errors.name && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Email</label>
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  type="email"
                  placeholder="you@library.io"
                  className="input-base pl-9 transition-all focus:ring-2 focus:ring-brand-400/20"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Password</label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand-400" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="input-base pl-9 transition-all focus:ring-2 focus:ring-brand-400/20"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-danger-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password.message}
                </div>
              )}

              {/* Password Requirements */}
              {passwordValue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-1.5 rounded-lg border border-border bg-bg-soft/50 p-3"
                >
                  <p className="text-xs font-medium text-fg-muted">Password strength: {passwordStrength}/5</p>
                  <div className="h-1 w-full rounded-full bg-bg-elevated">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength <= 2 ? 'bg-danger-500' : passwordStrength <= 4 ? 'bg-warning-500' : 'bg-success-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <div className="grid gap-1">
                    {PASSWORD_REQUIREMENTS.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {req.test(passwordValue) ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success-400" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-border-soft" />
                        )}
                        <span className={req.test(passwordValue) ? 'text-fg-muted' : 'text-fg-subtle'}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              disabled={!isPasswordValid}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-fg-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
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
