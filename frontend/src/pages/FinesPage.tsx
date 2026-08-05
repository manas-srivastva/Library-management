import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, DollarSign, Receipt, Wallet } from 'lucide-react';
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
import { placeholderFines, fineTrendData } from '@/data/placeholders';
import { formatCurrency, formatDate, paginate, totalPages } from '@/utils/format';

const statuses = ['All', 'pending', 'paid', 'waived'];
const PAGE_SIZE = 6;

export default function FinesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [fines, setFines] = useState(placeholderFines);

  const filtered = useMemo(() => {
    return fines.filter((f) => {
      const matchesQuery =
        !query ||
        f.user.toLowerCase().includes(query.toLowerCase()) ||
        f.bookTitle.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || f.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [fines, query, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

  const totalPending = fines.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
  const totalCollected = fines.filter((f) => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalWaived = fines.filter((f) => f.status === 'waived').reduce((s, f) => s + f.amount, 0);

  const handlePay = (id: string) => {
    setFines((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'paid' as const } : f)));
    toast.success('Fine paid successfully');
  };

  return (
    <div>
      <PageHeader title="Fine Management" description="Track, collect, and waive library fines." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Fines" value={formatCurrency(totalPending)} icon={Wallet} accent="warning" delay={0} />
        <StatCard label="Collected" value={formatCurrency(totalCollected)} icon={DollarSign} accent="brand" delay={0.05} />
        <StatCard label="Waived" value={formatCurrency(totalWaived)} icon={CheckCircle2} accent="info" delay={0.1} />
      </div>

      <ChartCard title="Fine Trends" subtitle="Collected vs pending over the last 8 months" className="mt-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fineTrendData} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2029" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ background: '#14161d', border: '1px solid #232733', borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="collected" fill="#1fb988" radius={[6, 6, 0, 0]} barSize={14} />
              <Bar dataKey="pending" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card className="mt-6 p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by member or book…" className="lg:w-80" />
          <Dropdown
            align="left"
            trigger={<span className="btn-secondary px-3 py-2 text-xs capitalize">Status: <span className="text-fg">{status}</span></span>}
          >
            {(close) => (
              <div>
                {statuses.map((s) => (
                  <DropdownItem key={s} onClick={() => { setStatus(s); setPage(1); close(); }}>
                    <span className="capitalize">{s}</span>
                  </DropdownItem>
                ))}
              </div>
            )}
          </Dropdown>
        </div>

        {current.length === 0 ? (
          <EmptyState title="No fines found" description="All clear — no fines match your filters." />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>Member</Th>
                  <Th>Book</Th>
                  <Th>Reason</Th>
                  <Th>Amount</Th>
                  <Th>Issued</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </THead>
              <TBody>
                {current.map((f, i) => (
                  <Tr key={f.id}>
                    <Td>
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-2">
                        <Avatar name={f.user} size="sm" />
                        <span className="font-medium text-fg">{f.user}</span>
                      </motion.div>
                    </Td>
                    <Td className="text-fg-muted">{f.bookTitle}</Td>
                    <Td className="text-fg-muted">{f.reason}</Td>
                    <Td className="font-semibold text-fg">{formatCurrency(f.amount)}</Td>
                    <Td className="text-fg-muted">{formatDate(f.issuedAt)}</Td>
                    <Td><FineStatusBadge status={f.status} /></Td>
                    <Td>
                      {f.status === 'pending' && (
                        <Button size="sm" leftIcon={<DollarSign className="h-3.5 w-3.5" />} onClick={() => handlePay(f.id)}>
                          Pay Fine
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <div className="mt-5 border-t border-border-soft pt-4">
              <Pagination page={page} totalPages={pages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
