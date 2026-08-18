import { useState } from 'react';
import { motion } from 'framer-motion';
import {Plus, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

import { PageHeader } from '@/components/shared/PageHeader';
import { BorrowStatusBadge } from '@/components/shared/StatusBadges';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { formatDate, formatCurrency } from '@/utils/format';

import { borrowApi } from '@/api/borrowApi';
import { usersApi } from '@/api/usersApi';
import { bookApi } from '@/api/booksApi';
import { bookCopyApi } from '@/api/bookCopyApi';

import { useQuery } from '@tanstack/react-query';

const statuses = ['All', 'BORROWED', 'RETURNED'];

const PAGE_SIZE = 6;

export default function BorrowManagementPage() {

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const [issueOpen, setIssueOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBookCopy, setSelectedBookCopy] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);


  /*
   * ==========================================
   * BORROW RECORDS
   * ==========================================
   *
   * IMPORTANT:
   * Pagination/search/status are now handled
   * by the BACKEND.
   */

  const {
    data: borrowResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'borrows',
      page,
      PAGE_SIZE,
      query,
      status,
    ],

    queryFn: () =>
      borrowApi.getBorrows({
        page,
        limit: PAGE_SIZE,
        search: query || undefined,
        status: status === 'All' ? undefined : status,
      }),

    placeholderData: (previousData) => previousData,
  });


  /*
   * The backend should return something like:
   *
   * {
   *   borrows: [...],
   *   pagination: {
   *      page: 1,
   *      limit: 6,
   *      totalRecords: 100,
   *      totalPages: 17
   *   }
   * }
   *
   * We also keep this flexible in case your
   * backend uses slightly different names.
   */

  const borrows =
    Array.isArray(borrowResponse)
      ? borrowResponse
      : borrowResponse?.borrows ||
        borrowResponse?.data ||
        [];


  const backendPagination =
    !Array.isArray(borrowResponse)
      ? borrowResponse?.pagination
      : undefined;


  const pages =
    backendPagination?.totalPages ??
    backendPagination?.pages ??
    1;


  /*
   * ==========================================
   * BOOKS
   * ==========================================
   */

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getBooks,
  });


  /*
   * ==========================================
   * USERS
   * ==========================================
   */

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });


  /*
   * ==========================================
   * BOOK COPIES
   * ==========================================
   */

  const { data: bookCopies = [] } = useQuery({
    queryKey: ['bookCopies'],
    queryFn: bookCopyApi.getBookCopies,
  });


  const availableBookCopies = bookCopies.filter(
    (copy) => copy.status === 'AVAILABLE'
  );


  /*
   * ==========================================
   * RETURN BOOK
   * ==========================================
   */

  const handleReturn = async (id: string) => {

    try {

      await borrowApi.returnBook(id);

      toast.success('Book returned successfully');

      /*
       * Refetch current page instead of
       * reloading the entire website.
       */

      window.location.reload();

    } catch (error) {

      console.error(error);

      toast.error('Failed to return book');

    }

  };


  /*
   * ==========================================
   * ISSUE BOOK
   * ==========================================
   */

  const handleIssue = async () => {

    if (!selectedUser || !selectedBookCopy || !dueDate) {

      toast.error('Please fill all fields');

      return;

    }


    try {

      setIsIssuing(true);


      await borrowApi.borrowBook({

        userId: selectedUser,

        bookCopyId: selectedBookCopy,

        dueDate: new Date(dueDate).toISOString(),

      });


      toast.success('Book issued successfully');


      setIssueOpen(false);

      setSelectedUser('');

      setSelectedBookCopy('');

      setDueDate('');


      window.location.reload();

    } catch (error) {

      toast.error('Failed to issue book');

      console.error(error);

    } finally {

      setIsIssuing(false);

    }

  };


  /*
   * ==========================================
   * SEARCH
   * ==========================================
   *
   * Whenever search changes:
   * return to page 1.
   */

  const handleSearch = (value: string) => {

    setQuery(value);

    setPage(1);

  };


  /*
   * ==========================================
   * STATUS
   * ==========================================
   */

  const handleStatusChange = (
    newStatus: string,
    close: () => void
  ) => {

    setStatus(newStatus);

    setPage(1);

    close();

  };


  return (

    <div>

      <PageHeader
        title="Borrow Management"
        description="Issue, return, and track all active and historical borrows."
        actions={
          <Button
            leftIcon={
              <Plus className="h-4 w-4" />
            }
            onClick={() => setIssueOpen(true)}
          >
            Issue Book
          </Button>
        }
      />


      <Card className="p-5">

        {/* ==========================================
            SEARCH + FILTERS
           ========================================== */}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <SearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Search by book or member…"
            className="lg:w-80"
          />


          <div className="flex items-center gap-2">

            <Dropdown
              align="left"
              trigger={
                <span className="btn-secondary px-3 py-2 text-xs capitalize">

                  Status:

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
                      onClick={() =>
                        handleStatusChange(
                          s,
                          close
                        )
                      }
                    >

                      <span className="capitalize">

                        {s}

                      </span>

                    </DropdownItem>

                  ))}

                </div>

              )}

            </Dropdown>


  

          </div>

        </div>


        {/* ==========================================
            LOADING
           ========================================== */}

        {isLoading ? (

          <div className="py-12 text-center text-fg-subtle">

            Loading borrow records...

          </div>

        ) : isError ? (

          <EmptyState
            title="Failed to load borrows"
            description="Unable to fetch borrow records from the server."
          />

        ) : borrows.length === 0 ? (

          <EmptyState
            title="No borrows found"
            description={
              query || status !== 'All'
                ? 'No borrow records match your search or filter.'
                : 'Issue a book to start a borrow record.'
            }
          />

        ) : (

          <>

            {/* ==========================================
                TABLE
               ========================================== */}

            <Table>

              <THead>

                <tr>

                  <Th>Book</Th>

                  <Th>Member</Th>

                  <Th>Borrow Date</Th>

                  <Th>Due Date</Th>

                  <Th>Return Date</Th>

                  <Th>Fine</Th>

                  <Th>Status</Th>

                  <Th></Th>

                </tr>

              </THead>


              <TBody>

                {borrows.map((b: any, i: number) => (

                  <Tr key={b._id}>

                    {/* BOOK */}

                    <Td>

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 4
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        transition={{
                          delay: i * 0.03
                        }}
                        className="flex items-center gap-3"
                      >

                        {b.bookCopy?.book?.coverImage ? (

                          <img
                            src={
                              b.bookCopy.book.coverImage
                            }
                            alt={
                              b.bookCopy.book.title
                            }
                            className="h-10 w-7 rounded object-cover border border-border"
                          />

                        ) : (

                          <div className="flex h-10 w-7 items-center justify-center rounded border border-border bg-bg-elevated">

                            <span className="text-xs text-fg-subtle">

                              📖

                            </span>

                          </div>

                        )}


                        <div>

                          <span className="font-medium text-fg">

                            {
                              b.bookCopy?.book?.title ||
                              'Unknown Book'
                            }

                          </span>


                          <div className="text-xs text-fg-subtle">

                            {
                              b.bookCopy?.barcode ||
                              'No barcode'
                            }

                          </div>

                        </div>

                      </motion.div>

                    </Td>


                    {/* MEMBER */}

                    <Td>

                      <div className="flex items-center gap-2">

                        <Avatar
                          name={
                            b.user?.name ||
                            'Unknown User'
                          }
                          size="sm"
                        />


                        <div>

                          <div className="text-fg">

                            {
                              b.user?.name ||
                              'Unknown User'
                            }

                          </div>


                          <div className="text-xs text-fg-subtle">

                            {
                              b.user?.email ||
                              'No email'
                            }

                          </div>

                        </div>

                      </div>

                    </Td>


                    {/* BORROW DATE */}

                    <Td className="text-fg-muted">

                      {b.issueDate
                        ? formatDate(
                            b.issueDate
                          )
                        : '—'}

                    </Td>


                    {/* DUE DATE */}

                    <Td className="text-fg-muted">

                      {b.dueDate
                        ? formatDate(
                            b.dueDate
                          )
                        : '—'}

                    </Td>


                    {/* RETURN DATE */}

                    <Td className="text-fg-muted">

                      {b.returnDate
                        ? formatDate(
                            b.returnDate
                          )
                        : '—'}

                    </Td>


                    {/* FINE */}

                    <Td className="text-fg-subtle">

                      {b.fine
                        ? formatCurrency(
                            b.fine.amount
                          )
                        : '—'}

                    </Td>


                    {/* STATUS */}

                    <Td>

                      <BorrowStatusBadge
                        status={b.status}
                      />

                    </Td>


                    {/* ACTION */}

                    <Td>

                      {b.status !== 'RETURNED' && (

                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={
                            <RotateCcw className="h-3.5 w-3.5" />
                          }
                          onClick={() =>
                            handleReturn(
                              b._id
                            )
                          }
                        >

                          Return

                        </Button>

                      )}

                    </Td>

                  </Tr>

                ))}

              </TBody>

            </Table>


            {/* ==========================================
                SERVER-SIDE PAGINATION
               ========================================== */}

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


      {/* ==========================================
          ISSUE BOOK MODAL
         ========================================== */}

      <Modal
        open={issueOpen}
        onClose={() =>
          setIssueOpen(false)
        }
        title="Issue Book"
      >

        <div className="space-y-4">


          {/* MEMBER */}

          <div>

            <label className="mb-1 block text-sm font-medium text-fg">

              Member

            </label>


            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            >

              <option value="">

                Select member

              </option>


              {users.map((user: any) => (

                <option
                  key={user._id}
                  value={user._id}
                >

                  {user.name} — {user.email}

                </option>

              ))}

            </select>

          </div>


          {/* BOOK COPY */}

          <div>

            <label className="mb-1 block text-sm font-medium text-fg">

              Book Copy

            </label>


            <select
              value={selectedBookCopy}
              onChange={(e) =>
                setSelectedBookCopy(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            >

              <option value="">

                Select book copy

              </option>


              {availableBookCopies.map(
                (copy: any) => (

                  <option
                    key={copy._id}
                    value={copy._id}
                  >

                    {
                      copy.book?.title ||
                      'Unknown Book'
                    }

                    {' — '}

                    {copy.barcode}

                  </option>

                )
              )}

            </select>

          </div>


          {/* DUE DATE */}

          <div>

            <label className="mb-1 block text-sm font-medium text-fg">

              Due Date

            </label>


            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            />

          </div>


          {/* ACTIONS */}

          <div className="flex justify-end gap-2 pt-2">

            <Button
              variant="secondary"
              onClick={() =>
                setIssueOpen(false)
              }
            >

              Cancel

            </Button>


            <Button
              onClick={handleIssue}
              disabled={isIssuing}
            >

              {isIssuing
                ? 'Issuing...'
                : 'Issue Book'}

            </Button>

          </div>


        </div>

      </Modal>

    </div>

  );

}