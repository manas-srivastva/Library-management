import client from "./client";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface BookCopy {
  _id: string;
  book:
    | string
    | {
        _id: string;
        title: string;
        isbn: string;
      };
  barcode: string;
  shelfLocation: string;
  status:
    | "AVAILABLE"
    | "ISSUED"
    | "RESERVED"
    | "LOST"
    | "MAINTENANCE";
  createdAt?: string;
  updatedAt?: string;
}

export const bookCopyApi = {
  async getBookCopies() {
    const { data } =
      await client.get<ApiResponse<BookCopy[]>>("/bookcopies");

    return data.data;
  },

  async getBookCopyById(id: string) {
    const { data } =
      await client.get<ApiResponse<BookCopy>>(`/bookcopies/${id}`);

    return data.data;
  },
};