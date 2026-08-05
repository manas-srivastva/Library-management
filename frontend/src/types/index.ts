export type BookStatus = 'available' | 'borrowed' | 'reserved' | 'lost' | 'damaged';
export type CopyStatus = 'available' | 'issued' | 'reserved' | 'lost' | 'damaged';
export type BorrowStatus = 'borrowed' | 'returned' | 'overdue';
export type ReservationStatus = 'pending' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';
export type FineStatus = 'pending' | 'paid' | 'waived';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  isbn: string;
  cover: string;
  status: BookStatus;
  totalCopies: number;
  availableCopies: number;
  rating: number;
  publishedYear: number;
  description: string;
}

export interface BookCopy {
  id: string;
  barcode: string;
  bookId: string;
  bookTitle: string;
  shelf: string;
  status: CopyStatus;
  condition: 'new' | 'good' | 'fair' | 'poor';
}

export interface BorrowRecord {
  id: string;
  bookTitle: string;
  bookCover: string;
  user: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: BorrowStatus;
  fine: number;
}

export interface Reservation {
  id: string;
  bookTitle: string;
  bookCover: string;
  user: string;
  reservedAt: string;
  expiresAt: string;
  status: ReservationStatus;
  queuePosition: number;
}

export interface Fine {
  id: string;
  user: string;
  bookTitle: string;
  amount: number;
  reason: string;
  issuedAt: string;
  status: FineStatus;
}

export interface Activity {
  id: string;
  type: 'borrow' | 'return' | 'reserve' | 'fine' | 'add_book' | 'register';
  message: string;
  user: string;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'member' | 'librarian' | 'admin';
  joinedAt: string;
  booksBorrowed: number;
  activeReservations: number;
  outstandingFines: number;
}
