import client from "./client";
import type { Book } from "../types/book";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface BookPagination {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bookApi = {

  // GET /api/books?page=1&limit=10&search=
  async getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {

    const { data } =
      await client.get<ApiResponse<BookPagination>>(
        "/books",
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            search: params?.search ?? "",
          },
        }
      );

    return data.data;
  },

  // GET /api/books/:id
  async getBookById(id: string) {

    const { data } =
      await client.get<ApiResponse<Book>>(
        `/books/${id}`
      );

    return data.data;
  },

  // POST /api/books
  async createBook(data: {
    title: string;
    isbn: string;
    description?: string;
    language?: string;
    publicationYear?: number;
    pages?: number;
    authors: string[];
    publisher: string;
    category: string;
    coverImage?: string;
  }) {

    const { data: response } =
      await client.post<ApiResponse<Book>>(
        "/books",
        data
      );

    return response.data;
  },
};