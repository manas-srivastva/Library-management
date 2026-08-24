import { useEffect, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  ChevronDown,
  DollarSign,
  Filter,
  Wallet,
} from 'lucide-react';

import { toast } from 'react-toastify';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageHeader } from '@/components/shared/PageHeader';
import { FineStatusBadge } from '@/components/shared/StatusBadges';

import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Avatar } from '@/components/ui/Avatar';

import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@/components/ui/Table';

import { EmptyState } from '@/components/ui/EmptyState';

import {
  Dropdown,
  DropdownItem,
} from '@/components/ui/Dropdown';

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useFineStats } from '@/hooks/useAnalytics';
import { fineApi } from '@/api/fineApi';
import { useAuthContext } from '@/context/AuthContext';

import {
  formatCurrency,
  formatDate,
  paginate,
  totalPages,
} from '@/utils/format';

const statuses = [
  'All',
  'PENDING',
  'PAID',
];

const PAGE_SIZE = 6;

export default function FinesPage() {
  const { user } = useAuthContext();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const [payingId, setPayingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const isMember = user?.role === 'MEMBER';

  /*
   * Reset pagination when filters change.
   */
  useEffect(() => {
    setPage(1);
  }, [query, status]);

  /*
   * Fetch fines.
   *
   * Members see only their own fines.
   * Staff can see all fines.
   */
  const {
    data: fines = [],
    isLoading: finesLoading,
    isError: finesError,
  } = useQuery({
    queryKey: isMember
      ? ['fines', 'user', user?._id]
      : ['fines'],

    queryFn: () => {
      if (isMember && user?._id) {
        return fineApi.getUserFines(user._id);
      }

      return fineApi.getFines();
    },

    enabled: !!user,
  });

  /*
   * Fine statistics are displayed only for staff.
   */
  const {
    data: fineStats = [],
  } = useFineStats();

  /*
   * Filter fines locally.
   */
  const filtered = useMemo(() => {
    return fines.filter((f: any) => {
      const userName =
        f.user?.name || '';

      const bookTitle =
        f.borrowRecord?.bookCopy?.book?.title || '';

      const searchValue =
        query.toLowerCase();

      const matchesQuery =
        !query ||
        userName
          .toLowerCase()
          .includes(searchValue) ||
        bookTitle
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === 'All' ||
        f.status === status;

      return (
        matchesQuery &&
        matchesStatus
      );
    });
  }, [fines, query, status]);

  const pages =
    totalPages(
      filtered.length,
      PAGE_SIZE
    );

  const current =
    paginate(
      filtered,
      page,
      PAGE_SIZE
    );

  /*
   * Calculate fine totals.
   */
  const totalPending =
    fines
      .filter(
        (f: any) =>
          f.status === 'PENDING'
      )
      .reduce(
        (
          sum: number,
          f: any
        ) =>
          sum + f.amount,
        0
      );

  const totalCollected =
    fines
      .filter(
        (f: any) =>
          f.status === 'PAID'
      )
      .reduce(
        (
          sum: number,
          f: any
        ) =>
          sum + f.amount,
        0
      );

  /*
   * Pay fine.
   */
  const handlePay = async (
    id: string
  ) => {
    try {
      setPayingId(id);

      await fineApi.payFine(id);

      toast.success(
        'Fine paid successfully'
      );

      await queryClient.invalidateQueries({
        queryKey: ['fines'],
      });

    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to pay fine'
      );

    } finally {
      setPayingId(null);
    }
  };

  /*
   * Error state.
   */
  if (finesError) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <PageHeader
          title="Fines"
          description="Unable to load fines."
        />

        <Card className="p-6">
          <EmptyState
            title="Failed to load fines"
            description="There was a problem loading your fines."
          />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <PageHeader
        title={
          isMember
            ? 'My Fines'
            : 'Fine Management'
        }
        description={
          isMember
            ? 'View and keep track of your library fines.'
            : 'Track outstanding fines and payment activity.'
        }
      />

      {/* SUMMARY */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.05,
          duration: 0.3,
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <StatCard
          label="Pending Fines"
          value={formatCurrency(
            totalPending
          )}
          icon={Wallet}
          accent="warning"
          delay={0}
        />

        <StatCard
          label="Collected"
          value={formatCurrency(
            totalCollected
          )}
          icon={DollarSign}
          accent="brand"
          delay={0.05}
        />
      </motion.div>

      {/* ANALYTICS */}

      {!isMember && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.35,
          }}
        >
          <ChartCard
            title="Fine Statistics"
            subtitle="Overview of paid and pending fines"
            className="mt-6"
          >
            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={fineStats}
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
                    formatter={(
                      value: number
                    ) =>
                      formatCurrency(value)
                    }
                    contentStyle={{
                      background: '#14161d',
                      border:
                        '1px solid #232733',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />

                  <Bar
                    dataKey="total"
                    fill="#1fb988"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      )}

      {/* FINE LIST */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.15,
          duration: 0.35,
        }}
      >
        <Card className="mt-6 overflow-hidden p-0">

          {/* FILTER BAR */}

          <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="w-full lg:w-80">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={
                  isMember
                    ? 'Search by book...'
                    : 'Search by member or book...'
                }
              />
            </div>

            <div className="flex items-center gap-3">

              <span className="hidden items-center gap-2 text-xs text-fg-subtle sm:flex">
                <Filter className="h-3.5 w-3.5" />
                Filter fines
              </span>

              <Dropdown
                align="left"
                trigger={
                  <motion.span
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="btn-secondary flex cursor-pointer items-center gap-2 px-3 py-2 text-xs"
                  >
                    <span className="text-fg-muted">
                      Status
                    </span>

                    <span className="font-medium text-fg">
                      {status}
                    </span>

                    <ChevronDown className="h-3.5 w-3.5 text-fg-subtle" />
                  </motion.span>
                }
              >
                {(close) => (
                  <div className="min-w-[150px] py-1">

                    {statuses.map((s) => (
                      <DropdownItem
                        key={s}
                        onClick={() => {
                          setStatus(s);
                          close();
                        }}
                      >
                        <div className="flex w-full items-center justify-between gap-4">

                          <span>
                            {s}
                          </span>

                          {status === s && (
                            <motion.span
                              layoutId="activeFineStatus"
                              className="h-1.5 w-1.5 rounded-full bg-brand-400"
                            />
                          )}

                        </div>
                      </DropdownItem>
                    ))}

                  </div>
                )}
              </Dropdown>

            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* LOADING */}

            {finesLoading ? (
              <motion.div
                key="loading"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="flex min-h-[320px] flex-col items-center justify-center gap-3"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.9,
                    ease: 'linear',
                  }}
                  className="h-7 w-7 rounded-full border-2 border-border border-t-brand-400"
                />

                <p className="text-sm text-fg-muted">
                  Loading fines...
                </p>
              </motion.div>

            ) : current.length === 0 ? (

              /* EMPTY */

              <motion.div
                key="empty"
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <EmptyState
                  title="No fines found"
                  description={
                    isMember
                      ? 'You currently have no fines.'
                      : 'No fines match your current filters.'
                  }
                />
              </motion.div>

            ) : (

              /* TABLE */

              <motion.div
                key="table"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <Table>

                  <THead>
                    <tr>

                      {!isMember && (
                        <Th>Member</Th>
                      )}

                      <Th>Book</Th>
                      <Th>Reason</Th>
                      <Th>Amount</Th>
                      <Th>Issued</Th>
                      <Th>Status</Th>

                      {!isMember && (
                        <Th></Th>
                      )}

                    </tr>
                  </THead>

                  <TBody>

                    {current.map(
                      (f: any, i: number) => (
                        <Tr
                          key={f._id}
                          className="transition-colors duration-150 hover:bg-bg-elevated/40"
                        >

                          {/* MEMBER */}

                          {!isMember && (
                            <Td>
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  x: -8,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                }}
                                transition={{
                                  delay: i * 0.035,
                                  duration: 0.25,
                                }}
                                className="flex items-center gap-2.5"
                              >
                                <Avatar
                                  name={
                                    f.user?.name ||
                                    'Unknown User'
                                  }
                                  size="sm"
                                />

                                <div>
                                  <div className="font-medium text-fg">
                                    {f.user?.name ||
                                      'Unknown User'}
                                  </div>

                                  <div className="text-xs text-fg-subtle">
                                    {f.user?.email ||
                                      'No email'}
                                  </div>
                                </div>
                              </motion.div>
                            </Td>
                          )}

                          {/* BOOK */}

                          <Td>
                            <motion.div
                              initial={{
                                opacity: 0,
                                x: -6,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              transition={{
                                delay: i * 0.035 + 0.02,
                              }}
                              className="font-medium text-fg"
                            >
                              {f.borrowRecord
                                ?.bookCopy
                                ?.book
                                ?.title ||
                                'Unknown Book'}
                            </motion.div>
                          </Td>

                          {/* REASON */}

                          <Td>
                            <span className="text-fg-muted">
                              {f.daysLate
                                ? `${f.daysLate} day${
                                    f.daysLate !== 1
                                      ? 's'
                                      : ''
                                  } overdue`
                                : 'Late return'}
                            </span>
                          </Td>

                          {/* AMOUNT */}

                          <Td>
                            <motion.span
                              initial={{
                                opacity: 0,
                                scale: 0.96,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay: i * 0.035 + 0.04,
                              }}
                              className="font-semibold text-fg"
                            >
                              {formatCurrency(
                                f.amount
                              )}
                            </motion.span>
                          </Td>

                          {/* DATE */}

                          <Td className="text-fg-muted">
                            {f.createdAt
                              ? formatDate(
                                  f.createdAt
                                )
                              : '—'}
                          </Td>

                          {/* STATUS */}

                          <Td>
                            <motion.div
                              initial={{
                                opacity: 0,
                                scale: 0.96,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay: i * 0.035 + 0.05,
                              }}
                            >
                              <FineStatusBadge
                                status={f.status}
                              />
                            </motion.div>
                          </Td>

                          {/* ACTION */}

                          {!isMember && (
                            <Td>
                              {f.status ===
                                'PENDING' && (
                                <motion.div
                                  whileHover={{
                                    y: -1,
                                  }}
                                  whileTap={{
                                    scale: 0.97,
                                  }}
                                >
                                  <Button
                                    size="sm"
                                    leftIcon={
                                      <DollarSign className="h-3.5 w-3.5" />
                                    }
                                    onClick={() =>
                                      handlePay(
                                        f._id
                                      )
                                    }
                                    disabled={
                                      payingId === f._id
                                    }
                                  >
                                    {payingId === f._id
                                      ? 'Processing...'
                                      : 'Pay Fine'}
                                  </Button>
                                </motion.div>
                              )}
                            </Td>
                          )}

                        </Tr>
                      )
                    )}

                  </TBody>

                </Table>

                {/* PAGINATION */}

                <div className="flex flex-col gap-3 border-t border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <span className="text-xs text-fg-muted">
                    <span className="font-medium text-fg">
                      {filtered.length}
                    </span>{' '}
                    fine
                    {filtered.length !== 1
                      ? 's'
                      : ''}
                  </span>

                  <Pagination
                    page={page}
                    totalPages={pages}
                    onPageChange={setPage}
                  />

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </Card>
      </motion.div>
    </motion.div>
  );
}