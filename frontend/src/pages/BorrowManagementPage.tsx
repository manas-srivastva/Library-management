import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

import { PageHeader } from "@/components/shared/PageHeader";
import { BorrowStatusBadge } from "@/components/shared/StatusBadges";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";

import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/components/ui/Table";

import { EmptyState } from "@/components/ui/EmptyState";

import {
  Dropdown,
  DropdownItem,
} from "@/components/ui/Dropdown";

import {
  formatDate,
  formatCurrency,
} from "@/utils/format";

import { borrowApi } from "@/api/borrowApi";
import { userApi } from "@/api/usersApi";
import { bookCopyApi } from "@/api/bookCopyApi";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const statuses = ["All", "BORROWED", "RETURNED"];

const PAGE_SIZE = 6;

export default function BorrowManagementPage() {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [issueOpen, setIssueOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBookCopy, setSelectedBookCopy] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [isIssuing, setIsIssuing] = useState(false);
  const [returningId, setReturningId] = useState<string | null>(null);

  /* ==========================================
     BORROW RECORDS
  ========================================== */

  const {
    data: borrowResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "borrows",
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
        status: status === "All" ? undefined : status,
      }),

    placeholderData: (previousData) => previousData,
  });

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

  /* ==========================================
     USERS
  ========================================== */

  const {
    data: usersResponse,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });

  const users =
    Array.isArray(usersResponse)
      ? usersResponse
      : usersResponse?.users ||
        usersResponse?.data ||
        [];

  /* ==========================================
     BOOK COPIES
  ========================================== */

  const {
    data: bookCopiesResponse,
    isLoading: bookCopiesLoading,
  } = useQuery({
    queryKey: ["bookCopies"],
    queryFn: bookCopyApi.getBookCopies,
  });

  const bookCopies =
    Array.isArray(bookCopiesResponse)
      ? bookCopiesResponse
      : bookCopiesResponse?.copies ||
        bookCopiesResponse?.data ||
        [];

  const availableBookCopies = Array.isArray(bookCopies)
    ? bookCopies.filter(
        (copy: any) => copy.status === "AVAILABLE"
      )
    : [];

  /* ==========================================
     REFRESH DATA
  ========================================== */

  const refreshBorrowData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["borrows"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["bookCopies"],
      }),
    ]);
  };

  /* ==========================================
     RETURN BOOK
  ========================================== */

  const handleReturn = async (id: string) => {
    try {
      setReturningId(id);

      await borrowApi.returnBook(id);

      await refreshBorrowData();

      toast.success("Book returned successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  /* ==========================================
     ISSUE BOOK
  ========================================== */

  const handleIssue = async () => {
    if (!selectedUser || !selectedBookCopy || !dueDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsIssuing(true);

      await borrowApi.borrowBook({
        userId: selectedUser,
        bookCopyId: selectedBookCopy,
        dueDate: new Date(dueDate).toISOString(),
      });

      await refreshBorrowData();

      toast.success("Book issued successfully");

      setIssueOpen(false);
      setSelectedUser("");
      setSelectedBookCopy("");
      setDueDate("");
      setPage(1);
    } catch (error) {
      console.error(error);

      toast.error("Failed to issue book");
    } finally {
      setIsIssuing(false);
    }
  };

  /* ==========================================
     SEARCH
  ========================================== */

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  /* ==========================================
     STATUS FILTER
  ========================================== */

  const handleStatusChange = (
    newStatus: string,
    close: () => void
  ) => {
    setStatus(newStatus);
    setPage(1);
    close();
  };

  /* ==========================================
     STATS
  ========================================== */

  const totalBorrows = borrows.length;

  const activeBorrows = borrows.filter(
    (borrow: any) => borrow.status === "BORROWED"
  ).length;

  const returnedBorrows = borrows.filter(
    (borrow: any) => borrow.status === "RETURNED"
  ).length;

  const overdueBorrows = borrows.filter((borrow: any) => {
    if (borrow.status !== "BORROWED") return false;

    if (!borrow.dueDate) return false;

    return new Date(borrow.dueDate) < new Date();
  }).length;

  return (
    <div className="space-y-6">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <PageHeader
        title="Borrow Management"
        description="Track issued books, returns, and active borrowing activity."
        action={
          <Button
            onClick={() => setIssueOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Issue Book
          </Button>
        }
      />

      {/* ======================================
          STATS
      ====================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border border-border-soft shadow-none">
            <div className="flex items-start justify-between p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Total Records
                </p>

                <p className="mt-2 text-2xl font-semibold text-fg">
                  {totalBorrows}
                </p>

                <p className="mt-1 text-xs text-fg-muted">
                  Current page results
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated text-fg-muted">
                <BookOpen className="h-5 w-5" />
              </div>

            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.04 }}
        >
          <Card className="border border-border-soft shadow-none">
            <div className="flex items-start justify-between p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Active Borrows
                </p>

                <p className="mt-2 text-2xl font-semibold text-fg">
                  {activeBorrows}
                </p>

                <p className="mt-1 text-xs text-fg-muted">
                  Books currently issued
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <Card className="border border-border-soft shadow-none">
            <div className="flex items-start justify-between p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Returned
                </p>

                <p className="mt-2 text-2xl font-semibold text-fg">
                  {returnedBorrows}
                </p>

                <p className="mt-1 text-xs text-fg-muted">
                  Completed borrow records
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-500/10 text-success-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          <Card className="border border-border-soft shadow-none">
            <div className="flex items-start justify-between p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Overdue
                </p>

                <p className="mt-2 text-2xl font-semibold text-fg">
                  {overdueBorrows}
                </p>

                <p className="mt-1 text-xs text-fg-muted">
                  Require attention
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger-500/10 text-danger-400">
                <RotateCcw className="h-5 w-5" />
              </div>

            </div>
          </Card>
        </motion.div>

      </div>

      {/* ======================================
          BORROW LIST
      ====================================== */}

      <Card className="overflow-hidden border border-border-soft shadow-none">

        {/* FILTER BAR */}

        <div className="border-b border-border-soft px-5 py-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-semibold text-fg">
                Borrow Records
              </h2>

              <p className="mt-1 text-sm text-fg-muted">
                Manage issued books and return activity.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

              <div className="w-full sm:w-72">
                <SearchInput
                  value={query}
                  onChange={(event) =>
                    handleSearch(event.target.value)
                  }
                  placeholder="Search records..."
                />
              </div>

              <Dropdown
                align="left"
                trigger={
                  <span className="btn-secondary flex items-center justify-between gap-3 px-3 py-2 text-xs min-w-[140px]">
                    <span className="text-fg-muted">
                      Status
                    </span>

                    <span className="font-medium text-fg">
                      {status}
                    </span>
                  </span>
                }
              >
                {(close) => (
                  <div className="min-w-[160px] py-1">
                    {statuses.map((s) => (
                      <DropdownItem
                        key={s}
                        onClick={() =>
                          handleStatusChange(s, close)
                        }
                      >
                        {s}
                      </DropdownItem>
                    ))}
                  </div>
                )}
              </Dropdown>

            </div>

          </div>

        </div>

        {/* TABLE */}

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <p className="text-sm text-fg-muted">
              Loading borrow records...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <p className="text-sm text-danger-400">
              Failed to load borrow records.
            </p>
          </div>
        ) : borrows.length === 0 ? (
          <div className="py-10">
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              title="No borrow records found"
              description="Try changing your search or filter."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">

            <Table>

              <THead>
                <Tr>

                  <Th>Member</Th>

                  <Th>Book</Th>

                  <Th>Issued</Th>

                  <Th>Due Date</Th>

                  <Th>Status</Th>

                  <Th className="text-right">
                    Action
                  </Th>

                </Tr>
              </THead>

              <TBody>

                {borrows.map((borrow: any) => {

                  const user =
                    borrow.user ||
                    borrow.member ||
                    {};

                  const copy =
                    borrow.bookCopy ||
                    borrow.copy ||
                    {};

                  const book =
                    copy.book ||
                    borrow.book ||
                    {};

                  const memberName =
                    user.name ||
                    user.fullName ||
                    user.username ||
                    "Unknown Member";

                  const bookTitle =
                    book.title ||
                    copy.title ||
                    "Unknown Book";

                  const isBorrowed =
                    borrow.status === "BORROWED";

                  return (
                    <Tr
                      key={borrow.id}
                      className="transition-colors hover:bg-bg-elevated/40"
                    >

                      <Td>

                        <div className="flex items-center gap-3">

                          <Avatar
                            name={memberName}
                            size="sm"
                          />

                          <div>

                            <p className="font-medium text-fg">
                              {memberName}
                            </p>

                            {user.email && (
                              <p className="mt-0.5 text-xs text-fg-subtle">
                                {user.email}
                              </p>
                            )}

                          </div>

                        </div>

                      </Td>

                      <Td>

                        <div>

                          <p className="font-medium text-fg">
                            {bookTitle}
                          </p>

                          {book.author && (
                            <p className="mt-0.5 text-xs text-fg-subtle">
                              {book.author}
                            </p>
                          )}

                        </div>

                      </Td>

                      <Td className="text-sm text-fg-muted">
                        {borrow.borrowDate
                          ? formatDate(borrow.borrowDate)
                          : "-"}
                      </Td>

                      <Td>

                        <span
                          className={
                            isBorrowed &&
                            borrow.dueDate &&
                            new Date(borrow.dueDate) < new Date()
                              ? "font-medium text-danger-400"
                              : "text-sm text-fg-muted"
                          }
                        >
                          {borrow.dueDate
                            ? formatDate(borrow.dueDate)
                            : "-"}
                        </span>

                      </Td>

                      <Td>
                        <BorrowStatusBadge
                          status={borrow.status}
                        />
                      </Td>

                      <Td className="text-right">

                        {isBorrowed ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleReturn(borrow.id)
                            }
                            disabled={
                              returningId === borrow.id
                            }
                            className="gap-2"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />

                            {returningId === borrow.id
                              ? "Returning..."
                              : "Return"}
                          </Button>
                        ) : (
                          <span className="text-xs text-fg-subtle">
                            Completed
                          </span>
                        )}

                      </Td>

                    </Tr>
                  );
                })}

              </TBody>

            </Table>

          </div>
        )}

        {/* PAGINATION */}

        {borrows.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-fg-subtle">
              Showing page {page} of {pages}
            </p>

            <Pagination
              page={page}
              totalPages={pages}
              onPageChange={setPage}
            />

          </div>
        )}

      </Card>

      {/* ======================================
          ISSUE BOOK MODAL
      ====================================== */}

      <Modal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        title="Issue Book"
      >

        <div className="space-y-5">

          <div className="border-b border-border-soft pb-4">

            <p className="text-sm text-fg-muted">
              Assign an available book to a library member.
            </p>

          </div>

          {/* MEMBER */}

          <div>

            <label className="mb-2 block text-sm font-medium text-fg">
              Select Member
            </label>

            <select
              value={selectedUser}
              onChange={(event) =>
                setSelectedUser(event.target.value)
              }
              disabled={usersLoading}
              className="input-base w-full"
            >
              <option value="">
                {usersLoading
                  ? "Loading members..."
                  : "Select a member"}
              </option>

              {users.map((user: any) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name ||
                    user.fullName ||
                    user.username ||
                    user.email}
                </option>
              ))}

            </select>

          </div>

          {/* BOOK */}

          <div>

            <label className="mb-2 block text-sm font-medium text-fg">
              Select Book
            </label>

            <select
              value={selectedBookCopy}
              onChange={(event) =>
                setSelectedBookCopy(event.target.value)
              }
              disabled={bookCopiesLoading}
              className="input-base w-full"
            >
              <option value="">
                {bookCopiesLoading
                  ? "Loading books..."
                  : "Select an available book"}
              </option>

              {availableBookCopies.map((copy: any) => {

                const book =
                  copy.book ||
                  {};

                return (
                  <option
                    key={copy.id}
                    value={copy.id}
                  >
                    {book.title ||
                      copy.title ||
                      "Unknown Book"}

                    {copy.copyNumber
                      ? ` — Copy ${copy.copyNumber}`
                      : ""}
                  </option>
                );
              })}

            </select>

          </div>

          {/* DUE DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-fg">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="input-base w-full"
            />

          </div>

          {/* ACTIONS */}

          <div className="flex items-center justify-end gap-3 border-t border-border-soft pt-5">

            <Button
              variant="secondary"
              onClick={() => setIssueOpen(false)}
              disabled={isIssuing}
            >
              Cancel
            </Button>

            <Button
              onClick={handleIssue}
              disabled={isIssuing}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />

              {isIssuing
                ? "Issuing..."
                : "Issue Book"}
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
}