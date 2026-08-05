import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookCopy, Plus, ScanLine } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { CopyStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { placeholderCopies } from '@/data/placeholders';
import { paginate, totalPages } from '@/utils/format';

const statuses = ['All', 'available', 'issued', 'reserved', 'lost', 'damaged'];
const conditions = ['All', 'new', 'good', 'fair', 'poor'];
const PAGE_SIZE = 8;

const conditionTone: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  new: 'success',
  good: 'info',
  fair: 'warning',
  poor: 'danger',
};

export default function BookCopiesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [condition, setCondition] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return placeholderCopies.filter((c) => {
      const matchesQuery =
        !query ||
        c.barcode.toLowerCase().includes(query.toLowerCase()) ||
        c.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
        c.shelf.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || c.status === status;
      const matchesCondition = condition === 'All' || c.condition === condition;
      return matchesQuery && matchesStatus && matchesCondition;
    });
  }, [query, status, condition]);

  const pages = totalPages(filtered.length, PAGE_SIZE);
  const current = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Book Copies"
        description="Track every physical copy by barcode, shelf, and condition."
        actions={
          <>
            <Button variant="secondary" leftIcon={<ScanLine className="h-4 w-4" />}>Scan Barcode</Button>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Copy</Button>
          </>
        }
      />

      <Card className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by barcode, title, or shelf…" className="lg:w-80" />
          <div className="flex flex-wrap items-center gap-2">
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
            <Dropdown
              align="left"
              trigger={<span className="btn-secondary px-3 py-2 text-xs capitalize">Condition: <span className="text-fg">{condition}</span></span>}
            >
              {(close) => (
                <div>
                  {conditions.map((c) => (
                    <DropdownItem key={c} onClick={() => { setCondition(c); setPage(1); close(); }}>
                      <span className="capitalize">{c}</span>
                    </DropdownItem>
                  ))}
                </div>
              )}
            </Dropdown>
          </div>
        </div>

        {current.length === 0 ? (
          <EmptyState variant="search" title="No copies found" description="Adjust filters or add a new copy to get started." />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>Barcode</Th>
                  <Th>Book</Th>
                  <Th>Shelf</Th>
                  <Th>Condition</Th>
                  <Th>Status</Th>
                </tr>
              </THead>
              <TBody>
                {current.map((c, i) => (
                  <Tr key={c.id}>
                    <Td>
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-2">
                        <code className="rounded-md bg-bg-elevated px-2 py-1 font-mono text-xs text-fg">{c.barcode}</code>
                      </motion.div>
                    </Td>
                    <Td className="font-medium text-fg">{c.bookTitle}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5 text-fg-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                        {c.shelf}
                      </span>
                    </Td>
                    <Td><Badge tone={conditionTone[c.condition]} className="capitalize">{c.condition}</Badge></Td>
                    <Td><CopyStatusBadge status={c.status} /></Td>
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
    </div>
  );
}
