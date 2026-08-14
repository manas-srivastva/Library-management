export type NotificationType =
  | "BOOK_DUE"
  | "FINE_GENERATED"
  | "RESERVATION_CREATED"
  | "RESERVATION_EXPIRED"
  | "BOOK_AVAILABLE"
  | "BOOK_ISSUED"
  | "BOOK_RETURNED";

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}