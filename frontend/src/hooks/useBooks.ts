import { useQuery } from "@tanstack/react-query";
import { bookApi } from "@/api/booksApi";

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: bookApi.getBooks,
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => bookApi.getBookById(id),
    enabled: !!id,
  });
};