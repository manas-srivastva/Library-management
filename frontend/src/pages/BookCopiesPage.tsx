import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ScanLine } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { CopyStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';

import { bookCopyApi } from '@/api/bookCopyApi';

import { useQuery } from '@tanstack/react-query';

const statuses = [
  'All',
  'AVAILABLE',
  'ISSUED',
  'RESERVED',
  'LOST',
  'MAINTENANCE',
];

const PAGE_SIZE = 10;

export default function BookCopiesPage() {

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  /*
   * Reset to page 1 whenever search/status changes.
   */
  useEffect(() => {
    setPage(1);
  }, [query, status]);

  /*
   * Fetch only the required page from backend.
   */
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'bookCopies',
      page,
      query,
      status,
    ],

    queryFn: () =>
      bookCopyApi.getBookCopies({
        page,
        limit: PAGE_SIZE,
        search: query,
        ...(status !== 'All'
          ? { status: status as 'AVAILABLE' | 'ISSUED' | 'RESERVED' | 'LOST' | 'MAINTENANCE' }
          : {}),
      }),
  });

  /*
   * Backend now returns:
   *
   * {
   *   copies,
   *   total,
   *   page,
   *   limit,
   *   totalPages
   * }
   */
  const bookCopies = data?.copies ?? [];

  const totalPages = data?.totalPages ?? 1;

  return (
    <div>

      <PageHeader
        title="Book Copies"
        description="Track every physical copy by barcode, shelf, and status."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={
                <ScanLine className="h-4 w-4" />
              }
            >
              Scan Barcode
            </Button>

            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              Add Copy
            </Button>
          </>
        }
      />

      <Card className="p-5">

        {/* SEARCH + FILTER */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by barcode..."
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
                      close();
                    }}
                  >
                    <span>
                      {s}
                    </span>
                  </DropdownItem>

                ))}

              </div>
            )}
          </Dropdown>

        </div>

        {/* LOADING */}
        {isLoading ? (

          <div className="py-10 text-center text-fg-muted">
            Loading book copies...
          </div>

        ) : isError ? (

          <div className="py-10 text-center text-danger">
            Failed to load book copies.
          </div>

        ) : bookCopies.length === 0 ? (

          <EmptyState
            variant="search"
            title="No copies found"
            description="Try changing your search or status filter."
          />

        ) : (

          <>

            {/* TABLE */}
            <Table>

              <THead>

                <tr>
                  <Th>Barcode</Th>
                  <Th>Book</Th>
                  <Th>Shelf</Th>
                  <Th>Status</Th>
                </tr>

              </THead>

              <TBody>

                {bookCopies.map((copy, index) => (

                  <Tr key={copy._id}>

                    {/* BARCODE */}
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
                          delay: index * 0.03,
                        }}
                        className="flex items-center gap-2"
                      >

                        <code className="rounded-md bg-bg-elevated px-2 py-1 font-mono text-xs text-fg">
                          {copy.barcode}
                        </code>

                      </motion.div>

                    </Td>

                    {/* BOOK */}
                    <Td className="font-medium text-fg">

                      {typeof copy.book === 'object'
                        ? copy.book.title
                        : 'Unknown Book'}

                    </Td>

                    {/* SHELF */}
                    <Td>

                      <span className="inline-flex items-center gap-1.5 text-fg-muted">

                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />

                        {copy.shelfLocation}

                      </span>

                    </Td>

                    {/* STATUS */}
                    <Td>

                      <CopyStatusBadge
                        status={copy.status}
                      />

                    </Td>

                  </Tr>

                ))}

              </TBody>

            </Table>

            {/* PAGINATION */}
            <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">

              <span className="text-xs text-fg-muted">
                {data?.total ?? 0} total copies
              </span>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

            </div>

          </>

        )}

      </Card>

    </div>
  );
}