import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/context/AuthContext';
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

import { reservationApi } from '@/api/reservationApi';
import { bookApi } from '@/api/booksApi';
import { userApi } from '@/api/usersApi';

import { formatDate, paginate, totalPages } from '@/utils/format';

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
const { user } = useAuthContext();
  // -----------------------------
  // RESERVATIONS
  // -----------------------------

  const {
  data: reservations = [],
  isLoading: reservationsLoading,
  isError: reservationsError,
} = useQuery({
  queryKey: ['reservations', user?.role, user?._id],
  queryFn:
    user?.role === 'MEMBER'
      ? reservationApi.getMyReservations
      : reservationApi.getReservations,
  enabled: !!user,
});

  // -----------------------------
  // BOOKS
  // -----------------------------

const {
  data: booksData,
  isLoading: booksLoading,
} = useQuery({
  queryKey: ['books'],
  queryFn: () => bookApi.getBooks({ limit: 100 }),
});

const books = booksData?.books ?? [];

  // -----------------------------
  // USERS
  // -----------------------------

 const {
  data: users = [],
  isLoading: usersLoading,
} = useQuery({
  queryKey: ['users'],
  queryFn: userApi.getUsers,
  enabled: user?.role !== 'MEMBER',
});

  // -----------------------------
  // FILTERING
  // -----------------------------

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const bookTitle = r.book?.title || '';
      const userName = r.user?.name || '';
      const userEmail = r.user?.email || '';

      const matchesQuery =
        !query ||
        bookTitle
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        userName
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        userEmail
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        status === 'All' || r.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [reservations, query, status]);

  const pages = totalPages(
    filtered.length,
    PAGE_SIZE
  );

  const current = paginate(
    filtered,
    page,
    PAGE_SIZE
  );

  // -----------------------------
  // CREATE RESERVATION
  // -----------------------------

  const createReservationMutation = useMutation({
    mutationFn: reservationApi.createReservation,

    onSuccess: () => {
      toast.success('Book reserved successfully');

      queryClient.invalidateQueries({
        queryKey: ['reservations'],
      });

      setSelectedBook('');
      setSelectedMember('');
      setReserveOpen(false);
    },

    onError: (error) => {
      console.error(error);
      toast.error('Failed to create reservation');
    },
  });

  // -----------------------------
  // CANCEL RESERVATION
  // -----------------------------

  const cancelReservationMutation = useMutation({
    mutationFn: reservationApi.cancelReservation,

    onSuccess: () => {
      toast.success('Reservation cancelled');

      queryClient.invalidateQueries({
        queryKey: ['reservations'],
      });
    },

    onError: (error) => {
      console.error(error);
      toast.error('Failed to cancel reservation');
    },
  });

  // -----------------------------
  // HANDLERS
  // -----------------------------

  const handleCancel = (id: string) => {
    cancelReservationMutation.mutate(id);
  };

