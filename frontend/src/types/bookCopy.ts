export interface BookCopyBook {
  _id: string;
  title: string;
  isbn: string;
}

export interface BookCopy {
  _id: string;
  book: BookCopyBook;
  barcode: string;
  shelfLocation: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}