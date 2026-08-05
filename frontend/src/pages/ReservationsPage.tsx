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
import { placeholderReservations, placeholderBooks, placeholderMembers } from '@/data/placeholders';
import { formatDate, paginate, totalPages } from '@/utils/format';

const statuses = ['All', 'pending', 'ready', 'fulfilled', 'cancelled', 'expired'];
const PAGE_SIZE = 6;

export default function ReservationsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reservations, setReservations] = useState(placeholderReservations);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesQuery =
        !query ||
        r.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
        r.user.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || r.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [reservations, query, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

  const handleCancel = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r)));
    toast.success('Reservation cancelled');
  };

  const handleReserve = () => {
    setReserveOpen(false);
    toast.success('Book reserved successfully');
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
