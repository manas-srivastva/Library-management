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

export function CopyStatusBadge({ status }: { status: CopyStatus }) {
  const map: Record<CopyStatus, { tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral'; label: string }> = {
    available: { tone: 'success', label: 'Available' },
    issued: { tone: 'info', label: 'Issued' },
    reserved: { tone: 'warning', label: 'Reserved' },
    lost: { tone: 'danger', label: 'Lost' },
    damaged: { tone: 'neutral', label: 'Damaged' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function BorrowStatusBadge({ status }: { status: BorrowStatus }) {
  const map: Record<BorrowStatus, { tone: 'info' | 'success' | 'danger'; label: string }> = {
    borrowed: { tone: 'info', label: 'Borrowed' },
    returned: { tone: 'success', label: 'Returned' },
    overdue: { tone: 'danger', label: 'Overdue' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, { tone: 'warning' | 'info' | 'success' | 'neutral' | 'danger'; label: string }> = {
    pending: { tone: 'warning', label: 'Pending' },
    ready: { tone: 'info', label: 'Ready' },
    fulfilled: { tone: 'success', label: 'Fulfilled' },
    cancelled: { tone: 'neutral', label: 'Cancelled' },
    expired: { tone: 'danger', label: 'Expired' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}

export function FineStatusBadge({ status }: { status: FineStatus }) {
  const map: Record<FineStatus, { tone: 'warning' | 'success' | 'neutral'; label: string }> = {
    pending: { tone: 'warning', label: 'Pending' },
    paid: { tone: 'success', label: 'Paid' },
    waived: { tone: 'neutral', label: 'Waived' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone} dot>{label}</Badge>;
}
