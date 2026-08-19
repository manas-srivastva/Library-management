import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  /*
   * Reset pagination when search changes.
   */
  useEffect(() => {
    setPage(1);
  }, [query]);

  /*
   * Fetch books from backend.
   *
   * Backend handles:
   * - search
   * - pagination
   */
  const {
    data,
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: [
      'books',
      page,
      query,
    ],

    queryFn: () =>
      bookApi.getBooks({
        page,
        limit: PAGE_SIZE,
        search: query,
      }),
  });

  /*
   * Fetch book copies.
   *
   * Used for showing copy counts
   * inside the book details modal.
   */
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

  /*
   * Category filtering.
   *
   * Since category is not currently supported
   * by the backend pagination API, keep this
   * simple for now.
   */
  const filteredBooks =
    category === 'All'
      ? books
      : books.filter(
          (book) =>
            book.category?.name === category
        );

  /*
   * Reset page if category filtering leaves
   * the current page empty.
   */
  useEffect(() => {
    if (
      filteredBooks.length === 0 &&
      page > 1
    ) {
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

  return (
    <div>

      <PageHeader
        title="Books"
        description="Browse and manage your library catalog."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={
                <Filter className="h-4 w-4" />
              }
            >
              Export
            </Button>

            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              Add Book
            </Button>
          </>
        }
      />

      <Card className="p-5">

        {/* SEARCH + FILTERS */}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by title, author, or ISBN…"
            className="lg:w-80"
          />

          <Dropdown
            align="left"
            trigger={
              <span className="btn-secondary px-3 py-2 text-xs">
                Category:{' '}
                <span className="text-fg">
                  {category}
                </span>
              </span>
            }
          >
            {(close) => (
              <div>

                {categories.map((c) => (

                  <DropdownItem
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setPage(1);
                      close();
                    }}
                  >
                    {c}
                  </DropdownItem>

                ))}

              </div>
            )}
          </Dropdown>

        </div>

        {/* LOADING */}

        {booksLoading ? (

          <div className="py-10 text-center text-fg-muted">
            Loading books...
          </div>

        ) : booksError ? (

          <div className="py-10 text-center text-danger">
            Failed to load books.
          </div>

        ) : filteredBooks.length === 0 ? (

          <EmptyState
            variant="search"
            title="No books found"
            description="Try adjusting your search or filters."
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

        ) : (

          <>

            {/* BOOK TABLE */}

            <Table>

              <THead>

                <tr>
                  <Th>Book</Th>
                  <Th>Author</Th>
                  <Th>Publisher</Th>
                  <Th>Category</Th>
                </tr>

              </THead>

              <TBody>

                {filteredBooks.map(
                  (book, index) => (

                    <Tr
                      key={book._id}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelected(book)
                      }
                    >

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
                            delay:
                              index * 0.04,
                          }}
                          className="flex items-center gap-3"
                        >

                          <img
                            src={
                              book.coverImage ||
                              '/Book1.png'
                            }
                            alt={book.title}
                            className="h-12 w-9 rounded-md object-cover border border-border"
                          />

                          <div>

                            <p className="font-medium text-fg">
                              {book.title}
                            </p>

                            <p className="text-xs text-fg-subtle">
                              ISBN {book.isbn}
                            </p>

                          </div>

                        </motion.div>

                      </Td>

                      {/* AUTHOR */}

                      <Td className="text-fg-muted">

                        {book.authors
                          ?.map(
                            (author) =>
                              author.name
                          )
                          .join(', ')}

                      </Td>

                      {/* PUBLISHER */}

                      <Td className="text-fg-muted">

                        {book.publisher?.name}

                      </Td>

                      {/* CATEGORY */}

                      <Td>

                        <Badge tone="neutral">

                          {book.category?.name}

                        </Badge>

                      </Td>

                    </Tr>

                  )
                )}

              </TBody>

            </Table>

            {/* PAGINATION */}

            <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">

              <span className="text-xs text-fg-muted">

                {data?.total ?? 0} total books

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

      {/* BOOK DETAILS MODAL */}

      <Modal
        open={!!selected}
        onClose={() =>
          setSelected(null)
        }
        title="Book Details"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setSelected(null)
              }
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

          <div className="flex flex-col gap-6 sm:flex-row">

            <img
              src={
                selected.coverImage ||
                '/Book1.png'
              }
              alt={selected.title}
              className="h-64 w-44 rounded-xl object-cover border border-border shadow-card"
            />

            <div className="flex-1 space-y-4">

              <div>

                <h3 className="text-xl font-bold text-fg">
                  {selected.title}
                </h3>

                <p className="text-sm text-fg-muted">
                  by{' '}
                  {selected.authors
                    ?.map(
                      (author) =>
                        author.name
                    )
                    .join(', ')}
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <Badge tone="neutral">
                  {selected.category?.name}
                </Badge>

                <Badge tone="neutral">
                  {selected.language}
                </Badge>

              </div>

              <p className="text-sm text-fg-muted">
                {selected.description ||
                  'No description available.'}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">

                <Info
                  label="Publisher"
                  value={
                    selected.publisher
                      ?.name || 'N/A'
                  }
                />

                <Info
                  label="Published"
                  value={
                    selected.publicationYear
                      ? String(
                          selected.publicationYear
                        )
                      : 'N/A'
                  }
                />

                <Info
                  label="ISBN"
                  value={
                    selected.isbn
                  }
                />

                <Info
                  label="Pages"
                  value={
                    selected.pages
                      ? String(
                          selected.pages
                        )
                      : 'N/A'
                  }
                />

                <Info
                  label="Total Copies"
                  value={String(
                    selectedBookCopies.length
                  )}
                />

                <Info
                  label="Available Copies"
                  value={String(
                    selectedBookCopies.filter(
                      (copy) =>
                        copy.status ===
                        'AVAILABLE'
                    ).length
                  )}
                />

              </div>

              {copiesLoading && (

                <p className="text-xs text-fg-muted">
                  Loading copy information...
                </p>

              )}

              {copiesError && (

                <p className="text-xs text-danger">
                  Could not load copy information.
                </p>

              )}

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="rounded-xl border border-border-soft bg-bg-soft px-3 py-2.5">

      <p className="text-xs text-fg-subtle">
        {label}
      </p>

      <p className="mt-0.5 font-medium text-fg">
        {value}
      </p>

    </div>

  );
}