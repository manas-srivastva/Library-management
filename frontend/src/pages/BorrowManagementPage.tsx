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

  const activeBorrows = borrows.filter(
    (borrow: any) => borrow.status === "BORROWED"
  ).length;
  const returnedBorrows = borrows.filter(
    (borrow: any) => borrow.status === "RETURNED"
  ).length;

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

const users = Array.isArray(usersResponse)
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
  queryFn: () =>
    bookCopyApi.getBookCopies({
      page: 1,
      limit: 100,
    }),
});

const bookCopies = Array.isArray(bookCopiesResponse)
  ? bookCopiesResponse
  : bookCopiesResponse?.copies ||
    bookCopiesResponse?.bookCopies ||
    bookCopiesResponse?.data ||
    [];

const availableBookCopies = bookCopies.filter(
  (copy: any) => copy.status === "AVAILABLE"
);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Borrow Management"
        description="Issue, return, and track all active and historical borrows."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIssueOpen(true)}
          >
            Issue Book
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Visible records",
            value: borrows.length,
            icon: BookOpen,
            tone: "text-brand-400",
            detail: "Across this page",
          },
          {
            label: "Active borrows",
            value: activeBorrows,
            icon: Clock3,
            tone: "text-warning-400",
            detail: "Currently checked out",
          },
          {
            label: "Returned",
            value: returnedBorrows,
            icon: CheckCircle2,
            tone: "text-success-400",
            detail: "Completed on this page",
          },
          {
            label: "Members",
            value: users.length,
            icon: Users,
            tone: "text-info-400",
            detail: "Eligible borrowers",
          },
        ].map(({ label, value, icon: Icon, tone, detail }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className="group rounded-2xl border border-border-soft bg-bg-card/70 p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-fg-muted">{label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</p>
              </div>
              <span className={`rounded-xl bg-bg-elevated p-2 ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-[11px] text-fg-subtle">{detail}</p>
          </motion.div>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        {/* SEARCH + FILTER */}

        <div className="flex flex-col gap-4 border-b border-border-soft bg-bg-soft/45 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Search by book or member…"
            className="w-full lg:w-96"
          />

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <Dropdown
              align="left"
              trigger={
                <span className="btn-secondary px-3 py-2 text-xs capitalize">
                  Status:{" "}
                  <span className="text-fg">
                    {status}
                  </span>
                </span>
              }
            >
            <span className="hidden text-xs text-fg-subtle sm:inline">
              {pages} {pages === 1 ? "page" : "pages"}
            </span>
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

        {/* LOADING */}

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
              query || status !== "All"
                ? "No borrow records match your search or filter."
                : "Issue a book to start a borrow record."
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
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
                {borrows.map(
                  (b: any, i: number) => (
                    <Tr key={b._id}>
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
                            delay: i * 0.03,
                          }}
                          className="flex items-center gap-3"
                        >
                          {b.bookCopy?.book
                            ?.coverImage ? (
                            <img
                              src={
                                b.bookCopy.book
                                  .coverImage
                              }
                              alt={
                                b.bookCopy.book
                                  .title
                              }
                              className="h-10 w-7 rounded border border-border object-cover"
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
                              {b.bookCopy?.book
                                ?.title ||
                                "Unknown Book"}
                            </span>

                            <div className="text-xs text-fg-subtle">
                              {b.bookCopy?.barcode ||
                                "No barcode"}
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
                              "Unknown User"
                            }
                            size="sm"
                          />

                          <div>
                            <div className="text-fg">
                              {b.user?.name ||
                                "Unknown User"}
                            </div>

                            <div className="text-xs text-fg-subtle">
                              {b.user?.email ||
                                "No email"}
                            </div>
                          </div>
                        </div>
                      </Td>

                      {/* ISSUE DATE */}

                      <Td className="text-fg-muted">
                        {b.issueDate
                          ? formatDate(
                              b.issueDate
                            )
                          : "—"}
                      </Td>

                      {/* DUE DATE */}

                      <Td className="text-fg-muted">
                        {b.dueDate
                          ? formatDate(
                              b.dueDate
                            )
                          : "—"}
                      </Td>

                      {/* RETURN DATE */}

                      <Td className="text-fg-muted">
                        {b.returnDate
                          ? formatDate(
                              b.returnDate
                            )
                          : "—"}
                      </Td>

                      {/* FINE */}

                      <Td className="text-fg-subtle">
                        {b.fine
                          ? formatCurrency(
                              b.fine.amount
                            )
                          : "—"}
                      </Td>

                      {/* STATUS */}

                      <Td>
                        <BorrowStatusBadge
                          status={b.status}
                        />
                      </Td>

                      {/* ACTION */}

                      <Td>
                        {b.status !== "RETURNED" && (
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
                            disabled={
                              returningId === b._id
                            }
                          >
                            {returningId === b._id
                              ? "Returning..."
                              : "Return"}
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  )
                )}
              </TBody>
              </Table>
            </div>

            {/* PAGINATION */}

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

      {/* ISSUE BOOK MODAL */}

      <Modal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
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
              disabled={usersLoading}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            >
              <option value="">
                {usersLoading
                  ? "Loading members..."
                  : "Select member"}
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
              disabled={bookCopiesLoading}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg"
            >
              <option value="">
                {bookCopiesLoading
                  ? "Loading book copies..."
                  : "Select book copy"}
              </option>

              {availableBookCopies.map(
                (copy: any) => (
                  <option
                    key={copy._id}
                    value={copy._id}
                  >
                    {typeof copy.book === "object"
                      ? copy.book.title
                      : "Unknown Book"}{" "}
                    — {copy.barcode}
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
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
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
              disabled={isIssuing}
            >
              Cancel
            </Button>

            <Button
              onClick={handleIssue}
              disabled={
                isIssuing ||
                usersLoading ||
                bookCopiesLoading
              }
            >
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