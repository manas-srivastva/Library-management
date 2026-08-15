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
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, BarChart3, BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
    useOverview,
    usePopularBooks,
    useActiveMembers,
    useFineStats,
    useMonthlyBorrows,
} from "@/hooks/useAnalytics";
import { formatCurrency } from '@/utils/format';

const PIE_COLORS = ['#1fb988', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];


export default function AnalyticsPage() {

  const {
    data: overview,
    isLoading: overviewLoading,
} = useOverview();

const {
    data: monthlyBorrows,
    isLoading: monthlyLoading,
} = useMonthlyBorrows();

const {
    data: popularBooks,
    isLoading: popularLoading,
} = usePopularBooks();

const {
    data: fineStats,
    isLoading: fineLoading,
} = useFineStats();

const {
    data: activeMembers,
    isLoading: membersLoading,
} = useActiveMembers();
  return (
    <div>
      <PageHeader title="Analytics" description="Deep insights into your library's performance." />

<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <StatCard
    label="Books"
    value={overviewLoading ? "..." : overview?.books ?? 0}
    icon={BookOpen}
    accent="brand"
  />

  <StatCard
    label="Users"
    value={overviewLoading ? "..." : overview?.users ?? 0}
    icon={Users}
    accent="info"
  />

  <StatCard
    label="Borrows"
    value={overviewLoading ? "..." : overview?.borrows ?? 0}
    icon={Activity}
    accent="accent"
  />

  <StatCard
    label="Reservations"
    value={overviewLoading ? "..." : overview?.reservations ?? 0}
    icon={TrendingUp}
    accent="warning"
  />
</div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Borrows" subtitle="Monthly Borrow Trend" action={<Badge tone="brand" dot><TrendingUp className="h-3 w-3" /> Live Data</Badge>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBorrows ?? []} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="total" stroke="#1fb988" strokeWidth={2.5} dot={{ r: 3 }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Popular Books" subtitle="Most borrowed this quarter">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularBooks ?? []} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="title" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="borrowCount" fill="#1fb988" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

       

        
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Fine Statistics" subtitle="Collected vs pending">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fineStats ?? []} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
                <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="total" fill="#1fb988" radius={[6, 6, 0, 0]} barSize={14} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">Most Active Members</h3>
            <BarChart3 className="h-5 w-5 text-fg-subtle" />
          </div>
          <div className="space-y-1">
            {(activeMembers ?? [])
              .slice()
              .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
              .map((m) => (
                <div key={m._id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-bg-elevated/60 transition">
                  <Avatar name={m.name} src={undefined} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                    <p className="truncate text-xs text-fg-subtle">{m.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-fg">{m.totalBorrowed}</p>
                    <p className="text-xs text-fg-subtle">borrows</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
