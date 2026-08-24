import { useEffect, useState } from 'react';
import { Filter, Plus } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@/components/ui/Table';

import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';

import type { Book } from '@/types';

import { bookApi } from '@/api/booksApi';
import { bookCopyApi } from '@/api/bookCopyApi';

import { useQuery } from '@tanstack/react-query';

const categories = ['All'];

const PAGE_SIZE = 6;

export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Book | null>(null);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const {
    data,
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: ['books', page, query],

    queryFn: () =>
      bookApi.getBooks({
        page,
        limit: PAGE_SIZE,
        search: query,
      }),
  });

  const {
    data: bookCopiesData,
    isLoading: copiesLoading,
    isError: copiesError,
  } = useQuery({
    queryKey: ['bookCopies'],

    queryFn: () =>
      bookCopyApi.getBookCopies({
        page: 1,
        limit: 100,
      }),
  });

  const books = data?.books ?? [];

  const totalPages = data?.totalPages ?? 1;

  const bookCopies = bookCopiesData?.copies ?? [];

  const filteredBooks =
    category === 'All'
      ? books
      : books.filter(
          (book) => book.category?.name === category
        );

  useEffect(() => {
    if (filteredBooks.length === 0 && page > 1) {
      setPage(1);
    }
  }, [filteredBooks.length, page]);

  const selectedBookCopies = selected
    ? bookCopies.filter((copy) =>
        typeof copy.book === 'object'
          ? copy.book._id === selected._id
          : copy.book === selected._id
      )
    : [];

  const availableCopies = selectedBookCopies.filter(
    (copy) => copy.status === 'AVAILABLE'
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Manage and browse your library catalog."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Export
            </Button>

            <Button
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Book
            </Button>
          </div>
        }
      />

      {/* Catalog */}
      <Card className="overflow-hidden border border-border-soft shadow-xs rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-border-soft bg-bg-soft/50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-fg tracking-tight">
              Library Catalog
            </h2>

            <p className="mt-0.5 text-xs text-fg-muted">
              Search and view books available in the library.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search title, author or ISBN"
              className="w-full sm:w-72"
            />

            <Dropdown
              align="right"
              trigger={
                <span className="btn-secondary whitespace-nowrap px-3 py-2 text-xs font-medium cursor-pointer">
                  Category: <span className="text-fg font-semibold">{category}</span>
                </span>
              }
            >
              {(close) => (
                <div>
                  {categories.map((item) => (
                    <DropdownItem
                      key={item}
                      onClick={() => {
                        setCategory(item);
                        setPage(1);
                        close();
                      }}
                    >
                      {item}
                    </DropdownItem>
                  ))}
                </div>
              )}
            </Dropdown>
          </div>
        </div>

        {/* Loading */}
        {booksLoading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-fg-muted animate-pulse">
              Loading books...
            </p>
          </div>
        ) : booksError ? (
          <div className="py-16 text-center">
            <p className="text-sm text-danger font-medium">
              Failed to load books.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-6">
            <EmptyState
              variant="search"
              title="No books found"
              description="Try changing your search or clearing the filters."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery('');
                    setCategory('All');
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <tr className="border-b border-border-soft bg-bg-soft/30">
                    <Th className="py-3 px-5 text-xs font-semibold">Book</Th>
                    <Th className="py-3 px-5 text-xs font-semibold">Author</Th>
                    <Th className="py-3 px-5 text-xs font-semibold">Publisher</Th>
                    <Th className="py-3 px-5 text-xs font-semibold">Category</Th>
                  </tr>
                </THead>

                <TBody className="divide-y divide-border-soft">
                  {filteredBooks.map((book) => (
                    <Tr
                      key={book._id}
                      className="cursor-pointer transition-colors duration-150 hover:bg-bg-elevated/50"
                      onClick={() => setSelected(book)}
                    >
                      <Td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-9 shrink-0 overflow-hidden rounded border border-border-soft bg-bg-soft shadow-xs">
                            <img
                              src={
                                book.coverImage ||
                                '/Book1.png'
                              }
                              alt={book.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-fg">
                              {book.title}
                            </p>

                            <p className="mt-0.5 text-xs text-fg-subtle font-mono">
                              ISBN {book.isbn || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </Td>

                      <Td className="py-3.5 px-5 text-xs text-fg-muted font-medium">
                        {book.authors
                          ?.map((author) => author.name)
                          .join(', ') || 'N/A'}
                      </Td>

                      <Td className="py-3.5 px-5 text-xs text-fg-muted">
                        {book.publisher?.name || 'N/A'}
                      </Td>

                      <Td className="py-3.5 px-5">
                        <Badge tone="neutral" className="text-xs">
                          {book.category?.name || 'Uncategorized'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-border-soft bg-bg-soft/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-fg-muted">
                Showing page <span className="font-semibold text-fg">{page}</span> of{' '}
                <span className="font-semibold text-fg">{totalPages}</span> ·{' '}
                <span className="font-semibold text-fg">{data?.total ?? 0}</span> books
              </p>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      {/* Book Details */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Book Details"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>

            <Button>
              Reserve Book
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-6">
            {/* Main info */}
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-bg-soft shadow-sm sm:mx-0">
                <img
                  src={
                    selected.coverImage ||
                    '/Book1.png'
                  }
                  alt={selected.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-fg tracking-tight">
                  {selected.title}
                </h3>

                <p className="mt-1 text-sm text-fg-muted font-medium">
                  {selected.authors
                    ?.map((author) => author.name)
                    .join(', ') || 'Unknown author'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="neutral">
                    {selected.category?.name || 'Uncategorized'}
                  </Badge>

                  {selected.language && (
                    <Badge tone="neutral">
                      {selected.language}
                    </Badge>
                  )}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-fg-muted">
                  {selected.description ||
                    'No description available for this book.'}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="border-t border-border-soft pt-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg">
                Publication Details
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                <Detail
                  label="Publisher"
                  value={selected.publisher?.name || 'N/A'}
                />

                <Detail
                  label="Published"
                  value={
                    selected.publicationYear
                      ? String(selected.publicationYear)
                      : 'N/A'
                  }
                />

                <Detail
                  label="ISBN"
                  value={selected.isbn || 'N/A'}
                />

                <Detail
                  label="Pages"
                  value={
                    selected.pages
                      ? String(selected.pages)
                      : 'N/A'
                  }
                />

                <Detail
                  label="Total Copies"
                  value={String(selectedBookCopies.length)}
                />

                <Detail
                  label="Available"
                  value={String(availableCopies)}
                />
              </div>
            </div>

            {copiesLoading && (
              <p className="text-xs text-fg-muted">
                Loading copy information...
              </p>
            )}

            {copiesError && (
              <p className="text-xs text-danger font-medium">
                Could not load copy information.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-fg-subtle">
        {label}
      </p>

      <p className="mt-1 font-medium text-fg">
        {value}
      </p>
    </div>
  );
}