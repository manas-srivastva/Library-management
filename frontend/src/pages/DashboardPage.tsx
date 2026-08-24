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
  Legend,
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
import { Badge } from '@/components/ui/Badge';
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
    0,
  );
  const fineTotal = (fineStats ?? []).reduce(
    (total, stat) => total + stat.total,
    0,
  );
  const topBook = popularBooks?.[0];

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

      <div className="mt-6 grid gap-3 rounded-2xl border border-border-soft bg-bg-card/60 p-4 shadow-card sm:grid-cols-3 sm:p-5">
        <div className="border-border-soft sm:border-r sm:pr-5">
          <p className="eyebrow">Since launch</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-fg">
            {monthlyLoading ? '...' : currentYearBorrows}
          </p>
          <p className="mt-1 text-xs text-fg-subtle">Borrows recorded since August</p>
        </div>
        <div className="border-border-soft sm:border-r sm:pr-5">
          <p className="eyebrow">Leading title</p>
          <p className="mt-2 truncate text-base font-semibold text-fg">
            {popularLoading ? 'Loading...' : topBook?.title ?? 'No borrow data'}
          </p>
          <p className="mt-1 text-xs text-fg-subtle">
            {topBook ? `${topBook.borrowCount} recorded borrows` : 'Awaiting activity'}
          </p>
        </div>
        <div>
          <p className="eyebrow">Fine exposure</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-fg">
            {fineLoading ? '...' : formatCurrency(fineTotal)}
          </p>
          <p className="mt-1 text-xs text-fg-subtle">Across backend fine records</p>
        </div>
      </div>

      {/* ========================================= */}
      {/* MONTHLY BORROWS */}
      {/* ========================================= */}

      <div className="mt-6 grid gap-4">

        {/* MONTHLY BORROWS - BACKEND */}

        <ChartCard
          title="Monthly Borrows"
          subtitle={`Borrow activity since August ${new Date().getFullYear()}`}
          className="w-full"
          action={
            <Badge tone="brand" dot>
              <TrendingUp className="h-3 w-3" />
              Live Data
            </Badge>
          }
        >

          <div className="h-72">
            {monthlyLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
                Loading borrow activity...
              </div>
            ) : monthlyError ? (
              <div className="flex h-full items-center justify-center text-sm text-danger-400">
                Unable to load borrow activity.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyBorrows ?? []}
                  margin={{ left: -16, right: 8, top: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#23445E" vertical={false} />
                  <XAxis dataKey="month" stroke="#71879B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71879B" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [value, 'Borrows']}
                    contentStyle={{ background: '#11283D', border: '1px solid #376582', borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="total" name="Borrows" stroke="#2A9D8F" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

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

            {popularLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
                Loading popular titles...
              </div>
            ) : popularError ? (
              <div className="flex h-full items-center justify-center text-sm text-danger-400">
                Unable to load popular titles.
              </div>
            ) : !popularBooks?.length ? (
              <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
                No borrow activity available yet.
              </div>
            ) : (
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
                  stroke="#23445E"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  stroke="#71879B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="#71879B"
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
                    background: '#11283D',
                    border: '1px solid #376582',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, 'Borrows']}
                />

                <Bar
                  dataKey="borrowCount"
                  name="Borrows"
                  fill="#2A9D8F"
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
            )}

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

            ) : membersError ? (
              <p className="px-2 py-4 text-sm text-danger-400">
                Unable to load active members.
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

            {fineLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
                Loading fine statistics...
              </div>
            ) : fineError ? (
              <div className="flex h-full items-center justify-center text-sm text-danger-400">
                Unable to load fine statistics.
              </div>
            ) : !fineStats?.length ? (
              <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
                No fine records available yet.
              </div>
            ) : (
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
                  stroke="#23445E"
                  vertical={false}
                />

                <XAxis
                  dataKey="_id"
                  stroke="#71879B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#71879B"
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
                    background: '#11283D',
                    border: '1px solid #376582',
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
                  fill="#E9C46A"
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
            )}

          </div>

        </ChartCard>

      </div>

    </div>
  );
}