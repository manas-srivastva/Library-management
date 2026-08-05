import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Library,
  Plus,
  Receipt,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  categoryDistribution,
  monthlyBorrowData,
  placeholderActivity,
  placeholderMembers,
  popularBooksData,
} from '@/data/placeholders';
import { relativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const PIE_COLORS = ['#1fb988', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const activityIcon: Record<string, typeof BookOpen> = {
  borrow: CalendarClock,
  return: BookOpen,
  reserve: Library,
  fine: Receipt,
  add_book: Plus,
  register: Users,
};

const activityTone: Record<string, string> = {
  borrow: 'bg-info-500/10 text-info-400',
  return: 'bg-success-500/10 text-success-400',
  reserve: 'bg-warning-500/10 text-warning-400',
  fine: 'bg-danger-500/10 text-danger-400',
  add_book: 'bg-brand-500/10 text-brand-400',
  register: 'bg-accent-500/10 text-accent-400',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Aisha. Here's what's happening in your library today."
        actions={
          <>
            <Button variant="secondary" leftIcon={<Library className="h-4 w-4" />} onClick={() => navigate('/app/reservations')}>
              Reserve
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/borrows')}>
              Issue Book
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Books" value="12,480" icon={BookOpen} trend={{ value: '+4.2%', up: true }} accent="brand" delay={0} />
        <StatCard label="Total Users" value="4,210" icon={Users} trend={{ value: '+2.8%', up: true }} accent="info" delay={0.05} />
        <StatCard label="Active Borrows" value="318" icon={CalendarClock} trend={{ value: '+12%', up: true }} accent="accent" delay={0.1} />
        <StatCard label="Reservations" value="47" icon={Library} trend={{ value: '-3%', up: false }} accent="warning" delay={0.15} />
        <StatCard label="Pending Fines" value="$1,240" icon={Receipt} trend={{ value: '+8%', up: true }} accent="danger" delay={0.2} />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Monthly Borrows"
          subtitle="Borrows vs returns over the last 8 months"
          className="lg:col-span-2"
          action={
            <Badge tone="brand" dot>
              <TrendingUp className="h-3 w-3" /> Trending up
            </Badge>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBorrowData} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="borrows" stroke="#1fb988" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="returns" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Categories" subtitle="Distribution by genre">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Popular books + active members */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Popular Books" subtitle="Most borrowed this quarter" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularBooksData} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="borrows" fill="#1fb988" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">Active Members</h3>
            <button className="text-xs text-brand-400 hover:underline" onClick={() => navigate('/app/analytics')}>
              View all
            </button>
          </div>
          <div className="space-y-1">
            {placeholderMembers.slice(0, 5).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-bg-elevated/60 transition"
              >
                <Avatar name={m.name} src={m.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                  <p className="truncate text-xs text-fg-subtle">{m.booksBorrowed} books borrowed</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-fg-subtle" />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-fg">Recent Activity</h3>
          <Badge tone="neutral">Last 7 days</Badge>
        </div>
        <div className="space-y-1">
          {placeholderActivity.map((a, i) => {
            const Icon = activityIcon[a.type] ?? BookOpen;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-bg-elevated/60 transition"
              >
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', activityTone[a.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-fg">
                    <span className="font-semibold">{a.user}</span> {a.message}
                  </p>
                </div>
                <span className="text-xs text-fg-subtle">{relativeTime(a.timestamp)}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
