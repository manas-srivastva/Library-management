import { useQuery } from '@tanstack/react-query';
import { CalendarClock, BookOpen, CheckCircle2 } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FullPageLoader } from '@/components/ui/Loader';
import { FineStatusBadge } from '@/components/shared/StatusBadges';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';

import { useAuthContext } from '@/context/AuthContext';
import client from '@/api/client';

import { formatDate } from '@/utils/format';

interface BorrowRecord {
  _id: string;
  bookCopy?: {
    _id: string;
    barcode?: string;
    shelfLocation?: string;
    book?: {
      _id: string;
      title?: string;
      isbn?: string;
      coverImage?: string;
    };
  };
  issueDate?: string;
  dueDate?: string;
  returnDate?: string;
  status?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export default function MyBorrowsPage() {
  const { user } = useAuthContext();

  const {
    data: borrows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-borrows', user?._id],
    queryFn: async () => {
      const { data } = await client.get<ApiResponse<BorrowRecord[]>>(
        `/borrows/user/${user?._id}`
      );

      return data.data;
    },
    enabled: !!user?._id,
  });

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title="My Borrows"
          description="View your borrowed books and borrowing history."
        />

        <Card className="p-6">
          <EmptyState
            title="Failed to load borrowing history"
            description="Something went wrong while fetching your borrowed books."
          />
        </Card>
      </div>
    );
  }

  const activeBorrows = borrows.filter(
    (borrow) =>
      borrow.status === 'BORROWED' ||
      borrow.status === 'ISSUED'
  );

  const returnedBorrows = borrows.filter(
    (borrow) => borrow.status === 'RETURNED'
  );

  return (
    <div>
      <PageHeader
        title="My Borrows"
        description="View your borrowed books and borrowing history."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10">
            <BookOpen className="h-5 w-5 text-brand-400" />
          </div>

          <div>
            <p className="text-sm text-fg-muted">
              Currently Borrowed
            </p>

            <p className="mt-1 text-2xl font-semibold text-fg">
              {activeBorrows.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10">
            <CheckCircle2 className="h-5 w-5 text-brand-400" />
          </div>

          <div>
            <p className="text-sm text-fg-muted">
              Returned Books
            </p>

            <p className="mt-1 text-2xl font-semibold text-fg">
              {returnedBorrows.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Borrow History */}
      <Card className="mt-6 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
            <CalendarClock className="h-5 w-5 text-brand-400" />
          </div>

          <div>
            <h2 className="font-semibold text-fg">
              Borrowing History
            </h2>

            <p className="text-sm text-fg-muted">
              Your complete borrowing activity
            </p>
          </div>
        </div>

        {borrows.length === 0 ? (
          <EmptyState
            title="No borrowing history"
            description="You haven't borrowed any books yet."
          />
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>Book</Th>
                <Th>Barcode</Th>
                <Th>Issued</Th>
                <Th>Due Date</Th>
                <Th>Returned</Th>
                <Th>Status</Th>
              </tr>
            </THead>

            <TBody>
              {borrows.map((borrow) => (
                <Tr key={borrow._id}>
                  {/* Book */}
                  <Td>
                    <div className="flex items-center gap-3">
                      {borrow.bookCopy?.book?.coverImage ? (
                        <img
                          src={borrow.bookCopy.book.coverImage}
                          alt={borrow.bookCopy.book.title || 'Book'}
                          className="h-10 w-7 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-7 items-center justify-center rounded bg-bg-elevated">
                          <BookOpen className="h-4 w-4 text-fg-subtle" />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-fg">
                          {borrow.bookCopy?.book?.title ||
                            'Unknown Book'}
                        </p>

                        {borrow.bookCopy?.book?.isbn && (
                          <p className="text-xs text-fg-subtle">
                            ISBN: {borrow.bookCopy.book.isbn}
                          </p>
                        )}
                      </div>
                    </div>
                  </Td>

                  {/* Barcode */}
                  <Td className="text-fg-muted">
                    {borrow.bookCopy?.barcode || '—'}
                  </Td>

                  {/* Issue Date */}
                  <Td className="text-fg-muted">
                    {borrow.issueDate
                      ? formatDate(borrow.issueDate)
                      : '—'}
                  </Td>

                  {/* Due Date */}
                  <Td className="text-fg-muted">
                    {borrow.dueDate
                      ? formatDate(borrow.dueDate)
                      : '—'}
                  </Td>

                  {/* Return Date */}
                  <Td className="text-fg-muted">
                    {borrow.returnDate
                      ? formatDate(borrow.returnDate)
                      : '—'}
                  </Td>

                  {/* Status */}
                  <Td>
                    <FineStatusBadge
                      status={borrow.status || 'UNKNOWN'}
                    />
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}