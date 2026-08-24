import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  ScanLine,
  PackageOpen,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { CopyStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
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

  useEffect(() => {
    setPage(1);
  }, [query, status]);

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
          ? {
              status: status as
                | 'AVAILABLE'
                | 'ISSUED'
                | 'RESERVED'
                | 'LOST'
                | 'MAINTENANCE',
            }
          : {}),
      }),
  });

  const bookCopies = data?.copies ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCopies = data?.total ?? 0;

  return (
    <div className="space-y-6">

      <PageHeader
        title="Book Copies"
        description="Manage and track every physical copy in your library."
        actions={
          <div className="flex items-center gap-2">
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
          </div>
        }
      />

      {/* MAIN CONTENT */}
      <Card className="overflow-hidden">

        {/* TOOLBAR */}
        <div className="border-b border-border-soft bg-bg-soft/20 px-5 py-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT SIDE */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="relative lg:w-[340px]">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search barcode or book..."
                />
              </div>

              <Dropdown
                align="left"
                trigger={
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-soft bg-bg-card px-3 text-sm text-fg transition-colors hover:bg-bg-elevated"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-fg-subtle" />

                    <span className="text-fg-muted">
                      Status
                    </span>

                    <span className="font-medium text-fg">
                      {status === 'All'
                        ? 'All copies'
                        : status}
                    </span>
                  </button>
                }
              >
                {(close) => (
                  <div className="min-w-[180px] p-1">
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
                            {s === 'All'
                              ? 'All copies'
                              : s}
                          </span>

                          {status === s && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                          )}
                        </div>
                      </DropdownItem>
                    ))}
                  </div>
                )}
              </Dropdown>

            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 text-xs text-fg-muted">

              <div className="flex items-center gap-2 rounded-lg border border-border-soft bg-bg-card px-3 py-2">

                <PackageOpen className="h-4 w-4 text-brand-400" />

                <span>
                  <span className="font-semibold text-fg">
                    {totalCopies}
                  </span>{' '}
                  total copies
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="min-h-[420px]">

          {isLoading ? (

            <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-fg-muted">

              <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-brand-400" />

              <p className="text-sm">
                Loading book copies...
              </p>

            </div>

          ) : isError ? (

            <div className="flex min-h-[420px] items-center justify-center">

              <div className="text-center">
                <p className="font-medium text-danger">
                  Failed to load book copies
                </p>

                <p className="mt-1 text-sm text-fg-muted">
                  Please try refreshing the page.
                </p>
              </div>

            </div>

          ) : bookCopies.length === 0 ? (

            <div className="flex min-h-[420px] items-center justify-center">

              <EmptyState
                variant="search"
                title="No copies found"
                description="Try adjusting your search or changing the selected status."
              />

            </div>

          ) : (

            <>
              {/* TABLE */}
              <Table>

                <THead>
                  <tr>
                    <Th>
                      <span className="pl-1">
                        Barcode
                      </span>
                    </Th>

                    <Th>
                      Book
                    </Th>

                    <Th>
                      Shelf location
                    </Th>

                    <Th>
                      Status
                    </Th>
                  </tr>
                </THead>

                <TBody>

                  {bookCopies.map((copy, index) => {

                    const bookTitle =
                      typeof copy.book === 'object'
                        ? copy.book?.title
                        : 'Unknown Book';

                    return (

                      <Tr
                        key={copy._id}
                        className="group transition-colors hover:bg-bg-elevated/40"
                      >

                        {/* BARCODE */}
                        <Td>

                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 6,
                            }}

                            animate={{
                              opacity: 1,
                              y: 0,
                            }}

                            transition={{
                              delay: index * 0.025,
                              duration: 0.2,
                            }}

                            className="flex items-center gap-3"
                          >

                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border-soft bg-bg-elevated/60 text-fg-subtle">

                              <ScanLine className="h-4 w-4" />

                            </div>

                            <code className="rounded-md border border-border-soft bg-bg-card px-2 py-1 font-mono text-xs font-medium text-fg">

                              {copy.barcode}

                            </code>

                          </motion.div>

                        </Td>

                        {/* BOOK */}
                        <Td>

                          <div className="flex flex-col">

                            <span className="font-medium text-fg transition-colors group-hover:text-brand-400">
                              {bookTitle}
                            </span>

                            <span className="mt-0.5 text-xs text-fg-subtle">
                              Physical library copy
                            </span>

                          </div>

                        </Td>

                        {/* SHELF */}
                        <Td>

                          <div className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-bg-soft/30 px-2.5 py-1.5 text-sm text-fg-muted">

                            <MapPin className="h-3.5 w-3.5 text-fg-subtle" />

                            <span>
                              {copy.shelfLocation || 'Not assigned'}
                            </span>

                          </div>

                        </Td>

                        {/* STATUS */}
                        <Td>

                          <CopyStatusBadge
                            status={copy.status}
                          />

                        </Td>

                      </Tr>
                    );
                  })}

                </TBody>

              </Table>

              {/* FOOTER */}
              <div className="flex flex-col gap-4 border-t border-border-soft bg-bg-soft/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2 text-xs text-fg-muted">

                  <span>
                    Showing
                  </span>

                  <span className="font-semibold text-fg">
                    {bookCopies.length}
                  </span>

                  <span>
                    of
                  </span>

                  <span className="font-semibold text-fg">
                    {totalCopies}
                  </span>

                  <span>
                    copies
                  </span>

                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />

              </div>

            </>
          )}

        </div>

      </Card>

    </div>
  );
}