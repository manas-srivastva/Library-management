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

export interface BookCopyPagination {
  copies: BookCopy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bookCopyApi = {

  // GET /api/bookcopies?page=1&limit=10&search=&status=
  async getBookCopies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: BookCopy["status"];
  }) {

    const { data } =
      await client.get<ApiResponse<BookCopyPagination>>(
        "/bookcopies",
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            search: params?.search ?? "",
            ...(params?.status
              ? { status: params.status }
              : {}),
          },
        }
      );

    return data.data;
  },

  // GET /api/bookcopies/:id
  async getBookCopyById(id: string) {

    const { data } =
      await client.get<ApiResponse<BookCopy>>(
        `/bookcopies/${id}`
      );

    return data.data;
  },

  // POST /api/bookcopies
  async createBookCopy(payload: {
    book: string;
    barcode: string;
    shelfLocation: string;
    status?: BookCopy["status"];
  }) {

    const { data } =
      await client.post<ApiResponse<BookCopy>>(
        "/bookcopies",
        payload
      );

    return data.data;
  },

  // PUT /api/bookcopies/:id
  async updateBookCopy(
    id: string,
    payload: {
      barcode?: string;
      shelfLocation?: string;
      status?: BookCopy["status"];
    }
  ) {

    const { data } =
      await client.put<ApiResponse<BookCopy>>(
        `/bookcopies/${id}`,
        payload
      );

    return data.data;
  },

  // DELETE /api/bookcopies/:id
  async deleteBookCopy(id: string) {

    const { data } =
      await client.delete<ApiResponse<null>>(
        `/bookcopies/${id}`
      );

    return data.data;
  },
};