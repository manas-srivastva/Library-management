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
  categoryDistribution,
  fineTrendData,
  monthlyBorrowData,
  placeholderMembers,
  popularBooksData,
} from '@/data/placeholders';
import { formatCurrency } from '@/utils/format';

const PIE_COLORS = ['#1fb988', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const radarData = [
  { category: 'Fiction', borrows: 120 },
  { category: 'Sci-Fi', borrows: 96 },
  { category: 'Self-Help', borrows: 84 },
  { category: 'History', borrows: 60 },
  { category: 'Tech', borrows: 72 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Deep insights into your library's performance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Borrows" value="1,398" icon={BookOpen} trend={{ value: '+14%', up: true }} accent="brand" delay={0} />
        <StatCard label="Active Members" value="4,210" icon={Users} trend={{ value: '+2.8%', up: true }} accent="info" delay={0.05} />
        <StatCard label="Fines Collected" value={formatCurrency(3080)} icon={DollarSign} trend={{ value: '+9%', up: true }} accent="accent" delay={0.1} />
        <StatCard label="Avg. Activity" value="86%" icon={Activity} trend={{ value: '+3%', up: true }} accent="warning" delay={0.15} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Borrows" subtitle="Borrows vs returns trend" action={<Badge tone="brand" dot><TrendingUp className="h-3 w-3" /> +14%</Badge>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBorrowData} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="borrows" stroke="#1fb988" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="returns" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Popular Books" subtitle="Most borrowed this quarter">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularBooksData} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="borrows" fill="#1fb988" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Category Distribution" subtitle="Borrows by genre">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Borrow Activity" subtitle="By category (radar)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={90}>
                <PolarGrid stroke="#232733" />
                <PolarAngleAxis dataKey="category" stroke="#6b7280" fontSize={12} />
                <Radar dataKey="borrows" stroke="#1fb988" fill="#1fb988" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Fine Statistics" subtitle="Collected vs pending">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fineTrendData} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="collected" fill="#1fb988" radius={[6, 6, 0, 0]} barSize={14} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={14} />
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
            {placeholderMembers
              .slice()
              .sort((a, b) => b.booksBorrowed - a.booksBorrowed)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-bg-elevated/60 transition">
                  <Avatar name={m.name} src={m.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                    <p className="truncate text-xs text-fg-subtle">{m.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-fg">{m.booksBorrowed}</p>
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
