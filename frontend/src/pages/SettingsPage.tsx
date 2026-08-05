import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Bell, Globe, Moon, Palette, Shield, Sun } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/context/ThemeContext';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-bg-elevated border border-border'}`}
      aria-pressed={checked}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? 'left-[1.4rem]' : 'left-0.5'}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notif, setNotif] = useState({ email: true, push: false, overdue: true, reservations: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your account, notifications, and appearance."
        actions={<Button onClick={handleSave}>{saved ? 'Saved' : 'Save changes'}</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how LibraAI looks for you.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Theme" description="Switch between dark and light mode.">
              <button
                onClick={toggleTheme}
                className="btn-secondary px-3 py-2 text-xs"
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </Row>
            <Row label="Language" description="Choose your preferred language.">
              <select className="input-base w-auto text-xs">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </Row>
            <Row label="Timezone" description="Used for dates and reminders.">
              <select className="input-base w-auto text-xs">
                <option>UTC-08:00 Pacific</option>
                <option>UTC-05:00 Eastern</option>
                <option>UTC+00:00 London</option>
                <option>UTC+05:30 India</option>
              </select>
            </Row>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-500/10 text-info-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Email notifications" description="Receive updates via email.">
              <Toggle checked={notif.email} onChange={() => setNotif((n) => ({ ...n, email: !n.email }))} />
            </Row>
            <Row label="Push notifications" description="Real-time alerts in your browser.">
              <Toggle checked={notif.push} onChange={() => setNotif((n) => ({ ...n, push: !n.push }))} />
            </Row>
            <Row label="Overdue reminders" description="Get notified about overdue books.">
              <Toggle checked={notif.overdue} onChange={() => setNotif((n) => ({ ...n, overdue: !n.overdue }))} />
            </Row>
            <Row label="Reservation updates" description="When a reserved book is ready.">
              <Toggle checked={notif.reservations} onChange={() => setNotif((n) => ({ ...n, reservations: !n.reservations }))} />
            </Row>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your account security.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Two-factor auth" description="Add an extra layer of security.">
              <Badge tone="warning">Not enabled</Badge>
            </Row>
            <Row label="Active sessions" description="Devices currently signed in.">
              <span className="text-sm text-fg-muted">3 sessions</span>
            </Row>
            <Row label="Data export" description="Download your library data.">
              <Button variant="secondary" size="sm" onClick={() => toast.info('Export started — check your email')}>
                <Globe className="h-4 w-4" /> Export
              </Button>
            </Row>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-danger-500/20">
          <CardHeader>
            <CardTitle className="text-danger-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Sign out everywhere" description="Sign out of all active sessions.">
              <Button variant="secondary" size="sm" onClick={() => toast.success('Signed out everywhere')}>
                Sign out all
              </Button>
            </Row>
            <Row label="Delete account" description="Permanently delete your account and data.">
              <Button variant="danger" size="sm" onClick={() => toast.error('Account deletion requires confirmation')}>
                Delete account
              </Button>
            </Row>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border-soft bg-bg-soft px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="text-xs text-fg-subtle">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
