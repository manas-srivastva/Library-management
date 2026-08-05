import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Filter, Plus, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/shared/PageHeader';
import { BorrowStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { placeholderBorrows, placeholderBooks, placeholderMembers } from '@/data/placeholders';
import { formatDate, formatCurrency, paginate, totalPages } from '@/utils/format';

const statuses = ['All', 'borrowed', 'overdue', 'returned'];
const PAGE_SIZE = 6;

export default function BorrowManagementPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [issueOpen, setIssueOpen] = useState(false);
  const [borrows, setBorrows] = useState(placeholderBorrows);

  const filtered = useMemo(() => {
    return borrows.filter((b) => {
      const matchesQuery =
        !query ||
        b.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
        b.user.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || b.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [borrows, query, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

  const handleReturn = (id: string) => {
    setBorrows((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'returned' as const, returnDate: new Date().toISOString().slice(0, 10), fine: 0 } : b,
      ),
    );
    toast.success('Book returned successfully');
  };

  const handleIssue = () => {
    setIssueOpen(false);
    toast.success('Book issued successfully');
  };

  return (
    <div>
      <PageHeader
        title="Borrow Management"
        description="Issue, return, and track all active and historical borrows."
        actions={<Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIssueOpen(true)}>Issue Book</Button>}
      />

      <Card className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by book or member…" className="lg:w-80" />
          <div className="flex items-center gap-2">
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
            <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>Filters</Button>
          </div>
        </div>

        {current.length === 0 ? (
          <EmptyState title="No borrows found" description="Issue a book to start a borrow record." />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>Book</Th>
                  <Th>Member</Th>
                  <Th>Borrow Date</Th>
                  <Th>Due Date</Th>
                  <Th>Return Date</Th>
                  <Th>Fine</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </THead>
              <TBody>
                {current.map((b, i) => (
                  <Tr key={b.id}>
                    <Td>
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3">
                        <img src={b.bookCover} alt={b.bookTitle} className="h-10 w-7 rounded object-cover border border-border" />
                        <span className="font-medium text-fg">{b.bookTitle}</span>
                      </motion.div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={b.user} size="sm" />
                        <span className="text-fg-muted">{b.user}</span>
                      </div>
                    </Td>
                    <Td className="text-fg-muted">{formatDate(b.borrowDate)}</Td>
                    <Td className="text-fg-muted">{formatDate(b.dueDate)}</Td>
                    <Td className="text-fg-muted">{b.returnDate ? formatDate(b.returnDate) : '—'}</Td>
                    <Td className={b.fine > 0 ? 'font-medium text-danger-400' : 'text-fg-subtle'}>
                      {b.fine > 0 ? formatCurrency(b.fine) : '—'}
                    </Td>
                    <Td><BorrowStatusBadge status={b.status} /></Td>
                    <Td>
                      {b.status !== 'returned' && (
                        <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => handleReturn(b.id)}>
                          Return
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

      {/* Issue Book modal */}
      <Modal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        title="Issue Book"
        description="Select a book and member to create a new borrow record."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIssueOpen(false)}>Cancel</Button>
            <Button onClick={handleIssue}>Issue Book</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg">Book</label>
            <select className="input-base">
              {placeholderBooks.map((b) => (
                <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg">Member</label>
            <select className="input-base">
              {placeholderMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Borrow Date</label>
              <input type="date" className="input-base" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">Due Date</label>
              <input type="date" className="input-base" defaultValue={new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
