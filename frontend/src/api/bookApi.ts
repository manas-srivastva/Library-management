import client from "./client";
import type { Book } from "../types/book";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const bookApi = {
  async getBooks() {
    const { data } = await client.get<ApiResponse<Book[]>>("/books");

    return data.data;
  },

  async getBookById(id: string) {
    const { data } = await client.get<ApiResponse<Book>>(`/books/${id}`);

    return data.data;
  },
};