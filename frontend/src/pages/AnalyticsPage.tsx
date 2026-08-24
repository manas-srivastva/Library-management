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
import { Activity, BarChart3, BookOpen, DollarSign, TrendingUp, Users, Award, Sparkles } from 'lucide-react';
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

const PIE_COLORS = ['#263746', '#526A78', '#C9A76A', '#A0AFB7', '#AE8B50'];

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
    <div className="relative min-h-screen overflow-hidden pb-12">
      {/* Dynamic Background FX Elements */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#263746]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#C9A76A]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-[#526A78]/10 blur-3xl" />

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{
          backgroundImage: `radial-gradient(#263746 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Header Container with subtle backdrop blur */}
        <div className="rounded-2xl border border-border-soft/60 bg-bg-soft/40 p-1 backdrop-blur-md shadow-xs">
          <PageHeader 
            title="Analytics Overview" 
            description="Deep real-time insights into your library's circulation, inventory, and member activity." 
          />
        </div>

        {/* Top KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Total Books"
              value={overviewLoading ? "..." : overview?.books ?? 0}
              icon={BookOpen}
              accent="brand"
              className="border border-border-soft/80 bg-gradient-to-br from-bg-elevated/80 to-bg-soft/50 shadow-sm backdrop-blur-sm"
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Active Users"
              value={overviewLoading ? "..." : overview?.users ?? 0}
              icon={Users}
              accent="info"
              className="border border-border-soft/80 bg-gradient-to-br from-bg-elevated/80 to-bg-soft/50 shadow-sm backdrop-blur-sm"
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Total Borrows"
              value={overviewLoading ? "..." : overview?.borrows ?? 0}
              icon={Activity}
              accent="accent"
              className="border border-border-soft/80 bg-gradient-to-br from-bg-elevated/80 to-bg-soft/50 shadow-sm backdrop-blur-sm"
            />
          </div>

          <div className="transition-transform duration-300 hover:-translate-y-1">
            <StatCard
              label="Reservations"
              value={overviewLoading ? "..." : overview?.reservations ?? 0}
              icon={TrendingUp}
              accent="warning"
              className="border border-border-soft/80 bg-gradient-to-br from-bg-elevated/80 to-bg-soft/50 shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Primary Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Borrows Line Chart */}
          <div className="group rounded-2xl transition-all duration-300 hover:shadow-md">
            <ChartCard 
              title="Monthly Borrows" 
              subtitle="Monthly Borrow Trend Analysis" 
              action={
                <Badge tone="brand" dot className="shadow-xs animate-pulse">
                  <TrendingUp className="h-3 w-3 mr-1" /> Live Data
                </Badge>
              }
              className="border border-border-soft/80 bg-bg-elevated/70 backdrop-blur-md rounded-2xl"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyBorrows ?? []} margin={{ left: -16, right: 8, top: 12 }}>
                    <defs>
                      <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#263746" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#263746" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C4" opacity={0.5} vertical={false} />
                    <XAxis dataKey="month" stroke="#859096" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#859096" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 253, 248, 0.95)', 
                        border: '1px solid #BCB3A1', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: '8px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#263746" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#263746', strokeWidth: 2, stroke: '#FFFDF8' }} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Popular Books Bar Chart */}
          <div className="group rounded-2xl transition-all duration-300 hover:shadow-md">
            <ChartCard 
              title="Popular Books" 
              subtitle="Most borrowed books this quarter"
              className="border border-border-soft/80 bg-bg-elevated/70 backdrop-blur-md rounded-2xl"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularBooks ?? []} layout="vertical" margin={{ left: 24, right: 16, top: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C4" opacity={0.5} horizontal={false} />
                    <XAxis type="number" stroke="#859096" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      type="category" 
                      dataKey="title" 
                      stroke="#859096" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      width={120} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(197, 167, 106, 0.08)' }} 
                      contentStyle={{ 
                        background: 'rgba(255, 253, 248, 0.95)', 
                        border: '1px solid #BCB3A1', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                      }} 
                    />
                    <Bar dataKey="borrowCount" fill="#263746" radius={[0, 6, 6, 0]} barSize={18}>
                      {(popularBooks ?? []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#263746' : '#526A78'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Fine Statistics Chart */}
          <div className="group rounded-2xl transition-all duration-300 hover:shadow-md">
            <ChartCard 
              title="Fine Statistics" 
              subtitle="Collected vs pending fine breakdown"
              className="border border-border-soft/80 bg-bg-elevated/70 backdrop-blur-md rounded-2xl"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fineStats ?? []} margin={{ left: -12, right: 8, top: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C4" opacity={0.5} vertical={false} />
                    <XAxis dataKey="_id" stroke="#859096" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#859096" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(197, 167, 106, 0.08)' }} 
                      contentStyle={{ 
                        background: 'rgba(255, 253, 248, 0.95)', 
                        border: '1px solid #BCB3A1', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: '8px' }} />
                    <Bar dataKey="total" fill="#C9A76A" radius={[6, 6, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Active Members Leaderboard Card */}
          <Card className="p-6 border border-border-soft/80 bg-bg-elevated/70 backdrop-blur-md rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-fg tracking-tight flex items-center gap-2">
                  Most Active Members
                  <Sparkles className="h-4 w-4 text-[#C9A76A]" />
                </h3>
                <p className="text-xs text-fg-subtle mt-0.5">Top library readers by total checkout count</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-bg-soft flex items-center justify-center border border-border-soft/60">
                <BarChart3 className="h-5 w-5 text-fg-subtle" />
              </div>
            </div>

            <div className="space-y-2.5 max-h-[270px] overflow-y-auto pr-1">
              {(activeMembers ?? [])
                .slice()
                .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
                .map((m, index) => (
                  <div 
                    key={m._id} 
                    className="group relative flex items-center gap-3.5 rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-border-soft hover:bg-bg-soft/70 hover:shadow-xs"
                  >
                    {/* Rank Badge */}
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-[#C9A76A]/20 text-[#AE8B50] border border-[#C9A76A]/40' :
                      index === 1 ? 'bg-[#A0AFB7]/20 text-[#526A78] border border-[#A0AFB7]/40' :
                      index === 2 ? 'bg-[#263746]/10 text-[#263746] border border-[#263746]/30' :
                      'text-fg-subtle'
                    }`}>
                      {index + 1}
                    </div>

                    <Avatar name={m.name} src={undefined} size="sm" className="ring-2 ring-border-soft/50" />
                    
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg group-hover:text-primary transition-colors">
                        {m.name}
                      </p>
                      <p className="truncate text-xs text-fg-subtle">{m.email}</p>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-bg-soft px-2.5 py-1 border border-border-soft/40">
                        <span className="text-xs font-bold text-fg">{m.totalBorrowed}</span>
                        <span className="text-[11px] text-fg-subtle">borrows</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}