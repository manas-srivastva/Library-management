import { motion } from 'framer-motion';
import {
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
  placeholderActivity,
} from '@/data/placeholders';

import { relativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

import {
  useOverview,
  usePopularBooks,
  useActiveMembers,
  useFineStats,
  useMonthlyBorrows,
} from '@/hooks/useAnalytics';

const PIE_COLORS = [
  '#1fb988',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
];

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

  // ============================
  // BACKEND ANALYTICS
  // ============================

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
    data: activeMembers,
    isLoading: membersLoading,
  } = useActiveMembers();

  const {
    data: fineStats,
    isLoading: fineLoading,
  } = useFineStats();

  return (
    <div>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening in your library today."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={
                <Library className="h-4 w-4" />
              }
              onClick={() =>
                navigate('/app/reservations')
              }
            >
              Reserve
            </Button>

            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
              onClick={() =>
                navigate('/app/borrows')
              }
            >
              Issue Book
            </Button>
          </>
        }
      />

      {/* ========================================= */}
      {/* OVERVIEW STATS - BACKEND */}
      {/* ========================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          label="Total Books"
          value={
            overviewLoading
              ? '...'
              : overview?.books ?? 0
          }
          icon={BookOpen}
          accent="brand"
          delay={0}
        />

        <StatCard
          label="Total Users"
          value={
            overviewLoading
              ? '...'
              : overview?.users ?? 0
          }
          icon={Users}
          accent="info"
          delay={0.05}
        />

        <StatCard
          label="Total Borrows"
          value={
            overviewLoading
              ? '...'
              : overview?.borrows ?? 0
          }
          icon={CalendarClock}
          accent="accent"
          delay={0.1}
        />

        <StatCard
          label="Reservations"
          value={
            overviewLoading
              ? '...'
              : overview?.reservations ?? 0
          }
          icon={Library}
          accent="warning"
          delay={0.15}
        />

        <StatCard
          label="Fines"
          value={
            overviewLoading
              ? '...'
              : overview?.fines ?? 0
          }
          icon={Receipt}
          accent="danger"
          delay={0.2}
        />

      </div>

      {/* ========================================= */}
      {/* MONTHLY BORROWS + CATEGORIES */}
      {/* ========================================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">

        {/* MONTHLY BORROWS - BACKEND */}

        <ChartCard
          title="Monthly Borrows"
          subtitle="Borrow activity from the backend"
          className="lg:col-span-2"
          action={
            <Badge tone="brand" dot>
              <TrendingUp className="h-3 w-3" />
              Live Data
            </Badge>
          }
        >

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  monthlyLoading
                    ? []
                    : monthlyBorrows ?? []
                }
                margin={{
                  left: -16,
                  right: 8,
                  top: 8,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1c2029"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Borrows"
                  stroke="#1fb988"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </ChartCard>

        {/* CATEGORY DISTRIBUTION
            Still placeholder because backend
            currently has no category analytics endpoint.
        */}

        <ChartCard
          title="Categories"
          subtitle="Distribution by genre"
        >

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

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

                  {categoryDistribution.map(
                    (_, i) => (
                      <Cell
                        key={i}
                        fill={
                          PIE_COLORS[
                            i %
                              PIE_COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </ChartCard>

      </div>

      {/* ========================================= */}
      {/* POPULAR BOOKS + ACTIVE MEMBERS */}
      {/* ========================================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">

        {/* POPULAR BOOKS - BACKEND */}

        <ChartCard
          title="Popular Books"
          subtitle="Top titles by recorded borrow count"
          className="lg:col-span-2"
        >

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  popularLoading
                    ? []
                    : Array.isArray(popularBooks)
                      ? popularBooks
                      : []
                }
                layout="vertical"
                margin={{
                  left: 24,
                  right: 16,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1c2029"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                />

                <Tooltip
                  cursor={{
                    fill:
                      'rgba(255,255,255,0.03)',
                  }}
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, 'Borrows']}
                />

                <Bar
                  dataKey="borrowCount"
                  name="Borrows"
                  fill="#1fb988"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                  barSize={16}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </ChartCard>

        {/* ACTIVE MEMBERS - BACKEND */}

        <Card className="p-5">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-base font-semibold text-fg">
              Active Members
            </h3>

            <button
              className="text-xs text-brand-400 hover:underline"
              onClick={() =>
                navigate('/app/analytics')
              }
            >
              View all
            </button>

          </div>

          <div className="space-y-1">

            {membersLoading ? (

              <p className="px-2 py-4 text-sm text-fg-subtle">
                Loading members...
              </p>

            ) : (

              (activeMembers ?? [])
                .slice(0, 5)
                .map((member, index) => (

                  <motion.div
                    key={member._id}
                    initial={{
                      opacity: 0,
                      x: 8,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-bg-elevated/60 transition"
                  >

                    <Avatar
                      name={member.name}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-fg">
                        {member.name}
                      </p>

                      <p className="truncate text-xs text-fg-subtle">
                        {member.email}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-semibold text-fg">
                        {member.totalBorrowed}
                      </p>

                      <p className="text-xs text-fg-subtle">
                        borrows
                      </p>

                    </div>

                  </motion.div>

                ))

            )}

            {!membersLoading &&
              (activeMembers ?? []).length === 0 && (

                <p className="px-2 py-4 text-sm text-fg-subtle">
                  No active members found.
                </p>

              )}

          </div>

        </Card>

      </div>

      {/* ========================================= */}
      {/* FINE STATISTICS - BACKEND */}
      {/* ========================================= */}

      <div className="mt-6">

        <ChartCard
          title="Fine Statistics"
          subtitle="Fine totals from backend records"
          action={
            <Badge tone="neutral">
              Backend Data
            </Badge>
          }
        >

          <div className="h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  fineLoading
                    ? []
                    : fineStats ?? []
                }
                margin={{
                  left: -12,
                  right: 8,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1c2029"
                  vertical={false}
                />

                <XAxis
                  dataKey="_id"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  cursor={{
                    fill:
                      'rgba(255,255,255,0.03)',
                  }}
                  contentStyle={{
                    background: '#14161d',
                    border: '1px solid #232733',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, 'Fine total']}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="total"
                  name="Fine Amount"
                  fill="#1fb988"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  barSize={30}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </ChartCard>

      </div>

      {/* ========================================= */}
      {/* RECENT ACTIVITY */}
      {/* ========================================= */}

      {/* 
        This is still placeholder data because your
        backend currently has no /analytics/activity
        endpoint.
      */}

      <Card className="mt-6 p-5">

        <div className="mb-4 flex items-center justify-between">

          <h3 className="text-base font-semibold text-fg">
            Recent Activity
          </h3>

          <Badge tone="neutral">
            Last 7 days
          </Badge>

        </div>

        <div className="space-y-1">

          {placeholderActivity.map(
            (activity, index) => {

              const Icon =
                activityIcon[
                  activity.type
                ] ?? BookOpen;

              return (

                <motion.div
                  key={activity.id}
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.04,
                  }}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-bg-elevated/60 transition"
                >

                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      activityTone[
                        activity.type
                      ]
                    )}
                  >

                    <Icon className="h-4 w-4" />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm text-fg">

                      <span className="font-semibold">
                        {activity.user}
                      </span>{' '}

                      {activity.message}

                    </p>

                  </div>

                  <span className="text-xs text-fg-subtle">
                    {relativeTime(
                      activity.timestamp
                    )}
                  </span>

                </motion.div>

              );
            }
          )}

        </div>

      </Card>

    </div>
  );
}