const handleReserve = () => {
  if (!selectedBook) {
    toast.error('Please select a book');
    return;
  }

  if (user?.role === 'MEMBER') {
    createReservationMutation.mutate({
      user: user.email,
      book: selectedBook,
    });

    return;
  }

  if (!selectedMember) {
    toast.error('Please select a member');
    return;
  }

  createReservationMutation.mutate({
    user: selectedMember,
    book: selectedBook,
  });
};

  // -----------------------------
  // LOADING / ERROR
  // -----------------------------

  if (reservationsLoading) {
    return (
      <div>
        <PageHeader
          title="Reservations"
          description="Manage book holds and pickup queues."
        />

        <Card className="p-5">
          <div className="py-12 text-center text-fg-muted">
            Loading reservations...
          </div>
        </Card>
      </div>
    );
  }

  if (reservationsError) {
    return (
      <div>
        <PageHeader
          title="Reservations"
          description="Manage book holds and pickup queues."
        />

        <Card className="p-5">
          <div className="py-12 text-center text-red-400">
            Failed to load reservations.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reservations"
        description="Manage book holds and pickup queues."
        actions={
  user?.role !== 'MEMBER' ? (
    <Button
      leftIcon={
        <Plus className="h-4 w-4" />
      }
      onClick={() => setReserveOpen(true)}
    >
      Reserve Book
    </Button>
  ) : undefined
}
      />

      <Card className="p-5">

        {/* SEARCH + FILTER */}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search by book or member…"
            className="lg:w-80"
          />

          <Dropdown
            align="left"
            trigger={
              <span className="btn-secondary px-3 py-2 text-xs">
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
                    {s}
                  </DropdownItem>
                ))}
              </div>
            )}
          </Dropdown>

        </div>

        {/* EMPTY STATE */}

        {current.length === 0 ? (
          <EmptyState
            title="No reservations found"
            description="Reserve a book to add it to the queue."
          />
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

                  <Tr key={r._id}>

                    {/* BOOK */}

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
                          delay: i * 0.03,
                        }}
                        className="flex items-center gap-3"
                      >

                        {r.book?.coverImage ? (
                          <img
                            src={r.book.coverImage}
                            alt={
                              r.book.title
                            }
                            className="h-10 w-7 rounded object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-10 w-7 items-center justify-center rounded border border-border bg-bg-elevated text-[10px] text-fg-subtle">
                            Book
                          </div>
                        )}

                        <span className="font-medium text-fg">
                          {r.book?.title ||
                            'Unknown Book'}
                        </span>

                      </motion.div>

                    </Td>

                    {/* MEMBER */}

                    <Td>

                      <div className="flex items-center gap-2">

                        <Avatar
                          name={
                            r.user?.name ||
                            'Unknown User'
                          }
                          size="sm"
                        />

                        <div>

                          <div className="text-fg-muted">
                            {r.user?.name ||
                              'Unknown User'}
                          </div>

                          <div className="text-xs text-fg-subtle">
                            {r.user?.email || ''}
                          </div>

                        </div>

                      </div>

                    </Td>

                    {/* RESERVED */}

                    <Td className="text-fg-muted">
                      {r.reservationDate
                        ? formatDate(
                            r.reservationDate
                          )
                        : '—'}
                    </Td>

                    {/* EXPIRES */}

                    <Td className="text-fg-muted">
                      {r.expiryDate
                        ? formatDate(
                            r.expiryDate
                          )
                        : '—'}
                    </Td>

                    {/* QUEUE */}

                    <Td className="text-fg-muted">
                      —
                    </Td>

                    {/* STATUS */}

                    <Td>
                      <ReservationStatusBadge
                        status={r.status}
                      />
                    </Td>

                    {/* CANCEL */}

                    <Td>

                      {r.status ===
                        'ACTIVE' && (

                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={
                            <X className="h-3.5 w-3.5" />
                          }
                          disabled={
                            cancelReservationMutation.isPending
                          }
                          onClick={() =>
                            handleCancel(
                              r._id
                            )
                          }
                        >
                          Cancel
                        </Button>

                      )}

                    </Td>

                  </Tr>

                ))}

              </TBody>

            </Table>

            <div className="mt-5 border-t border-border-soft pt-4">

              <Pagination
                page={page}
                totalPages={pages}
                onPageChange={setPage}
              />

            </div>

          </>

        )}

      </Card>

      {/* CREATE RESERVATION MODAL */}

      <Modal
        open={reserveOpen}
        onClose={() =>
          setReserveOpen(false)
        }
        title="Reserve Book"
        description="Place a hold on a book for a member."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setReserveOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleReserve}
              disabled={
                createReservationMutation.isPending
              }
            >
              {createReservationMutation.isPending
                ? 'Reserving...'
                : 'Reserve'}
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          {/* BOOK SELECT */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-fg">
              Book
            </label>

            <select
              className="input-base"
              value={selectedBook}
              onChange={(e) =>
                setSelectedBook(
                  e.target.value
                )
              }
              disabled={booksLoading}
            >

              <option value="">
                {booksLoading
                  ? 'Loading books...'
                  : 'Select a book'}
              </option>

              {books.map((book) => (

                <option
                  key={book._id}
                  value={book.title}
                >
                  {book.title}
                </option>

              ))}

            </select>

          </div>

          {/* MEMBER SELECT */}

{/* MEMBER SELECT */}

{user?.role !== 'MEMBER' && (
  <div>

    <label className="mb-1.5 block text-sm font-medium text-fg">
      Member
    </label>

    <select
      className="input-base"
      value={selectedMember}
      onChange={(e) =>
        setSelectedMember(e.target.value)
      }
      disabled={usersLoading}
    >

      <option value="">
        {usersLoading
          ? 'Loading members...'
          : 'Select a member'}
      </option>

      {users
        .filter(
          (user) =>
            user.role === 'MEMBER' &&
            user.status === 'ACTIVE'
        )
        .map((user) => (

          <option
            key={user._id}
            value={user.email}
          >
            {user.name} — {user.email}
          </option>

        ))}

    </select>

  </div>
)}

        </div>

      </Modal>

    </div>
  );
}