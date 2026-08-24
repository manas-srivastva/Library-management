import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Library,
  Plus,
  Receipt,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/format';

import {
  useOverview,
  usePopularBooks,
  useActiveMembers,
  useFineStats,
  useMonthlyBorrows,
} from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: overview,
    isLoading: overviewLoading,
  } = useOverview();

  const {
    data: monthlyBorrows,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useMonthlyBorrows();

  const {
    data: popularBooks,
    isLoading: popularLoading,
    isError: popularError,
  } = usePopularBooks();

  const {
    data: activeMembers,
    isLoading: membersLoading,
    isError: membersError,
  } = useActiveMembers();

  const {
    data: fineStats,
    isLoading: fineLoading,
    isError: fineError,
  } = useFineStats();

  const currentYearBorrows = (monthlyBorrows ?? []).reduce(
    (total, month) => total + month.total,
    0
  );

  const fineTotal = (fineStats ?? []).reduce(
    (total, stat) => total + stat.total,
    0
  );

  const topBook = popularBooks?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}

      <PageHeader
        title="Dashboard"
        description="Overview of your library activity and current records."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<Library className="h-4 w-4" />}
              onClick={() => navigate('/app/reservations')}
            >
              Reservations
            </Button>

            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate('/app/borrows')}
            >
              Issue Book
            </Button>
          </>
        }
      />

      {/* Overview */}

      <section>
        <h2 className="mb-4 text-sm font-semibold text-fg">
          Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {overviewLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}

          {!overviewLoading && (
            <>
              <StatCard
                label="Total Books"
                value={overview?.books ?? 0}
                icon={BookOpen}
                accent="brand"
              />

              <StatCard
                label="Total Users"
                value={overview?.users ?? 0}
                icon={Users}
                accent="info"
              />

              <StatCard
                label="Total Borrows"
                value={overview?.borrows ?? 0}
                icon={CalendarClock}
                accent="accent"
              />

              <StatCard
                label="Reservations"
                value={overview?.reservations ?? 0}
                icon={Library}
                accent="warning"
              />

              <StatCard
                label="Fines"
                value={overview?.fines ?? 0}
                icon={Receipt}
                accent="danger"
              />
            </>
          )}
        </div>
      </section>

      {/* Quick Summary */}

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-fg-subtle">
            Total Borrow Activity
          </p>

          <p className="mt-2 text-2xl font-semibold text-fg">
            {monthlyLoading ? '...' : currentYearBorrows}
          </p>

          <p className="mt-1 text-xs text-fg-subtle">
            Recorded borrows this year
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-fg-subtle">
            Most Borrowed Book
          </p>

          <p className="mt-2 truncate text-lg font-semibold text-fg">
            {popularLoading
              ? 'Loading...'
              : topBook?.title ?? 'No data available'}
          </p>

          <p className="mt-1 text-xs text-fg-subtle">
            {topBook
              ? `${topBook.borrowCount} total borrows`
              : 'No borrow activity yet'}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-fg-subtle">
            Total Fine Amount
          </p>

          <p className="mt-2 text-2xl font-semibold text-fg">
            {fineLoading
              ? '...'
              : formatCurrency(fineTotal)}
          </p>

          <p className="mt-1 text-xs text-fg-subtle">
            Current fine records
          </p>
        </Card>
      </section>

      {/* Monthly Borrows */}

      <ChartCard
        title="Monthly Borrows"
        subtitle={`Borrow activity in ${new Date().getFullYear()}`}
      >
        <div className="h-72">
          {monthlyLoading ? (
            <div className="flex h-full flex-col justify-center gap-3 px-6">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : monthlyError ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-danger-400">
              <AlertCircle className="h-4 w-4" />
              Unable to load borrow activity.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyBorrows ?? []}
                margin={{
                  left: -16,
                  right: 12,
                  top: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D8D2C4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#859096"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#859096"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value: number) => [
                    value,
                    'Borrows',
                  ]}
                  contentStyle={{
                    background: '#FFFDF8',
                    border: '1px solid #BCB3A1',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Borrows"
                  stroke="#263746"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      {/* Popular Books and Active Members */}

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Popular Books"
          subtitle="Books with the highest borrow activity"
          className="lg:col-span-2"
        >
          <div className="h-72">
            {popularLoading ? (
              <div className="flex h-full flex-col justify-center gap-3 px-6">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : popularError ? (
              <div className="flex h-full items-center justify-center gap-2 text-sm text-danger-400">
                <AlertCircle className="h-4 w-4" />
                Unable to load popular books.
              </div>
            ) : !popularBooks?.length ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-fg-subtle">
                <BookOpen className="h-5 w-5" />
                No borrow activity available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularBooks}
                  layout="vertical"
                  margin={{
                    left: 24,
                    right: 16,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#D8D2C4"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    stroke="#859096"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="title"
                    stroke="#859096"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />

                  <Tooltip
                    formatter={(value: number) => [
                      value,
                      'Borrows',
                    ]}
                    contentStyle={{
                      background: '#FFFDF8',
                      border: '1px solid #BCB3A1',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />

                  <Bar
                    dataKey="borrowCount"
                    name="Borrows"
                    fill="#263746"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-fg">
                Active Members
              </h3>

              <p className="mt-0.5 text-xs text-fg-subtle">
                Members with recent borrow activity
              </p>
            </div>

            <button
              onClick={() => navigate('/app/analytics')}
              className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {membersLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2"
                >
                  <Skeleton className="h-9 w-9 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                </div>
              ))
            ) : membersError ? (
              <div className="flex items-center gap-2 py-4 text-sm text-danger-400">
                <AlertCircle className="h-4 w-4" />
                Unable to load members.
              </div>
            ) : !activeMembers?.length ? (
              <div className="flex items-center gap-2 py-4 text-sm text-fg-subtle">
                <Users className="h-4 w-4" />
                No active members found.
              </div>
            ) : (
              activeMembers.slice(0, 5).map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-lg py-2"
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
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* Fine Statistics */}

      <ChartCard
        title="Fine Statistics"
        subtitle="Fine amounts recorded by the library"
      >
        <div className="h-64">
          {fineLoading ? (
            <div className="flex h-full flex-col justify-center gap-3 px-6">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : fineError ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-danger-400">
              <AlertCircle className="h-4 w-4" />
              Unable to load fine statistics.
            </div>
          ) : !fineStats?.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-fg-subtle">
              <Receipt className="h-5 w-5" />
              No fine records available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fineStats}
                margin={{
                  left: -12,
                  right: 8,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D8D2C4"
                  vertical={false}
                />

                <XAxis
                  dataKey="_id"
                  stroke="#859096"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#859096"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value: number) => [
                    value,
                    'Fine Amount',
                  ]}
                  contentStyle={{
                    background: '#FFFDF8',
                    border: '1px solid #BCB3A1',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="total"
                  name="Fine Amount"
                  fill="#C9A76A"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}