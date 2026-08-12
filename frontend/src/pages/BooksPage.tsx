import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {  Filter, Plus} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import type { Book } from '@/types';
import { paginate, totalPages } from '@/utils/format';
import { bookApi } from '@/api/booksApi';
import { useQuery } from '@tanstack/react-query';
const categories = ['All'];
const statuses = ['All', 'available', 'borrowed', 'reserved', 'lost', 'damaged'];
const PAGE_SIZE = 6;

export default function BooksPage() {
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getBooks,
  })
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Book | null>(null);
  ;

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const authorNames = b.authors
        ?.map((author) => author.name)
        .join(', ');

      const matchesQuery =
        !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        authorNames.toLowerCase().includes(query.toLowerCase()) ||
        b.isbn.includes(query);

      const matchesCategory =
        category === 'All' || b.category?.name === category;

      // Status will be handled later when we connect BookCopy data
      const matchesStatus = status === 'All';

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [books, query, category, status]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Books"
        description="Browse and manage your library catalog."
        actions={
          <>
            <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
              Export
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Book</Button>
          </>
        }
      />

      <Card className="p-5">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by title, author, or ISBN…" className="lg:w-80" />
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              align="left"
              trigger={
                <span className="btn-secondary px-3 py-2 text-xs">
                  Category: <span className="text-fg">{category}</span>
                </span>
              }
            >
              {(close) => (
                <div className="max-h-64 overflow-y-auto">
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
            <Dropdown
              align="left"
              trigger={
                <span className="btn-secondary px-3 py-2 text-xs capitalize">
                  Status: <span className="text-fg">{status}</span>
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
                      <span className="capitalize">{s}</span>
                    </DropdownItem>
                  ))}
                </div>
              )}
            </Dropdown>
          </div>
        </div>

        {current.length === 0 ? (
          <EmptyState
            variant="search"
            title="No books found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setCategory('All'); setStatus('All'); }}>Clear filters</Button>}
          />
        ) : (
          <>
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
                {current.map((b, i) => (
                  <Tr key={b._id} className="cursor-pointer" onClick={() => setSelected(b)}>
                    <Td>
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3"
                      >
                        <img src={b.coverImage || '/Book1.png'} alt={b.title} className="h-12 w-9 rounded-md object-cover border border-border" />
                        <div>
                          <p className="font-medium text-fg">{b.title}</p>
                          <p className="text-xs text-fg-subtle">ISBN {b.isbn}</p>
                        </div>
                      </motion.div>
                    </Td>
                    <Td className="text-fg-muted">
                      {b.authors?.map((author) => author.name).join(', ')}
                    </Td>
                    <Td className="text-fg-muted">
                      {b.publisher?.name}
                    </Td>
                    <Td>
                      <Badge tone="neutral">
                        {b.category?.name}
                      </Badge>
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

      {/* Details modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Book Details"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <Button>Reserve Book</Button>
          </>
        }
      >
       {selected && (
  <div className="flex flex-col gap-6 sm:flex-row">
    <img
      src={selected.coverImage || '/Book1.png'}
      alt={selected.title}
      className="h-64 w-44 rounded-xl object-cover border border-border shadow-card"
    />

    <div className="flex-1 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-fg">
          {selected.title}
        </h3>

        <p className="text-sm text-fg-muted">
          by {selected.authors?.map((author) => author.name).join(', ')}
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
        {selected.description || 'No description available.'}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info
          label="Publisher"
          value={selected.publisher?.name || 'N/A'}
        />

        <Info
          label="Published"
          value={
            selected.publicationYear
              ? String(selected.publicationYear)
              : 'N/A'
          }
        />

        <Info
          label="ISBN"
          value={selected.isbn}
        />

        <Info
          label="Pages"
          value={
            selected.pages
              ? String(selected.pages)
              : 'N/A'
          }
        />
      </div>
    </div>
  </div>
)}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-soft px-3 py-2.5">
      <p className="text-xs text-fg-subtle">{label}</p>
      <p className="mt-0.5 font-medium text-fg">{value}</p>
    </div>
  );
}
