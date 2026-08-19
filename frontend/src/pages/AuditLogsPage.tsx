import { useMemo, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';

import { auditApi } from '@/api/auditApi';
import { formatDate, paginate, totalPages } from '@/utils/format';

const PAGE_SIZE = 8;

export default function AuditLogsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: logs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: auditApi.getAll,
  });

  const filteredLogs = useMemo(() => {
    const search = query.toLowerCase();

    return logs.filter((log: any) => {
      const userName = log.user?.name || '';
      const userEmail = log.user?.email || '';
      const action = log.action || '';
      const entity = log.entity || '';

      return (
        !query ||
        userName.toLowerCase().includes(search) ||
        userEmail.toLowerCase().includes(search) ||
        action.toLowerCase().includes(search) ||
        entity.toLowerCase().includes(search)
      );
    });
  }, [logs, query]);

  const pages = totalPages(
    filteredLogs.length,
    PAGE_SIZE
  );

  const currentLogs = paginate(
    filteredLogs,
    page,
    PAGE_SIZE
  );

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Audit Logs"
          description="Track important activities performed in the library."
        />

        <Card className="mt-6 p-8">
          <div className="text-center text-sm text-fg-muted">
            Loading audit logs...
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Audit Logs"
          description="Track important activities performed in the library."
        />

        <Card className="mt-6 p-8">
          <EmptyState
            title="Unable to load audit logs"
            description="Something went wrong while fetching audit logs."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Track important activities performed in the library."
      />

      <Card className="mt-6 p-5">
        <div className="mb-5">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search user, action or entity..."
            className="lg:w-96"
          />
        </div>

        {currentLogs.length === 0 ? (
          <EmptyState
            title="No audit logs found"
            description="No audit logs match your search."
          />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Entity</Th>
                  <Th>Entity ID</Th>
                  <Th>Date</Th>
                </tr>
              </THead>

              <TBody>
                {currentLogs.map((log: any) => (
                  <Tr key={log._id}>

                    {/* User */}
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={
                            log.user?.name ||
                            'Unknown User'
                          }
                          size="sm"
                        />

                        <div>
                          <div className="font-medium text-fg">
                            {log.user?.name ||
                              'Unknown User'}
                          </div>

                          <div className="text-xs text-fg-subtle">
                            {log.user?.email ||
                              'No email'}
                          </div>
                        </div>
                      </div>
                    </Td>

                    {/* Action */}
                    <Td>
                      <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                        {log.action}
                      </span>
                    </Td>

                    {/* Entity */}
                    <Td className="text-fg-muted">
                      {log.entity}
                    </Td>

                    {/* Entity ID */}
                    <Td className="max-w-[180px] truncate text-xs text-fg-subtle">
                      {log.entityId || '—'}
                    </Td>

                    {/* Date */}
                    <Td className="text-fg-muted">
                      {log.createdAt
                        ? formatDate(log.createdAt)
                        : '—'}
                    </Td>

                  </Tr>
                ))}
              </TBody>
            </Table>

            {pages > 1 && (
              <div className="mt-5 border-t border-border-soft pt-4">
                <Pagination
                  page={page}
                  totalPages={pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}