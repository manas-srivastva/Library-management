import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet } from 'lucide-react';
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
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFineStats } from '@/hooks/useAnalytics';
import { fineApi } from '@/api/fineApi';
import { useAuthContext } from '@/context/AuthContext';

import {
  formatCurrency,
  formatDate,
  paginate,
  totalPages,
} from '@/utils/format';

const statuses = ['All', 'PENDING', 'PAID'];
const PAGE_SIZE = 6;

export default function FinesPage() {

  const { user } = useAuthContext();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const isMember = user?.role === 'MEMBER';

  /*
   * ADMIN/LIBRARIAN:
   * Get all fines
   *
   * MEMBER:
   * Get only their own fines
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
   * Analytics are only required for
   * ADMIN/LIBRARIAN.
   */
  const {
    data: fineStats = [],
  } = useFineStats();


  /*
   * Show error if API request failed
   */
  if (finesError) {
    return (
      <div>
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
      </div>
    );
  }


  const filtered = useMemo(() => {

    return fines.filter((f: any) => {

      const userName =
        f.user?.name || '';

      const bookTitle =
        f.borrowRecord?.bookCopy?.book?.title || '';

      const matchesQuery =
        !query ||
        userName
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        bookTitle
          .toLowerCase()
          .includes(query.toLowerCase());

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


  const handlePay = async (
    id: string
  ) => {

    try {

      await fineApi.payFine(id);

      toast.success(
        'Fine paid successfully'
      );

      queryClient.invalidateQueries({
        queryKey: ['fines'],
      });

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to pay fine'
      );

    }

  };


  return (
    <div>

      <PageHeader
        title={
          isMember
            ? 'My Fines'
            : 'Fine Management'
        }
        description={
          isMember
            ? 'View your library fines.'
            : 'Track and collect library fines.'
        }
      />


      <div className="grid gap-4 sm:grid-cols-3">

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

      </div>


      {/* Analytics only for staff */}

      {!isMember && (
        <ChartCard
          title="Fine Statistics"
          subtitle="Paid vs pending fines"
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
      )}


      <Card className="mt-6 p-5">

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={
              isMember
                ? 'Search by book…'
                : 'Search by member or book…'
            }
            className="lg:w-80"
          />

          <Dropdown
            align="left"
            trigger={
              <span className="btn-secondary px-3 py-2 text-xs capitalize">
                Status:{' '}
                <span className="text-fg">
                  {status}
                </span>
              </span>
            }
          >

            {(close) => (
              <div>

                {statuses.map((s) => (

                  <DropdownItem
                    key={s}
                    onClick={() => {
                      setStatus(s);
                      setPage(1);
                      close();
                    }}
                  >
                    <span className="capitalize">
                      {s}
                    </span>
                  </DropdownItem>

                ))}

              </div>
            )}

          </Dropdown>

        </div>


        {finesLoading ? (

          <div className="py-10 text-center text-fg-muted">
            Loading fines...
          </div>

        ) : current.length === 0 ? (

          <EmptyState
            title="No fines found"
            description={
              isMember
                ? 'You currently have no fines.'
                : 'All clear — no fines match your filters.'
            }
          />

        ) : (

          <>

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

                    <Tr key={f._id}>

                      {!isMember && (
                        <Td>

                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 4,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                i * 0.03,
                            }}
                            className="flex items-center gap-2"
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


                      <Td className="text-fg-muted">

                        {f.borrowRecord
                          ?.bookCopy
                          ?.book
                          ?.title ||
                          'Unknown Book'}

                      </Td>


                      <Td className="text-fg-muted">

                        {f.daysLate
                          ? `${f.daysLate} day${
                              f.daysLate !== 1
                                ? 's'
                                : ''
                            } overdue`
                          : 'Late return'}

                      </Td>


                      <Td className="font-semibold text-fg">

                        {formatCurrency(
                          f.amount
                        )}

                      </Td>


                      <Td className="text-fg-muted">

                        {f.createdAt
                          ? formatDate(
                              f.createdAt
                            )
                          : '—'}

                      </Td>


                      <Td>

                        <FineStatusBadge
                          status={f.status}
                        />

                      </Td>


                      {!isMember && (
                        <Td>

                          {f.status ===
                            'PENDING' && (

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
                            >
                              Pay Fine
                            </Button>

                          )}

                        </Td>
                      )}

                    </Tr>

                  )
                )}

              </TBody>

            </Table>


            <div className="mt-5 border-t border-border-soft pt-4">

              <Pagination
                page={page}
                totalPages={pages}
                onPageChange={
                  setPage
                }
              />

            </div>

          </>

        )}

      </Card>

    </div>
  );
}