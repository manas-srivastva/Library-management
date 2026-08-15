import { Badge } from '@/components/ui/Badge';
import type { BookStatus, BorrowStatus, CopyStatus, FineStatus, ReservationStatus } from '@/types';

export function BookStatusBadge({ status }: { status: BookStatus }) {
  const map: Record<BookStatus, { tone: 'success' | 'warning' | 'info' | 'danger' | 'neutral'; label: string }> = {
    available: { tone: 'success', label: 'Available' },
    borrowed: { tone: 'info', label: 'Borrowed' },
    reserved: { tone: 'warning', label: 'Reserved' },
    lost: { tone: 'danger', label: 'Lost' },
    damaged: { tone: 'neutral', label: 'Damaged' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function CopyStatusBadge({
  status,
}: {
  status: "AVAILABLE" | "BORROWED" | "RESERVED" | "LOST" | "MAINTENANCE";
}) {
  const map: Record<
    "AVAILABLE" | "BORROWED" | "RESERVED" | "LOST" | "MAINTENANCE",
    {
      tone: "success" | "info" | "warning" | "danger" | "neutral";
      label: string;
    }
  > = {
    AVAILABLE: { tone: "success", label: "Available" },
    BORROWED: { tone: "info", label: "Borrowed" },
    RESERVED: { tone: "warning", label: "Reserved" },
    LOST: { tone: "danger", label: "Lost" },
    MAINTENANCE: { tone: "neutral", label: "Maintenance" },
  };

  const { tone, label } = map[status];

  return <Badge tone={tone} dot>{label}</Badge>;
}

export function BorrowStatusBadge({ status }: { status: BorrowStatus }) {
const map = {
  BORROWED: {
    tone: "info",
    label: "Borrowed",
  },
  RETURNED: {
    tone: "success",
    label: "Returned",
  },
  OVERDUE: {
    tone: "danger",
    label: "Overdue",
  },
};
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function ReservationStatusBadge({
  status,
}: {
  status: ReservationStatus;
}) {
  const map: Record<
    ReservationStatus,
    {
      tone:
        | 'warning'
        | 'info'
        | 'success'
        | 'neutral'
        | 'danger';
      label: string;
    }
  > = {
    ACTIVE: {
      tone: 'warning',
      label: 'Active',
    },

    FULFILLED: {
      tone: 'success',
      label: 'Fulfilled',
    },

    CANCELLED: {
      tone: 'neutral',
      label: 'Cancelled',
    },

    EXPIRED: {
      tone: 'danger',
      label: 'Expired',
    },
  };

  const { tone, label } = map[status];

  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

export function FineStatusBadge({ status }: { status: FineStatus }) {
  const map: Record<
    FineStatus,
    {
      tone: 'warning' | 'success';
      label: string;
    }
  > = {
    PENDING: {
      tone: 'warning',
      label: 'Pending',
    },
    PAID: {
      tone: 'success',
      label: 'Paid',
    },
  };

  const { tone, label } = map[status];

  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
