import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  CalendarPlus,
  CalendarX,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Library,
  MailOpen,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';

import { notificationApi } from '@/api/notificationApi';
import { useAuthContext } from '@/context/AuthContext';
import type {
  Notification,
  NotificationType,
} from '@/types/notification';
import { formatDate, paginate, totalPages } from '@/utils/format';

const PAGE_SIZE = 6;

const notificationTypes = [
  'All',
  'BOOK_DUE',
  'FINE_GENERATED',
  'RESERVATION_CREATED',
  'RESERVATION_EXPIRED',
  'BOOK_AVAILABLE',
  'BOOK_ISSUED',
  'BOOK_RETURNED',
] as const;

type NotificationFilter = (typeof notificationTypes)[number];

const notificationConfig: Record<
  NotificationType,
  {
    label: string;
    icon: typeof Bell;
  }
> = {
  BOOK_DUE: {
    label: 'Book Due',
    icon: Clock,
  },

  FINE_GENERATED: {
    label: 'Fine Generated',
    icon: CircleDollarSign,
  },

  RESERVATION_CREATED: {
    label: 'Reservation Created',
    icon: CalendarPlus,
  },

  RESERVATION_EXPIRED: {
    label: 'Reservation Expired',
    icon: CalendarX,
  },

  BOOK_AVAILABLE: {
    label: 'Book Available',
    icon: Library,
  },

  BOOK_ISSUED: {
    label: 'Book Issued',
    icon: BookOpen,
  },

  BOOK_RETURNED: {
    label: 'Book Returned',
    icon: CheckCircle2,
  },
};

export default function NotificationsPage() {
  const { user } = useAuthContext();

  const [query, setQuery] = useState('');
  const [filter, setFilter] =
    useState<NotificationFilter>('All');
  const [showUnreadOnly, setShowUnreadOnly] =
    useState(false);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery<Notification[]>({
    queryKey: ['notifications', user?._id],
    queryFn: () =>
      notificationApi.getUserNotifications(user!._id),
    enabled: !!user?._id,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      notificationApi.markAsRead(id),

    onSuccess: () => {
      toast.success('Notification marked as read');

      queryClient.invalidateQueries({
        queryKey: ['notifications', user?._id],
      });
    },

    onError: (error) => {
      console.error(error);
      toast.error('Failed to update notification');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      notificationApi.markAllAsRead(),

    onSuccess: () => {
      toast.success('All notifications marked as read');

      queryClient.invalidateQueries({
        queryKey: ['notifications', user?._id],
      });
    },

    onError: (error) => {
      console.error(error);
      toast.error('Failed to update notifications');
    },
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = query.toLowerCase();

      const matchesQuery =
        !query ||
        notification.title
          .toLowerCase()
          .includes(searchText) ||
        notification.message
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        filter === 'All' ||
        notification.type === filter;

      const matchesUnread =
        !showUnreadOnly ||
        !notification.isRead;

      return (
        matchesQuery &&
        matchesType &&
        matchesUnread
      );
    });
  }, [
    notifications,
    query,
    filter,
    showUnreadOnly,
  ]);

  const pages = totalPages(
    filteredNotifications.length,
    PAGE_SIZE
  );

  const currentNotifications = paginate(
    filteredNotifications,
    page,
    PAGE_SIZE
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleFilterChange = (
    value: NotificationFilter
  ) => {
    setFilter(value);
    setPage(1);
  };

  const handleUnreadChange = () => {
    setShowUnreadOnly((current) => !current);
    setPage(1);
  };

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.info('No unread notifications');
      return;
    }

    markAllReadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Notifications"
          description="Stay updated with your library activity."
        />

        <Card className="mt-6 p-8">
          <div className="flex items-center justify-center">
            <div className="text-sm text-fg-muted">
              Loading notifications...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Notifications"
          description="Stay updated with your library activity."
        />

        <Card className="mt-6 p-8">
          <EmptyState
            title="Unable to load notifications"
            description="Something went wrong while fetching your notifications."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with your library activity."
      />

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
              <Bell className="h-5 w-5 text-brand" />
            </div>

            <div>
              <div className="text-sm text-fg-muted">
                Total Notifications
              </div>

              <div className="text-2xl font-semibold text-fg">
                {notifications.length}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <MailOpen className="h-5 w-5 text-warning" />
            </div>

            <div>
              <div className="text-sm text-fg-muted">
                Unread Notifications
              </div>

              <div className="text-2xl font-semibold text-fg">
                {unreadCount}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mt-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search notifications..."
            className="lg:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(event) =>
                handleFilterChange(
                  event.target.value as NotificationFilter
                )
              }
              className="rounded-lg border border-border-soft bg-bg-card px-3 py-2 text-xs text-fg outline-none"
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All'
                    ? 'All Types'
                    : notificationConfig[
                        type as NotificationType
                      ]?.label || type}
                </option>
              ))}
            </select>

            <Button
              size="sm"
              variant={
                showUnreadOnly
                  ? 'primary'
                  : 'secondary'
              }
              onClick={handleUnreadChange}
            >
              Unread Only
            </Button>

            <Button
              size="sm"
              leftIcon={
                <CheckCircle2 className="h-3.5 w-3.5" />
              }
              onClick={handleMarkAllRead}
              disabled={
                unreadCount === 0 ||
                markAllReadMutation.isPending
              }
            >
              {markAllReadMutation.isPending
                ? 'Updating...'
                : 'Mark All Read'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification list */}
      <div className="mt-6 space-y-3">
        {currentNotifications.length === 0 ? (
          <Card className="p-5">
            <EmptyState
              title="No notifications found"
              description={
                showUnreadOnly
                  ? 'You have no unread notifications.'
                  : 'There are no notifications matching your filters.'
              }
            />
          </Card>
        ) : (
          currentNotifications.map(
            (notification, index) => {
              const config =
                notificationConfig[
                  notification.type
                ];

              const Icon = config.icon;

              return (
                <motion.div
                  key={notification._id}
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                >
                  <Card
                    className={`p-5 transition ${
                      !notification.isRead
                        ? 'border-brand/30 bg-brand/[0.03]'
                        : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          notification.isRead
                            ? 'bg-bg-soft text-fg-muted'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-fg">
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-brand" />
                              )}
                            </div>

                            <div className="mt-1 text-xs text-fg-subtle">
                              {config.label}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-xs text-fg-subtle">
                            <Clock className="h-3.5 w-3.5" />

                            {notification.createdAt
                              ? formatDate(
                                  notification.createdAt
                                )
                              : '—'}
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-fg-muted">
                          {notification.message}
                        </p>

                        {!notification.isRead && (
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="secondary"
                              leftIcon={
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              }
                              onClick={() =>
                                handleMarkRead(
                                  notification._id
                                )
                              }
                              disabled={
                                markReadMutation.isPending
                              }
                            >
                              Mark as Read
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            }
          )
        )}
      </div>

      {/* Pagination */}
      {currentNotifications.length > 0 &&
        pages > 1 && (
          <div className="mt-5 border-t border-border-soft pt-4">
            <Pagination
              page={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          </div>
        )}
    </div>
  );
}