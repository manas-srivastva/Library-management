import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/shared/PageHeader';
import { ReservationStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { formatDate, paginate, totalPages } from '@/utils/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '@/api/reservationApi';
const statuses = [
  'All',
  'ACTIVE',
  'FULFILLED',
  'CANCELLED',
  'EXPIRED',
];
const PAGE_SIZE = 6;

export default function ReservationsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
const [selectedMember, setSelectedMember] = useState('');
const queryClient = useQueryClient();

const {
  data: reservations = [],
  isLoading,
  isError,
} = useQuery({
  queryKey: ['reservations'],
  queryFn: reservationApi.getReservations,
});
const filtered = useMemo(() => {
  return reservations.filter((r) => {
    const userName = r.user?.name || '';
    const userEmail = r.user?.email || '';
    const bookTitle = r.book?.title || '';

    const matchesQuery =
      !query ||
      bookTitle.toLowerCase().includes(query.toLowerCase()) ||
      userName.toLowerCase().includes(query.toLowerCase()) ||
      userEmail.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      status === 'All' || r.status === status;

    return matchesQuery && matchesStatus;
  });
}, [reservations, query, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

const handleCancel = async (id: string) => {
  try {
    await reservationApi.cancelReservation(id);

    toast.success('Reservation cancelled');

    queryClient.invalidateQueries({
      queryKey: ['reservations'],
    });
  } catch (error) {
    console.error(error);

    toast.error('Failed to cancel reservation');
  }
};

const handleReserve = async () => {
  if (!selectedBook || !selectedMember) {
    toast.error('Please select a book and member');
    return;
  }

  try {
    await reservationApi.createReservation({
      user: selectedMember,
      book: selectedBook,
    });

    toast.success('Book reserved successfully');

    setReserveOpen(false);

    setSelectedBook('');
    setSelectedMember('');

    queryClient.invalidateQueries({
      queryKey: ['reservations'],
    });
  } catch (error) {
    console.error(error);

    toast.error('Failed to create reservation');
  }
};

  return (
    <div>
      <PageHeader
        title="Reservations"
        description="Manage book holds and pickup queues."
        actions={<Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setReserveOpen(true)}>Reserve Book</Button>}
      />

      <Card className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by book or member…" className="lg:w-80" />
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
          <EmptyState title="No reservations found" description="Reserve a book to add it to the queue." />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>Book</Th>
                  <Th>Member</Th>
                  <Th>Reserved</Th>
                  <Th>Expires</Th>
                  <Th>Queue</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </THead>
              <TBody>
                {current.map((r, i) => (
                  <Tr key={r.id}>
                    <Td>
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3">
                        <img src={r.bookCover} alt={r.bookTitle} className="h-10 w-7 rounded object-cover border border-border" />
                        <span className="font-medium text-fg">{r.bookTitle}</span>
                      </motion.div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={r.user} size="sm" />
                        <span className="text-fg-muted">{r.user}</span>
                      </div>
                    </Td>
                    <Td className="text-fg-muted">{formatDate(r.reservedAt)}</Td>
                    <Td className="text-fg-muted">{formatDate(r.expiresAt)}</Td>
                    <Td className="text-fg-muted">{r.queuePosition > 0 ? `#${r.queuePosition}` : '—'}</Td>
                    <Td><ReservationStatusBadge status={r.status} /></Td>
                    <Td>
                      {(r.status === 'pending' || r.status === 'ready') && (
                        <Button size="sm" variant="danger" leftIcon={<X className="h-3.5 w-3.5" />} onClick={() => handleCancel(r.id)}>
                          Cancel
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
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        title="Reserve Book"
        description="Place a hold on a book for a member."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReserveOpen(false)}>Cancel</Button>
            <Button onClick={handleReserve}>Reserve</Button>
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
        </div>
      </Modal>
    </div>
  );
}
