import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {  Filter, Plus, RotateCcw } from 'lucide-react';
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
import { formatDate, formatCurrency, paginate, totalPages } from '@/utils/format';
import { borrowApi } from '@/api/borrowApi';
import { usersApi } from '@/api/usersApi';
import { bookApi } from '@/api/booksApi';
import { bookCopyApi } from '@/api/bookCopyApi';
import { useQuery } from '@tanstack/react-query';
const statuses = ['All', 'BORROWED', 'RETURNED'];
const PAGE_SIZE = 6;

export default function BorrowManagementPage() {
const [query, setQuery] = useState('');
const [status, setStatus] = useState('All');
const [page, setPage] = useState(1);
const [issueOpen, setIssueOpen] = useState(false);

const [selectedUser, setSelectedUser] = useState('');
const [selectedBookCopy, setSelectedBookCopy] = useState('');
const [dueDate, setDueDate] = useState('');
const [isIssuing, setIsIssuing] = useState(false);
const {
  data: borrows = [],
  isLoading,
  isError,
} = useQuery({
  queryKey: ['borrows'],
  queryFn: borrowApi.getBorrows,
});

const { data: books = [] } = useQuery({
  queryKey: ['books'],
  queryFn: bookApi.getBooks,
});




const { data: users = [] } = useQuery({
  queryKey: ['users'],
  queryFn: usersApi.getUsers,
});

console.log("USERS FROM API:", users);

const { data: bookCopies = [] } = useQuery({
  queryKey: ['bookCopies'],
  queryFn: bookCopyApi.getBookCopies,
});
const availableBookCopies = bookCopies.filter(
  (copy) => copy.status === 'AVAILABLE'
);
 const filtered = useMemo(() => {
  return borrows.filter((b) => {
    const bookTitle = b.bookCopy?.book?.title || '';
    const userName = b.user?.name || '';

    const matchesQuery =
      !query ||
      bookTitle.toLowerCase().includes(query.toLowerCase()) ||
      userName.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      status === 'All' || b.status === status;

    return matchesQuery && matchesStatus;
  });
}, [borrows, query, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

const handleReturn = async (id: string) => {
  try {
    await borrowApi.returnBook(id);

    toast.success('Book returned successfully');

    // Refresh borrow records
    window.location.reload();
  } catch (error) {
    toast.error('Failed to return book');
  }
};

const handleIssue = async () => {
  if (!selectedUser || !selectedBookCopy || !dueDate) {
    toast.error('Please fill all fields');
    return;
  }

  try {
    setIsIssuing(true);

    await borrowApi.borrowBook({
      userId: selectedUser,
      bookCopyId: selectedBookCopy,
      dueDate: new Date(dueDate).toISOString(),
    });

    toast.success('Book issued successfully');

    setIssueOpen(false);
    setSelectedUser('');
    setSelectedBookCopy('');
    setDueDate('');

    window.location.reload();
  } catch (error) {
    toast.error('Failed to issue book');
    console.error(error);
  } finally {
    setIsIssuing(false);
  }
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
    <Tr key={b._id}>
      {/* Book */}
      <Td>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-3"
        >
          {b.bookCopy?.book?.coverImage ? (
            <img
              src={b.bookCopy.book.coverImage}
              alt={b.bookCopy.book.title}
              className="h-10 w-7 rounded object-cover border border-border"
            />
          ) : (
            <div className="flex h-10 w-7 items-center justify-center rounded border border-border bg-bg-elevated">
              <span className="text-xs text-fg-subtle">📖</span>
            </div>
          )}

          <div>
            <span className="font-medium text-fg">
              {b.bookCopy?.book?.title || 'Unknown Book'}
            </span>

            <div className="text-xs text-fg-subtle">
              {b.bookCopy?.barcode || 'No barcode'}
            </div>
          </div>
        </motion.div>
      </Td>

      {/* Member */}
      <Td>
        <div className="flex items-center gap-2">
          <Avatar
            name={b.user?.name || 'Unknown User'}
            size="sm"
          />

          <div>
            <div className="text-fg">
              {b.user?.name || 'Unknown User'}
            </div>

            <div className="text-xs text-fg-subtle">
              {b.user?.email || 'No email'}
            </div>
          </div>
        </div>
      </Td>

      {/* Borrow Date */}
      <Td className="text-fg-muted">
        {b.issueDate ? formatDate(b.issueDate) : '—'}
      </Td>

      {/* Due Date */}
      <Td className="text-fg-muted">
        {b.dueDate ? formatDate(b.dueDate) : '—'}
      </Td>

      {/* Return Date */}
      <Td className="text-fg-muted">
        {b.returnDate ? formatDate(b.returnDate) : '—'}
      </Td>

      {/* Fine */}
      <Td className="text-fg-subtle">
        —
      </Td>

      {/* Status */}
      <Td>
        <BorrowStatusBadge status={b.status} />
      </Td>

      {/* Action */}
      <Td>
        {b.status !== 'RETURNED' && (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={
              <RotateCcw className="h-3.5 w-3.5" />
            }
            onClick={() => handleReturn(b._id)}
          >
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
          <Modal
  open={issueOpen}
  onClose={() => setIssueOpen(false)}
  title="Issue Book"
>
  <div className="space-y-4">

    {/* Member */}
    <div>
      <label className="mb-1 block text-sm font-medium text-fg">
        Member
      </label>

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
      >
        <option value="">Select member</option>

        {users
          .filter((user: any) => user.role === 'MEMBER')
          .map((user: any) => (
            <option key={user._id} value={user._id}>
              {user.name} — {user.email}
            </option>
          ))}
      </select>
    </div>

    {/* Book Copy */}
    <div>
      <label className="mb-1 block text-sm font-medium text-fg">
        Book Copy
      </label>

      <select
        value={selectedBookCopy}
        onChange={(e) => setSelectedBookCopy(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
      >
        <option value="">Select book copy</option>

        {bookCopies
          .filter((copy: any) => copy.status === 'AVAILABLE')
          .map((copy: any) => (
            <option key={copy._id} value={copy._id}>
              {copy.book?.title || 'Unknown Book'} — {copy.barcode}
            </option>
          ))}
      </select>
    </div>

    {/* Due Date */}
    <div>
      <label className="mb-1 block text-sm font-medium text-fg">
        Due Date
      </label>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-2 pt-2">
      <Button
        variant="secondary"
        onClick={() => setIssueOpen(false)}
      >
        Cancel
      </Button>

      <Button
        onClick={handleIssue}
        disabled={isIssuing}
      >
        {isIssuing ? 'Issuing...' : 'Issue Book'}
      </Button>
    </div>

  </div>
</Modal>

    </div>
  );
}
