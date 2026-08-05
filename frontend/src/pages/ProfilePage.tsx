import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Camera, Mail, MapPin, Phone, Shield, User as UserIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { placeholderMembers } from '@/data/placeholders';
import { formatDate } from '@/utils/format';

const member = placeholderMembers[2];

export default function ProfilePage() {
  const [name, setName] = useState(member.name);

  const handleSave = () => toast.success('Profile updated successfully');

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal information and preferences." />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <div className="relative h-24 rounded-t-2xl bg-gradient-to-r from-brand-500/20 to-accent-500/20" />
          <CardContent className="-mt-12 flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name={member.name} src={member.avatar} size="lg" className="border-4 border-bg-card" />
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated border border-border text-fg-muted hover:text-fg" aria-label="Change photo">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h3 className="mt-3 text-lg font-bold text-fg">{member.name}</h3>
            <p className="text-sm text-fg-muted">{member.email}</p>
            <div className="mt-2">
              <Badge tone="brand" className="capitalize">{member.role}</Badge>
            </div>
            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              <Stat label="Borrowed" value={member.booksBorrowed} />
              <Stat label="Reserved" value={member.activeReservations} />
              <Stat label="Fines" value={`$${member.outstandingFines}`} />
            </div>
            <p className="mt-4 text-xs text-fg-subtle">Member since {formatDate(member.joinedAt)}</p>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" icon={UserIcon}>
                  <input className="input-base pl-9" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input className="input-base pl-9" type="email" defaultValue={member.email} />
                </Field>
                <Field label="Phone" icon={Phone}>
                  <input className="input-base pl-9" placeholder="+1 (555) 000-0000" />
                </Field>
                <Field label="Location" icon={MapPin}>
                  <input className="input-base pl-9" placeholder="City, Country" />
                </Field>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-fg">Bio</label>
                <textarea
                  rows={3}
                  className="input-base resize-none"
                  placeholder="Tell us a bit about yourself…"
                  defaultValue="Librarian passionate about making knowledge accessible to everyone."
                />
              </div>
              <div className="flex justify-end gap-2.5">
                <Button variant="secondary">Cancel</Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Current password" icon={Shield}>
            <input type="password" className="input-base pl-9" placeholder="••••••••" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password" icon={Shield}>
              <input type="password" className="input-base pl-9" placeholder="••••••••" />
            </Field>
            <Field label="Confirm new password" icon={Shield}>
              <input type="password" className="input-base pl-9" placeholder="••••••••" />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => toast.success('Password updated')}>Update password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-soft px-2 py-3">
      <p className="text-lg font-bold text-fg">{value}</p>
      <p className="text-xs text-fg-subtle">{label}</p>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof UserIcon; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
        {children}
      </div>
    </div>
  );
}
